'use strict'

const commons = require('../../odata-commons')
const CommonsUriHelper = commons.uri.UriHelper
const AbstractError = commons.errors.AbstractError
const UriSyntaxError = commons.errors.UriSyntaxError
const IllegalArgumentError = commons.errors.IllegalArgumentError
const NotImplementedError = commons.errors.NotImplementedError

/**
 * UriHelper has utility methods for reading and constructing URIs.
 */
class UriHelper {
  /**
   * Parses the URL query-string parameters. A leading '?' is allowed.
   * Overloaded parameters will result in an error.
   *
   * Example:
   * Input: '?foo=bar&bar=foo'
   * Output: { foo: 'bar1', bar: 'foo' }
   *
   * @param {string} queryString the query string
   * @throws {UriSyntaxError} if any parameter is overloaded
   * @returns {Object} the parsed URL query string represented as key:value pairs
   */
  static parseQueryString (queryString) {
    if (!queryString) return null

    const query = queryString.startsWith('?') ? queryString.substring(1) : queryString
    try {
      let result = {}
      for (const parameter of query.split('&')) {
        if (!parameter) continue
        const index = parameter.indexOf('=')
        const name = decodeURIComponent(index >= 0 ? parameter.substring(0, index) : parameter)
        if (result[name] !== undefined) {
          throw new UriSyntaxError(UriSyntaxError.Message.DUPLICATED_OPTION, name)
        }
        result[name] = index >= 0 ? decodeURIComponent(parameter.substring(index + 1, parameter.length)) : ''
      }
      return result
    } catch (error) {
      throw new AbstractError(AbstractError.ErrorNames.URI_SYNTAX, 'wrong percent encoding in query string', error)
    }
  }

  /**
   * Builds an abstract output structure for a given array of UriParameter. The structure would look like
   * [
   *  { type: <type of property>, name: <name of key property>, value: <value of key> },
   *  ...
   * ]
   *
   * @param {UriParameter[]} keyPredicates The array of UriParameter
   * @returns {Object[]} The key predicates
   */
  static buildKeyPredicates (keyPredicates) {
    if (!Array.isArray(keyPredicates)) return []

    return keyPredicates.map(elem => {
      const edmRef = elem.getEdmRef()
      return {
        type: edmRef.getProperty().getType(),
        name: edmRef.getAlias() || edmRef.getName(),
        value: elem.getText()
      }
    })
  }

  /**
   * Build an array of objects with names, types, and values of the keys of an entity.
   * @param {EdmEntityType} edmEntityType the entity type
   * @param {Object} entity the entity
   * @param {PrimitiveValueEncoder} primitiveValueEncoder the encoder for primitive values
   * @returns {Object[]} the keys
   * @throws {IllegalArgumentError} if the key properties in edmEntityType do not match the keys in entity
   */
  static buildEntityKeys (edmEntityType, entity, primitiveValueEncoder) {
    let keys = []
    for (const [name, keyPropertyRef] of edmEntityType.getKeyPropertyRefs()) {
      let value = entity
      const property = keyPropertyRef.getProperty()
      for (const pathElement of keyPropertyRef.getName().split('/')) {
        value = value[pathElement]
        if (value === undefined) {
          throw new IllegalArgumentError(`The key '${pathElement}' does not exist in the given entity`)
        }
      }
      value = primitiveValueEncoder.encodeText(value, property)
      keys.push({ type: property.getType(), name, value })
    }
    return keys
  }

  /**
   * Build the key as string out of key information in URI form, including parentheses.
   * @param {Object[]} keys the keys of the entity as array of objects with name, value, and type
   * @returns {string} the key
   */
  static buildKeyString (keys) {
    let url

    for (const key of keys) {
      url = url ? url + ',' : ''
      if (keys.length > 1) url += encodeURIComponent(key.name) + '='
      url += encodeURIComponent(CommonsUriHelper.toUriLiteral(key.value, key.type))
    }
    return '(' + url + ')'
  }

  /**
   * Build the canonical URL of an entity.
   * @param {UriResource[]} pathSegments the path segments leading to the entity
   * @param {Object[]} keys the keys of the entity as array of objects with name, value, and type
   * @returns {string} the canonical URL
   */
  static buildCanonicalUrl (pathSegments, keys) {
    let result = ''
    let isCollection
    for (const pathSegment of pathSegments) {
      if (pathSegment.getEntitySet()) {
        result = encodeURIComponent(pathSegment.getEntitySet().getName())
        isCollection = true
      } else if (pathSegment.getSingleton()) {
        result = encodeURIComponent(pathSegment.getSingleton().getName())
      } else if (pathSegment.getTarget()) {
        result = encodeURIComponent(pathSegment.getTarget().getName())
        isCollection = true
      } else if (pathSegment.getNavigationProperty() && pathSegment.getNavigationProperty().containsTarget()) {
        result += '/' + encodeURIComponent(pathSegment.getNavigationProperty().getName())
        isCollection = pathSegment.isCollection()
      } else if (pathSegment.getFunction()) {
        throw new NotImplementedError(
          'Determination of the canonical URL for the result of a ' +
            'function import or of a bound function without entity-set definition is not supported.'
        )
      }
      if (
        pathSegment.getKeyPredicates().length &&
        // With referential constraints, some key predicates can be omitted.
        // In that case, we rely on the key values provided with the data.
        pathSegment.getKeyPredicates().length === pathSegment.getEdmType().getKeyPropertyRefs().size
      ) {
        result += UriHelper.buildKeyString(UriHelper.buildKeyPredicates(pathSegment.getKeyPredicates()))
        isCollection = false
      }
    }
    if (isCollection) result += UriHelper.buildKeyString(keys)
    return result
  }
}

module.exports = UriHelper
