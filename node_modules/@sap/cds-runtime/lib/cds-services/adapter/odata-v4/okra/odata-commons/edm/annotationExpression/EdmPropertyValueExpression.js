'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752660">
 *     OData CSDL # 14.5.14.2 Element edm:PropertyValue
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmPropertyValueExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm the EDM
   * @param {CsdlPropertyValueExpression} expression the CSDL property-value expression
   */
  constructor (edm, expression) {
    validateThat('edm', edm).truthy()
    validateThat('expression', expression).truthy()

    super(CsdlAnnotationExpression.kinds.PropertyValue)

    this._edm = edm
    this._expression = expression

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._edmExpression = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, this._expression.expression)

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns the property name.
   * @returns {string} the property name
   */
  getProperty () {
    return this._expression.property
  }

  /**
   * Returns the property value.
   * @returns {EdmAnnotationExpression} the property value
   */
  getExpression () {
    return this._edmExpression
  }

  /**
   * Returns the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._expression.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmPropertyValueExpression
