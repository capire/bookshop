const AMQPMessaging = require('./AMQPMessaging')
const options = require('./message-queuing-utils/options')
const { addSubscription, putQueue } = require('./message-queuing-utils/management')
const { emit, addDataListener } = require('./message-queuing-utils/client')

class MessageQueuing extends AMQPMessaging {
  constructor (...args) {
    super(...args)
    this._options = options
    this._putQueue = putQueue
    this._addSubscription = addSubscription
    this._addDataListener = addDataListener
    this._emit = emit
  }
}

module.exports = MessageQueuing
