const { emit, addDataListener } = require('../common-utils/client')
module.exports = {
  emit: emit('topic:'),
  addDataListener: addDataListener('queue:')
}
