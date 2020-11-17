const _keyFromEntity = entity => {
  const keyName = Object.keys(entity.keys)[0]
  return entity.keys[keyName]
}

const getConvertedValue = (type, value) => {
  // TODO: part of input validation?
  // TODO: what to do with binaries (Buffer?!)
  switch (type) {
    case 'cds.Boolean':
      return value === 'true'
    case 'cds.Integer':
    case 'cds.Integer64':
    case 'cds.Decimal':
    case 'cds.DecimalFloat':
    case 'cds.Double':
      return Number(value)
    default:
      return value
  }
}

module.exports = {
  getKeyValuePair: (entity, value) => {
    const key = _keyFromEntity(entity)
    return {
      [key.name]: getConvertedValue(key.type, value)
    }
  },
  getConvertedValue
}
