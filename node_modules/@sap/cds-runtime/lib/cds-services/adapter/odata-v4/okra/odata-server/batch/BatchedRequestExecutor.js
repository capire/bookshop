'use strict'

const HeaderNames = require('../../odata-commons').http.HttpHeader.HeaderNames
const OdataResponseInBatch = require('../core/OdataResponseInBatch')
const PlainHttpResponse = require('../core/PlainHttpResponse')

/**
 * Start the execution of a request contained within request to $batch.
 */
class BatchedRequestExecutor {
  /**
   * Constructor
   * @param {BatchContext} batchContext Batch context
   * @param {OdataRequestInBatch} request Batched request
   */
  constructor (batchContext, request) {
    /**
     * Batch context
     * @type {BatchContext}
     * @private
     */
    this._batchContext = batchContext

    /**
     * Request to be executed
     * @type {OdataRequestInBatch}
     * @private
     */
    this._request = request
  }

  /**
   * Executes a batched request with forwarding the request's HTTP data to the process method of the service.
   * @returns {Promise} a promise
   */
  execute () {
    const oDataRequestID = this._request.getOdataRequestId()
    const service = this._batchContext.getRequest().getService()

    const plainHttpRequest = this._request.getIncomingRequest()
    const plainHttpResponse = new PlainHttpResponse()
    const odataResponseInBatch = new OdataResponseInBatch(plainHttpResponse, oDataRequestID)

    const atomicityGroupId = this._request.getAtomicityGroupId()

    // Transfer information to nested ODataRequest via PlaintHttpRequest.
    plainHttpRequest.setOdataRequestId(oDataRequestID)
    plainHttpRequest.setBatchContext(this._batchContext)

    if (atomicityGroupId) {
      plainHttpRequest.setAtomicityGroupId(atomicityGroupId)
      odataResponseInBatch.setAtomicityGroupId(atomicityGroupId)
    }
    this._batchContext.addResponseInBatch(odataResponseInBatch)

    this._insertContentIdsIntoRequestUrl()

    try {
      return service.process(plainHttpRequest, plainHttpResponse).then((/* ignore result, read status code */) => {
        const statusCode = plainHttpResponse.statusCode
        if (statusCode >= 400 && statusCode < 600) {
          this._batchContext.markRequestAsFailed(oDataRequestID, this._request, odataResponseInBatch)
        } else {
          // Store location header.
          const locationHeader = plainHttpResponse.getHeader(HeaderNames.LOCATION)
          if (locationHeader) this._batchContext.addLocation(oDataRequestID, locationHeader)
        }
        return Promise.resolve()
      })
    } catch (frameworkError) {
      return Promise.reject(frameworkError)
    }
  }

  /**
   * Apply content-ID referencing.
   * @private
   */
  _insertContentIdsIntoRequestUrl () {
    let url = this._request.getIncomingRequest().url
    const id = this._request.getReferencedId()
    if (id) {
      const replacement = this._batchContext.getLocation(id)
      if (replacement) {
        url = url.replace('$' + id, replacement)
        this._request.rewriteUrl(url)
      }
    }
  }
}

module.exports = BatchedRequestExecutor
