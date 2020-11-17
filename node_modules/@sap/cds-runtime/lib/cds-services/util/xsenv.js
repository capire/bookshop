const _findByType = type => {
  try {
    return require('@sap/xsenv').getServices({
      [type]: {
        tag: type
      }
    })
  } catch (e) {}
}

const _structured = filter => {
  return Object.keys(filter).some(key => {
    return typeof filter[key] === 'object'
  })
}

const _filter = (serviceName, filter) => {
  if (_structured(filter)) {
    return filter
  }

  return { [serviceName]: filter }
}

const _getServices = (serviceName, filter) => {
  if (typeof filter === 'object') {
    return require('@sap/xsenv').getServices(_filter(serviceName, filter))
  }

  return _findByType(serviceName)
}

/**
 * Get credentials for service by name and/or filter object.
 * @param {string} serviceName
 * @param {Object} [filter]
 * @return {*}
 * @private
 */
const getCredentialsFromXsEnv = (serviceName, filter) => {
  const services = _getServices(serviceName, filter)

  if (services) {
    return services[Object.keys(services)[0]]
  }
}

module.exports = getCredentialsFromXsEnv
