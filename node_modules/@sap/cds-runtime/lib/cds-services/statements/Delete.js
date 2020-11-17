const Where = require('./Where')

/**
 * DELETE statement removes values or rows from a specific table.
 * @extends {Where}
 */
class Delete extends Where {
  constructor () {
    super('DELETE')
  }

  /**
   * @param {string|object} entity string or an entity from reflection API
   */
  static from (entity) {
    const cqn = new Delete()

    if (typeof entity === 'string' && (entity.includes(':') || entity.includes('['))) {
      cqn.DELETE.from = Where.convertPathExpression(entity)
    } else {
      cqn.DELETE.from = Where._isEntity(entity, 'DELETE.from()')
    }

    return cqn
  }

  valueOf () {
    return `DELETE FROM ${Delete._quoteElement(this.DELETE.from)} `
  }
}

module.exports = Delete
