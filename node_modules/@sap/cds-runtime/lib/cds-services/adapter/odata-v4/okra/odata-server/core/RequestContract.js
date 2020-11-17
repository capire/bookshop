'use strict'

/**
 * Stores information which has been negotiated between client and server.
 * This includes the request content type.
 * @hideconstructor
 */
class RequestContract {
  constructor () {
    /**
     * @type {boolean}
     * @private
     */
    this._isDebug = false

    /**
     * @type {ContentTypeInfo}
     * @private
     */
    this._contentTypeInfo = null

    /**
     * @type {RepresentationKind.Kinds}
     * @private
     */
    this._representationKind = null

    /**
     * @type {Function}
     * @private
     */
    this._deserializerFunction = null
  }

  /**
   * Enable or disable the debug mode.
   * @param {boolean} isDebug true to enable debug mode, else false.
   * @returns {RequestContract} This instance
   */
  enableDebugMode (isDebug) {
    this._isDebug = isDebug
    return this
  }

  /**
   * Returns true if the request has odata-debug custom query option and debug is enabled.
   * @returns {boolean} True if debug output has to be produced
   */
  isDebug () {
    return this._isDebug
  }

  /**
   * Sets the content type info (determined from Content-Type header).
   * @param {ContentTypeInfo} contentTypeInfo the content-type info
   * @returns {RequestContract} this instance
   * @package
   */
  setContentTypeInfo (contentTypeInfo) {
    this._contentTypeInfo = contentTypeInfo
    return this
  }

  /**
   * Returns the content type info (determined from Content-Type header).
   * @returns {ContentTypeInfo} the content-type info
   */
  getContentTypeInfo () {
    return this._contentTypeInfo
  }

  /**
   * Sets the request representation kind.
   * @param {RepresentationKind.Kinds} representationKind the representation kind
   * @returns {RequestContract} this instance
   * @package
   */
  setRepresentationKind (representationKind) {
    this._representationKind = representationKind
    return this
  }

  /**
   * Returns the request representation kind.
   * @returns {RepresentationKind.Kinds} the representation kind
   */
  getRepresentationKind () {
    return this._representationKind
  }

  /**
   * Sets the deserializer function.
   * @param {Function} fn The deserializer function
   * @returns {RequestContract} This instance of contract
   * @package
   */
  setDeserializerFunction (fn) {
    this._deserializerFunction = fn
    return this
  }

  /**
   * Returns the deserializer function. This is the function responsible for parsing the request payload.
   * @returns {Function} The deserializer function
   */
  getDeserializerFunction () {
    return this._deserializerFunction
  }
}

module.exports = RequestContract
