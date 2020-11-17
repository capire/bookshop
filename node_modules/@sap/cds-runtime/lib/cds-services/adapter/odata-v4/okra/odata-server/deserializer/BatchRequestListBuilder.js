'use strict'

const EventEmitter = require('events')
const HttpMethods = require('../../odata-commons').http.HttpMethod.Methods
const ContentReader = require('./ContentDeserializer')
const MultipartReader = require('./MultipartReader')
const OdataRequestInBatch = require('../core/OdataRequestInBatch')
const PlainHttpRequest = require('../core/PlainHttpRequest')
const DeserializationError = require('../errors/DeserializationError')

/**
 * Create a list of OdataRequestInBatch from an incoming batch request.
 */
class BatchRequestListBuilder {
  constructor () {
    /**
     * @type {OdataRequestInBatch[]}
     * @private
     */
    this._requestInBatchList = []

    // create emitter which is injected into readers
    this._emitter = new EventEmitter()
    this._setupEvents()

    // temporary helper
    this._currentPlainHttpRequest = null
    this._currentRequestId = null
    this._previousRequestId = null
    this._previousChangeId = null
    this._curAtomicityGroup = null
    this._atomicityGroupPredecessors = []
    this._currentBuffer = null
    this._multipartLevel = 0
    this._batchBoundary = ''

    /**
     * Used to produces IDs like '~0', '~1', '~2', ...
     * @type {number}
     * @private
     */
    this._autoRequestID = -1
  }

  /**
   * Returns the boundary used in the multipart document.
   * @returns {string} the boundary
   */
  getBatchBoundary () {
    return this._batchBoundary
  }

  /**
   * Prepares the internal state for reading the next part.
   * @private
   */
  _clearForNextRequest () {
    this._currentPlainHttpRequest = null
    this._currentRequestId = null
  }

  /**
   * Generates a request ID.
   * @param {string} tag the tag the ID starts with
   * @returns {string} the request ID
   * @private
   */
  _generateNewRequestID (tag) {
    const infix = tag | ''
    this._autoRequestID++
    return '~' + infix + this._autoRequestID.toString()
  }

  /**
   * Starts reading the incoming batch request.
   * @param {OdataRequest} request the OData request
   * @param {Function} callback the callback
   */
  build (request, callback) {
    const source = request.getIncomingRequest()

    // create a body reader
    const parser = new MultipartReader(source.headers)
    parser.setEmitter(this._emitter)

    // create reader and start with ContentReader
    const reader = new ContentReader(parser, this._emitter)

    source
      .pipe(reader)
      .on('finish', () => {
        callback(null, this._requestInBatchList)
      })
      .on('error', callback)
  }

  /**
   * Registers the events emitted by the multipart parser.
   */
  _setupEvents () {
    this._emitter.on(ContentReader.EVENTS.MULTIPART_START, boundary => {
      this._multipartLevel++

      if (this._multipartLevel === 1) {
        this._batchBoundary = boundary
      } else if (this._multipartLevel === 2) {
        this._curAtomicityGroup = boundary
      } else if (this._multipartLevel === 3) {
        throw new DeserializationError('Nested changesets are not allowed.')
      }
    })

    this._emitter.on(ContentReader.EVENTS.PART_START, () => this._clearForNextRequest())

    this._emitter.on(ContentReader.EVENTS.REQUEST_START, () => {
      this._currentPlainHttpRequest = new PlainHttpRequest()
    })

    this._emitter.on(ContentReader.EVENTS.REQUEST_REQUESTLINE, requestLine => {
      const parts = requestLine.toString('latin1').split(' ')
      this._currentPlainHttpRequest.setMethod(parts[0])
      this._currentPlainHttpRequest.setUri(parts[1])
      this._currentPlainHttpRequest.setVersion(parts[2])
    })

    this._emitter.on(ContentReader.EVENTS.REQUEST_HEADERS, headers => {
      this._currentPlainHttpRequest.setHeaders(headers)
    })

    this._emitter.on(ContentReader.EVENTS.REQUEST_BODY_START, () => {
      this._currentBuffer = Buffer.from([])
    })

    this._emitter.on(ContentReader.EVENTS.REQUEST_BODY_DATA, data => {
      this._currentBuffer = Buffer.concat([this._currentBuffer, data])
    })

    this._emitter.on(ContentReader.EVENTS.REQUEST_BODY_END, () => {
      this._currentPlainHttpRequest.setBody(this._currentBuffer)
    })

    this._emitter.on(ContentReader.EVENTS.UNCONSUMED, () => {
      throw new DeserializationError('Invalid OData batch request, invalid data at request end')
    })

    this._emitter.on(ContentReader.EVENTS.REQUEST_END, () => {
      let requestID = this._currentRequestId || this._generateNewRequestID()
      const odataRequestInBatch = new OdataRequestInBatch(this._currentPlainHttpRequest, requestID)

      // Add dependency for ordered execution (as defined in specification).
      if (this._multipartLevel === 1) {
        if (this._previousChangeId) odataRequestInBatch.addDependsOn(this._previousChangeId)
      } else if (this._atomicityGroupPredecessors.length) {
        for (const id of this._atomicityGroupPredecessors) odataRequestInBatch.addDependsOn(id)
      }

      // The URL may contain a reference to the result of another request.
      const referencedId = odataRequestInBatch.getReferencedId()
      if (referencedId) odataRequestInBatch.addDependsOn(referencedId)

      if (this._curAtomicityGroup) odataRequestInBatch.setAtomicityGroupId(this._curAtomicityGroup)
      this._requestInBatchList.push(odataRequestInBatch)

      this._previousRequestId = requestID
      if (
        [HttpMethods.DELETE, HttpMethods.PATCH, HttpMethods.POST, HttpMethods.PUT].includes(
          this._currentPlainHttpRequest.method.toUpperCase()
        )
      ) {
        this._previousChangeId = requestID
        if (!this._curAtomicityGroup) this._atomicityGroupPredecessors = [requestID]
      } else {
        this._atomicityGroupPredecessors.push(requestID)
      }
    })

    this._emitter.on(ContentReader.EVENTS.PART_HEADERS, headers => {
      const contentId = headers['content-id']
      this._currentRequestId = contentId ? contentId.getValue() : undefined
    })

    this._emitter.on(ContentReader.EVENTS.MULTIPART_END, () => {
      this._multipartLevel--
      this._previousChangeId = this._curAtomicityGroup
      this._atomicityGroupPredecessors = [this._curAtomicityGroup]
      this._curAtomicityGroup = null
    })
  }
}

module.exports = BatchRequestListBuilder
