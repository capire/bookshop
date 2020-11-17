const BaseStatement = require('./BaseStatement')
const { hasBeenCalledError, invalidFunctionArgumentError } = require('../util/errors')

const fnChain = Symbol.for('sap.cds.fnChain')

/**
 * CREATE statement creates entity
 */
class Create extends BaseStatement {
  constructor () {
    super('CREATE')
  }

  /**
   * @param {string|object} entity - entity name or an entity from reflection API
   * @param {object} elements - dictionary as specified in CSN element definition
   */
  static entity (entity, elements) {
    BaseStatement._isEntity(entity, 'CREATE.entity()')

    const cqn = new Create()
    cqn[fnChain] = cqn[fnChain].concat('.entity()')

    if (elements) {
      cqn.CREATE.entity = { elements: elements, kind: 'entity', name: entity }
    } else {
      cqn.CREATE.entity = entity
    }

    return cqn
  }

  /**
   * Constructs a create statement as SELECT.from statement
   * @param {object} query - SELECT query
   * @example
   * CREATE.entity('Bar').as(SELECT.from('Foo'))
   * @throws Error - if called twice or if query is not of expected format
   *
   */
  as (query) {
    this[fnChain] = this[fnChain].concat('.as()')
    if (!query || !query.SELECT) {
      throw invalidFunctionArgumentError(this[fnChain], query)
    }

    if (this.CREATE.as) {
      throw hasBeenCalledError('as()', this[fnChain])
    }

    this.CREATE.as = query
    return this
  }
}

module.exports = Create
