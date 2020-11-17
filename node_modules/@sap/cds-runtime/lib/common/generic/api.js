const cds = global.cds || require('@sap/cds/lib')

const DEBUG = cds.debug('ApplicationService')

function getData (params, args) {
  const data = {}

  if (params) {
    const keys = Object.keys(params)

    // REVISIT: api of bound * with params?
    // if (keys.length !== args.length) {
    //   throw new Error('params.length !== args.length')
    // }

    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = args[i]
    }
  }

  return data
}

function getResult (res, operation) {
  if (!operation.returns) {
    return
  }

  if (operation.returns.items && !Array.isArray(res)) {
    return [res]
  }

  if (!operation.returns.items && Array.isArray(res)) {
    return res[0]
  }

  return res
}

function getHandler (name, operations) {
  return async function (...args) {
    // this === tx or service

    let entity
    if (typeof args[0] === 'object' && args[0].kind && args[0].kind === 'entity') {
      args[0] = args[0].name.match(/\w*$/)[0]
    }
    if (typeof args[0] === 'string') {
      entity = this.entities[args[0]]
    }

    let operation, target, data
    if (entity) {
      // > bound
      operation = operations.bounds[entity.name]
      target = this.entities[args.shift()]
      data = getData(Object.assign({}, operation.parent.keys, operation.params || {}), args)
    } else {
      // > unbound
      operation = operations.unbound
      data = getData(operation.params, args)
    }

    const res = await this.emit({ event: name, target, data })

    return getResult(res, operation)
  }
}

function _logUnableToAdd (fn, srv) {
  DEBUG && DEBUG(`Unable to add function "${fn}" to service "${srv}" due to conflict`)
}

module.exports = function () {
  const operations = {}

  // unbounds
  for (const operation of this.operations) {
    const name = operation.name.match(/\w*$/)[0]
    if (name in this) {
      _logUnableToAdd(name, this.name)
      continue
    }

    operations[name] = { unbound: operation }
  }

  // bounds
  for (const entity of this.entities) {
    if (!entity.actions) continue

    for (const name in entity.actions) {
      const operation = entity.actions[name]
      if (name in this) {
        _logUnableToAdd(name, this.name)
        continue
      }

      operations[name] = operations[name] || {}
      operations[name].bounds = operations[name].bounds || {}
      operations[name].bounds[entity.name] = operation
    }
  }

  // register
  for (const name in operations) {
    this[name] = getHandler(name, operations[name])
  }
}
