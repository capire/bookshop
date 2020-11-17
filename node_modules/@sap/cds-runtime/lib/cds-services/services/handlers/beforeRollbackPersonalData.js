/* istanbul ignore file */

const { callAuditLogContinuation, isRelevantOperation, logDataChange } = require('../utils/personalData')

module.exports = auditLogger => {
  /**
   * In case of failed commit: finishes the audit logging in case of a data change event and rollback.
   * In case of failed on handler: starts audit logging
   *
   * @param context - the context object
   * @returns {Promise}
   */
  return context => {
    const phase = 'before rollback'

    if (isRelevantOperation(context.event, context.target) && context.event !== 'READ') {
      if (context._.auditLogContinuation) {
        return callAuditLogContinuation(context, phase)
      }

      return logDataChange(auditLogger, context, phase)
    }
  }
}
