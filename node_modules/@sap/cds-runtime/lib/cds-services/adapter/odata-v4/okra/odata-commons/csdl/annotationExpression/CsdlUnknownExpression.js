'use strict'

const CsdlAnnotationExpression = require('./CsdlAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752633">
 *     OData CSDL # 14.4 Constant Expressions
 * </a>
 *
 * We use this expression to adapt the OASIS Issue 1221.
 * With this issue we can not detect the type of all ConstantExpressions (like $Binary, $Int, $Decimal, etc..) as well as
 * The $...Path expressions like $PropertyPath, $AnnotationPath, etc..
 * These expressions are now written as strings.
 *
 * @extends CsdlAnnotationExpression
 */
class CsdlUnknownExpression extends CsdlAnnotationExpression {
  /**
   * @param {*} [value] Value of the unknown expression
   */
  constructor (value) {
    super(CsdlAnnotationExpression.kinds.Unknown)

    /**
     * OData CSDL # 14.4.*
     */
    this.value = value
  }

  /**
   * Sets the value of the unkwnon expression
   *
   * @param {*} value Value of the constant expression
   * @returns {CsdlUnknownExpression} this instance
   */
  setValue (value) {
    validateThat('value', value).typeOf('string')
    this.value = value
    return this
  }
}

module.exports = CsdlUnknownExpression
