const BaseStatement = require('./BaseStatement')
const { invalidFunctionArgumentError } = require('../util/errors')

const fnChain = Symbol.for('sap.cds.fnChain')

/**
 * Insert values into table
 */
class Insert extends BaseStatement {
  constructor () {
    super('INSERT')
  }

  /**
   * Name of the entity where the entries should be inserted
   *
   * @example <caption>In case the order of columns is known, their names can be omitted</caption>
   * INSERT.into('Books')
   *  .rows([1, 'Harry Potter'])
   *
   * @example <caption>In case the order of columns is unknown, specify the name of the columns</caption>
   * INSERT.into('Books')
   *  .columns('ID', 'NAME')
   *  .rows([1, 'The Hitchhikers Guide to the Galaxy'])
   *
   * @example <caption>Use an object instead of array</caption>
   * INSERT.into('Books')
   *  .rows({ID:1, NAME: 'Animal Farm'})
   *
   * @param {string|object} entity string or an entity from reflection API
   *
   * @returns {Insert} CQN object for Insert
   */
  static into (entity) {
    const cqn = new Insert()
    cqn[fnChain] = cqn[fnChain].concat('.into()')

    if (typeof entity === 'string' && (entity.includes(':') || entity.includes('['))) {
      cqn.INSERT.into = BaseStatement.convertPathExpression(entity)
    } else {
      cqn.INSERT.into = BaseStatement._isEntity(entity, 'INSERT.into()')
    }

    return cqn
  }

  /**
   * Optional. Can be used to order the value entries if column names are known
   * @param {Array} columnNames - names of the columns
   * @param {Array} args - List of columns in case one arguemnt per column is used
   * @returns {Insert} current instance of the insert
   * @throws Error if columnNames is neither String nor Array
   */
  columns (columnNames, ...args) {
    this[fnChain] = this[fnChain].concat('.columns()')
    if (typeof columnNames === 'string') {
      args.unshift(columnNames)
      columnNames = args
    }

    if (Array.isArray(columnNames)) {
      this.INSERT.columns = columnNames
      return this
    }

    throw invalidFunctionArgumentError(this[fnChain], columnNames)
  }

  /**
   * Adds one or multiple rows to the table.
   *
   * @example <caption>In case the order of columns is known, their names can be omitted</caption>
   * INSERT.into('Books')
   *   .rows([1, 'Harry Potter'])
   *
   * @example <caption>If order is unknown specify the name of the columns</caption>
   * INSERT.into('Books')
   *   .columns('ID', 'NAME')
   *   .rows([1, 'The Hitchhikers Guide to the Galaxy'])
   *
   * @example <caption>Use an object instead of array</caption>
   * INSERT.into('Books')
   *   .rows({ID:1, NAME: 'Animal Farm'})
   *
   * @example <caption>Batch insert</caption>
   * INSERT.into('Books').rows([
   *   [1, 'Harry Potter'],
   *   [2, 'The Hitchhikers Guide to the Galaxy'],
   *   [3, 'Animal Farm']
   * ])
   * @example <caption>Batch insert with objects</caption>
   * INSERT.into('Books').rows([
   *   {ID:1, NAME: 'Harry Potter'},
   *   {ID:2, NAME: 'The Hitchhikers Guide to the Galaxy'},
   *   {ID:3, NAME: 'Animal Farm'}
   * ])
   *  @param {array|object} rows
   *  @returns {object} query object according to CQN format
   *  @throws Error if no valid rows are provided
   */
  rows (rows, ...args) {
    this[fnChain] = this[fnChain].concat('.rows()')
    if (!rows) {
      throw invalidFunctionArgumentError(this[fnChain])
    }

    if (Array.isArray(rows)) {
      // check if we have at least one element
      if (rows.length === 0) {
        throw invalidFunctionArgumentError(this[fnChain], rows)
      }

      // check if all the entries in the array are arrays
      if (rows.every(e => Array.isArray(e))) {
        this._rows(rows)
        // check if array contains one or multiple objects
      } else if (rows.every(e => typeof e === 'object')) {
        this._entries(rows)
        // the rows have been added as arguments
      } else if (args.length !== 0) {
        args.unshift(rows)
        this._rows(args)
      } else {
        this._values(rows)
      }
    } else if (typeof rows === 'object') {
      this._entries(rows)
    } else {
      throw invalidFunctionArgumentError(this[fnChain], rows)
    }

    return this
  }

  /**
   * Adds one or more entries as rows.
   * @throws Error if no valid entries are provided
   */
  entries (...args) {
    this[fnChain] = this[fnChain].concat('.entries()')
    const entries = Array.isArray(args[0]) ? args[0] : args
    this._invalidArgs('entries', entries)
    return this.rows(entries)
  }

  values (...args) {
    this[fnChain] = this[fnChain].concat('.values()')
    const values = Array.isArray(args[0]) ? args[0] : args
    this._invalidArgs('values', values)
    this._values(values)
    return this
  }

  as (selectCqn) {
    this[fnChain] = this[fnChain].concat('.as()')
    if (!selectCqn || !selectCqn.SELECT) {
      throw invalidFunctionArgumentError(this[fnChain], selectCqn)
    }

    this.INSERT.as = selectCqn
    return this
  }

  _invalidArgs (argName, args) {
    if (!Array.isArray(args) || args.length === 0) {
      throw invalidFunctionArgumentError(this[fnChain], args)
    }
  }

  _rows (rows) {
    this.INSERT.rows = rows
  }

  _values (values) {
    this.INSERT.values = values
  }

  _entries (entries) {
    // object can be passed directly, so if only 1 object is passed wrap it into an array
    this.INSERT.entries = Array.isArray(entries) ? entries : [entries]
  }

  valueOf () {
    return `INSERT INTO ${Insert._quoteElement(this.INSERT.into)} `
  }
}

const insert = (...entries) => {
  return {
    into: entity => {
      return Insert.into(entity).entries(...entries)
    }
  }
}
insert.into = Insert.into

module.exports = insert
