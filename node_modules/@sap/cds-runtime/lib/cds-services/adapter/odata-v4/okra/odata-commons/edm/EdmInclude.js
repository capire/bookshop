'use strict'

const EdmAnnotation = require('./EdmAnnotation')
const validateThat = require('../validator/ParameterValidator').validateThat

/**
 * <a href="../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Element_edmx:Include">
 *     OData CSDL # 3.4 Element edmx:Include
 * </a>
 * @hideconstructor
 */
class EdmInclude {
  /**
   * Constructor
   * @param {Edm} edm The EDM itself
   * @param {CsdlInclude} include the CSDL include
   */
  constructor (edm, include) {
    validateThat('edm', edm).truthy()
    validateThat('include', include).truthy()

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {CsdlInclude}
     * @private
     */
    this._include = include

    this._annotations = null
  }

  /**
   * Return the namespace.
   * @returns {string} the namespace
   */
  getNamespace () {
    return this._include.namespace
  }

  /**
   * Return the alias.
   * @returns {string} the alias
   */
  getAlias () {
    return this._include.alias
  }

  /**
   * Returns the annotations for this include.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._include.annotations.map(item => new EdmAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = EdmInclude
