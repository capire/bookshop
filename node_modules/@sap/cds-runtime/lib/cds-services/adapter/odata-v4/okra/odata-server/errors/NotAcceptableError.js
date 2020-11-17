'use strict'

const AbstractError = require('../../odata-commons').errors.AbstractError

/**
 * @extends AbstractError
 */
class NotAcceptableError extends AbstractError {
  /**
   * @param {string} message the error message
   */
  constructor (message) {
    super(AbstractError.ErrorNames.NOT_ACCEPTABLE, message)
  }

  static createForInacceptableContentType (requestedContentType) {
    return new NotAcceptableError(`The requested content-type '${requestedContentType}' is not acceptable`)
  }
}

module.exports = NotAcceptableError
