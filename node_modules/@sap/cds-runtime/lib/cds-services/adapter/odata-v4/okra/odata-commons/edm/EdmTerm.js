'use strict'

const AbstractEdmFaceted = require('./AbstractEdmFaceted')
const EdmTypeKind = require('./EdmType').TypeKind

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752620">
 *     OData CSDL # 14.1 Element edm:Term
 * </a>
 * @extends AbstractEdmFaceted
 * @hideconstructor
 */
class EdmTerm extends AbstractEdmFaceted {
  /**
   * Constructor
   * @param {Edm} edm The edm itself
   * @param {CsdlTerm} term the CSDL term
   */
  constructor (edm, term) {
    super(edm, term)

    /**
     * @type {EdmType}
     * @private
     */
    this._baseTerm = null
  }

  /**
   * Returns the name.
   * @returns {string} the name
   */
  getName () {
    return this._csdlObject.name
  }

  /**
   * Returns the CSDL element names to which this term can be applied.
   * @returns {string[]} the element names this term can be applied to
   */
  getAppliesTo () {
    return this._csdlObject.appliesTo
  }

  /**
   * Returns the base term.
   * @returns {EdmTerm} the base term
   */
  getBaseTerm () {
    if (this._baseTerm) return this._baseTerm

    if (!this._csdlObject.baseTerm) return null

    this._baseTerm = this._edm.getTerm(this._csdlObject.baseTerm)
    return this._baseTerm
  }

  /**
   * Return the default value of the term.
   * @returns {*} the default value
   */
  getDefaultValue () {
    return this._csdlObject.defaultValue
  }

  /**
   * Returns true if the term is primitive, false otherwise.
   * @returns {boolean} whether the term is primitive
   */
  isPrimitive () {
    return this.getType().getKind() === EdmTypeKind.PRIMITIVE
  }
}

module.exports = EdmTerm
