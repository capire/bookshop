'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752656">
 *     OData CSDL # 14.5.10 Expression edm:Null
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmNullExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlNullExpression} expression the CSDL null expression
   */
  constructor (edm, expression) {
    validateThat('edm', edm).truthy()
    validateThat('expression', expression).truthy()

    super(CsdlAnnotationExpression.kinds.Null)

    this._edm = edm
    this._expression = expression

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns the annotations for this null expression.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._expression.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmNullExpression
