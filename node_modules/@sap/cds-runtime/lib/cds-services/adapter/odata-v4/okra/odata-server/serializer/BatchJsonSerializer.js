'use strict'

const commons = require('../../odata-commons')
const HttpHeaders = commons.http.HttpHeader.HeaderNames
const ContentTypes = commons.format.ContentTypeInfo.ContentTypes

/**
 * Serializes the list of batched responses.
 */
class BatchJsonSerializer {
  /**
   * Serializes batched responses to OData JSON string.
   * @param {Map.<string, OdataResponseInBatch>} responses responses to be written, with response ID as key
   * @returns {string} the serialized responses
   */
  serialize (responses) {
    return JSON.stringify({
      responses: Array.from(responses.values()).map(response => {
        let result = { status: response.getStatusCode() }

        const id = response.getOdataResponseId()
        if (id) result.id = id

        const atomicityGroup = response.getAtomicityGroupId()
        if (atomicityGroup) result.atomicityGroup = atomicityGroup

        const httpResponse = response.getIncomingResponse()
        result.headers = httpResponse.getHeaders()

        const contentType = httpResponse.getHeader(HttpHeaders.CONTENT_TYPE)
        const isJson = contentType && contentType.startsWith(ContentTypes.JSON)
        const isText = contentType && contentType.startsWith('text/')
        const body = httpResponse.getBody()
        if (body.length) {
          if (isJson) result.body = JSON.parse(body.toString())
          else if (isText) result.body = body.toString()
          else result.body = body.toString('base64')
        }

        return result
      })
    })
  }
}

module.exports = BatchJsonSerializer
