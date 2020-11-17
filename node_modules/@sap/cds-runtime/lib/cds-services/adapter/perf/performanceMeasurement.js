const measurePerformance = require('../utils/performance')

const hasPackage = require('../utils/hasPackage')
const packageName = '@dynatrace/oneagent-sdk'
let dynatrace

if (hasPackage(packageName)) {
  const sdk = require(packageName)
  const api = sdk.createInstance()
  dynatrace = {
    sdk,
    api
  }
}

const sapStatistics = (req, res, next) => {
  measurePerformance(req, res)
  next()
}

const useDynatrace = (req, res, next) => {
  req.dynatrace = dynatrace
  next()
}

const performanceMeasurement = app => {
  app.use(sapStatistics)

  if (dynatrace) {
    app.use(useDynatrace)
  }
}

module.exports = performanceMeasurement
