'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752654">
 *     OData CSDL # 14.5.8 Expression edm:LabeledElement
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmLabeledElementExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlLabeledElementExpression} labeledElement the CSDL labeled-element expression
   */
  constructor (edm, labeledElement) {
    validateThat('edm', edm).truthy()
    validateThat('labeledElement', labeledElement).truthy()

    super(CsdlAnnotationExpression.kinds.LabeledElement)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlLabeledElementExpression}
     * @private
     */
    this._labeledElement = labeledElement

    /**
     * @type {EdmAnnotationExpression}
     * @private
     */
    this._expression = AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, labeledElement.expression)

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Return the label name.
   * @returns {string} label name
   */
  getName () {
    return this._labeledElement.name
  }

  /**
   * Returns the labeled expression.
   * @returns {EdmAnnotationExpression} the labeled expression
   */
  getExpression () {
    return this._expression
  }

  /**
   * Returns the annotations for this labeled-element expression.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._labeledElement.annotations.map(item =>
        AnnotationFactory.createAnnotation(this._edm, item)
      )
    }
    return this._annotations
  }
}

module.exports = EdmLabeledElementExpression
