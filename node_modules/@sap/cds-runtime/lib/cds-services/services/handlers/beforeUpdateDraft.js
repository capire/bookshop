const { addDraftDataFromExistingDraft } = require('../utils/handlerUtils')
const { isDraftActivateAction } = require('../utils/draftUtils')

/**
 * Generic Handler for before UPDATE requests.
 *
 * @alias module:handlers.beforeUpdateDraft
 */
const beforeUpdateDraft = service => async context => {
  if (isDraftActivateAction(context)) {
    return
  }

  const result = await addDraftDataFromExistingDraft(context, service)

  // means that draft not exists
  if (result.length === 0) {
    context.reject(404)
  }
}

const { ODATA, COMMON } = require('../../../common/constants/annotation')
const _relevant = e => e[ODATA.DRAFT] || e[COMMON.DRAFT_NODE.PREP_ACTION]
module.exports = function () {
  let _handler
  for (const entity of Object.values(this.entities).filter(_relevant)) {
    _handler = _handler || beforeUpdateDraft(this)
    _handler._initial = true
    this.before(['PATCH', 'UPDATE'], entity, _handler)
  }
}
