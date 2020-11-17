'use strict'

const url = require('url')

const SEGMENT_SEPARATOR_REGEXP = new RegExp('\\/|\\?')
const REQUEST_ID_REGEXP = new RegExp('^(?:\\w|[-.~])+$')

/**
 * Request object wrapper to carry original request information.
 * It is similar to OdataRequest but contains only the things needed for batch processing.
 */
class OdataRequestInBatch {
  /**
   * Creates an instance of OdataRequestInBatch.
   * @param {PlainHttpRequest} inRequest request object with {method, url, headers, payload}
   * @param {string} requestId the ID of the request
   */
  constructor (inRequest, requestId) {
    this._inRequest = inRequest

    this._odataRequestId = requestId

    /**
     * @type {string[]}
     * @private
     */
    this._dependsOn = []

    this._atomicityGroupId = null

    this._url = url.parse(this._inRequest.url)
  }

  /**
   * Rewrite the underlying URL.
   * @param {string} newUrl the URL
   * @returns {OdataRequestInBatch} this instance
   * @package
   */
  rewriteUrl (newUrl) {
    this._inRequest.url = newUrl
    this._url = url.parse(this._inRequest.url)
    return this
  }

  /**
   * Returns the original incoming node request message.
   * @returns {IncomingMessage} the original incoming request
   */
  getIncomingRequest () {
    return this._inRequest
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
   * @param {string} id Atomicity group id
   * @returns {OdataRequestInBatch} this instance
   */
  setAtomicityGroupId (id) {
    this._atomicityGroupId = id
    return this
  }

  /**
   * Return  OData request ID.
   * @returns {?string} the request ID
   */
  getOdataRequestId () {
    return this._odataRequestId
  }

  /**
   * Add the ID of a request or of a atomicity group which MUST have been processed successfully
   * before this request can be executed.
   * @param {string} id - Request ID or atomicity group ID
   * @returns {OdataRequestInBatch} This instance
   * @package
   */
  addDependsOn (id) {
    this._dependsOn.push(id)
    return this
  }

  /**
   * Returns the request IDs or atomicity group IDs this request depends on.
   * @returns {string[]} the list of request IDs and/or atomicity group IDs
   */
  getDependsOn () {
    return this._dependsOn
  }

  /**
   * Returns the header value for a given name.
   * @param {string} name the name of the header
   * @returns {string} The header value or undefined, if not found
   */
  getHeader (name) {
    return this._inRequest.headers[name]
  }

  /**
   * Returns all available headers.
   * @returns {Object} All headers with header:headerValue
   */
  getHeaders () {
    return this._inRequest.headers
  }

  /**
   * Returns the parsed url object parsed with node.js url module.
   * @returns {Object} The parsed url object.
   */
  getUrlObject () {
    return this._url
  }

  /**
   * Returns the referenced ID from the URL.
   * "The request identifier is case-sensitive, MUST be unique within the batch request,
   * and MUST satisfy the rule request-id in [OData-ABNF]."
   * request-id = 1*unreserved
   * unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
   * @returns {?string} the referenced ID or null if no reference is in the URL
   */
  getReferencedId () {
    const urlString = this._inRequest.url
    if (
      urlString.startsWith('$') &&
      !['$batch', '$crossjoin', '$all', '$entity', '$root', '$id', '$metadata'].some(name => urlString.startsWith(name))
    ) {
      // The URL contains a reference to the result of another request.
      const referencedId = urlString.substring(1, urlString.split(SEGMENT_SEPARATOR_REGEXP, 1)[0].length)
      return REQUEST_ID_REGEXP.test(referencedId) ? referencedId : null
    }
    return null
  }
}

module.exports = OdataRequestInBatch
