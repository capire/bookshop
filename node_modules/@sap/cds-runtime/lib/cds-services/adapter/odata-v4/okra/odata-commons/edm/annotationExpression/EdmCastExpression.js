'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const EdmTypeFactory = require('../EdmTypeFactory')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752650">
 *     OData CSDL # 14.5.4 Expression edm:Cast
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmCastExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlCastExpression} cast The csdl cast expression
   */
  constructor (edm, cast) {
    validateThat('edm', edm).truthy()
    validateThat('cast', cast).truthy()

    super(CsdlAnnotationExpression.kinds.Cast)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlCastExpression}
     * @private
     */
    this._cast = cast

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._expression = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, cast.expression)

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
   * Return the target type.
   * @returns {EdmType} the target type
   */
  getType () {
    if (!this._type) this._type = EdmTypeFactory.createTypeFromFQN(this._edm, this._cast.type)
    return this._type
  }

  /**
   * Returns the Full Qualified Name of the type.
   * @returns {FullQualifiedName} the full-qualified name
   */
  getTypeFQN () {
    return this._cast.type
  }

  /**
   * Return the expression to be casted.
   * @returns {EdmAnnotationExpression} the expression
   */
  getExpression () {
    return this._expression
  }

  /**
   * Returns the max length.
   * @returns {number|string} the max length
   */
  getMaxLength () {
    return this._cast.maxLength
  }

  /**
   * Returns the precision.
   * @returns {number|string} the precision
   */
  getPrecision () {
    return this._cast.precision
  }

  /**
   * Returns the scale.
   * @returns {number} the scale
   */
  getScale () {
    return this._cast.scale
  }

  /**
   * Return true if this type is a collection, else false.
   * @returns {boolean} True if this type is a collection, else false
   */
  isCollection () {
    return this._cast.isCollection
  }

  /**
   * Returns the annotations for this cast expression.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._cast.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmCastExpression
