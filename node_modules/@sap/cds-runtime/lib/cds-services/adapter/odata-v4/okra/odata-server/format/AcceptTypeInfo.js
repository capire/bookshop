'use strict'

const ContentTypeInfo = require('../../odata-commons').format.ContentTypeInfo

/**
 * Used to store the parts of an accept type.
 * @extends ContentTypeInfo
 * @hideconstructor
 */
class AcceptTypeInfo extends ContentTypeInfo {
  /**
   * Constructor
   * @param {string} typeAndSubtype Mime type and subtype
   */
  constructor (typeAndSubtype) {
    super()
    super.setMimeType(typeAndSubtype)

    /**
     * @type {number}
     * @private
     */
    this._quality = 1
  }

  /**
   * Set the quality.
   * @param {number} quality the quality
   * @returns {AcceptTypeInfo} this instance
   * @package
   */
  setQuality (quality) {
    this._quality = quality
    return this
  }

  /**
   * Return the quality.
   * @returns {number} quality
   */
  getQuality () {
    return this._quality
  }

  toString () {
    return super.toString() + (this._quality < 1 ? ';q=' + this._quality : '')
  }

  /**
   * Return true if the given MIME type is matched by this instance's MIME type
   * (which can contain '*'), false otherwise.
   * @param {string} mimeType the MIME type to match
   * @returns {boolean} whether the MIME type is matched
   */
  match (mimeType) {
    const m = this.getMimeType()
    if (m.startsWith('*')) return true
    if (m.endsWith('*')) return m.substring(0, m.indexOf('/')) === mimeType.substring(0, mimeType.indexOf('/'))
    return m === mimeType
  }

  /**
   * Return a number indicating how two AcceptTypeInfo instances compare to each other
   * according to the sort order determined by quality-parameter value and specificity
   * (defined in RFC 7231, chapters 3.1.1.1, 5.3.1, and 5.3.2) as:
   * a negative value if a comes before b;
   * a positive value if a comes after b;
   * 0 if they are considered equal.
   * @param {AcceptTypeInfo} a first instance
   * @param {AcceptTypeInfo} b second instance
   * @returns {number} the comparison result (-1, 0, or 1)
   */
  static compare (a, b) {
    if (a.getQuality() !== b.getQuality()) return b.getQuality() - a.getQuality()
    // '^' is XOR in JavaScript.
    if (a.getMimeType().startsWith('*') ^ b.getMimeType().startsWith('*')) {
      return a.getMimeType().startsWith('*') ? 1 : -1
    }
    if (a.getMimeType().endsWith('*') ^ b.getMimeType().endsWith('*')) {
      return a.getMimeType().endsWith('*') ? 1 : -1
    }
    return b.getParameters().length - a.getParameters().length
  }
}

module.exports = AcceptTypeInfo
