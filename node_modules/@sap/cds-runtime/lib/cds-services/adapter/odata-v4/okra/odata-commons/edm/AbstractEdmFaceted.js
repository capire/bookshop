'use strict'

const EdmTypeFactory = require('./EdmTypeFactory')
const EdmAnnotation = require('./EdmAnnotation')
const validateThat = require('../validator/ParameterValidator').validateThat
const FeatureSupport = require('../FeatureSupport')

/**
 * Abstract super class to manage facets, i.e., restrictions for typed values;
 * {@link EdmProperty}, {@link EdmReturnType}, {@link EdmParameter}, and {@link EdmTerm}
 * derive from this class. Since they all have an EDM type and can have annotations,
 * this class handles that as well.
 *
 * @abstract
 * @hideconstructor
 * @ignore
 */
class AbstractEdmFaceted {
  /**
   * Creates an instance of AbstractEdmFaceted.
   * @param {Edm} edm the entity-data model
   * @param {CsdlProperty|CsdlReturnType|CsdlParameter|CsdlTerm} csdlObject the associated CSDL object
   */
  constructor (edm, csdlObject) {
    validateThat('edm', edm).truthy()
    validateThat('csdlObject', csdlObject).truthy()

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    if (csdlObject.unicode !== undefined && !csdlObject.unicode) {
      FeatureSupport.failUnsupported(FeatureSupport.features.AttributeUnicode)
    }

    /**
     * @type {CsdlProperty|CsdlReturnType|CsdlParameter|CsdlTerm}
     * @private
     */
    this._csdlObject = csdlObject

    /**
     * @type {EdmType}
     * @private
     */
    this._type = null

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns true if this EDM object is a collection, false otherwise.
   * @returns {boolean} whether this EDM object is a collection
   */
  isCollection () {
    return this._csdlObject.isCollection
  }

  /**
   * Returns true if this EDM object is nullable, false otherwise.
   * @returns {boolean} whether this EDM object is nullable
   */
  isNullable () {
    return this._csdlObject.isNullable
  }

  /**
   * Returns the max length.
   * @returns {?(number|string)} the max length
   */
  getMaxLength () {
    return this._csdlObject.maxLength
  }

  /**
   * Returns the precision.
   * @returns {?number} the precision
   */
  getPrecision () {
    return this._csdlObject.precision
  }

  /**
   * Returns the scale.
   * @returns {?(number|string)} the scale
   */
  getScale () {
    return this._csdlObject.scale
  }

  /**
   * Returns the SRID.
   * @returns {?(number|string)} the SRID
   */
  getSrid () {
    return this._csdlObject.srid
  }

  /**
   * Returns true if the (string) value is Unicode encoded, false otherwise.
   * @returns {boolean} if Unicode encoding is supported
   */
  isUnicode () {
    return this._csdlObject.unicode
  }

  /**
   * Returns the property type.
   * @returns {EdmType} the EDM type
   */
  getType () {
    if (!this._type) {
      this._type = EdmTypeFactory.createTypeFromFQN(this._edm, this._csdlObject.type)
    }
    return this._type
  }

  /**
   * Returns the annotations for this EDM object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._csdlObject.annotations.map(item => new EdmAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = AbstractEdmFaceted
