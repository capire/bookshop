'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752633">
 *     OData CSDL # 14.4 Constant Expressions
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmUnknownExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm the EDM itself
   * @param {CsdlUnknownExpression} unknownExpression the CSDL unknown expression
   */
  constructor (edm, unknownExpression) {
    validateThat('edm', edm)
      .truthy()
      .instanceOf(Object)
    validateThat('unknownExpression', unknownExpression)
      .truthy()
      .instanceOf(Object)

    super(CsdlAnnotationExpression.kinds.Unknown)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlUnknownExpression}
     * @private
     */
    this._expression = unknownExpression

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns the value of the expression.
   *
   * @returns {string} the value
   */
  getValue () {
    return this._expression.value
  }

  /**
   * Returns the annotations for this constant expression.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._expression.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmUnknownExpression
