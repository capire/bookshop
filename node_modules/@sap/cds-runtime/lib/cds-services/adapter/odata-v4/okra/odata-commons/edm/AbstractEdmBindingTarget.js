'use strict'

const EdmAnnotation = require('./EdmAnnotation')
const EdmNavigationPropertyBinding = require('./EdmNavigationPropertyBinding')
const Target = require('./Target')
const validateThat = require('../validator/ParameterValidator').validateThat

/**
 * {@link EdmEntitySet} and {@link EdmSingleton} share much information, the information contained in this class.
 * @abstract
 * @hideconstructor
 * @ignore
 */
class AbstractEdmBindingTarget {
  /**
   * Constructor
   * @param {Edm} edm the EDM itself
   * @param {EdmEntityContainer} container The entity container the target belongs to
   * @param {CsdlEntitySet|CsdlSingleton} target The target
   * @param {Object} configuration Configuration object with additional configuration properties
   * @param {boolean} configuration.isConcurrent True if this binding target is target of a conditional request with concurrent modifications
   */
  constructor (edm, container, target, configuration = {}) {
    validateThat('edm', edm).truthy()
    validateThat('container', container).truthy()
    validateThat('target', target).truthy()

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {string}
     * @private
     */
    this._name = target.name

    /**
     * EntityContainer containing this binding target
     * @type {EdmEntityContainer}
     * @private
     */
    this._entityContainer = container

    /**
     * @type {CsdlEntitySet|CsdlSingleton}
     * @private
     */
    this._target = target

    /**
     * The Navigation property bindings
     * @type {EdmNavigationPropertyBinding[]}
     * @private
     */
    this._navigationPropertyBindings = null

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null

    /**
     * Configuration object
     * @type {Object}
     * @private
     */
    this._configuration = configuration
  }

  /**
   * Return whether this binding target is configured to be concurrency controlled.
   * @returns {boolean} whether the binding target is under concurrency control
   */
  isConcurrent () {
    return this._configuration.isConcurrent === true
  }

  /**
   * Return the name.
   * @returns {string} the name
   */
  getName () {
    return this._name
  }

  /**
   * Return all navigation property bindings
   * See
   * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752607">
   *     13.4 Element edm:NavigationPropertyBinding
   * </a> for details
   *
   * @returns {EdmNavigationPropertyBinding[]} the navigation-property bindings
   */
  getNavigationPropertyBindings () {
    if (!this._navigationPropertyBindings) {
      this._navigationPropertyBindings = this._target.navigationPropertyBindings.map(
        binding => new EdmNavigationPropertyBinding(binding.path, binding.target)
      )
    }
    return this._navigationPropertyBindings
  }

  /**
   * Return the entityContainer containing this binding target.
   * @returns {EdmEntityContainer} the entity container
   */
  getEntityContainer () {
    return this._entityContainer
  }

  /**
   * Return the type of the target.
   * @returns {EdmEntityType} the target entity type
   */
  getEntityType () {
    return this._edm.getEntityType(this._target.type)
  }

  /**
   * Return the target for a given path or null if no target was found.
   * @param {string} inputPath The EntitySetPath value
   * @returns {?(EdmEntitySet|EdmSingleton)} the target
   */
  getRelatedBindingTarget (inputPath) {
    validateThat('inputPath', inputPath).truthy()

    /**
     * @type {?(EdmEntitySet|EdmSingleton)}
     */
    let bindingTarget = null

    const binding = this.getNavigationPropertyBindings().find(b => inputPath === b.getPath())
    if (binding) {
      const edmTarget = new Target(binding.getTarget(), this._entityContainer)
      const entityContainer = this._edm.getEntityContainer(edmTarget.getEntityContainer())
      if (entityContainer) {
        bindingTarget =
          entityContainer.getEntitySet(edmTarget.getTargetName()) ||
          entityContainer.getSingleton(edmTarget.getTargetName())
      }
    }

    return bindingTarget
  }

  /**
   * Return the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    if (!this._annotations) {
      this._annotations = this._target.annotations.map(item => new EdmAnnotation(this._edm, item))
    }
    return this._annotations
  }
}

module.exports = AbstractEdmBindingTarget
