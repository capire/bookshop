const AMQPMessaging = require('./AMQPMessaging')
const options = require('./enterprise-messaging-utils/options')
const { addSubscription, putQueue } = require('./enterprise-messaging-utils/management')
const { emit, addDataListener } = require('./enterprise-messaging-utils/client')

class EnterpriseMessaging extends AMQPMessaging {
  constructor (...args) {
    super(...args)
    this._options = options
    this._putQueue = putQueue
    this._addSubscription = addSubscription
    this._addDataListener = addDataListener
    this._emit = emit
  }
}

module.exports = EnterpriseMessaging
