'use strict'

const EdmAnnotation = require('./EdmAnnotation')
const EdmReturnType = require('./EdmReturnType')
const EdmParameter = require('./EdmParameter')
const FullQualifiedName = require('../FullQualifiedName')
const validateThat = require('../validator/ParameterValidator').validateThat

/**
 * {@link EdmAction} and {@link EdmFunction} share much information, this information contained in
 * this class.
 *
 * @abstract
 * @hideconstructor
 * @ignore
 */
class AbstractEdmOperation {
  /**
   * Constructor
   *
   * @param {Edm} edm  The edm itself
   * @param {FullQualifiedName} name Full qualified name of the operation
   * @param {CsdlAction | CsdlFunction} operation The operation
   */
  constructor (edm, name, operation) {
    validateThat('edm', edm).truthy()
    validateThat('name', name)
      .truthy()
      .instanceOf(FullQualifiedName)
    validateThat('operation', operation).truthy()

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {FullQualifiedName}
     * @private
     */
    this._fqn = name

    /**
     * @type {CsdlAction | CsdlFunction}
     * @private
     */
    this._operation = operation

    /**
     * @type {Map.<string, EdmParameter>}
     * @private
     */
    this._parameters = null

    /**
     * @type {EdmReturnType}
     * @private
     */
    this._returnType = null

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null
  }

  /**
   * Returns the full qualified name object for this operation.
   * @returns {FullQualifiedName} The full qualified name
   */
  getFullQualifiedName () {
    return this._fqn
  }

  /**
   * Return the namespace of this operation.
   * @returns {string} The namespace of this operation
   */
  getNamespace () {
    return this._fqn.namespace
  }

  /**
   * Return the name of this operation.
   * @returns {string} The name of this operation
   */
  getName () {
    return this._fqn.name
  }

  /**
   * Returns a map with all parameters.
   * @returns {Map.<string, EdmParameter>} the parameters
   */
  getParameters () {
    if (!this._parameters) {
      this._parameters = new Map()
      if (this._operation.parameters) {
        for (let parameter of this._operation.parameters) {
          // CsdlParameter
          this._parameters.set(parameter.name, new EdmParameter(this._edm, parameter))
        }
      }
    }
    return this._parameters
  }

  /**
   * Return the corresponding parameter found by its name.
   * @param {string} name Name
   * @returns {?EdmParameter} The edm parameter by name or null
   */
  getParameter (name) {
    return this.getParameters().get(name)
  }

  /**
   * Get EdmEntitySet for the given entity set of the binding parameter.
   * @param {EdmEntitySet} bindingParameterEntitySet the entity set of the binding parameter
   * @returns {?EdmEntitySet} the returned entity set
   */
  getReturnedEntitySet (bindingParameterEntitySet) {
    if (!bindingParameterEntitySet || !this._operation.entitySetPath) return null

    // The first segment of the input path is the binding-parameter path segment.
    // See odata-v4.0-errata03-os-part3-csdl-complete > 12. ff.
    return this._operation.entitySetPath.includes('/')
      ? bindingParameterEntitySet.getRelatedBindingTarget(
        this._operation.entitySetPath.substring(this._operation.entitySetPath.indexOf('/') + 1)
      )
      : bindingParameterEntitySet
  }

  /**
   * Returns the {@link EdmReturnType} of this operation.
   * @returns {EdmReturnType} the return type
   */
  getReturnType () {
    if (!this._returnType && this._operation.returnType) {
      this._returnType = new EdmReturnType(this._edm, this._operation.returnType)
    }
    return this._returnType
  }

  /**
   * Returns true if this operation is bound otherwise false
   * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752581">
   *     12.1.2 Attribute IsBound
   * </a>
   *
   * @returns {boolean} whether the operation is bound
   */
  isBound () {
    return this._operation.isBound
  }

  /**
   * Returns the full qualified name of the binding parameter if the operation is bound.
   * Otherwise null is returned
   *
   * @returns {?FullQualifiedName} the full-qualified name of the type of the binding parameter
   */
  getBindingParameterTypeFqn () {
    if (this.isBound()) {
      let bindingParameter = this._operation.parameters[0] // CsdlParameter
      return bindingParameter.type
    }
    return null
  }

  /**
   *  Return true if the binding parameter is a collection parameter. Otherwise null is returned.
   * @returns {?boolean} whether the binding parameter is a collection
   */
  isBindingParameterTypeCollection () {
    if (this.isBound()) {
      let bindingParameter = this._operation.parameters[0] // CsdlParameter
      return bindingParameter.isCollection
    }
    return null
  }

  /**
   * Return the entity set path.
   * @returns {string} the entity-set path
   */
  getEntitySetPath () {
    return this._operation.entitySetPath
  }

  /**
   * Returns the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._operation.annotations.map(item => new EdmAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = AbstractEdmOperation
