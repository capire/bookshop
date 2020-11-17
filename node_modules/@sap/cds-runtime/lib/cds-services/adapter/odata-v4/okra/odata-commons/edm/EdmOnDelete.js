'use strict'

const EdmAnnotation = require('./EdmAnnotation')

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752579">
 *     OData CSDL # 7.3 Element edm:OnDelete
 * </a>
 *
 * @hideconstructor
 */
class EdmOnDelete {
  /**
   *Creates an instance of EdmOndelete.
   * @param {Edm} edm The edm provider instance
   * @param {CsdlOnDelete} csdlOnDelete The csdl on delete instance
   */
  constructor (edm, csdlOnDelete) {
    this._edm = edm
    this._csdlOnDelete = csdlOnDelete
    this._annotations = null
  }

  /**
   * Returns the value for OnDelete action.
   * @returns {string} The OnDelete action value
   */
  getAction () {
    return this._csdlOnDelete.action
  }

  /**
   * Returns the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._csdlOnDelete.annotations.map(an => new EdmAnnotation(this._edm, an))
    }
    return this._annotations
  }
}

module.exports = EdmOnDelete
