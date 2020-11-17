const cds = global.cds || require('@sap/cds/lib')
const { isComplex, isAssociation, resolveAssociation } = require('../utils/associations')
const { ensureUnlocalized } = require('../../common/utils/draft')

/**
 * Check if the value is a function or reference to private function.
 * Return if any of the cases are true.
 * @param {string|function} fn -
 * @returns {function}
 * @throws Error if no valid parameter fn provided
 * @private
 */
const _getMethod = fn => {
  if (typeof fn === 'function') {
    return fn
  }

  throw new Error(`Method "${fn}" does not exist.`)
}

/**
 * Get the entity name from CQN and check if it exists at CSN.
 * @param {Object} csn - Reflected CSN
 * @param {String} from - Entity name
 * @returns {string|undefined}
 * @private
 */
const _getEntityName = (csn, from) => {
  if (!from.ref || typeof csn !== 'object') {
    return
  }

  let entityName = from.ref[0].id ? from.ref[0].id : from.ref[0]

  if (csn.definitions && csn.definitions[entityName]) {
    return entityName
  }

  entityName = entityName.replace(/_drafts$/i, '')

  if (csn.definitions && csn.definitions[entityName]) {
    return entityName
  }
}

const _refs = (refs, as) => {
  const arr = []

  for (const element of refs) {
    // multiple join are nested, so we need to find all the table names in there as well
    if (element.hasOwnProperty('join')) {
      arr.push(..._extractRefs(element))
      // Likely a union
    } else if (element.hasOwnProperty('SELECT')) {
      arr.push(..._extractRefs(element.SELECT.from, as))
    } else {
      arr.push(element)
    }
  }

  return arr
}

const _extractRefs = (from, as) => {
  if (from.SELECT) {
    return _extractRefs(from.SELECT.from, from.SELECT.as)
  }

  if (from.hasOwnProperty('join')) {
    // cqn with join in from
    return _refs(from.args)
  }

  if (from.hasOwnProperty('SET')) {
    return _refs(from.SET.args, from.SET.as || from.as)
  }

  const ref = { ref: from.ref, as: from.as }

  if (as) {
    ref.as = as
  }

  return [ref]
}

const _addMapperFunction = (elements, toService, key, type, from, includeAlias) => {
  if (!toService.has(type)) {
    return
  }

  const convertFunction = _getMethod(toService.get(type))

  // ambiguous cases will lead to SQL syntax errors anyway, so no need for a check
  elements.set(key, convertFunction)

  if (includeAlias) {
    elements.set(`${from.as}_${key}`, convertFunction)
  }
}

const _filterUnique = (value, index, arr) => {
  return arr.indexOf(value) === index
}

/**
 * Get a map of all possible elements and their mappers.
 * @param {Map} toService - Mapping instructions for data conversions based on CDS data types
 * @param {Object} csn - Reflected CSN
 * @param {Object} cqn - CQN that is used to query the DB.
 * @param {Boolean} [includeAlias] - Include mapping for aliases. Defaults to false.
 * @returns {Map<any, any>}
 * @private
 */
const _getElementCombinations = (toService, csn, cqn, includeAlias = false) => {
  const elements = new Map()

  // Get list of available and relevant entities as defined by from
  for (const from of _extractRefs(cqn.SELECT.from).filter(_filterUnique)) {
    const entityName = _getEntityName(csn, from)

    if (!entityName) {
      continue
    }

    const entity = csn.definitions[ensureUnlocalized(entityName)]

    for (const key of Object.keys(entity.elements)) {
      const element = entity.elements[key]

      // Complex type
      if (isComplex(element)) {
        for (const complexKey of Object.keys(element.elements)) {
          _addMapperFunction(
            elements,
            toService,
            `${key}_${complexKey}`,
            element.elements[complexKey].type,
            from,
            includeAlias
          )
        }
      } else {
        // Flat type
        _addMapperFunction(elements, toService, key, element.type, from, includeAlias)
      }
    }
  }

  return elements
}

const _getCastFunction = ({ type }) => {
  switch (type) {
    case 'cds.Boolean':
      return Boolean
    case 'cds.Integer':
      return Number
    default:
      return String
  }
}

/**
 * Get a map of to be converted elements and their conversion functions.
 * @param {Map} toService - Mapping instructions for data conversions based on CDS data types
 * @param {Object} csn - Reflected CSN
 * @param {Object} cqn - CQN that is used to query the DB.
 * @returns {Map<any, any>}
 * @private
 */
const _getMapperForListedElements = (toService, csn, cqn) => {
  const elements = _getElementCombinations(toService, csn, cqn, true)
  const mapper = new Map()

  for (const element of cqn.SELECT.columns) {
    if (element.ref) {
      const identifier = element.ref[element.ref.length - 1]
      const name = element.as ? element.as : identifier

      if (element.cast) {
        mapper.set(name, _getCastFunction(element.cast))
      } else if (elements.has(name)) {
        mapper.set(name, elements.get(name))
      } else if (elements.has(identifier) && !cqn.SELECT.from.args) {
        mapper.set(name, elements.get(identifier))
      }
    } else if (element.as && element.cast) {
      mapper.set(element.as, _getCastFunction(element.cast))
    }
  }

  return mapper
}

/**
 * Based on CSN and CQN get a map on how to map the result.
 * @param {Map} toService - Mapping instructions for data conversions based on CDS data types
 * @param {Object} csn - Reflected CSN
 * @param {Object} cqn - CQN that is used to query the DB.
 * @returns {Map<any, any>}
 * @private
 */
const getPostProcessMapper = (toService, csn = {}, cqn = {}) => {
  // No mapper defined or irrelevant as no READ request
  if (!cqn.hasOwnProperty('SELECT')) {
    return new Map()
  }

  if (Array.isArray(cqn.SELECT.columns) && cqn.SELECT.columns.length !== 0 && !cqn.SELECT.columns.includes('*')) {
    return _getMapperForListedElements(toService, csn, cqn)
  }

  // No element/column specified
  return _getElementCombinations(toService, csn, cqn)
}

const _getCombineStructureConvert = (structure, columnName, propName, fn) => {
  const length = structure.length

  return row => {
    if (row[columnName] === undefined) {
      return
    }

    if (!row[structure[0]]) {
      row[structure[0]] = {}
    }

    let subObj = row[structure[0]]

    for (let i = 1; i < length; i++) {
      subObj = subObj[structure[i]] = {}
    }

    subObj[propName] = fn ? fn(row[columnName]) : row[columnName]

    delete row[columnName]
  }
}

const _getCombineRenameConvert = (columnName, propName, fn) => {
  return row => {
    if (row[columnName] === undefined) {
      return
    }

    row[propName] = fn ? fn(row[columnName]) : row[columnName]
    delete row[columnName]
  }
}

const _getConvert = (columnName, fn) => {
  return row => {
    row[columnName] = fn(row[columnName])
  }
}

const _getRemoveMapper = (mapper, propName) => {
  if (mapper) {
    const fn = mapper.get(propName)
    mapper.delete(propName)

    return fn
  }
}

const _propertyMapper = (dataMapper, propertyMapper, objStructMapper, mapper) => {
  if (!propertyMapper) {
    return
  }

  for (const [columnName, propName] of propertyMapper.entries()) {
    const fn = _getRemoveMapper(dataMapper, propName)
    const structure = _getRemoveMapper(objStructMapper, propName)

    mapper.push(
      structure
        ? _getCombineStructureConvert(structure, columnName, propName, fn)
        : _getCombineRenameConvert(columnName, propName, fn)
    )
  }
}

const _objStructMapper = (dataMapper, propertyMapper, objStructMapper, mapper) => {
  if (!objStructMapper) {
    return
  }

  for (const [propName, structure] of objStructMapper.entries()) {
    mapper.push(_getCombineStructureConvert(structure, propName, propName, _getRemoveMapper(dataMapper, propName)))
  }
}

const _dataMapper = (dataMapper, propertyMapper, objStructMapper, mapper) => {
  if (!dataMapper) {
    return
  }

  for (const [columnName, converter] of dataMapper.entries()) {
    mapper.push(_getConvert(columnName, converter))
  }
}

/**
 * Generate the mapper per row up front, so that we do not have to iterate over possibly three mappers
 * @param dataMapper
 * @param propertyMapper
 * @param objStructMapper
 * @returns {Array}
 * @private
 */
const _combineMappers = (dataMapper, propertyMapper, objStructMapper) => {
  const mapper = []

  // Technical names + optionally structure and/or type conversions
  _propertyMapper(dataMapper, propertyMapper, objStructMapper, mapper)

  // Deep structures + optionally type conversions
  _objStructMapper(dataMapper, propertyMapper, objStructMapper, mapper)

  // type conversion
  _dataMapper(dataMapper, propertyMapper, objStructMapper, mapper)

  return mapper
}

const _processRow = (mapper, mapperCount, row) => {
  // REVISIT: when is this the case?
  if (!row) return

  for (let i = 0; i < mapperCount; i++) {
    mapper[i](row)
  }
}

/**
 * Post process the result as given by the db driver.
 * @param {*} result - The result as returned by the db driver.
 * @param {Map} dataMapper - Instructions, how to transform.
 * @param {Map} propertyMapper - Instructions, how to rename properties.
 * @param {Map} objStructMapper - Instructions, how to rename properties.
 * @returns {*}
 * @private
 */
const postProcess = (result, dataMapper, propertyMapper, objStructMapper) => {
  const mapper = _combineMappers(dataMapper, propertyMapper, objStructMapper)
  const mapperCount = mapper.length

  if (mapperCount === 0) {
    return result
  }

  if (Array.isArray(result)) {
    for (let i = 0, length = result.length; i < length; i++) {
      _processRow(mapper, mapperCount, result[i])
    }
  } else {
    _processRow(mapper, mapperCount, result)
  }

  return result
}

const _isAssocOrCompEntity = (csn, entity, element) => {
  return (
    csn.definitions[entity] &&
    csn.definitions[entity].elements[element] &&
    (csn.definitions[entity].elements[element].type === 'cds.Association' ||
      csn.definitions[entity].elements[element].type === 'cds.Composition')
  )
}

const _checkExpressionsAmbiguousNaming = (csn, entity, element) => {
  if (!entity.as || !Array.isArray(element.ref)) {
    return
  }

  if (
    entity.as === element.ref[0] &&
    csn.definitions[entity.ref[0]] &&
    csn.definitions[entity.ref[0]].elements[element.ref[1]] &&
    _isAssocOrCompEntity(csn, entity.ref[0], element.ref[0])
  ) {
    throw new Error(`Ambiguous entity property and alias name: "${entity.as}"`)
  }
}

const _checkColumnsAmbiguousNaming = (csn, entity, columns) => {
  for (const element of columns) {
    _checkExpressionsAmbiguousNaming(csn, entity, element)
  }
}

const _checkJoinAmbiguousNaming = (csn, select) => {
  for (const subSelect of select.from.args) {
    if (Array.isArray(select.columns)) {
      _checkColumnsAmbiguousNaming(csn, subSelect, select.columns)
    }
  }
}

const _checkSelectAmbiguousNaming = (csn, select) => {
  if (Array.isArray(select.columns)) {
    _checkColumnsAmbiguousNaming(csn, select.from, select.columns)
  }
}

const _checkRecursiveSelectAmbiguousNaming = (csn, select) => {
  if (select.from.SELECT) {
    _checkRecursiveSelectAmbiguousNaming(csn, select.from.SELECT)
  } else if (select.from.join) {
    _checkJoinAmbiguousNaming(csn, select)
  } else if (select.from.as) {
    // Check innermost select statement
    _checkSelectAmbiguousNaming(csn, select)
  }
}

const getStructMapper = (csn, cqn, propertyMapper) => {
  if (csn && cqn.SELECT) {
    _checkRecursiveSelectAmbiguousNaming(csn, cqn.SELECT)
  }

  // REVISIT still needed?

  return new Map()
}

const _addToMap = (map, key) => {
  const allUpperKey = key.toUpperCase()

  if (key === allUpperKey) {
    return
  }

  map.set(allUpperKey, key)
}

const _addColumn = (map, from, element) => {
  _addToMap(map, element)

  if (from.ref[0] && from.ref[0].id) {
    _addToMap(map, `${from.ref[0].id}.${element}`)
  } else {
    if (from.ref) {
      _addToMap(map, `${from.ref.join('.')}.${element}`)
    }
  }

  if (from.as) {
    _addToMap(map, `${from.as}.${element}`)
  }
}

const _addAssociationToMap = (map, from, element) => {
  for (const assocName of resolveAssociation(element)) {
    _addColumn(map, from, assocName)
  }
}

const _addComplexTypeToMap = (map, from, name, element) => {
  for (const complexName of Object.keys(element.elements)) {
    _addColumn(map, from, `${name}_${complexName}`)
  }
}

const _getKeyMapForAllElements = (csn, cqn) => {
  const map = new Map()

  // Get list of available and relevant entities as defined by from
  for (const from of _extractRefs(cqn.SELECT.from)) {
    const entityName = _getEntityName(csn, from)

    if (!entityName) {
      continue
    }

    for (const name of Object.keys(csn.definitions[entityName].elements)) {
      const element = csn.definitions[entityName].elements[name]

      if (isAssociation(element)) {
        _addAssociationToMap(map, from, element)
      } else if (isComplex(element)) {
        _addComplexTypeToMap(map, from, name, element)
      } else {
        _addColumn(map, from, name)
      }
    }
  }

  return map
}

/**
 * Provide a map with to be renamed properties.
 * @param {Object} csn - Reflected CSN
 * @param {Object} cqn - CQN that is used to query the DB.
 * @returns {Map<any, any>}
 */
const getPropertyMapper = (csn, cqn) => {
  if (
    cds.config.data.sql_mapping === 'plain' &&
    cqn.SELECT &&
    (cqn.SELECT.columns === undefined || (cqn.SELECT.columns && cqn.SELECT.columns.includes('*')))
  ) {
    return _getKeyMapForAllElements(csn, cqn)
  }

  return new Map()
}

module.exports = {
  getPropertyMapper,
  getPostProcessMapper,
  getStructMapper,
  postProcess
}
