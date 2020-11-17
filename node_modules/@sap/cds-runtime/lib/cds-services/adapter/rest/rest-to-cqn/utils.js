const DATA_TYPES_NOT_TO_BE_CONVERTED_BY_COMPILER = {
  'cds.Boolean': 1,
  'cds.Integer': 1,
  'cds.Integer16': 1,
  'cds.Integer32': 1,
  'cds.Integer64': 1,
  'cds.Decimal': 1,
  'cds.DecimalFloat': 1,
  'cds.Float': 1,
  'cds.Double': 1
}

const _convertKeyForCompiler = (keyValue, type) => {
  if (!DATA_TYPES_NOT_TO_BE_CONVERTED_BY_COMPILER[type]) {
    return `'${keyValue}'`
  }

  return keyValue
}

const createCqlString = (target, key, keyValue) => {
  let keyString = ''

  if (keyValue !== undefined) {
    keyString = `[${key}=${_convertKeyForCompiler(keyValue, target.keys[key].type)}]`
  }

  return `${target.name}${keyString}`
}

module.exports = {
  createCqlString
}
