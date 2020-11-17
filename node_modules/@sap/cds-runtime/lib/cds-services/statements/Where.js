const cds = global.cds || require('@sap/cds/lib')
const BaseStatement = require('./BaseStatement')
const { ensureNoDraftsSuffix } = require('../services/utils/draftUtils')
const { unexpectedFunctionCallError, invalidFunctionArgumentError } = require('../util/errors')

const MODEL = Symbol.for('sap.cds.model')
const fnChain = Symbol.for('sap.cds.fnChain')

const OPERATIONS = ['=', '>', '<', '!=', '<>', '>=', '<=', 'like', 'between', 'in', 'not in']
const VALUES = [null, undefined, true, false]

class Where extends BaseStatement {
  get cqn () {
    return this.SELECT || this.UPDATE || this.DELETE
  }

  /**
   * Build 'where' cqn object. Can be chained and will always connect the chained where with an 'and'.
   *
   * Possible uses:
   * where('ID', '<operator>', <value>)
   * where('ID', 'between', <value>, <value>)
   * where('Association.name', '<operator>', <value>)
   * where('lower(column)', '<operator>', <value>)
   * where(<object>)
   * Fluid usage with alternating string value arguments
   * where(arg1, arg2, arg3, ...)
   * Array with partial CQNs
   * where([arg1, arg2, arg3, ...])
   *
   * @example
   * where('ID', '>', 7411)
   * where({ ID: 7411})
   * where({ or: [{ ID: 7411}, { ID: 2511}]})
   * Fluid usage:
   * where(`name like`, 'foo', `and ( ratio between`, 0.1, `and`, 0.3, `or ratio >`, 0.9, ')')
   * Array with partial CQNs
   * where([{ref: ['x']}, '=', {val: 1}])
   *
   * @returns {Object} this object instance for chaining.
   * @throws Error - If .having() called before .where() or if no valid first argument provided
   */
  where (...args) {
    if (args.length === 0) return this // ignore attempts to add nothing
    const { cqn } = this
    if (cqn.having) throw unexpectedFunctionCallError('.having()', '.where()')
    if (cqn.where) return this._andWhere(...args)
    cqn.where = []
    this[fnChain] = this[fnChain].concat('.where()')
    return this._where(...args)
  }

  /**
   * .and can only be used after .join has been called.
   * @param {string|Object} arg1 Can be object if argument is passed as an object or can be a string when an identifier is directly passed.
   * @param {*} [arg2] Can be a value or an operator if the 3rd argument is the value.
   * @param [arg3] Value or CQN if second argument is operator.
   * @param [arg4] Value in case the second argument is the 'between' operator; Otherwise ignored.
   * @returns {Object} this object instance for chaining.
   * @throws Error - If called without calling join or where before.
   */
  and (...args) {
    if (args.length === 0) return this
    this[fnChain] = this[fnChain].concat('.and()')
    return this._logicOperation('and', ...args)
  }

  /**
   * .byId filters on the column 'id'. It can only be used if .where has not been called yet.
   * @param {string} arg1 is the value on which the filtering should be performed.
   * @returns {Object} this object instance for chaining
   */
  byId (arg1) {
    this[fnChain] = this[fnChain].concat('.byId()')
    return this.where('id', '=', arg1)
  }

  /**
   * @param {string|Object} arg1 Can be object if argument is passed as an object or can be a string when an identifier is directly passed.
   * @param {*} [arg2] Can be a value or an operator if the 3rd argument is the value.
   * @param [arg3] Value or CQN if second argument is operator.
   * @param [arg4] Value in case the second argument is the 'between' operator; Otherwise ignored.
   * @returns {Object} this object instance for chaining.
   * @throws Error - If called without calling join or where before.
   */
  or (...args) {
    this[fnChain] = this[fnChain].concat('.or()')
    return this._logicOperation('or', ...args)
  }

  _andWhere (...args) {
    return this._setAndOrBracket('and', 'where', ...args)
  }

  _parseOnArguments (...args) {
    if (Array.isArray(args[0]) && !args[1] && args[0].length > 0) {
      if (this.cqn.from.on && this.cqn.from.on.length !== 0) {
        return ['(', ...args[0], ')']
      } else {
        return args[0]
      }
    }

    // single object
    if (typeof args[0] === 'object') {
      if (args[0].or && this.cqn.from.on && this.cqn.from.on.length !== 0) {
        return ['(', ...this._parseObjectArgument(args[0]), ')']
      } else {
        return this._parseObjectArgument(args[0])
      }
    }

    // fluid usage is used by default
    if (this.cqn.from.on && this.cqn.from.on.length !== 0) {
      return ['(', ...this._fluidUsage(...args), ')']
    } else {
      return this._fluidUsage(...args)
    }
  }

  _setAndOrBracket (operator, clause, ...args) {
    if (operator === 'and') {
      this.cqn[clause].unshift('(')
      this.cqn[clause].push(')')
    }
    this.cqn[clause].push(operator)
    return this._condition(clause, ...args)
  }

  _setAndBracketOn (operator, cqn) {
    if (operator === 'and') {
      cqn.from.on.unshift('(')
      cqn.from.on.push(')')
    }
  }

  _logicOperation (operator, ...args) {
    const cqn = this.cqn
    const isJoin = cqn.from && cqn.from.hasOwnProperty('join')
    const isWhere = cqn.where && cqn.where.length > 0
    const isHaving = cqn.having && cqn.having.length > 0

    if (operator === 'or' && (isHaving || isWhere)) {
      const clause = isHaving ? 'having' : 'where'
      return this._setAndOrBracket('or', clause, ...args)
    }

    if (!isJoin && operator === 'or') {
      // or called without where before
      return this.where(...args)
    }

    if (!isJoin && operator === 'and') {
      return isHaving ? this.having(...args) : this.where(...args)
    }

    if (isJoin) {
      this._setAndBracketOn(operator, cqn)
      cqn.from.on.push(operator)
      cqn.from.on.push(...this._parseOnArguments(...args))

      return this
    }

    throw unexpectedFunctionCallError(operator, this[fnChain])
  }

  _getList (arr) {
    const list = []
    for (const element of arr) {
      if (element === null) list.push({ val: null })
      else if (element === 'true') list.push({ val: true })
      else if (element === 'false') list.push({ val: false })
      else if (typeof element === 'object') list.push(element)
      else if (!isNaN(element)) list.push({ val: element })
      else if (element[0] === "'" && element[element.length - 1] === "'") list.push({ val: element.slice(1, -1) })
      else list.push({ val: element })
    }

    return { list: list }
  }

  _fluidValue (val) {
    if (val === null) {
      return { val: null }
    }
    if (val === undefined || val.xpr || val.ref || val.val || val.func || val.list) return val
    if (Array.isArray(val)) {
      return this._getList(val)
    }

    if (isNaN(val)) {
      if (val[0] === "'" && val[val.length - 1] === "'") {
        return { val: val.slice(1, -1) }
      }
    }

    return { val: val }
  }

  _replacePlaceholders (xpr, placeholderMap) {
    for (const placeholder of placeholderMap.keys()) {
      const index = xpr.findIndex(
        obj =>
          obj.SELECT && obj.SELECT.from && Array.isArray(obj.SELECT.from.ref) && obj.SELECT.from.ref[0] === placeholder
      )
      xpr[index] = placeholderMap.get(placeholder)
    }
  }

  // fluid usage uses cds-compiler
  _fluidUsage (...args) {
    const placeholderStr = 'PARTIAL_CQN_PLACEHOLDER'
    const placeholderMap = new Map()
    let placeholderNum = 0
    let expr = ''
    const values = []

    // 1. construct a full expr string with ? for values collected in values
    args.forEach((element, index) => {
      if (index % 2 === 0) {
        expr = expr.concat(element)
      } else {
        if (element && element.SELECT) {
          placeholderNum++
          const placeholder = ` (SELECT FROM ${placeholderStr}_${placeholderNum}) `
          placeholderMap.set(`${placeholderStr}_${placeholderNum}`, element)
          expr = expr.concat(placeholder)
        } else {
          expr = expr.concat(' ? ')
          values.push(element)
        }
      }
    })
    // 2. parse the expr string
    const { xpr } = cds.parse.expr(expr)
    const result = []
    // 3. replace {params} in there with collected values
    for (const element of xpr) {
      const v = element.param ? this._fluidValue(values.shift()) : element
      result.push(v)
    }
    // 4. replace sub-selects
    this._replacePlaceholders(result, placeholderMap)

    return result
  }

  _simpleArguments (...args) {
    if (args.length < 3 || args.length > 4) {
      return false
    }

    if (typeof args[0] !== 'string' || args[0].includes('(')) {
      return false
    }

    if (typeof args[1] !== 'string' || !OPERATIONS.includes(args[1].toLowerCase())) {
      return false
    }

    if (
      typeof args[2] !== 'string' &&
      typeof args[2] !== 'number' &&
      !VALUES.includes(args[2]) &&
      !(args[2] instanceof RegExp) &&
      !Array.isArray(args[2])
    ) {
      return false
    }

    if (
      args[3] !== undefined &&
      typeof args[3] !== 'string' &&
      typeof args[3] !== 'number' &&
      !VALUES.includes(args[3])
    ) {
      return false
    }

    return true
  }

  _copyCondition (kind, arr) {
    if (arr.length === 0) {
      throw invalidFunctionArgumentError(this[fnChain], [])
    }

    if (this.cqn[kind].length !== 0) {
      this.cqn[kind].push('(', ...arr, ')')
    } else {
      this.cqn[kind].push(...arr)
    }
  }

  _conditionObject (kind, obj) {
    obj.or && this.cqn[kind].length !== 0
      ? this.cqn[kind].push('(', ...this._parseObjectArgument(obj), ')')
      : this.cqn[kind].push(...this._parseObjectArgument(obj))
  }

  _condition (kind, ...args) {
    // copy existing array with partial CQNs
    if (Array.isArray(args[0])) {
      this._copyCondition(kind, args[0])
      return this
    }

    // single object
    if (typeof args[0] === 'object') {
      this._conditionObject(kind, ...args)
      return this
    }

    // simple comparison "ref op val"
    if (this._simpleArguments(...args)) {
      this.cqn[kind].push(...this._parseSimpleArguments(...args))
      return this
    }

    // fluid usage is used by dafault
    if (this.cqn[kind].length !== 0) {
      this.cqn[kind].push('(', ...this._fluidUsage(...args), ')')
    } else {
      this.cqn[kind].push(...this._fluidUsage(...args))
    }
    return this
  }

  _where (...args) {
    return this._condition('where', ...args)
  }

  _parseValOrRef (str) {
    if (str === '*' || this._isNumber(str)) {
      return { val: str }
    }

    const valString = str.match(/^'(.*)'$/)
    if (valString) {
      return { val: valString[1] }
    }

    return this._buildRef(str.trim())
  }

  _isNumber (obj) {
    return !isNaN(obj)
  }

  _valOrCqn (arg) {
    if (this._isCqn(arg)) {
      return arg
    }

    return { val: arg }
  }

  _isCqn (arg) {
    return arg && (arg.xpr || arg.hasOwnProperty('val') || arg.ref || arg.func || arg.SELECT)
  }

  _getTableNamesFrom (fromObj) {
    if (typeof fromObj === 'string') {
      // delete with string in from
      return [fromObj]
    }

    if (fromObj.name) {
      // delete with entity in from
      return [fromObj.name]
    }

    // select
    return this._extractRefs(fromObj)
  }

  _extractRefs (from) {
    if (from.hasOwnProperty('join')) {
      // cqn with join in from
      return this._refs(from.args)
    }

    if (from.hasOwnProperty('SET')) {
      // cqn UNION
      return from.as ? [from.as] : []
    }

    return from.as ? [from.ref[0], from.as] : [from.ref[0]]
  }

  _refs (refs) {
    const arr = []

    for (const element of refs) {
      if (element.hasOwnProperty('join')) {
        // multiple join are nested, se we need to find all the table names in there as well
        arr.push(...this._extractRefs(element))
      } else {
        arr.push(element.ref[0])

        if (element.as) {
          arr.push(element.as)
        }
      }
    }

    return arr
  }

  _getTableNamesEntity (entityObj) {
    if (typeof entityObj === 'string') {
      // update with string in entity
      return entityObj
    }

    if (entityObj.name) {
      // update with entity in entity
      return ensureNoDraftsSuffix(entityObj.name)
    }
  }

  _getTableNames () {
    const tableNames = []
    const cqn = this.cqn

    if (cqn.from) {
      // select and delete
      tableNames.push(...this._getTableNamesFrom(cqn.from))
    } else if (cqn.entity) {
      // update
      tableNames.push(this._getTableNamesEntity(cqn.entity))
    }

    return tableNames
  }

  _matchTableColumn (name = '') {
    const matches = name.match(/^(?:"(\w+(?:\.\w+)*)"|(\w+))\.(?:"(\w+(?:\.\w+)*)"|(\w+))$/)

    if (matches) {
      return matches.filter(this._filterForTableAndColumn)
    }
  }

  _matchInline (name) {
    return name
      .replace(/{/g, '')
      .replace(/}/g, '')
      .split(/\./)
  }

  _filterForTableAndColumn (element, index) {
    return index && element != null
  }

  _parseInlineAssociation (element, tableNames) {
    if (element.includes('.{')) {
      return { ref: this._matchInline(element) }
    }

    const parts = element.split(/\./)
    if (parts && this[MODEL]) {
      for (const table of tableNames) {
        // inline or column name  with dot
        if (this._isAssociation(table, parts[0])) {
          return { ref: parts }
        }
      }
    }
  }

  _buildWithTableName (element) {
    const tableNames = this._getTableNames()
    const matched = this._matchTableColumn(element)

    if (matched && tableNames.indexOf(matched[0]) !== -1) {
      return { ref: [matched[0], matched[1]] }
    }

    if (element.includes('.')) {
      return this._parseInlineAssociation(element, tableNames)
    }
  }

  _buildRef (element) {
    const ref = this._buildWithTableName(element)

    if (ref) {
      return ref
    }

    return { ref: [element] }
  }

  _buildValOrRef (element) {
    if (typeof element === 'string') {
      const ref = this._buildWithTableName(element)
      if (ref) {
        return ref
      }
    }

    return this._valOrCqn(element)
  }

  _refOrCqn (arg) {
    if (!this._isCqn(arg)) {
      return this._buildRef(arg)
    }

    return arg
  }

  _comparison (...args) {
    if (args.length > 2) {
      return args[1]
    }

    return '='
  }

  _value (...args) {
    if (args.length > 2) {
      return args[2]
    }

    return args[1]
  }

  _parseSimpleObjectArguments (...args) {
    const ref = this._refOrCqn(args[0])
    const comparison = this._comparison(...args)
    const value = this._value(...args)

    if (args.length === 1) {
      return [ref]
    }

    if (value != null) {
      // skip null / undefined
      if (value instanceof RegExp) {
        return [ref, 'regexp', { val: String(value) }]
      }

      if (value.SELECT) {
        return [ref, comparison, value]
      }
    }

    if (args.length === 4) {
      return [ref, comparison, { val: value }, 'and', { val: args[3] }]
    }

    return [ref, comparison, this._buildValOrRef(value)]
  }

  _isNestedObject (object) {
    return object && typeof object === 'object' && !Array.isArray(object) && !(object instanceof RegExp)
  }

  _isAndOr (key) {
    return key === 'or' || key === 'and'
  }

  _validateObjectArgument (object) {
    if (!object || Object.keys(object).length === 0) {
      throw invalidFunctionArgumentError(this[fnChain], object)
    }
  }

  _parseObjectArgument (object, inAnd) {
    this._validateObjectArgument(object)

    if (this._isCqn(object)) {
      return [object]
    }

    const arrayReturn = []
    const keys = Object.keys(object)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (this._isAndOr(key)) {
        Array.isArray(object[key])
          ? this._andOrAsArray(key, object[key], arrayReturn, keys.length === 1)
          : this._andOrAsObject(key, object[key], arrayReturn, i === keys.length - 1)
      } else if (/^(:?not )?exists$/.test(key)) {
        arrayReturn.push(key, object[key])
      } else if (this._isNestedObject(object[key])) {
        this._addLogicOperatorIfNeeded(arrayReturn)
        arrayReturn.push(...this._parseNestedObject(key, object[key]))
      } else {
        this._addLogicOperatorIfNeeded(arrayReturn)
        const comparison = Array.isArray(object[key]) ? 'in' : '='
        arrayReturn.push(...this._parseSimpleObjectArguments(key, comparison, object[key]))
      }
    }

    if (inAnd && object.or) {
      arrayReturn.unshift('(')
      arrayReturn.push(')')
    }

    return arrayReturn
  }

  _parseSimpleArguments (...args) {
    const ref = this._buildRef(args[0])
    const op = args[1]
    const value = args[2]

    if (value != null && value instanceof RegExp) {
      return [ref, 'regexp', { val: String(value) }]
    }

    if (args.length === 4) {
      return [ref, op, { val: value }, 'and', { val: args[3] }]
    }

    return [ref, op, this._buildValOrRef(value)]
  }

  _andOrAsArray (key, array, arrayReturn, isOne) {
    this._addLogicOperatorIfNeeded(arrayReturn)

    if (key === 'or' && !isOne) {
      arrayReturn.push('(')
    }
    arrayReturn.push(...this._parseObjectArgument(array[0]))
    for (let i = 1, length = array.length; i < length; i++) {
      if (this._isAndOr(Object.keys(array[i])[0])) {
        arrayReturn.push(key, '(', ...this._parseObjectArgument(array[i]), ')')
      } else {
        arrayReturn.push(key, ...this._parseObjectArgument(array[i]))
      }
    }

    if (key === 'or' && !isOne) {
      arrayReturn.push(')')
    }
  }

  _andOrAsObject (key, obj, arrayReturn, isLast) {
    if (key === 'or' && !isLast) {
      arrayReturn.unshift('(')
      arrayReturn.push(key, ...this._parseObjectArgument(obj), ')')
    } else {
      arrayReturn.push(key, ...this._parseObjectArgument(obj, key === 'and'))
    }
  }

  _addLogicOperatorIfNeeded (array) {
    const length = array.length

    if (length === 0) {
      return
    }

    const lastEntry = array[length - 1]

    if (lastEntry !== 'and' && lastEntry !== 'or') {
      array.push('and')
    }
  }

  _parseNestedObject (parentKey, object) {
    const keys = Object.keys(object)

    if (this._isCqn(object)) {
      if (object.SELECT) {
        return this._parseSimpleObjectArguments(parentKey, 'in', object)
      }

      return this._parseSimpleObjectArguments(parentKey, object)
    }

    switch (keys.length) {
      case 1:
        return this._parseSimpleObjectArguments(parentKey, keys[0], object[keys[0]])
      case 2:
        return this._parseSimpleObjectArguments(parentKey, keys[0], object[keys[0]], object[keys[1]])
      default:
        throw invalidFunctionArgumentError(this[fnChain], object)
    }
  }

  _isAssociation (entityName, associationName) {
    const name = typeof entityName === 'object' ? ensureNoDraftsSuffix(entityName.name) : entityName
    const entity = this[MODEL].definitions[name]
    if (entity) {
      return entity.elements[associationName] && entity.elements[associationName].type === 'cds.Association'
    }
    throw invalidFunctionArgumentError(this[fnChain], entity)
  }

  _isFunction (element) {
    if (element === null) {
      return false
    }

    if (typeof element === 'string') {
      return element.includes('(')
    }

    return false
  }

  _parseFunction (func) {
    if (typeof func === 'string') {
      return this._parseFunctionFromString(func)
    }
  }

  _splitArgs (argsString) {
    let bracketCounter = 0

    const commaIndex = []

    for (let i = 0; i < argsString.length; i++) {
      if (argsString.charAt(i) === '(') {
        bracketCounter++
      } else if (argsString.charAt(i) === ')') {
        bracketCounter--
      } else if (argsString.charAt(i) === ',' && bracketCounter === 0) {
        commaIndex.push(i)
      }
    }

    if (commaIndex.length > 0) {
      const args = []
      let lastIndex = 0

      for (const index of commaIndex) {
        args.push(argsString.substring(lastIndex, index))
        lastIndex = index + 1
      }
      args.push(argsString.substring(lastIndex, argsString.length))
      return args
    }

    return []
  }

  _fnArgs (str) {
    if (str.match(/^([^(]*)\((.*)\)$/)) {
      return this._parseFunctionFromString(str)
    } else {
      return this._parseValOrRef(str)
    }
  }

  _parseFunctionArgs (argsString, fnArgs = []) {
    if (argsString === '') {
      return []
    }

    const parts = this._splitArgs(argsString)
    if (parts.length > 0) {
      for (const part of parts) {
        fnArgs.push(this._fnArgs(part))
      }
    } else {
      fnArgs.push(this._fnArgs(argsString))
    }
    return fnArgs
  }

  _parseFunctionFromString (aggregation, cqnPartial = {}) {
    const fnArray = aggregation.match(/^([^(]*)\((.*)\)$/)
    cqnPartial.func = fnArray[1].toLowerCase()
    cqnPartial.args = fnArray[2] === '*' ? ['*'] : this._parseFunctionArgs(fnArray[2]) // * should not be wrapped as val here
    return cqnPartial
  }
}

module.exports = Where
