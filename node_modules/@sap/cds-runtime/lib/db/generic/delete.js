// REVISIT: DeleteResult
// const DeleteResult = require('../result/DeleteResult')

/**
 * Generic Handler for DELETE requests.
 * REVISIT: correct description?
 * In case of success it returns undefined.
 * If the entry to be deleted does not exist, it rejects with error 404.
 *
 * @param req - cds.Request
 */
module.exports = function (req) {
  if (typeof req.query === 'string') {
    return this._execute.sql(this.dbc, req.query, req.data)
  }

  return this._delete(this.model, this.dbc, req.query, req)
}
