const { deleteDraft } = require('../utils/deleteDraftUtils')
/**
 * Generic Handler for DELETE requests.
 * In case of success it returns an empty object.
 * If the entry to be deleted does not exist, it rejects with error to return a 404.
 *
 * @param context - operation object, that provides error, continuation and other functions as well as information
 * regarding the current operation.
 * @alias module:handlers.onDelete
 */
const onDeleteDraft = ({ model: { definitions } = {} } = {}) => context => {
  return deleteDraft(context, definitions, true)
}

const { ODATA, COMMON } = require('../../../common/constants/annotation')
const _relevant = e => e[ODATA.DRAFT] || e[COMMON.DRAFT_NODE.PREP_ACTION]
module.exports = function () {
  let _handler
  for (const entity of Object.values(this.entities).filter(_relevant)) {
    _handler = _handler || onDeleteDraft(this)
    this.on('DELETE', entity, _handler)
  }
}
