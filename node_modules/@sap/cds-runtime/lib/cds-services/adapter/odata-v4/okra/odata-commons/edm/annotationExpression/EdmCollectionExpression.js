'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752651">
 *     OData CSDL # 14.5.5 Expression edm:Collection
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmCollectionExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm The edm itself
   * @param {CsdlCollectionExpression} collection the CSDL collection expression
   */
  constructor (edm, collection) {
    validateThat('edm', edm).truthy()
    validateThat('collection', collection).truthy()

    super(CsdlAnnotationExpression.kinds.Collection)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {EdmAnnotationExpression[]}
     * @private
     */
    this._expressions = collection.expressions.map(item =>
      AnnotationFactory.createEdmExpressionFromCsdlExpression(this._edm, item)
    )
  }

  /**
   * Return the expressions which make up the collection.
   * @returns {EdmAnnotationExpression[]} the expressions
   */
  getExpressions () {
    return this._expressions
  }
}

module.exports = EdmCollectionExpression
