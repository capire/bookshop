'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752652">
 *     OData CSDL # 14.5.6 Expression edm:If
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmIfExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlIfExpression}  ifExpression the CSDL if expression
   */
  constructor (edm, ifExpression) {
    validateThat('edm', edm).truthy()
    validateThat('ifExpression', ifExpression).truthy()

    super(CsdlAnnotationExpression.kinds.If)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlIfExpression}
     * @private
     */
    this._ifExpression = ifExpression

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._condition = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, ifExpression.condition)

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._ifTrue = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, ifExpression.ifTrue)

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._ifFalse = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, ifExpression.ifFalse)

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Return the condition expression.
   * @returns {EdmAnnotationExpression} Condition expression which must evaluate to a boolean value
   */
  getCondition () {
    return this._condition
  }

  /**
   * Returns the true-expression.
   * @returns {EdmAnnotationExpression} Expression used if the condition evaluates to true
   */
  getIfTrue () {
    return this._ifTrue
  }

  /**
   * Returns the false-expression.
   * @returns {EdmAnnotationExpression} Expression used if the condition evaluates to true
   */
  getIfFalse () {
    return this._ifFalse
  }

  /**
   * Returns the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._ifExpression.annotations.map(item =>
        AnnotationFactory.createAnnotation(this._edm, item)
      )
    }
    return this._annotations
  }
}

module.exports = EdmIfExpression
