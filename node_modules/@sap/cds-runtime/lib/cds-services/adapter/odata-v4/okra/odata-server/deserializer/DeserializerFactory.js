'use strict'

const stream = require('stream')
const commons = require('../../odata-commons')
const PrimitiveValueDecoder = commons.utils.PrimitiveValueDecoder
const RepresentationKinds = commons.format.RepresentationKind.Kinds
const JsonContentTypeInfo = commons.format.JsonContentTypeInfo
const EdmTypeKind = commons.edm.EdmType.TypeKind
const EdmPrimitiveTypeKind = commons.edm.EdmPrimitiveTypeKind
const ResourceJsonDeserializer = require('./ResourceJsonDeserializer')
const BatchJsonDeserializer = require('./BatchJsonDeserializer')
const BatchRequestListBuilder = require('./BatchRequestListBuilder')
const BatchContext = require('../batch/BatchContext')
const BufferedWriter = require('../utils/BufferedWriter')
const DeserializationError = require('../errors/DeserializationError')

/**
 * The DeserializerFactory is responsible for creating parsing facade functions
 * for a specific payload type regarding to the corresponding request
 * representation kind like ENTITY and the corresponding request mime type.
 */
class DeserializerFactory {
  /**
   * Creates and returns the deserialization facade function for application/json requests.
   * This function is called on deserialization of the incoming payload.
   *
   * @param {Edm} edm the current EDM instance
   * @param {RepresentationKind.Kinds} representationKind the representation kind
   * @returns {Function} The deserialization facade function
   */
  static createJsonDeserializer (edm, representationKind) {
    const getPropertyFunction = uriInfo => uriInfo.getLastSegment().getProperty()

    function getCreateDeserializerFunction (name) {
      return contract => {
        const jsonContentTypeInfo = new JsonContentTypeInfo(contract.getContentTypeInfo())
        let expand = []
        let additionalInformation = { hasDelta: false }
        const deserializer = new ResourceJsonDeserializer(edm, jsonContentTypeInfo)
        return (edmObject, value) => {
          return {
            body: deserializer[name](edmObject, value, expand, additionalInformation),
            expand,
            additionalInformation
          }
        }
      }
    }

    switch (representationKind) {
      case RepresentationKinds.ENTITY:
        return DeserializerFactory._createDeserializer(
          uriInfo => uriInfo.getFinalEdmType(),
          getCreateDeserializerFunction('deserializeEntity')
        )

      case RepresentationKinds.PRIMITIVE:
        return DeserializerFactory._createDeserializer(
          getPropertyFunction,
          getCreateDeserializerFunction('deserializePrimitiveProperty')
        )

      case RepresentationKinds.PRIMITIVE_COLLECTION:
        return DeserializerFactory._createDeserializer(
          getPropertyFunction,
          getCreateDeserializerFunction('deserializePrimitivePropertyCollection')
        )

      case RepresentationKinds.COMPLEX:
        return DeserializerFactory._createDeserializer(
          getPropertyFunction,
          getCreateDeserializerFunction('deserializeComplexProperty')
        )

      case RepresentationKinds.COMPLEX_COLLECTION:
        return DeserializerFactory._createDeserializer(
          getPropertyFunction,
          getCreateDeserializerFunction('deserializeComplexPropertyCollection')
        )

      case RepresentationKinds.ACTION_PARAMETERS:
        return DeserializerFactory._createDeserializer(
          uriInfo => uriInfo.getLastSegment().getAction(),
          getCreateDeserializerFunction('deserializeActionParameters')
        )

      case RepresentationKinds.REFERENCE:
        return DeserializerFactory._createDeserializer(
          uriInfo => uriInfo.getFinalEdmType(),
          getCreateDeserializerFunction('deserializeReference')
        )

      default:
        return null
    }
  }

  /**
   * Create and return the deserialization function for text/plain requests
   * containing a single primitive value.
   * This function is called on deserialization of the incoming payload.
   *
   * @returns {Function} the deserialization function
   */
  static createTextValueDeserializer () {
    return DeserializerFactory._createDeserializer(
      uriInfo => uriInfo.getLastSegment(-1).getProperty(),
      () => {
        const deserializer = new PrimitiveValueDecoder()
        return (edmProperty, value) => {
          return { body: deserializer.decodeText(value.toString(), edmProperty) }
        }
      }
    )
  }

  /**
   * Create and return the deserialization function for binary requests.
   * This function is called on deserialization of the incoming payload.
   *
   * @returns {Function} the deserialization function
   */
  static createBinaryDeserializer () {
    return (request, next) => {
      let type = request.getUriInfo() && request.getUriInfo().getFinalEdmType()
      if (type && type.getKind() === EdmTypeKind.DEFINITION) type = type.getUnderlyingType()
      if (type && type === EdmPrimitiveTypeKind.Stream) {
        next(
          null,
          request
            .getIncomingRequest()
            .on('error', next)
            .pipe(new stream.PassThrough())
        )
      } else {
        request
          .getIncomingRequest()
          .on('error', next)
          .pipe(new BufferedWriter())
          .on('error', next)
          .on('result', rawBody => next(null, rawBody))
      }
    }
  }

  /**
   * Create and return the deserialization function for batch requests in the multipart/mixed format.
   * This function is called on deserialization of the incoming payload.
   *
   * @returns {Function} the deserialization function
   */
  static createMultipartMixedDeserializer () {
    return (request, next) => {
      const batchRequestListBuilder = new BatchRequestListBuilder()
      batchRequestListBuilder.build(request, (err, list) =>
        err
          ? next(err)
          : next(null, {
            boundary: batchRequestListBuilder.getBatchBoundary(),
            requests: list,
            semantics: BatchContext.SEMANTICS.MULTIPART
          })
      )
    }
  }

  /**
   * Creates and returns the deserialization function for batch requests in JSON format.
   * @returns {Function} the deserialization function
   */
  static createBatchJsonDeserializer () {
    return (request, next) => {
      request
        .getIncomingRequest()
        .on('error', next)
        .pipe(new BufferedWriter())
        .on('error', next)
        .on('result', rawBody => {
          try {
            const body = JSON.parse(rawBody)
            const list = new BatchJsonDeserializer().deserialize(body)
            next(null, {
              requests: list,
              semantics: BatchContext.SEMANTICS.JSON
            })
          } catch (error) {
            next(new DeserializationError('Error while deserializing payload', error))
          }
        })
    }
  }

  /**
   * Create and return a deserialization function.
   * @param {Function} edmFunction function to get from URI info the EDM object for the parse function
   * @param {Function} createDeserializerFunction function to create the deserialize function
   *                                              (with parameters EDM object and input)
   * @returns {Function} the deserialization function
   */
  static _createDeserializer (edmFunction, createDeserializerFunction) {
    return (request, next) => {
      request
        .getIncomingRequest()
        .on('error', next)
        .pipe(new BufferedWriter())
        .on('error', next)
        .on('result', rawBody => {
          try {
            const edmObject = edmFunction(request.getUriInfo())
            const deserializeFunction = createDeserializerFunction(request.getContract())
            const result = deserializeFunction(edmObject, rawBody)

            if (result.expand && result.expand.length > 0) request.setDeepInsertExpand(result.expand)
            if (result.additionalInformation && result.additionalInformation.hasDelta) {
              request.setHasDelta(true)
            }

            next(null, result.body)
          } catch (error) {
            let text = 'Error while deserializing payload'
            let err = error
            while (err) {
              if (err.message.includes('IEEE754Compatible') || err.message.includes('JSON number is not supported')) {
                text +=
                  '; consider using parameter IEEE754Compatible=true in content-type ' + 'with adjusted formatting'
                break
              }
              err = typeof err.getRootCause === 'function' ? err.getRootCause() : undefined
            }
            next(new DeserializationError(text, error), rawBody)
          }
        })
    }
  }
}

module.exports = DeserializerFactory
