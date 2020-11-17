'use strict'

const CommonsHttpHeader = require('../../odata-commons').http.HttpHeader
const HttpHeaderReader = require('./HttpHeaderReader')
const BadRequestError = require('../errors/BadRequestError')

class HttpHeader extends CommonsHttpHeader {
  /**
   * Parses an Accept header.
   * @param {string|Buffer} accept header value to be parsed
   * @returns {AcceptTypeInfo[]} information about acceptable content types
   */
  static parseAcceptHeader (accept) {
    try {
      return new HttpHeaderReader(Buffer.isBuffer(accept) ? accept : Buffer.from(accept, 'latin1')).readAccept()
    } catch (err) {
      throw new BadRequestError(`Wrong accept header value '${accept}'`, err)
    }
  }

  /**
   * Parses an Accept-Charset header.
   * @param {string|Buffer} acceptCharset header value to be parsed
   * @returns {CharsetInfo[]} list of acceptable character sets
   */
  static parseAcceptCharsetHeader (acceptCharset) {
    try {
      return new HttpHeaderReader(
        Buffer.isBuffer(acceptCharset) ? acceptCharset : Buffer.from(acceptCharset, 'latin1')
      ).readAcceptCharset()
    } catch (err) {
      throw new BadRequestError(`Wrong accept-charset header value '${acceptCharset}'`, err)
    }
  }

  /**
   * Parses a Prefer header.
   * @param {string|Buffer} prefer header value to be parsed
   * @returns {Preferences} the preferences
   */
  static parsePreferHeader (prefer) {
    try {
      return new HttpHeaderReader(Buffer.isBuffer(prefer) ? prefer : Buffer.from(prefer, 'latin1')).readPrefer()
    } catch (err) {
      throw new BadRequestError(`Wrong prefer header value '${prefer}'`, err)
    }
  }

  /**
   * Reads a header line.
   * @param {Buffer} line the header line
   * @returns {HeaderInfo} header information
   */
  static parseHeaderLine (line) {
    return new HttpHeaderReader(line).readHeaderLine()
  }
}

module.exports = HttpHeader
