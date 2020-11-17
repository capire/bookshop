const CONVERTED = Symbol.for('sap.cds.converted')

/**
 * Convert any result to the result object structure, which is expected of odata-v4.
 * @param {*} result
 * @param {*} [arg]
 * @return {string|object}
 */
const toODataResult = (result, arg) => {
  if (result === undefined || result === null) {
    return ''
  }

  if (result[CONVERTED]) {
    return result
  }

  if (arg) {
    if (typeof arg === 'object') {
      arg = arg._.odataReq
        .getUriInfo()
        .getLastSegment()
        .isCollection()
        ? 'Array'
        : ''
    }
    if (!Array.isArray(result) && arg === 'Array') {
      result = [result]
    } else if (Array.isArray(result) && arg !== 'Array') {
      result = result[0]
    }
  }

  return {
    [CONVERTED]: true,
    value: result
  }
}

module.exports = {
  toODataResult
}
