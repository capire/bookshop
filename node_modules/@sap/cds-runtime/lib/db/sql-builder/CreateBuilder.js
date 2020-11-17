const cds = global.cds || require('@sap/cds/lib')
const BaseBuilder = require('./BaseBuilder')
const { isAssociation } = require('../utils/associations')
const { convertDataType } = require('./dataTypes')

/**
 * CreateBuilder is used to take a CQN object as an input and to build an object representing a create operation
 * with SQL string.
 * The SQL object can only be built if properties 'entity' and 'as' in case 'entity' is string are available.
 * @example <caption>Example of CQN </caption>
 * {
 *  CREATE = {CREATE:{
 *  entity: entity | string,
 *  as: SELECT
 *  }}
 * }
 */
class CreateBuilder extends BaseBuilder {
  /**
   * The base class constructor for the builders.
   * If the options parameter is not specified, " are used as delimiter and ? as placeholders.
   *
   * @param {object} obj - The CQN object used for the insert operation
   * @param {object} [options] - The configuration object.
   * @param {string} [options.delimiter] - The delimiter string.
   * @param {string} [options.placeholder] - The placeholder for prepared statement.
   * @param {Map} [options.typeConversion] - Map for database specific type conversion.
   * @param {object} [csn] - The csn object.
   */
  constructor (obj, options, csn) {
    super(obj, options)
    this._options.typeConversion = this._options.typeConversion || new Map()
    this._csn = csn
  }

  /**
   * Builds an Object based on the properties of the CQN object.
   * @example <caption>Example output</caption>
   * {
   *    sql: 'CREATE TABLE name'
   * }
   *
   * @returns {{sql: string}} Object containing sql.
   */
  build () {
    this._outputObj = {
      sql: ['CREATE']
    }
    this._entity()
    if (!this._isView && this._obj.CREATE.entity.elements) {
      this._elements()
    }
    if (!this._isView && this._obj.CREATE.as) {
      this._as()
    }

    this._outputObj.sql = this._outputObj.sql.join(' ')
    return this._outputObj
  }

  get SelectBuilder () {
    const SelectBuilder = require('./SelectBuilder')
    Object.defineProperty(this, 'SelectBuilder', { value: SelectBuilder })
    return SelectBuilder
  }

  _entity () {
    let entityName
    let view
    if (typeof this._obj.CREATE.entity === 'string') {
      entityName = this._obj.CREATE.entity
      if (this._csn && this._csn.definitions[entityName]) {
        view = this._view(this._csn.definitions[entityName])
      }
    } else {
      entityName = this._obj.CREATE.entity.name
      view = this._view(this._obj.CREATE.entity)
    }

    if (view) {
      this._outputObj.sql.push('VIEW', this._quoteElement(entityName), 'AS', view)
      this._isView = true
    } else {
      this._outputObj.sql.push('TABLE', this._quoteElement(entityName))
    }
  }

  _view (entity) {
    if (entity.query) {
      const select = entity.query.cql ? cds.parse.cql(entity.query.cql) : entity.query
      const { sql, values } = new this.SelectBuilder(select, this._options, this._csn).build()
      this._outputObj.values = values
      return sql
    }
    return undefined
  }

  _flattenStructuredElement (prefix, structuredType, arr) {
    const flattenedElements = arr || []
    for (const property of Object.keys(structuredType)) {
      if (structuredType[property].elements) {
        this._flattenStructuredElement(`${prefix}_${property}`, structuredType[property].elements, flattenedElements)
      } else if (
        structuredType[property].type === 'cds.Association' &&
        (structuredType[property].keys || structuredType[property].foreignKeys)
      ) {
        // OLD CSN
        flattenedElements.push(...this._association(`${prefix}_${property}`, structuredType[property]))
      } else {
        const dataType = convertDataType(structuredType[property], this._csn, this._options)
        const constraints = this._addConstraints(structuredType[property])

        flattenedElements.push({ column: `${prefix}_${property}`, dataType: dataType, constraints: constraints })
      }
    }
    return flattenedElements
  }

  _association (associationName, element) {
    const keys = element.foreignKeys || element.keys // OLD CSN
    if (keys) {
      return keys.map(key => {
        const ref = key.ref ? key.ref[0] : key // OLD CSN
        const dataType = convertDataType(this._csn.definitions[element.target].elements[ref], this._csn, this._options)
        const constraints = this._addConstraints(this._csn.definitions[element.target].elements[ref])

        return { column: `${associationName}_${ref}`, dataType: dataType, constraints: constraints }
      })
    }

    return []
  }

  _addConstraints (element) {
    const notNull = element.notNull === true ? ' NOT NULL' : ''

    if (element.default) {
      const defaultVal = element.default.val || element.default // OLD CSN
      const defaultConstraint = typeof defaultVal === 'string' ? ` DEFAULT '${defaultVal}'` : ` DEFAULT ${defaultVal}`
      return `${notNull}${defaultConstraint}`
    }

    return notNull
  }

  _combinePrefixAndElement (element, prefix) {
    return prefix ? `${prefix}_${element}` : element
  }

  _elementsForEntity (entity, columnPrefix) {
    let elements = new Map()
    for (const element of Object.keys(entity.elements || {})) {
      if (isAssociation(entity.elements[element])) {
        const association = this._association(element, entity.elements[element])
        if (association) {
          association.forEach(e => elements.set(e.column, e))
        }
        continue
      }

      if (entity.elements[element].elements) {
        this._flattenStructuredElement(element, entity.elements[element].elements).forEach(e =>
          elements.set(e.column, e)
        )
        continue
      }

      const columnName = this._combinePrefixAndElement(element, columnPrefix)
      const dataType = convertDataType(entity.elements[element], this._csn, this._options)
      const constraints = this._addConstraints(entity.elements[element])
      elements.set(columnName, { column: columnName, dataType: dataType, constraints: constraints })
    }

    return elements
  }

  _elements () {
    const elements = []

    this._elementsForEntity(this._obj.CREATE.entity).forEach(element => {
      if (element.dataType !== 'cds.Composition' && element.dataType !== 'cds.Association') {
        elements.push(`${this._quoteElement(element.column)} ${element.dataType}${element.constraints}`)
      }
    })

    const keys = []

    // .keys returns undefined if no keys are available
    const keyElements = this._obj.CREATE.entity.keys || {}

    for (const key of Object.keys(keyElements)) {
      keys.push(this._quoteElement(key))
    }

    if (elements.length > 0) {
      this._outputObj.sql.push(
        '(',
        `${elements.join(', ')}${keys.length > 0 ? `, PRIMARY KEY (${keys.join(', ')})` : ''}`,
        ')'
      )
    }
  }

  _as () {
    const as = new this.SelectBuilder(this._obj.CREATE.as).build()
    this._outputObj.sql.push('AS', as.sql)
  }
}

module.exports = CreateBuilder
