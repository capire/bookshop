'use strict'

const ContentTypeInfo = require('../format/ContentTypeInfo')

/**
 * Reads header values as defined in RFCs 7231, 7230, 7240, and 5234.
 * Currently only the headers prefer (only 'odata.continue-on-error', 'odata.maxpagesize', 'return'
 * and everything allowed by http://tools.ietf.org/html/draft-snell-http-prefer-18),
 * content-type and accept are supported.
 *
 * Used syntax:
 *
 * https://tools.ietf.org/html/rfc7230#section-3.2
 * header-field   = field-name ":" OWS field-value OWS
 * field-name     = token
 * field-value    = *( field-content / obs-fold )                   !!! obs-fold is not supported by this parser
 * field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar    = VCHAR / obs-text
 * obs-fold       = CRLF 1*( SP / HTAB )                            !!! obs-fold is not supported by this parser
 * ; obsolete line folding
 * ; see Section 3.2.4
 *
 * https://tools.ietf.org/html/rfc7231#section-3.1.1.1
 * Content-Type     = media-type
 * media-type       = type "/" subtype *( OWS ";" OWS parameter )
 * parameter        = token "=" ( token / quoted-string )
 * type             = token
 *
 * Accept = #( media-range [ accept-params ] )
 * media-range = ( "&#42;/&#42;"
 *               / ( type "/" "&#42;" )
 *               / ( type "/" subtype )
 *               ) *( OWS ";" OWS parameter )
 * accept-params = weight *( accept-ext )
 * accept-ext = OWS ";" OWS token [ "=" ( token / quoted-string ) ]
 * weight = OWS ";" OWS "q=" qvalue
 * qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )
 *
 * https://tools.ietf.org/html/rfc7240#section-2
 * Errata to RFC 7240 (Errata ID: 4439)
 * Prefer     = "Prefer" ":" 1#preference
 * preference = preference-parameter *( OWS ";" [ OWS preference-parameter ] )
 * preference-parameter = parameter / token
 *
 * https://tools.ietf.org/html/rfc7230#section-3.2.6
 * quoted-string    = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * quoted-pair      = "\" ( HTAB / SP / VCHAR / obs-text )
 * qdtext           = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text         = %x80-FF
 * token            = 1*tchar
 * tchar            = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *                       / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *                       / DIGIT / ALPHA
 *
 *  https://tools.ietf.org/html/rfc5234#appendix-B.1
 *  ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z
 *  DIGIT          =  %x30-39
 *  DQUOTE         =  %x22
 *  VCHAR          =  %x21-7E
 */
class HttpHeaderReader {
  /**
   * Constructor
   * @param {Buffer} source Buffer do be parsed
   */
  constructor (source) {
    this._origSource = source
    this._source = source
    this._index = 0
    this._length = source.length
  }

  /**
   * Read a character at the read position, if the character doesn't matches the expectedChar an error is thrown
   * If the character matches the read position is increased, other wise the read position is not increased
   *
   * @param {string} expChar Character to be expected at read position
   * @returns {string} the read character
   * @throws {Error}
   * @protected
   */
  _readChar (expChar) {
    let code = this._source[this._index]
    if (code !== expChar.codePointAt(0)) {
      throw new Error('Expected "' + expChar + '" at index ' + this._index + ' but found ' + this._getCurrentChar())
    }
    this._index++
    return expChar
  }

  /**
   * Check if the character at the read position is a given character.
   * @param {string} expChar character to be compared with the read position
   * @returns {boolean} true if characters are equal, false other wise
   * @throws {Error}
   * @protected
   */
  _checkChar (expChar) {
    let code = this._source[this._index]
    if (code === expChar.charCodeAt(0)) {
      this._index++
      return true
    }
    return false
  }

  _isVCHAR (code) {
    return code >= 0x21 && code <= 0x7e
  }

  /**
   * Consumes optional whitespaces and increases the read position
   * @protected
   */
  _readOWS () {
    let code = this._source[this._index]
    while (
      code === 0x20 || // SP
      code === 0x09
    ) {
      // HTAB
      this._index++
      code = this._source[this._index]
    }
  }

  /**
   * Returns character at read position
   *
   * @returns {string} Character at read position
   * @protected
   */
  _getCurrentChar () {
    const code = this._source[this._index]
    let char
    if (code) {
      if (this._isVCHAR(code)) {
        char = this._source.toString('latin1', this._index, this._index + 1)
      } else {
        char = '0x' + this._source.toString('hex', this._index, this._index + 1)
      }
    }

    return char ? '"' + char + '"' : 'no char'
  }

  /**
   * Consumes a quoted string and increases the read position
   *
   * @returns {string} String (without leading and trailing quotes, deescaped)
   * @throws {Error}
   * @protected
   */
  _readQuotedString () {
    // " is already consumed so start
    let s = ''
    let code = this._source[this._index]
    while (
      (code >= 0x23 && code <= 0x5b) ||
      (code >= 0x5d && code <= 0x7e) ||
      (code >= 0x80 && code <= 0xff) || // obs-text
      code === 0x09 || // HTAB
      code === 0x20 || // SP
      code === 0x21 || // %x21
      code === 0x5c
    ) {
      // "\"     quoted-pair start
      if (code === 0x5c) {
        // quoted-pair char
        this._index++
        // Don't add "\" to string because:
        // Recipients that process the value of a quoted-string MUST handle a quoted-pair
        // as if it were replaced by the octet following the backslash.
        code = this._source[this._index]
        if (
          (code >= 0x21 && code <= 0x7e) || // VCHAR
          (code >= 0x80 && code <= 0xff) || // obs-text
          code === 0x09 || // HTAB
          code === 0x20 // SP
        ) {
          s = s + this._source.toString('latin1', this._index, this._index + 1)
          this._index++
          code = this._source[this._index]
        } else {
          throw new Error('Illegal character ' + this._getCurrentChar() + ' after "\\" at position ' + this._index)
        }
      } else {
        // normal char
        s = s + this._source.toString('latin1', this._index, this._index + 1)
        this._index++
        code = this._source[this._index]
      }
    }

    this._readChar('"')

    return s
  }

  /**
   * Consumes a token and increases the read position
   *
   * @returns {string} Token build from (latin1) decoded buffer part
   * @throws {Error}
   * @protected
   */
  _readToken () {
    let token = ''
    let code = this._source[this._index]
    while (
      (code >= 0x41 && code <= 0x61) ||
      (code >= 0x61 && code <= 0x7a) ||
      (code >= 0x30 && code <= 0x39) ||
      code === 0x21 || // "!"
      code === 0x23 || // "#"
      code === 0x24 || // "$"
      code === 0x25 || // "%"
      code === 0x26 || // "&"
      code === 0x27 || // "'"
      code === 0x2a || // "*"
      code === 0x2b || // "+"
      code === 0x2d || // "-"
      code === 0x2e || // "."
      code === 0x5e || // "^"
      code === 0x5f || // "_"
      code === 0x60 || // "`"
      code === 0x7c || // "|"
      code === 0x7e
    ) {
      // "~"
      token = token + this._source.toString('latin1', this._index, this._index + 1)
      this._index++
      code = this._source[this._index]
    }
    return token
  }

  /**
   * Consumes all parameters and increases the read position
   *
   * @returns {Array.<{name:string, value:string}>} Array with parameters
   * @throws {Error}
   * @protected
   */
  _readParameters () {
    let params = []

    this._readOWS()
    let name
    let value

    while (this._checkChar(';')) {
      this._readOWS()
      name = this._readToken()
      if (name.length === 0) {
        throw new Error(
          'Expected valid parameter name at index ' + this._index + ' but found ' + this._getCurrentChar()
        )
      }
      this._readChar('=')

      if (this._checkChar('"')) {
        value = this._readQuotedString()
      } else {
        value = this._readToken()
      }
      if (value.length === 0) {
        throw new Error(
          'Expected valid parameter value at index ' + this._index + ' but found ' + this._getCurrentChar()
        )
      }
      params.push({ name: name, value: value })
      this._readOWS()
    }
    return params
  }

  /**
   * Read the content type and increase the read position.
   * @param {?ContentTypeInfo} [contentTypeInfo] - Specific content type information (e.g. JsonContentTypeInfo)
   * @returns {ContentTypeInfo} the content-type information
   */
  readContentType (contentTypeInfo = null) {
    const type = this._readToken()

    let ret = contentTypeInfo || new ContentTypeInfo()

    if (type.length === 0) {
      const c = this._getCurrentChar()
      throw new Error('Expected valid type at index ' + this._index + ' but found ' + c)
    }

    this._readChar('/')

    const subtype = this._readToken()

    if (subtype.length === 0) {
      throw new Error('Expected valid subtype at index ' + this._index + ' but found ' + this._getCurrentChar())
    }

    const parameters = this._readParameters()

    if (this._index !== this._length) {
      // not all chars are consumed
      throw new Error('Illegal character ' + this._getCurrentChar() + ' after content type at index ' + this._index)
    }

    ret.setMimeType(type + '/' + subtype)

    for (const parameter of parameters) {
      ret.addParameter(parameter.name, parameter.value)
    }

    return ret
  }
}

module.exports = HttpHeaderReader
