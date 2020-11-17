'use strict'

const LoggerFacade = require('../../odata-commons').logging.LoggerFacade
const OdataRequest = require('./OdataRequest')
const OdataResponse = require('./OdataResponse')

/**
 * The main odata context. This context will be injected in most application components.
 */
class Context {
  /**
   * Creates an instance of Context. Furthermore build internal request/response wrapper.
   * @param {Object} request - the incoming request object
   * @param {Object} response - the outgoing response object
   * @param {Service} service - the OData service
   * @param {Function} serviceResolutionFn - Function to resolve the service name in the request URL. It must return an object with the 'base' and 'path' parts of the input URL.
   */
  constructor (request, response, service, serviceResolutionFn) {
    this._service = service

    this._request = new OdataRequest(request, serviceResolutionFn)
    this._response = new OdataResponse(response)

    this._performanceMonitor = null
  }

  /**
   * Sets logging information.
   * @param {LoggerFacade|Logger} logger the logger
   * @param {Function} formatter Function used to format each log entry before the logger is called
   * @param {string} id Id of the logger
   * @returns {Context} this instance of Context
   */
  setLogger (logger, formatter, id) {
    if (logger instanceof LoggerFacade) {
      this._loggerFacade = logger
    } else {
      this._loggerFacade = new LoggerFacade(logger, id).setFormatter(formatter)
    }
    this.getRequest().setLogger(this._loggerFacade)
    this.getResponse().setLogger(this._loggerFacade)
    return this
  }

  /**
   * Returns the logger facade.
   * @returns {LoggerFacade} the logger
   */
  getLogger () {
    return this._loggerFacade
  }

  /**
   * Sets the performance monitor.
   * @param {PerformanceMonitor} performanceMonitor The performance monitor
   * @returns {Context} This instance of Context
   */
  setPerformanceMonitor (performanceMonitor) {
    this._performanceMonitor = performanceMonitor
    return this
  }

  /**
   * Returns the performance monitor.
   * @returns {PerformanceMonitor} The performance monitor
   */
  getPerformanceMonitor () {
    return this._performanceMonitor
  }

  /**
   * Returns the request.
   * @returns {OdataRequest} The request.
   */
  getRequest () {
    return this._request
  }

  /**
   * Returns the response.
   * @returns {OdataResponse} The response.
   */
  getResponse () {
    return this._response
  }

  /**
   * Returns the Service instance
   * @returns {Service} the Service instance
   */
  getService () {
    return this._service
  }
}

module.exports = Context
