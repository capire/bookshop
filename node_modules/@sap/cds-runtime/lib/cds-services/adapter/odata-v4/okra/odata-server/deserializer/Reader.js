'use strict'

/**
 * Parent class of all readers
 */
class Reader {
  /**
   */
  constructor () {
    this._emitter = null
  }

  /**
   * Sets the event emitter
   *
   * @param {EventEmitter} emitter - Emitter used for emitting events
   * @param {string} [prefix] - Prefix to be appended to event name
   * @returns {Reader} this instance
   */
  setEmitter (emitter, prefix) {
    this._emitter = emitter
    this._prefix = prefix ? prefix + '.' : ''
    return this
  }

  /**
   * Emits an event via the internal emitter
   * @param {string} event - Event name
   * @param {*} data1 data send to event receiver
   * @param {*} data2 data send to event receiver
   * @param {*} data3 data send to event receiver
   */
  emit (event, data1, data2, data3) {
    this._emitter.emit(this._prefix + event, data1, data2, data3)
  }

  /**
   * Emit consumed bytes data from the caches read position onwards and advance the cache position
   *
   * @param {Cache} cache - Cache
   * @param {number} consumed - Amount of bytes to consume
   * @param {string} event - Event to be emitted
   */
  emitAndConsume (cache, consumed, event) {
    if (this._emitter && consumed) {
      this.emit(event, cache.getBytes(consumed))
    }
    cache.advance(consumed)
  }
}

module.exports = Reader
