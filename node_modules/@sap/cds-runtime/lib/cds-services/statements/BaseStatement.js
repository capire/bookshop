const { invalidFunctionArgumentError } = require('../util/errors')
const cds = global.cds || require('@sap/cds/lib')

const _slugify = name => name.replace(/::/g, '__').replace(/\./g, '_')

const quotingStyles = {
  // assumption that the delimiter is "
  quoted: name => `"${name}"`,
  plain: name => _slugify(name)
}

const fnChain = Symbol.for('sap.cds.fnChain')

const _resolveEntityAndKeys = pathExpression => {
  return {
    transformedEntity: `"${pathExpression.substring(0, pathExpression.indexOf('[')) || pathExpression}"`,
    keys: pathExpression.substring(pathExpression.indexOf('['))
  }
}

class BaseStatement {
  constructor (dml) {
    this[dml] = {}

    Object.defineProperty(this, fnChain, { value: dml, writable: true })
  }

  static _isEntity (value, fnName) {
    if (value) {
      const entity = value.name || value

      if (typeof entity === 'string') {
        return entity
      }
    }

    throw invalidFunctionArgumentError(fnName, value)
  }

  static convertPathExpression (entity) {
    if (entity.includes(':') && entity.includes('[')) {
      // if ']' included -> keys provided, ':' can be part of date key or navigationh
      const baseEntity = entity.substring(0, entity.indexOf(']') + 1)
      if (baseEntity.length === entity.length) {
        // no navigation
        const { transformedEntity, keys } = _resolveEntityAndKeys(baseEntity)
        return cds.parse.expr(`${transformedEntity}${keys}`)
      } else {
        // ']' is followed by ':', we use + 1 to get the path
        const path = entity.substring(baseEntity.length + 1, entity.length)
        const { transformedEntity, keys } = _resolveEntityAndKeys(baseEntity)
        return cds.parse.expr(`${transformedEntity}${keys}.${path}`)
      }
    }

    if (entity.includes(':')) {
      // if no ']' included -> no keys provided -> first ':' must be separator
      const [baseEntity, path] = entity.split(/:(.+)/)
      const { transformedEntity } = _resolveEntityAndKeys(baseEntity)
      return cds.parse.expr(`${transformedEntity}.${path}`)
    }

    // entity.includes.only('['))
    const { transformedEntity, keys } = _resolveEntityAndKeys(entity)
    return cds.parse.expr(`${transformedEntity}${keys}`)
  }

  static _quoteElement (element) {
    return quotingStyles[cds.env.sql_mapping](element)
  }

  get _isQuery () {
    return true
  }
}

module.exports = BaseStatement
