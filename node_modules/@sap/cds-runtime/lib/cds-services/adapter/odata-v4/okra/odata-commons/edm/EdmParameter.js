'use strict'

const AbstractEdmFaceted = require('./AbstractEdmFaceted')

/**
 * * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752591">
 *  OData CSDL # 12.4 Element edm:Parameter
 * </a>
 * @extends AbstractEdmFaceted
 * @hideconstructor
 */
class EdmParameter extends AbstractEdmFaceted {
  /**
   * Returns the name.
   * @returns {string} the name
   */
  getName () {
    return this._csdlObject.name
  }
}

module.exports = EdmParameter
