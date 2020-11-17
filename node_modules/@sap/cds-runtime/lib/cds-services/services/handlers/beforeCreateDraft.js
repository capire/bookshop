const { isNavigationToMany } = require('../utils/compositionTree')
const { isDraftActivateAction } = require('../utils/draftUtils')
const { addDraftDataFromExistingDraft, addGeneratedDraftUUID } = require('../utils/handlerUtils')

/**
 * Generic Handler for before CREATE requests.
 *
 * @param service
 * @alias module:handlers.beforeCreateDraft
 */
const beforeCreateDraft = service => async context => {
  if (isDraftActivateAction(context)) {
    return
  }
  if (isNavigationToMany(context)) {
    const result = await addDraftDataFromExistingDraft(context, service)
    // in order to fix strange case where active subitems are created in draft case
    if (result.length === 0) {
      context.reject(404)
    }
  } else {
    addGeneratedDraftUUID(context)
  }
}

const { ODATA, COMMON } = require('../../../common/constants/annotation')
const _relevant = e => e[ODATA.DRAFT] || e[COMMON.DRAFT_NODE.PREP_ACTION]
module.exports = function () {
  let _handler
  for (const entity of Object.values(this.entities).filter(_relevant)) {
    _handler = _handler || beforeCreateDraft(this)
    _handler._initial = true
    this.before('NEW', entity, _handler)
  }
}
