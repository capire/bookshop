'use strict'

/**
 * Stores custom (non OData) preferences.
 */
class CustomPreference {
  /**
   * @param {string} preferenceName the name of the preference
   * @param {*} value the value of the preference
   * @param {Map} parameters the parameters of the preference
   */
  constructor (preferenceName, value, parameters) {
    this._preferenceName = preferenceName
    this._value = value
    this._parameters = parameters
  }

  getPreferenceName () {
    return this._preferenceName
  }

  getValue () {
    return this._value
  }

  getParameters () {
    return this._parameters
  }
}

module.exports = CustomPreference
