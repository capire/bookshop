/* istanbul ignore file */

let error

const _getHanaDriver = name => {
  try {
    return Object.assign({ name }, require(name))
  } catch (err) {
    if (name === '@sap/hana-client') {
      error = err
      return _getHanaDriver('hdb')
    }

    throw error
  }
}

let prefer = '@sap/hana-client'

// hdb as own dependency?
try {
  const pckg = require(require('path').join(process.cwd(), 'package.json'))
  if (pckg && pckg.dependencies && pckg.dependencies.hdb && !pckg.dependencies['@sap/hana-client']) {
    prefer = 'hdb'
  }
} catch (e) {
  // nothing to do
}

module.exports = _getHanaDriver(prefer)
