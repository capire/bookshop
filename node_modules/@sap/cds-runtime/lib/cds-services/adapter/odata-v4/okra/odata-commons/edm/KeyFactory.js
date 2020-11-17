'use strict'

const FullQualifiedName = require('../FullQualifiedName')
const validateThat = require('../validator/ParameterValidator').validateThat

/**
 * Factory for creating keys used to store EDM entities in ES6 Maps
 */
class KeyFactory {
  /**
   * Creates a string representation of the action tuple which can be used as key for a map.
   * @param {FullQualifiedName} actionName Full qualified name of the action
   * @param {FullQualifiedName} bindingParameterTypeName Full qualified name of the binding parameter
   * @param {boolean} isBindingParameterCollection whether the binding parameter is a collection
   * @returns {string} the unique key
   */
  static createActionKey (actionName, bindingParameterTypeName, isBindingParameterCollection) {
    validateThat('actionName', actionName)
      .truthy()
      .instanceOf(FullQualifiedName)
    validateThat('bindingParameterTypeName', bindingParameterTypeName)
      .truthy()
      .instanceOf(FullQualifiedName)
    validateThat('isBindingParameterCollection', isBindingParameterCollection).typeOf('boolean')

    return (
      FullQualifiedName.getFQNAsString(actionName) + ' ' + bindingParameterTypeName + ' ' + isBindingParameterCollection
    )
  }

  /**
   * Creates a string representation of the function tuple which can be used as key for a map.
   * @param {FullQualifiedName} functionName full-qualified name of the function
   * @param {?FullQualifiedName} bindingParameterTypeName Binding parameter typename or null if unbound
   * @param {?boolean} isBindingParameterCollection Binding parameter collection info or null if unbound
   * @param {string[]} parameterNames the names of the function parameters
   * @returns {string} the unique key
   */
  static createFunctionKey (functionName, bindingParameterTypeName, isBindingParameterCollection, parameterNames) {
    validateThat('functionName', functionName)
      .truthy()
      .instanceOf(FullQualifiedName)
    if (bindingParameterTypeName) {
      validateThat('bindingParameterTypeName', bindingParameterTypeName)
        .truthy()
        .instanceOf(FullQualifiedName)
      validateThat('isBindingParameterCollection', isBindingParameterCollection).typeOf('boolean')
    }
    validateThat('parameterNames', parameterNames)
      .array()
      .containsElementsOfType('string')

    return (
      FullQualifiedName.getFQNAsString(functionName) +
      ' ' +
      bindingParameterTypeName +
      ' ' +
      isBindingParameterCollection +
      '  ' +
      Array.from(parameterNames)
        .sort()
        .join(' ')
    )
  }
}

module.exports = KeyFactory
