'use strict'

const CHARSETS = {
  UTF_8: 'utf-8',
  ALL: '*'
}

class CharsetInfo {
  /**
   * Used to store parts of the Accept-Charset Header
   * @param {string} charset the character set
   */
  constructor (charset) {
    this._charset = charset
    this._quality = 1
  }

  /**
   * Set the quality.
   * @param {number} quality the quality
   * @returns {CharsetInfo} this instance
   * @package
   */
  setQuality (quality) {
    this._quality = quality
    return this
  }

  /**
   * Return the quality.
   * @returns {number} quality
   * @package
   */
  getQuality () {
    return this._quality
  }

  /**
   * Set the charset.
   * @param {string} charset character set
   * @returns {CharsetInfo} this instance
   */
  setCharset (charset) {
    this._charset = charset
    return this
  }

  /**
   * Return the charset.
   * @returns {string} the character set
   * @package
   */
  getCharset () {
    return this._charset
  }

  /**
   * Returns if all Charsets are supported.
   * @returns {boolean} whether all character sets are supported
   */
  isAll () {
    return this._charset.toLowerCase() === CHARSETS.ALL
  }

  /**
   * Returns if the charset is supported.
   * @returns {boolean} whether the character set is supported
   */
  isSupported () {
    return this.isAll() || this._charset.toLowerCase() === CHARSETS.UTF_8
  }
}

CharsetInfo.CHARSETS = CHARSETS

module.exports = CharsetInfo
