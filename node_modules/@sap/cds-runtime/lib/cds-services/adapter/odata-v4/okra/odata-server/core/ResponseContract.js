'use strict'

/**
 * Stores information which has been negotiated between client and server.
 * This includes the negotiated response content type.
 * @hideconstructor
 */
class ResponseContract {
  constructor () {
    /**
     * @type {string}
     * @private
     */
    this._locale = null

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
    this._serializerFunction = null
  }

  /**
   * Sets the best matched content type info (negotiated between accept header and supported formats).
   * @param {ContentTypeInfo} contentTypeInfo the content-type info
   * @returns {ResponseContract} this instance
   * @package
   */
  setContentTypeInfo (contentTypeInfo) {
    this._contentTypeInfo = contentTypeInfo
    return this
  }

  /**
   * Returns the best matched content type info (negotiated between accept header and supported formats).
   * @returns {ContentTypeInfo} the content-type info
   */
  getContentTypeInfo () {
    return this._contentTypeInfo
  }

  /**
   * Sets the negotiated response representation kind
   * @param {RepresentationKind.Kinds} representationKind the representation kind
   * @returns {ResponseContract} this instance
   * @package
   */
  setRepresentationKind (representationKind) {
    this._representationKind = representationKind
    return this
  }

  /**
   * Returns the negotiated response representation kind.
   * @returns {RepresentationKind.Kinds} the representation kind
   */
  getRepresentationKind () {
    return this._representationKind
  }

  /**
   * Sets the negotiated serializer function which should be used to serialize the response.
   * @param {SerializerFunction} serializerFunction the serializer function
   * @returns {ResponseContract} this instance
   * @package
   */
  setSerializerFunction (serializerFunction) {
    this._serializerFunction = serializerFunction
    return this
  }

  /**
   * Returns the negotiated serializer function which should be used to serialize the response.
   * @returns {?SerializerFunction} the serializer function
   */
  getSerializerFunction () {
    return this._serializerFunction
  }

  /**
   * Sets the locale the response should be provided for.
   * @param {string} locale the locale
   * @returns {ResponseContract} this instance
   */
  setLocale (locale) {
    this._locale = locale
    return this
  }

  /**
   * Returns the negotiated locale or null, if none was set.
   * @returns {?string} the locale
   */
  getLocale () {
    return this._locale
  }
}

module.exports = ResponseContract
