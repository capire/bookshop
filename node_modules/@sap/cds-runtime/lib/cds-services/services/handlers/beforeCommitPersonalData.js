/* istanbul ignore file */

const { isRelevantOperation, logDataChange, logReadAccess } = require('../utils/personalData')

module.exports = auditLogger => {
  /**
   * Starts the audit logging in case of a data change event or writes the log immediately for data read access.
   *
   * @param context - the context object
   * @returns {*|Promise} - promise if relevant for audit logging, otherwise undefined
   */
  return context => {
    if (isRelevantOperation(context.event, context.target)) {
      if (context.event === 'READ') {
        return logReadAccess(auditLogger, context)
      }

      return logDataChange(auditLogger, context, 'before commit')
    }
  }
}
