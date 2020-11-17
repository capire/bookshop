'use strict'

const BatchContext = require('../batch/BatchContext')
const BatchValidator = require('../batch/BatchValidator')
const BatchProcessor = require('../batch/BatchProcessor')

/**
 * Processes all requests to $batch,
 * performing request and atomicity group validation (for multipart requests) and executing batched requests.
 */
class BatchHandler {
  /**
   * Process a $batch request.
   * @param {OdataRequest} request - the OData request
   * @param {OdataResponse} response - the OData response
   * @param {Function} next - The callback function with signature next(error, resultData).
   */
  static handle (request, response, next) {
    const data = request.getBody()
    const batchContext = new BatchContext(request, response)
      .setBatchBoundary(data.boundary)
      .setSemantics(data.semantics)
      .setRequestList(data.requests)

    if (data.semantics === BatchContext.SEMANTICS.MULTIPART) BatchValidator.validate(data.requests)

    new BatchProcessor(batchContext)
      .process()
      // At this point the batch processing should be finished and the responses from the batched requests are
      // collected inside the batch context.
      .catch(next)
      .then(() => next(null, batchContext))
  }
}

module.exports = BatchHandler
