'use strict'

const AbstractError = require('../../odata-commons').errors.AbstractError

/**
 * This class is used to represent a deserialization-related error.
 * @extends AbstractError
 */
class DeserializationError extends AbstractError {
  /**
   * @param {string} message the error message
   * @param {Error} [rootCause] the root cause
   */
  constructor (message, rootCause) {
    super(AbstractError.ErrorNames.DESERIALIZATION, message, rootCause)
  }
}

module.exports = DeserializationError
