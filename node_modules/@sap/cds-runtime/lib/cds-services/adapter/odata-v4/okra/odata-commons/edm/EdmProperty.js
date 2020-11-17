'use strict'

const AbstractEdmFaceted = require('./AbstractEdmFaceted')
const EdmTypeKind = require('./EdmType').TypeKind

/**
 * * * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752525">
 *     OData CSDL # 6.1 Element edm:Property
 * </a>
 * @extends AbstractEdmFaceted
 * @hideconstructor
 */
class EdmProperty extends AbstractEdmFaceted {
  /**
   * Returns the name.
   * @returns {string} the name
   */
  getName () {
    return this._csdlObject.name
  }

  /**
   * Return the default value of the property.
   * @returns {*} the default value
   */
  getDefaultValue () {
    return this._csdlObject.defaultValue
  }

  /**
   * Returns true if the parameter is primitive, false otherwise.
   * @returns {boolean} whether the property is primitive
   */
  isPrimitive () {
    return this.getType().getKind() === EdmTypeKind.PRIMITIVE
  }
}

module.exports = EdmProperty
