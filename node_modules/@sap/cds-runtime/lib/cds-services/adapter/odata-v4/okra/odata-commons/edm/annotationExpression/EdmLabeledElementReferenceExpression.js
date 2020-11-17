'use strict'

const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752655">
 *     OData CSDL # 14.5.8 Expression edm:LabeledElement
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmLabeledElementReferenceExpression extends EdmAnnotationExpression {
  /**
   * @param {CsdlLabeledElementReferenceExpression} labeledElementReference the CSDL labeled-element reference expression
   */
  constructor (labeledElementReference) {
    validateThat('labeledElementReference', labeledElementReference).truthy()

    super(CsdlAnnotationExpression.kinds.LabeledElementReference)

    /**
     * @type {CsdlLabeledElementReferenceExpression}
     * @private
     */
    this._labeledElementReference = labeledElementReference
  }

  /**
   * Referenced label.
   * @returns {FullQualifiedName} referenced label
   */
  getName () {
    return this._labeledElementReference.name
  }
}

module.exports = EdmLabeledElementReferenceExpression
