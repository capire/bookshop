'use strict'

const AbstractError = require('../../odata-commons').errors.AbstractError

/**
 * This class is used to represent a serialization-related error.
 * @extends AbstractError
 */
class SerializationError extends AbstractError {
  /**
   * @param {string} message the error message
   * @param {Error} rootCause the root cause
   */
  constructor (message, rootCause) {
    super(AbstractError.ErrorNames.SERIALIZATION, message, rootCause)
  }
}

module.exports = SerializationError
