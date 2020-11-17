'use strict'

const commons = require('../../odata-commons')
const validateThat = commons.validator.ParameterValidator.validateThat
const JsonFormat = commons.format.JsonFormat
const JsonAnnotations = JsonFormat.Annotations
const MetaProperties = JsonFormat.MetaProperties
const SerializationError = require('../errors/SerializationError')

const ENTITY_SET = 'EntitySet'
const SINGLETON = 'Singleton'
const FUNCTION_IMPORT = 'FunctionImport'

/**
 * JSON serializer for service documents
 */
class ServiceJsonSerializer {
  /**
   * @param {EdmProvider} edmProvider the EDM
   */
  constructor (edmProvider) {
    validateThat('edmProvider', edmProvider)
      .truthy()
      .instanceOf(Object)
    this._edmProvider = edmProvider
  }

  /**
   * Serializes the service document based on the available EDM.
   * The output includes context URL, metadata ETag, entity sets, function imports, and singletons.
   * @param {Object} data the data
   * @returns {string} The serialized service document
   */
  serialize (data) {
    try {
      let outputJson = {
        [JsonAnnotations.CONTEXT]: '$metadata',
        [JsonAnnotations.METADATA_ETAG]:
          data[MetaProperties.ETAG] === null || data[MetaProperties.ETAG] === undefined
            ? undefined
            : 'W/"' + data[MetaProperties.ETAG] + '"'
      }

      const entityContainer = this._edmProvider.getEntityContainer()
      if (entityContainer) {
        outputJson.value = this._writeElements(entityContainer.getEntitySets(), ENTITY_SET)
          .concat(this._writeElements(entityContainer.getFunctionImports(), FUNCTION_IMPORT))
          .concat(this._writeElements(entityContainer.getSingletons(), SINGLETON))
      }

      return JSON.stringify(outputJson)
    } catch (e) {
      throw new SerializationError('An error occurred while serializing the service document', e)
    }
  }

  /**
   * Serializes the given EDM elements in objects with the properties name, url, and kind (if provided).
   * @param {EdmEntitySet[]|EdmFunctionImport[]|EdmSingleton[]} elements - Array of the given EDM elements
   * @param {string} kind - 'EntitySet' | 'FunctionImport' | 'Singleton'
   * @returns {Array.<{ name: string, url: string, kind: ?string }>} the serialized elements
   * @private
   */
  _writeElements (elements, kind) {
    return elements
      .filter(element => {
        // filter in/out elements that set includeInServiceDocument
        switch (kind) {
          case ENTITY_SET: // default is to be serialized
            return element.isIncludeInServiceDocument() !== false

          case FUNCTION_IMPORT: // default is not to be serialized
            return element.isIncludeInServiceDocument() === true

          case SINGLETON:
            return true
          default:
            return false
        }
      })
      .map(element => ({
        name: element.getName(),
        url: element.getName(),
        kind: kind === ENTITY_SET ? undefined : kind
      }))
  }
}

module.exports = ServiceJsonSerializer
