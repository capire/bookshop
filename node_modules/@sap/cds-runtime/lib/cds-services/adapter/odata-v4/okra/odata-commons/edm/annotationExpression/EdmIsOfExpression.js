'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const EdmTypeFactory = require('../EdmTypeFactory')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752653">
 *     OData CSDL # 14.5.7 Expression edm:IsOf
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmIsOfExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlIsOfExpression} isOfExpression the CSDL is-of expression
   */
  constructor (edm, isOfExpression) {
    validateThat('edm', edm).truthy()
    validateThat('isOfExpression', isOfExpression).truthy()

    super(CsdlAnnotationExpression.kinds.IsOf)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlIsOfExpression}
     * @private
     */
    this._isOfExpression = isOfExpression

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._expression = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, isOfExpression.expression)

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Return the type used for check.
   * @returns {EdmType} Type
   */
  getType () {
    if (!this._type) this._type = EdmTypeFactory.createTypeFromFQN(this._edm, this._isOfExpression.type)
    return this._type
  }

  /**
   * Returns the Full Qualified Name of the type.
   * @returns {FullQualifiedName} the full-qualified name
   */
  getTypeFQN () {
    return this._isOfExpression.type
  }

  /**
   * Returns the expression to be type checked.
   * @returns {EdmAnnotationExpression} Expression
   */
  getExpression () {
    return this._expression
  }

  /**
   * Returns the max length.
   * @returns {number|string} the max length
   */
  getMaxLength () {
    return this._isOfExpression.maxLength
  }

  /**
   * Returns the precision.
   * @returns {number|string} the precision
   */
  getPrecision () {
    return this._isOfExpression.precision
  }

  /**
   * Returns the scale.
   * @returns {number} the scale
   */
  getScale () {
    return this._isOfExpression.scale
  }

  /**
   * Return true if this type is a collection, else false.
   * @returns {boolean} True if this type is a collection, else false
   */
  isCollection () {
    return this._isOfExpression.isCollection
  }

  /**
   * Returns the annotations for this isOf expression.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._isOfExpression.annotations.map(item =>
        AnnotationFactory.createAnnotation(this._edm, item)
      )
    }
    return this._annotations
  }
}

module.exports = EdmIsOfExpression
