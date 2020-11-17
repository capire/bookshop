const run = require('./run')
const insert = require('./insert')
const read = require('./read')
const update = require('./update')
const deleet = require('./delete')

module.exports = {
  run,
  insert,
  read,
  update,
  delete: deleet
}
