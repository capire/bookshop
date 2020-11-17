'use strict'

const AnnotationFactory = require('./AnnotationExpressionFactory')
const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const EdmTypeFactory = require('../EdmTypeFactory')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752660">
 *     OData CSDL # 14.5.14 Expression edm:Record
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmRecordExpression extends EdmAnnotationExpression {
  /**
   * @param {Edm} edm the EDM
   * @param {CsdlRecordExpression} record the CSDL record expression
   */
  constructor (edm, record) {
    validateThat('edm', edm).truthy()
    validateThat('record', record).truthy()

    super(CsdlAnnotationExpression.kinds.Record)

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlRecordExpression}
     * @private
     */
    this._record = record

    /**
     * @type {EdmAnnotationExpression[]}
     * @private
     */
    this._propertyValues = record.propertyValues.map(item =>
      AnnotationFactory.createEdmExpressionFromCsdlExpression(edm, item)
    )

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
   * Return the type used for check.
   * @returns {EdmType} Type
   */
  getType () {
    if (!this._type) {
      if (this._record.type) this._type = EdmTypeFactory.createTypeFromFQN(this._edm, this._record.type)
    }
    return this._type
  }

  /**
   * Returns the Full Qualified Name of the type
   * @returns {FullQualifiedName} the full-qualified name
   */
  getTypeFQN () {
    return this._record.type
  }

  /**
   * Returns the record's properties.
   * @returns {Array} the properties
   */
  getPropertyValues () {
    return this._propertyValues
  }

  /**
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._record.annotations.map(item => AnnotationFactory.createAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmRecordExpression
