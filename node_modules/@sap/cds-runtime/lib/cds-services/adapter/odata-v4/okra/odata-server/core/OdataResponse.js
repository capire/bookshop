'use strict'

const EventEmitter = require('events')
const validateThat = require('../../odata-commons').validator.ParameterValidator.validateThat
const PreferenceApplied = require('../http/PreferencesApplied.js')

/**
 * Response object wrapper to carry original response information.
 * If any error occurs in the underlying stream, the OdataResponse object emits this error.
 * If any data was written, a finish event will be emitted.
 *
 * @extends EventEmitter
 * @hideconstructor
 */
class OdataResponse extends EventEmitter {
  /**
   * Creates an instance of OdataResponse.
   * @param {PlainHttpResponse|http.ServerResponse} inResponse - The original response object.
   */
  constructor (inResponse) {
    super()

    this._response = inResponse

    this._response.on('error', err => this.emit('error', err))
    this._response.on('finish', () => this.emit('finish'))

    this._isBuffered = false
    this._buffer = Buffer.from('')

    this._preferencesApplied = null

    this._statusCodeHasBeenSet = false

    this._contract = null

    this._logger = null
  }

  /**
   * Returns the current logger instance.
   * @returns {LoggerFacade} The current logger instance
   */
  getLogger () {
    return this._logger
  }

  /**
   * Sets the current logger instance.
   * @param {LoggerFacade} logger The current logger
   * @returns {OdataResponse} this OData response instance
   * @package
   */
  setLogger (logger) {
    this._logger = logger
    return this
  }

  /**
   * Sets the response contract.
   * @param {ResponseContract} contract The response contract
   * @returns {OdataResponse} this response object
   * @package
   */
  setContract (contract) {
    if (this._contract !== null) this._originalContract = this._contract
    this._contract = contract
    return this
  }

  /**
   * Returns the current response contract.
   * @returns {ResponseContract} The current response contract
   */
  getContract () {
    return this._contract
  }

  /**
   * Returns the original response contract.
   * @returns {ResponseContract} The original response contract
   */
  getOriginalContract () {
    return this._originalContract
  }

  /**
   * Sets this response into buffered mode. If buffered mode is active, all data writing to
   * to response will be buffered and can be fetched by method .getBuffer().
   *
   * @param {boolean} isBuffered if true, response will be in buffered mode, else false
   * @returns {OdataResponse} this instance of OData response
   */
  setBuffered (isBuffered) {
    this._isBuffered = isBuffered
    return this
  }

  /**
   * Returns the internal buffer.
   * @returns {Buffer} The internal buffer.
   */
  getBuffer () {
    return this._buffer
  }

  /**
   * Concatenates the data to the internal buffer.
   * @param {*} data The data to concatenate
   * @private
   */
  _concatBuffer (data) {
    if (data !== null && data !== undefined) {
      this._buffer = Buffer.concat([this._buffer, Buffer.from(data)])
    }
  }

  /**
   * Ends the response and closes the underlying client connection.
   * @param {string|Buffer} data any data to send to the client
   * @param {string} [encoding] encoding of data if it is a string
   * @param {Function} [callback] function to be called when the response stream is finished
   * @returns {OdataResponse} this instance of OdataResponse
   * @package
   */
  end (data, encoding, callback) {
    if (this._isBuffered) {
      if (data && data.pipe && typeof data.pipe === 'function') {
        data
          .on('data', chunk => this._concatBuffer(chunk))
          .on('end', callback)
          .on('error', callback)
      } else {
        this._concatBuffer(data)
        callback()
      }
    } else if (data && data.pipe && typeof data.pipe === 'function') {
      data
        .on('end', callback)
        .on('error', callback)
        .pipe(this._response)
    } else {
      if (!this._response.writableEnded) this._response.end(data, encoding, callback)
      this._buffer = Buffer.from('')
    }
    return this
  }

  /**
   * Writes into the underlying stream.
   * @param {string|Buffer} chunk chunk of data to write
   * @param {string} [encoding] the encoding of the data if it is a string, default is utf8
   * @param {Function} [callback] called when data was written
   * @package
   */
  write (chunk, encoding, callback) {
    if (this._isBuffered) {
      this._concatBuffer(chunk)
      callback()
    } else {
      this._response.write(chunk, encoding, callback)
    }
  }

  /**
   * Sets the response status code.
   * The status code can only be set once unless the overwrite option is used.
   *
   * @param {number} statusCode The status code to set.
   * @param {Object} [options] An options object to control the behavior for setting the status code.
   * @param {Object} [options.overwrite] If true the status code will be set anyway. Default is 'false'
   * @throws IllegalArgumentError If the status code is not a number.
   * @returns {OdataResponse} this instance of OData response
   */
  setStatusCode (statusCode, options = { overwrite: false }) {
    if (!this._statusCodeHasBeenSet || options.overwrite) {
      validateThat('statusCode', statusCode).typeOf('number')
      if (options.overwrite) {
        this._statusCodeOriginal = this._response.statusCode
      }
      this._response.statusCode = statusCode
      this._statusCodeHasBeenSet = true
    }

    return this
  }

  /**
   * Returns the current status code of this response.
   * @returns {number} the current status code
   */
  getStatusCode () {
    return this._response.statusCode
  }

  /**
   * Returns the original status code before overwriting.
   * @returns {number} the original status code
   */
  getOriginalStatusCode () {
    return this._statusCodeOriginal
  }

  /**
   * Sets the status message of the HTTP response.
   * @param {string} msg The message to set
   * @returns {OdataResponse} This instance of OData response
   */
  setStatusMessage (msg) {
    this._response.statusMessage = msg
    return this
  }

  /**
   * Returns the status message of the HTTP response.
   * @returns {string} The status message
   */
  getStatusMessage () {
    return this._response.statusMessage
  }

  /**
   * Stores all Preferences, which were actually applied by the application or library.
   * @returns {PreferenceApplied} an object which stores the actually applied Preferences.
   */
  getPreferencesApplied () {
    if (this._preferencesApplied === null) {
      this._preferencesApplied = new PreferenceApplied()
    }
    return this._preferencesApplied
  }

  /**
   * Set a header. The header name will be handled as case-insensitive key.
   * If a header already exists then the header will be replaced by this new value.
   *
   * @param {string} name Case-insensitive header name.
   * @param {string} value Value for the given header name.
   * @returns {OdataResponse} this instance
   * @see <a href="http://ietf.org/rfc/rfc7230.txt">RFC 7230, section 3.2.2</a>
   */
  setHeader (name, value) {
    this._response.setHeader(name, value)
    return this
  }

  /**
   * Returns the corresponding header value found by name.
   * @param {string} name the name of the header
   * @returns {string} the value for the header, or undefined if not found
   */
  getHeader (name) {
    return this._response.getHeader(name)
  }

  /**
   * Returns all available headers set.
   * @returns {Object} All headers with header: headerValue pairs.
   */
  getHeaders () {
    return this._response.getHeaders()
  }

  /**
   * Returns true if the headers of the response have been sent already.
   * @returns {boolean} true if headers have been sent already, else false
   */
  isHeadersSent () {
    return this._response.headersSent
  }

  /**
   * Returns the response body created by application. This body should be sent to the client.
   * @returns {*} This body
   */
  getBody () {
    return this._body
  }

  /**
   * Sets the response body. The body is set while processing the dispatcher command.
   * @param {*} body The response body
   * @returns {OdataResponse} This instance
   */
  setBody (body) {
    this._body = body
    return this
  }

  /**
   * @typedef {Object} Options
   */

  /**
   * Returns the OData response options. These options are needed for serialization.
   * @returns {Options} The OData response options
   */
  getOdataOptions () {
    return this._odataOptions
  }

  /**
   * Sets the OData response options.
   * @param {Options} options the OData response options
   * @returns {OdataResponse} this instance
   * @package
   */
  setOdataOptions (options) {
    this._odataOptions = options
    return this
  }
}

module.exports = OdataResponse
