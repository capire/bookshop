const getError = require('../../common/error')

const getModelNotDefinedError = modelName => {
  return new Error(`No valid model provided. Invalid model: ${JSON.stringify(modelName)}`)
}

// REVISIT: use i18n
const getFeatureNotSupportedError = message => {
  return getError(501, `Feature is not supported: ${message}`)
}

const getAuditLogNotWrittenError = (rootCauseError, phase, event) => {
  const errorMessage =
    !phase || event === 'READ' ? 'Audit log could not be written' : `Audit log could not be written ${phase}`
  const error = new Error(errorMessage)
  error.rootCause = rootCauseError
  return error
}

const hasBeenCalledError = (method, query) => {
  return new Error(`Method ${method} has been called before. Invalid CQN: ${JSON.stringify(query)}`)
}

const unexpectedFunctionCallError = (functionName, expectedFunction) => {
  return new Error(`Cannot build CQN object. Invalid call of "${functionName}" before "${expectedFunction}"`)
}

const invalidFunctionArgumentError = (statement, arg) => {
  const details = JSON.stringify(arg, (key, value) => (value === undefined ? '__undefined__' : value)).replace(
    /"__undefined__"/g,
    'undefined'
  )
  return new Error(`Cannot build ${statement} statement. Invalid data provided: ${details}`)
}

module.exports = {
  getModelNotDefinedError,
  getFeatureNotSupportedError,
  getAuditLogNotWrittenError,
  hasBeenCalledError,
  unexpectedFunctionCallError,
  invalidFunctionArgumentError
}
