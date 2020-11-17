'use strict'

/**
 * Used to store the parts of a content type.
 * @hideconstructor
 */
class ContentTypeInfo {
  constructor () {
    this._name = 'content-type'
    this._mimeType = null

    /**
     * @type {Array.<{name:string,value:string}>}
     * @private
     */
    this._parameters = []
  }

  /**
   * Returns the header name.
   * @returns {string} Header name
   */
  getName () {
    return this._name
  }

  /**
   * Sets the MIME type and subtype part of the content type.
   * @param {string} mimeType the MIME type
   * @returns {ContentTypeInfo} this instance
   * @package
   */
  setMimeType (mimeType) {
    this._mimeType = mimeType
    return this
  }

  /**
   * Returns the corresponding MIME-Type with the subtype without any parameters.
   * Example: application/json
   *
   * @returns {string} The corresponding type and subtype
   * @package
   */
  getMimeType () {
    return this._mimeType
  }

  /**
   * Returns an array containing all parameters contained in the content-type string.
   * @returns {Array.<{ name: string, value: string }>} the parameters
   */
  getParameters () {
    return this._parameters
  }

  /**
   * Returns the value or values of a parameter.
   * @param {string} name Name of the parameter
   * @returns {string|string[]} the value(s)
   */
  getParameter (name) {
    const values = this._parameters.filter(nameValue => nameValue.name === name).map(nameValue => nameValue.value)
    if (!values || values.length === 0) return null
    if (values.length === 1) return values[0]
    return values
  }

  /**
   * Adds a parameter.
   * @param {string} name name of the parameter
   * @param {string} value value of the parameter
   * @returns {ContentTypeInfo} this instance
   * @package
   */
  addParameter (name, value) {
    this._parameters.push({ name: name, value: value })
    return this
  }

  /**
   * Returns the corresponding MIME type with the subtype and with all parameters.
   * Example: application/json;IEEE754Compatible=true
   * @returns {string} the content type
   */
  toString () {
    return this._mimeType + this._parameters.map(p => (p.value ? ';' + p.name + '=' + p.value : '')).join('')
  }
}

/**
 * MIME type
 * @enum {string}
 * @readonly
 */
ContentTypeInfo.ContentTypes = {
  XML: 'application/xml',
  JSON: 'application/json',
  HTML: 'text/html',
  TEXT_PLAIN: 'text/plain',
  BINARY: 'application/octet-stream',
  MULTIPART_MIXED: 'multipart/mixed'
}

module.exports = ContentTypeInfo
