'use strict'

const Readable = require('stream').Readable

/**
 * Simulates an http.IncomingMessage
 * Used when parsing an multipart/mixed request into sub requests
 *
 * @extends Readable
 * @hideconstructor
 */
class PlainHttpRequest extends Readable {
  /**
   * Constructor
   */
  constructor () {
    super()
    this.method = 'GET'
    this.url = '/'
    this.version = 'HTTP/1.1'
    this.headers = {}
    this._body = null

    this._readPosition = 0
    this._line = null

    this._odataRequestId = null
    this._atomicityGroupId = null

    /**
     * @type {BatchContext}
     * @private
     */
    this._batchContext = null
  }

  /**
   * Return OData request ID.
   * @returns {?string} the request ID
   */
  getOdataRequestId () {
    return this._odataRequestId
  }

  /**
   * Set OData request ID.
   * @param {string} id OData request ID
   * @returns {PlainHttpRequest} this instance
   */
  setOdataRequestId (id) {
    this._odataRequestId = id
    return this
  }

  /**
   * Return atomicity group ID.
   * @returns {?string} the atomicity group ID
   */
  getAtomicityGroupId () {
    return this._atomicityGroupId
  }

  /**
   * Set atomicity group ID.
   * @param {string} id Atomicity group ID
   * @returns {PlainHttpRequest} this instance
   */
  setAtomicityGroupId (id) {
    this._atomicityGroupId = id
    return this
  }

  /**
   * Set the HTTP method.
   * @param {string} method the HTTP method
   * @returns {PlainHttpRequest} this instance
   * @package
   */
  setMethod (method) {
    this.method = method
    return this
  }

  /**
   * Set the uri.
   * @param {string} uri the URI
   * @returns {PlainHttpRequest} this instance
   * @package
   */
  setUri (uri) {
    this.url = uri
    return this
  }

  /**
   * Set the HTTP version.
   * @param {string} version the HTTP version
   * @returns {PlainHttpRequest} this instance
   * @package
   */
  setVersion (version) {
    this.version = version
    return this
  }

  /**
   * Set the headers object.
   * @param {Object} headers the headers
   * @returns {PlainHttpRequest} this instance
   * @package
   */
  setHeaders (headers) {
    this.headers = headers
    return this
  }

  /**
   * Set the body.
   * @param {Buffer} buffer the body
   * @returns {PlainHttpRequest} this instance
   * @package
   */
  setBody (buffer) {
    this._body = buffer
    return this
  }

  /**
   * Returns the request body.
   * @returns {?Buffer} the request body
   */
  getBody () {
    return this._body
  }

  /**
   * Readable implementation.
   * @param {number} size the size to read
   * @private
   */
  _read (size) {
    if (!this._body || this._readPosition >= this._body.length) {
      this.push(null)
    } else {
      const pushTo = Math.min(this._body.length, this._readPosition + size)
      this.push(this._body.slice(this._readPosition, pushTo))
      this._readPosition = pushTo
    }
  }

  /**
   * Returns batch context with meta information (e.g., dependencies).
   * So this context is used to tranport information from the batch request
   * to the batched request / sub request.
   *
   * @returns {BatchContext} OData batch context
   * @package
   */
  getBatchContext () {
    return this._batchContext
  }

  /**
   * Set batch context with meta information (e.g., dependencies).
   * @param {BatchContext} batchContext batch context information
   * @returns {PlainHttpRequest} this instance
   * @package
   */
  setBatchContext (batchContext) {
    this._batchContext = batchContext
    return this
  }
}

module.exports = PlainHttpRequest
