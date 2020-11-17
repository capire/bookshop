const { addDraftDataFromExistingDraft } = require('../utils/handlerUtils')
/**
 * Generic Handler for before DELETE requests.
 *
 * @alias module:handlers.beforeDeleteOrCancelDraft
 */
const beforeDeleteOrCancelDraft = service => async context => {
  await addDraftDataFromExistingDraft(context, service)
}

const { ODATA, COMMON } = require('../../../common/constants/annotation')
const _relevant = e => e[ODATA.DRAFT] || e[COMMON.DRAFT_NODE.PREP_ACTION]
module.exports = function () {
  let _handler
  for (const entity of Object.values(this.entities).filter(_relevant)) {
    _handler = _handler || beforeDeleteOrCancelDraft(this)
    _handler._initial = true
    this.before(['DELETE', 'CANCEL'], entity, _handler)
  }
}
