'use strict'

/**
 * The ComponentManager manages the core components of the OData library.
 * @hideconstructor
 */
class ComponentManager {
  /**
   * Creates an instance of ComponentManager.
   */
  constructor () {
    this._components = new Map()
  }

  /**
   * Registers a component by its name.
   * @param {ComponentManager.Components} name the name of the component
   * @param {*} component the component to register
   * @returns {ComponentManager} this instance of ComponentManager
   * @package
   */
  use (name, component) {
    this._components.set(name, component)
    return this
  }

  /**
   * Returns a component found by its name.
   * @param {string} name The name of the component
   * @returns {*} the component found by its name or null if none was found
   * @package
   */
  getComponent (name) {
    return this._components.get(name)
  }
}

/**
 * @enum {string}
 * @readonly
 */
ComponentManager.Components = {
  URI_PARSER: 'URI_PARSER',
  DISPATCHER: 'DISPATCHER',
  REQUEST_VALIDATOR: 'REQUEST_VALIDATOR',
  CONTENT_NEGOTIATOR: 'CONTENT_NEGOTIATOR',
  LOCALE_NEGOTIATOR: 'LOCALE_NEGOTIATOR',
  PRIMITIVE_VALUE_ENCODER: 'PRIMITIVE_VALUE_ENCODER',
  LOGGER: 'LOGGER',
  METADATA_HANDLER: 'METADATA_HANDLER',
  SERVICE_HANDLER: 'SERVICE_HANDLER',
  // Please don't change the value of the CRUD Handler constants as the value is aligned with CDS
  // and later on the API can be enhanced with, e.g., service.on('READ', 'EntitySet', handler() {})
  DATA_READ_HANDLER: 'READ',
  DATA_DELETE_HANDLER: 'DELETE',
  DATA_CREATE_HANDLER: 'CREATE',
  DATA_UPDATE_HANDLER: 'UPDATE',
  ERROR_HANDLER: 'ERROR_HANDLER',
  ACTION_EXECUTE_HANDLER: 'ACTION_EXECUTE_HANDLER',
  BATCH_EXECUTE_HANDLER: 'BATCH_EXECUTE_HANDLER'
}

module.exports = ComponentManager
