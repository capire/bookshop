'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752649">
 *     OData CSDL # 14.5.2 Expression edm:Apply
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmApplyExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlApplyExpression} apply The csdl apply expression
   */
  constructor (edm, apply) {
    validateThat('edm', edm).truthy()
    validateThat('apply', apply).truthy()

    super(CsdlAnnotationExpression.kinds.Apply)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlApplyExpression}
     * @private
     */
    this._apply = apply

    /**
     * @type {EdmAnnotationExpression[]}
     * @private
     */
    this._parameters = []
    for (let item of apply.parameters) {
      const parameter = AnnotationFactory.createEdmExpressionFromCsdlExpression(this._edm, item)
      this._parameters.push(parameter)
    }

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns the function to be applied on client side.
   * @returns {FullQualifiedName} Function name {e.g. "odata.concat"}
   */
  getFunctionName () {
    return this._apply.functionName
  }

  /**
   * Returns the parameters to be used for the function on client side.
   * @returns {EdmAnnotationExpression[]} the parameters
   */
  getParameters () {
    return this._parameters
  }

  /**
   * Returns the annotations for this apply expression.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._apply.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmApplyExpression
