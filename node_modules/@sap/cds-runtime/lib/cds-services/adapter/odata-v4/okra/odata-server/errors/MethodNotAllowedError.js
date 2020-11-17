'use strict'

const AbstractError = require('../../odata-commons').errors.AbstractError

/**
 * @extends AbstractError
 */
class MethodNotAllowedError extends AbstractError {
  /**
   * @param {string} [message] the error message
   */
  constructor (message) {
    super(AbstractError.ErrorNames.METHOD_NOT_ALLOWED, message || 'Method not allowed')
  }
}

module.exports = MethodNotAllowedError
