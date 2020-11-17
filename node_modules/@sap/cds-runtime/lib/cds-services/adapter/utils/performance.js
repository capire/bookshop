/* istanbul ignore file */
// REVISIT: remove istanbul ignore once re-enabled

const { performance, PerformanceObserver } = require('perf_hooks')
const generateUUID = require('../../../common/utils/uuid')

const _addDurationToRequest = (req, splitName, duration) => {
  if (splitName[2] === 'Total') {
    req.performanceMeasurement.results.total = duration
  } else if (splitName[splitName.length - 2] === 'SQL') {
    req.performanceMeasurement.results.db += duration
  } else if (splitName[splitName.length - 1] === 'ODataIn') {
    req.performanceMeasurement.results.ODataIn = duration
  } else if (splitName[splitName.length - 1] === 'default') {
    req.performanceMeasurement.results.defaulthandler += duration
  } else if (splitName[splitName.length - 1] === 'custom') {
    req.performanceMeasurement.results.customhandler += duration
  }
}

const _clearMeasuresAndMarksOfRequest = req => {
  for (const mark of req.performanceMeasurement.marks) {
    performance.clearMarks(mark)
  }

  if (performance.clearMeasures) {
    for (const measure of req.performanceMeasurement.measures) {
      performance.clearMeasures(measure)
    }
  }
}

const _observerCallback = req => items => {
  const entry = items.getEntries()[0]
  const splitName = entry.name.split(' ')

  if (splitName[0] === req.performanceMeasurement.uuid) {
    if (entry.entryType === 'mark') {
      req.performanceMeasurement.marks.push(entry.name)
    } else if (entry.entryType === 'measure') {
      req.performanceMeasurement.measures.push(entry.name)
      _addDurationToRequest(req, splitName, entry.duration)
    }
  }
}

const _statisticsRequested = req =>
  (req.query && req.query['sap-statistics'] === 'true') ||
  (req.headers && req.headers['sap-statistics'] === 'true' && (!req.query || !req.query['sap-statistics']))

const measurePerformance = (req, res) => {
  if (_statisticsRequested(req)) {
    const uuid = generateUUID()
    const startMark = `${uuid} Start`
    const endMark = `${uuid} End`

    req.performanceMeasurement = {
      uuid,
      performance,
      sqlId: 0,
      results: { total: 0.0, db: 0.0, ODataIn: 0.0, defaulthandler: 0.0, customhandler: 0.0 },
      marks: [],
      measures: []
    }
    req.performanceMeasurement.observer = new PerformanceObserver(_observerCallback(req))
    req.performanceMeasurement.observer.observe({ entryTypes: ['measure', 'mark'] })

    const includeStatusHeader = originalFn =>
      function (...args) {
        if (!res.headersSent) {
          // avoid ERR_HTTP_HEADERS_SENT in case res.write was used before res.end
          performance.mark(endMark)
          performance.measure(`${uuid} 0 Total`, startMark, endMark)

          _clearMeasuresAndMarksOfRequest(req)

          req.performanceMeasurement.observer.disconnect()

          const statusCode = res.statusCode && res.statusCode.toString()

          if (!statusCode.startsWith('4') && !statusCode.startsWith('5')) {
            res.setHeader(
              'sap-statistics',
              `total=${req.performanceMeasurement.results.total.toFixed(
                2
              )},defaulthandler=${req.performanceMeasurement.results.defaulthandler.toFixed(
                2
              )},customhandler=${req.performanceMeasurement.results.customhandler.toFixed(
                2
              )},db=${req.performanceMeasurement.results.db.toFixed(2)}`
            )
          }
        }

        originalFn.call(this, ...args)
      }

    // if res.write is used e.g. by odata-server, no headers can be set afterwards
    const originalWrite = res.write
    res.write = includeStatusHeader(originalWrite)
    const originalEnd = res.end
    res.end = includeStatusHeader(originalEnd)

    performance.mark(startMark)
  }
}

module.exports = measurePerformance
