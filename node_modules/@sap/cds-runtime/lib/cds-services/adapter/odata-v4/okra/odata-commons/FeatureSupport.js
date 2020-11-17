'use strict'

const util = require('util')
const NotImplementedError = require('./errors/NotImplementedError')

/**
 * Describes a feature.
 */
class Feature {
  /**
   * Constructor
   * @param {string} message Short text info of feature
   */
  constructor (message) {
    /**
     * Short text info of feature (used for error information)
     * @type {string}
     * @private
     */
    this._message = message
  }
}

/**
 * List of not (fully) supported features
 * Example:
 * features.TypeCast --> TypeCasts as general features are not supported
 */
const features = {
  AttributeAbstract: new Feature('Entity and complex type attribute abstract is not supported'),
  AttributeHasStream: new Feature('The attribute HasStream is not supported'),
  AttributeOpenType: new Feature('Entity and complex type attribute opentype is not supported'),
  AttributeUnicode: new Feature(
    'The attribute Unicode with a false value is not supported',
    'All properties must be set with a unicode character set'
  ),

  QueryParameterDeltatoken: new Feature('The system query parameter $deltatoken is not supported'),
  QueryParameterId: new Feature('The system query parameter $id is not supported'),
  QueryParameterSkipToken: new Feature(
    'The system query parameter $skiptoken is only supported for entity- and reference-collections'
  ),

  CrossJoin: new Feature('Requests with $crossjoin are not supported'),
  All: new Feature('Requests with $all are not supported'),
  Entity_id: new Feature('Requests with $entity are not supported'),
  TypeCast: new Feature("The typecast '%s' at position %d is not supported."),

  Ref: new Feature('Requests with $ref in $expand are not supported'),
  Levels: new Feature('The $expand option $levels is currently not supported')
}

/**
 * Facade allowing the various lib parts to reject requests for explicitly not supported features
 */
class FeatureSupport {
  /**
   * Fail with an appropriate message.
   * @param {Feature} feature the feature
   * @param {Array} parameters the parameters for the error message
   * @throws {NotImplementedError} the unsupported error
   */
  static failUnsupported (feature, ...parameters) {
    throw new NotImplementedError(util.format(feature._message, ...parameters))
  }
}

FeatureSupport.features = features

module.exports = FeatureSupport
