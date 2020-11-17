'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752661">
 *     OData CSDL # 14.5.15 Expression edm:UrlRef
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmUrlRefExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm the EDM
   * @param {CsdlUrlRefExpression} urlRef the CSDL URL reference
   */
  constructor (edm, urlRef) {
    validateThat('edm', edm).truthy()
    validateThat('urlRef', urlRef).truthy()

    super(CsdlAnnotationExpression.kinds.UrlRef)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlUrlRefExpression}
     * @private
     */
    this._urlRef = urlRef

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._expression = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, urlRef.expression)

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns the constant expression describing the URL.
   * @returns {EdmAnnotationExpression} the expression
   */
  getExpression () {
    return this._expression
  }

  /**
   * Returns the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._urlRef.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmUrlRefExpression
