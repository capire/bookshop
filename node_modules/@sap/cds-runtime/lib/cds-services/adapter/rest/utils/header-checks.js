const getError = require('../../../../common/error')

const contentTypeCheck = req => {
  if (req.headers['content-type'] && req.headers['content-type'] !== 'application/json') {
    throw getError(415, 'INVALID_CONTENT_TYPE_ONLY_JSON')
  }
}
module.exports = {
  contentTypeCheck
}
