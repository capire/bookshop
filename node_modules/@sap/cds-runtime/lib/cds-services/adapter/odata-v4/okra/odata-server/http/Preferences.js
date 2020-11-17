'use strict'

/**
 * Stores the parsed prefer headers from the request.
 *
 * <a href="../ODataSpecification/odata-v4.0-errata03-os/complete/part1-protocol/odata-v4.0-errata03-os-part1-protocol-complete.html#_Toc453752234">
 *     OData V4 part1 protocol 8.2.8 Header Prefer
 * </a>
 *
 * @hideconstructor
 */
class Preferences {
  constructor () {
    this._odataAllowEntityReferences = false
    this._odataCallback = null
    this._odataContinueOnError = false
    this._odataIncludeAnnotations = null
    this._odataMaxPageSize = null
    this._odataTrackChanges = null
    this._return = null
    this._respondAsync = false
    this._wait = null

    this._customPreferences = new Map()
  }

  /**
   * Returns true if Preference "odata.allow-entityreferences" is set.
   * @returns {boolean} whether "odata.allow-entityreferences" is set
   */
  getOdataAllowEntityReferences () {
    return this._odataAllowEntityReferences
  }

  /**
   * @param {boolean} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setOdataAllowEntityReferences (value) {
    this._odataAllowEntityReferences = value
    return this
  }

  /**
   * Returns the URI in Preference "odata.callback;url=<URI>".
   * @returns {?string} the URI
   */
  getOdataCallback () {
    return this._odataCallback
  }

  /**
   * @param {?string} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setOdataCallback (value) {
    this._odataCallback = value
    return this
  }

  /**
   * Returns true if Preference "odata.continue-on-error" is set.
   * @returns {boolean} whether to continue on error
   */
  getOdataContinueOnError () {
    return this._odataContinueOnError
  }

  /**
   * @param {boolean} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setOdataContinueOnError (value) {
    this._odataContinueOnError = value
    return this
  }

  /**
   * Returns the annotations list in "odata.include-annotations".
   * @returns {*} the annotations list
   */
  getOdataIncludeAnnotations () {
    return this._odataIncludeAnnotations
  }

  /**
   * @param {*} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setOdataIncludeAnnotations (value) {
    this._odataIncludeAnnotations = value
    return this
  }

  /**
   * Returns the number set in Preference "odata.maxpagesize=<number>".
   * @returns {?number} the page size preference
   */
  getOdataMaxPageSize () {
    return this._odataMaxPageSize
  }

  /**
   * @param {?number} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setOdataMaxPageSize (value) {
    this._odataMaxPageSize = value
    return this
  }

  /**
   * Returns true if Preference "odata.track-changes" is set.
   * @returns {boolean} whether to track changes
   */
  getOdataTrackChanges () {
    return this._odataTrackChanges
  }

  /**
   * @param {boolean} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setOdataTrackChanges (value) {
    this._odataTrackChanges = value
    return this
  }

  /**
   * Returns the ReturnName set in Preference "return=<Preferences.ReturnValues>".
   * @returns {?Preferences.ReturnValues} the return preference
   */
  getReturn () {
    return this._return
  }

  /**
   * @param {?Preferences.ReturnValues} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setReturn (value) {
    this._return = value
    return this
  }

  /**
   * Returns true if Preference "respond-async" is set.
   * @returns {boolean} whether to respond asynchronously
   */
  getRespondAsync () {
    return this._respondAsync
  }

  /**
   * @param {boolean} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setRespondAsync (value) {
    this._respondAsync = value
    return this
  }

  /**
   * Returns the number in Preference "wait=<number>"
   * @returns {?number} the wait time
   */
  getWait () {
    return this._wait
  }

  /**
   * @param {?number} value the value of the preference
   * @returns {Preferences} this instance
   * @package
   */
  setWait (value) {
    this._wait = value
    return this
  }

  /**
   * Adds a custom preference object to the custom preferences map.
   * The key in the map is the name of the preference (the token referring to the ABNF)
   * @param {CustomPreference} customPreference the custom preference to add to the map
   * @returns {Preferences} this instance
   * @package
   */
  setCustomPreference (customPreference) {
    this._customPreferences.set(customPreference.getPreferenceName(), customPreference)
    return this
  }

  /**
   * Returns the value of a custom preference.
   * Returns null if the custom preference does not exist.
   * @param {string} customPreferenceName the name of the custom preference
   * @returns {?(string|boolean)} The value of the given custom preference
   */
  getCustomPreferenceValue (customPreferenceName) {
    const customPreference = this._customPreferences.get(customPreferenceName)
    return customPreference ? customPreference.getValue() : null
  }

  /**
   * Returns all parameters of a custom preference.
   * @param {string} preferenceName name of the preference
   * @returns {Map.<string, string|boolean>} the parameters of the custom preference
   */
  getCustomPreferenceParameters (preferenceName) {
    return this._customPreferences.get(preferenceName).getParameters()
  }
}

module.exports = Preferences
