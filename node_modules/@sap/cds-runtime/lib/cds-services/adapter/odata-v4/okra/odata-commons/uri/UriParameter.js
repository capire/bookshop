'use strict'

/**
 * A UriParameter represents a key=value pair inside a URI like ESKeyNav(PropertyInt16=1)
 * or a function parameter=value pair inside a URI like FICRTETTwoKeyNavParam(ParameterInt16=1).
 * @hideconstructor
 */
class UriParameter {
  /**
   * Sets the EDM reference.
   * @param {EdmKeyPropertyRef|EdmParameter} edmRef the corresponding EDM reference
   * @returns {UriParameter} this parameter object
   * @package
   */
  setEdmRef (edmRef) {
    this._edmRef = edmRef
    return this
  }

  /**
   * Returns the EDM reference object.
   * @returns {EdmKeyPropertyRef|EdmParameter} the EDM reference object
   */
  getEdmRef () {
    return this._edmRef
  }

  /**
   * Sets the value of the parameter or key. This is a string or null if the URI was like ParameterInt16=null.
   * @param {?string} value the value of the parameter or key
   * @returns {UriParameter} This parameter object
   * @package
   */
  setText (value) {
    this._value = value
    return this
  }

  /**
   * Returns the value of the parameter or key. This is a string or null if the URI was like ParameterInt16=null.
   * @returns {?string} The value of the parameter or key
   */
  getText () {
    return this._value
  }

  /**
   * Sets the alias name (useful in the case the value was given as a parameter-alias name).
   * @param {string} name The alias name (starting with '@')
   * @returns {UriParameter} This parameter object
   * @package
   */
  setAlias (name) {
    this._alias = name
    return this
  }

  /**
   * Returns the alias name if set.
   * @returns {(string|undefined)} The alias name
   */
  getAlias () {
    return this._alias
  }

  /**
   * Sets the alias value (for the case the value was given as a parameter-alias name
   * and the alias value is a simple literal value).
   *
   * @param {string} value The alias value
   * @returns {UriParameter} This parameter object
   * @package
   */
  setAliasValue (value) {
    this._aliasValue = value
    return this
  }

  /**
   * Returns the alias value if set.
   * @returns {(string|undefined)} The alias value
   */
  getAliasValue () {
    return this._aliasValue
  }

  /**
   * Sets the expression value (for the case the value was given as a common expression).
   * @param {Expression} expression The expression value
   * @returns {UriParameter} This parameter object
   * @package
   */
  setExpression (expression) {
    this._expression = expression
    return this
  }

  /**
   * Returns the expression value if set.
   * @returns {(Expression|undefined)} The expression value
   */
  getExpression () {
    return this._expression
  }
}

module.exports = UriParameter
