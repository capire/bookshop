'use strict'

const IllegalArgumentError = require('../errors/IllegalArgumentError')

/**
 * This class is intended to be used to simplify validation of method input parameters
 * and to prevent duplication of the validation code.
 */
class ParameterValidator {
  static validateThat (parameterName, parameterValue) {
    return new ParameterValidator(parameterName, parameterValue)
  }

  /**
   * @param {string} name - name of the parameter to be validated
   * @param {*} value - value of the parameter to be validated
   */
  constructor (name, value) {
    this._name = name
    this._value = value
  }

  /**
   * Checks whether the parameter value is truthy.
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if the parameter value is falsy
   */
  truthy () {
    if (!this._value) throw IllegalArgumentError.createForMissingParameter(this._name)
    return this
  }

  /**
   * Checks that the parameter is not null and not undefined.
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if the parameter value is null or undefined
   */
  notNullNorUndefined () {
    if (this._value === null || this._value === undefined) {
      throw IllegalArgumentError.createForMissingParameter(this._name)
    }
    return this
  }

  /**
   * Checks whether type of the parameter value equals to the specified typeName.
   * @param {string} typeName - name of the type to be used on the right side of 'typeof' expression
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if type of the parameter value is not equal to the specified typeName
   */
  typeOf (typeName) {
    // eslint-disable-next-line valid-typeof
    if (typeof this._value !== typeName) throw IllegalArgumentError.createForIllegalInstance(this._name, typeName)
    return this
  }

  /**
   * Checks whether the parameter value is instance of the specified type.
   * @param {Object} constructor - constructor of the type, for which instanceof operator will be called
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if the parameter value is not an instance of the specified type
   */
  instanceOf (constructor) {
    if (!(this._value instanceof constructor)) {
      throw IllegalArgumentError.createForIllegalInstance(this._name, constructor.name)
    }
    return this
  }

  /**
   * Checks whether the parameter value is an array.
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if the parameter value is not an array
   */
  array () {
    if (!Array.isArray(this._value)) throw IllegalArgumentError.createForIllegalInstance(this._name, 'Array')
    return this
  }

  /**
   * Checks whether all the elements of the parameter value, WHICH MUST BE AN ARRAY, are type of the specified type.
   * @param {string} typeName Name of the type to be used on the right side of 'typeof' expression
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if there is an element in the parameter value which is not of the specified type
   */
  containsElementsOfType (typeName) {
    // eslint-disable-next-line valid-typeof
    const index = this._value.findIndex(element => typeof element !== typeName)
    if (index > -1) throw IllegalArgumentError.createForIllegalElementType(index, this._name, typeName)
    return this
  }

  /**
   * Checks whether all the elements of the parameter value, WHICH MUST BE AN ARRAY,
   * are instances of the specified type.
   *
   * @param {Object} constructor - constructor of the type, for which instanceof operator will be called.
   * @returns {ParameterValidator} 'this' instance to be able to use method chaining
   * @throws {IllegalArgumentError} if there is an element in the parameter value, which is not an
   *                                instance of the specified type
   */
  containsInstancesOf (constructor) {
    const index = this._value.findIndex(element => !(element instanceof constructor))
    if (index > -1) throw IllegalArgumentError.createForIllegalElementType(index, this._name, constructor.name)
    return this
  }

  integer () {
    if (!Number.isInteger(this._value)) throw IllegalArgumentError.createForIllegalInstance(this._name, 'Number')
    return this
  }

  nonNegativeInteger () {
    if (this._value < 0) throw IllegalArgumentError.createForNonNegativeParameter(this._name)
    return this
  }

  positiveInteger () {
    if (this._value <= 0) throw IllegalArgumentError.createForPositiveParameter(this._name)
    return this
  }
}

module.exports = ParameterValidator
