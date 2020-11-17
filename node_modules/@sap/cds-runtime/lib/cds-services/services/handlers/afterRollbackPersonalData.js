/* istanbul ignore file */

const { callAuditLogContinuation, isRelevantOperation } = require('../utils/personalData')

/**
 * Finishes the audit logging in case of a data change event and rollback.
 *
 * @param result - the result of the event
 * @param context - the context object
 * @returns {Promise}
 */
module.exports = (result, context) => {
  if (isRelevantOperation(context.event, context.target) && context._.auditLogContinuation) {
    return callAuditLogContinuation(context, 'after rollback')
  }
}
