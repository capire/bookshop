'use strict'

const EdmAnnotation = require('./EdmAnnotation')
const EdmEntitySet = require('./EdmEntitySet')
const EdmSingleton = require('./EdmSingleton')
const EdmActionImport = require('./EdmActionImport')
const EdmFunctionImport = require('./EdmFunctionImport')
const validateThat = require('../validator/ParameterValidator').validateThat

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752597">
 *     OData CSDL # 13.1 Element edm:EntityContainer
 * </a>
 * @hideconstructor
 */
class EdmEntityContainer {
  /**
   * Constructor
   * Use factory method EdmEntityContainer.createWithFQN or
   * EdmEntityContainer.createWithContainerInfo to create an entity container
   *
   * @param {Edm} edm The edm itself
   * @param {CsdlProvider} provider Provider for the Csdl artifacts
   * @param {CsdlEntityContainerInfo} [entityContainerInfo] Entity container info
   * @param {FullQualifiedName} [fqn] Full qualified name
   * @param {CsdlEntityContainer} [entityContainer]  Entity container
   * @param {Object} [configuration]  Edm configuration object
   */
  constructor (edm, provider, entityContainerInfo, fqn, entityContainer, configuration = {}) {
    validateThat('edm', edm).truthy()
    validateThat('provider', provider).truthy()
    if (!entityContainerInfo) {
      validateThat('fqn', fqn).truthy()
      validateThat('entityContainer', entityContainer).truthy()
    }

    /**
     * @type {Edm}
     * @private
     */
    this._edm = edm

    /**
     * @type {string}
     * @private
     */
    this._name = null

    /**
     * @type {FullQualifiedName}
     * @private
     */
    this._entityContainerName = null

    /**
     * @type {FullQualifiedName}
     * @private
     */
    this._parentContainerName = null

    /**
     * @type {CsdlEntityContainer}
     * @private
     */
    this._container = null

    /**
     * @type {CsdlProvider}
     * @private
     */
    this._provider = provider

    if (entityContainerInfo) {
      this._name = entityContainerInfo.name.name
      this._entityContainerName = entityContainerInfo.name
      this._parentContainerName = entityContainerInfo.extends
    } else {
      this._name = fqn.name
      this._container = entityContainer
      this._entityContainerName = fqn
      this._parentContainerName = entityContainer.extends
    }

    /**
     * @type {EdmSingleton[]}
     * @private
     */
    this._singletons = null

    /**
     * @type {Map.<string, EdmSingleton>}
     * @private
     */
    this._singletonCache = new Map()

    /**
     * @type {EdmEntitySet[]}
     * @private
     */
    this._entitySets = null

    /**
     * @type {Map.<string, EdmEntitySet>}
     * @private
     */
    this._entitySetCache = new Map()

    /**
     * @type {EdmActionImport[]}
     * @private
     */
    this._actionImports = null

    /**
     * @type {Map.<string, EdmActionImport>}
     * @private
     */
    this._actionImportCache = new Map()

    /**
     * @type {EdmFunctionImport[]}
     * @private
     */
    this._functionImports = null

    /**
     * @type {Map.<string, EdmFunctionImport>}
     * @private
     */
    this._functionImportCache = new Map()

    /**
     * @type {EdmAnnotation[]}
     * @private
     */
    this._annotations = null

    this._configuration = configuration
  }

  /**
   * Return Namespace.
   * @returns {string} the namespace
   */
  getNamespace () {
    return this._entityContainerName.namespace
  }

  /**
   * Return name.
   * @returns {string} the name
   */
  getName () {
    return this._entityContainerName.name
  }

  /**
   * Return full qualified name.
   * @returns {FullQualifiedName} the full-qualified name
   */
  getFullQualifiedName () {
    return this._entityContainerName
  }

  /**
   * Get contained singleton by name.
   * @param {string} singletonName Name of singleton, or null if not found
   * @returns {?EdmSingleton} the singleton
   */
  getSingleton (singletonName) {
    let singleton = this._singletonCache.get(singletonName) // EdmSingleton
    if (!singleton) {
      singleton = this._createSingleton(singletonName)
      if (singleton) this._singletonCache.set(singletonName, singleton)
    }
    return singleton
  }

  /**
   * Get contained entity set by name.
   * @param {string} entitySetName Name of entity set, or null if not found
   * @returns {?EdmEntitySet} the entity set
   */
  getEntitySet (entitySetName) {
    let entitySet = this._entitySetCache.get(entitySetName)
    if (!entitySet) {
      entitySet = this._createEntitySet(entitySetName)
      if (entitySet) this._entitySetCache.set(entitySetName, entitySet)
    }
    return entitySet
  }

  /**
   * Get contained action import by name, or null if not found.
   * @param {string} actionImportName Name of action import
   * @returns {?EdmActionImport} the action import
   */
  getActionImport (actionImportName) {
    let actionImport = this._actionImportCache.get(actionImportName)
    if (!actionImport) {
      actionImport = this._createActionImport(actionImportName)
      if (actionImport) this._actionImportCache.set(actionImportName, actionImport)
    }
    return actionImport
  }

  /**
   * Get contained function import by name.
   * @param {string} functionImportName Name of function import
   * @returns {?EdmFunctionImport} the function import
   */
  getFunctionImport (functionImportName) {
    let functionImport = this._functionImportCache.get(functionImportName)
    if (!functionImport) {
      functionImport = this._createFunctionImport(functionImportName)
      if (functionImport) this._functionImportCache.set(functionImportName, functionImport)
    }
    return functionImport
  }

  /**
   * Returns all singletons.
   * @returns {EdmSingleton[]} the singletons
   */
  getSingletons () {
    if (!this._singletons) this._loadAllSingletons()
    return this._singletons
  }

  /**
   * Returns all entity sets.
   * @returns {EdmEntitySet[]} the entity sets
   */
  getEntitySets () {
    if (!this._entitySets) this._loadAllEntitySets()
    return this._entitySets
  }

  /**
   * Loads and returns all action imports.
   * @returns {EdmActionImport[]} the action imports
   */
  getActionImports () {
    if (!this._actionImports) this._loadAllActionImports()
    return this._actionImports
  }

  /**
   * Loads and returns all function imports.
   * @returns {EdmFunctionImport[]} the function imports
   */
  getFunctionImports () {
    if (!this._functionImports) this._loadAllFunctionImports()
    return this._functionImports
  }

  /**
   * Returns the {@link FullQualifiedName} of the parent container or null if no parent is specified.
   * @returns {FullQualifiedName} the full.qualified name of the parent container
   */
  getParentContainerName () {
    return this._parentContainerName
  }

  /**
   * Creates a EdmSingleton instance using the CSDL provider.
   * @param {string} singletonName Name of the singleton
   * @returns {EdmSingleton} the singleton
   * @private
   */
  _createSingleton (singletonName) {
    const providerSingleton = this._provider.getSingleton(this._entityContainerName, singletonName)
    const config = this._getArtifactConfiguration(this.getNamespace(), singletonName)

    return providerSingleton ? new EdmSingleton(this._edm, this, providerSingleton, config) : null
  }

  /**
   * Creates a EdmEntitySet instance using the CSDL provider.
   * @param {string} entitySetName Name of the entity set
   * @returns {EdmEntitySet} the entity set
   * @private
   */
  _createEntitySet (entitySetName) {
    const providerEntitySet = this._provider.getEntitySet(this._entityContainerName, entitySetName)
    const config = this._getArtifactConfiguration(this.getNamespace(), entitySetName)

    return providerEntitySet ? new EdmEntitySet(this._edm, this, providerEntitySet, config) : null
  }

  /**
   * Creates a EdmActionImport instance using the CSDL provider.
   * @param {string} actionImportName Name of the action import
   * @returns {EdmActionImport} the action import
   * @private
   */
  _createActionImport (actionImportName) {
    const providerImport = this._provider.getActionImport(this._entityContainerName, actionImportName)
    return providerImport ? new EdmActionImport(this._edm, this, providerImport) : null
  }

  /**
   * Creates a EdmFunctionImport instance using the CSDL provider.
   * @param {string} functionImportName Name of the function import
   * @returns {EdmFunctionImport} the function import
   * @private
   */
  _createFunctionImport (functionImportName) {
    const providerImport = this._provider.getFunctionImport(this._entityContainerName, functionImportName)
    return providerImport ? new EdmFunctionImport(this._edm, this, providerImport) : null
  }

  /**
   * Load all singletons from the Csdl provider into the caches.
   * @private
   */
  _loadAllSingletons () {
    this._loadContainer()
    const providerSingletons = this._container.singletons

    this._singletons = []
    if (providerSingletons) {
      for (const csdlSingleton of providerSingletons) {
        // CsdlSingleton
        const config = this._getArtifactConfiguration(this.getNamespace(), csdlSingleton.name)
        const singleton = new EdmSingleton(this._edm, this, csdlSingleton, config) // EdmSingletonImpl
        this._singletonCache.set(csdlSingleton.name, singleton)
        this._singletons.push(singleton)
      }
    }
  }

  /**
   * Load all entity sets from the Csdl provider into the caches.
   * @private
   */
  _loadAllEntitySets () {
    this._loadContainer()
    const providerEntitySets = this._container.entitySets // CsdlEntitySet

    this._entitySets = []
    if (providerEntitySets) {
      for (const csdlEntitySet of providerEntitySets) {
        const config = this._getArtifactConfiguration(this.getNamespace(), csdlEntitySet.name)
        const entitySet = new EdmEntitySet(this._edm, this, csdlEntitySet, config)
        this._entitySetCache[entitySet.getName()] = entitySet
        this._entitySets.push(entitySet)
      }
    }
  }

  /**
   * Load all action imports from the Csdl provider into the caches.
   * @private
   */
  _loadAllActionImports () {
    this._loadContainer()
    const providerActionImports = this._container.actionImports

    this._actionImports = []
    if (providerActionImports) {
      for (const csdlActionImport of providerActionImports) {
        const actionImport = new EdmActionImport(this._edm, this, csdlActionImport)
        this._actionImportCache.set(actionImport.name, actionImport)
        this._actionImports.push(actionImport)
      }
    }
  }

  /**
   * Load all function imports from the Csdl provider into the caches.
   * @private
   */
  _loadAllFunctionImports () {
    this._loadContainer()
    const providerFunctionImports = this._container.functionImports

    this._functionImports = []
    if (providerFunctionImports) {
      for (const csdlFunctionImport of providerFunctionImports) {
        const functionImport = new EdmFunctionImport(this._edm, this, csdlFunctionImport)
        this._functionImportCache.set(functionImport.name, functionImport)
        this._functionImports.push(functionImport)
      }
    }
  }

  /**
   * Load CsdlEntityContainer object from the Csdl provider if the EdmEntityContainer
   * was created with an CsdlContainerInfo object.
   * @private
   */
  _loadContainer () {
    if (!this._container) {
      /**
       * @type {CsdlEntityContainer}
       * @private
       */
      this._container = this._provider.getEntityContainer(this._entityContainerName)
    }
  }

  /**
   * Returns the annotations for this object.
   * @returns {EdmAnnotation[]} the annotations
   */
  getAnnotations () {
    this._loadContainer()

    if (!this._annotations) {
      this._annotations = this._container.annotations.map(item => new EdmAnnotation(this._edm, item))
    }
    return this._annotations
  }

  /**
   * Creates a EdmEntityContainer instance from an ContainerInfo instance.
   * @param {Edm} edm The edm itself
   * @param {CsdlProvider} provider Provider for the Csdl artifacts
   * @param {CsdlEntityContainerInfo} entityContainerInfo Entity container info
   * @param {Object} configuration a configuration object
   * @returns {EdmEntityContainer} the entity container
   * @package
   */
  static createWithContainerInfo (edm, provider, entityContainerInfo, configuration) {
    return new EdmEntityContainer(edm, provider, entityContainerInfo, null, null, configuration)
  }

  /**
   * Creates a EdmEntityContainer instance from full qualified name and the CsdlEntityContainer.
   * @param {Edm} edm The edm itself
   * @param {CsdlProvider} provider Provider for the Csdl artifacts
   * @param {FullQualifiedName} fqn Full qualified name of container
   * @param {CsdlEntityContainer} entityContainer Entity container
   * @param {Object} configuration a configuration object
   * @returns {EdmEntityContainer} the entity container
   * @package
   */
  static createWithFQN (edm, provider, fqn, entityContainer, configuration) {
    return new EdmEntityContainer(edm, provider, null, fqn, entityContainer, configuration)
  }

  /**
   * @param {string} namespace the namespace
   * @param {string} name the name
   * @returns {?Object} configuration the configuration
   * @private
   */
  _getArtifactConfiguration (namespace, name) {
    const nsConfig = this._configuration[namespace]
    return nsConfig ? nsConfig[name] : undefined
  }
}

module.exports = EdmEntityContainer
