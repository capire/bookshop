'use strict'

const AbstractError = require('../../odata-commons').errors.AbstractError

class PreconditionRequiredError extends AbstractError {
  constructor (message) {
    super(AbstractError.ErrorNames.PRECONDITION_REQUIRED_ERROR, message || 'Precondition required')
  }
}

module.exports = PreconditionRequiredError
