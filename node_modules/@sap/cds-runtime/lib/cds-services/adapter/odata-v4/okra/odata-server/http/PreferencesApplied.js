'use strict'

/**
 * Stores the applied preferences for the response header.
 *
 * <a href="../ODataSpecification/odata-v4.0-errata03-os/complete/part1-protocol/odata-v4.0-errata03-os-part1-protocol-complete.html#_Toc453752239">
 *     OData V4 part1 protocol 8.3.4 Header Preference-Applied
 *
 * @hideconstructor
 */
class PreferencesApplied {
  constructor () {
    this._odataAllowEntityReferencesApplied = false
    this._odataCallbackApplied = false
    this._odataContinueOnErrorApplied = false
    this._odataIncludeAnnotationsApplied = null
    this._odataMaxPageSizeApplied = null
    this._respondAsyncApplied = false
    this._returnApplied = null
    this._odataTrackChangesApplied = null
    this._waitApplied = null

    this._customPreferencesApplied = new Map()
  }

  /**
   * Returns true if Preference "odata.allow-entityreferences" is set.
   * @returns {boolean} whether the preference has been applied
   * @package
   */
  getOdataAllowEntityReferencesApplied () {
    return this._odataAllowEntityReferencesApplied
  }

  /**
   * Set to true if the Preference 'odata.allow-entityreferences' was applied to the processing.
   * @param {boolean} value whether the preference has been applied
   */
  setOdataAllowEntityReferencesApplied (value) {
    this._odataAllowEntityReferencesApplied = value
  }

  /**
   * Returns true if Preference "odata.callback" is set.
   * @returns {boolean} whether the preference has been applied
   * @package
   */
  getOdataCallbackApplied () {
    return this._odataCallbackApplied
  }

  /**
   * Set to true if the Preference 'odata.callback' was applied to the processing.
   * @param {boolean} value whether the preference has been applied
   */
  setOdataCallbackApplied (value) {
    this._odataCallbackApplied = value
  }

  /**
   * Returns true if Preference "odata.continue-on-error" is set.
   * @returns {boolean} whether the preference has been applied
   * @package
   */
  getOdataContinueOnErrorApplied () {
    return this._odataContinueOnErrorApplied
  }

  /**
   * Set to true if the Preference 'odata.continue-on-error' was applied to the processing.
   * @param {boolean} value whether the preference has been applied
   */
  setOdataContinueOnErrorApplied (value) {
    this._odataContinueOnErrorApplied = value
  }

  /**
   * Returns the annotations list in "odata.include-annotations".
   * @returns {*} the applied annotations list
   * @package
   */
  getOdataIncludeAnnotationsApplied () {
    return this._odataIncludeAnnotationsApplied
  }

  /**
   * Set to to the actually applied annotations if the Preference 'odata.include-annotations' was applied to the processing.
   * @param {*} value the applied annotations
   */
  setOdataIncludeAnnotationsApplied (value) {
    this._odataIncludeAnnotationsApplied = value
  }

  /**
   * Returns the number set in Preference "odata.maxpagesize=<number>".
   * @returns {?number} the applied page size
   * @package
   */
  getOdataMaxPageSizeApplied () {
    return this._odataMaxPageSizeApplied
  }

  /**
   * Set to actually applied maxPageSize if the Preference 'odata.maxpagesize' was applied to the processing.
   * @param {?number} value the applied page size
   */
  setOdataMaxPageSizeApplied (value) {
    this._odataMaxPageSizeApplied = value
  }

  /**
   * Returns true if Preference "odata.track-changes" is set.
   * @returns {boolean} whether the preference has been applied
   * @package
   */
  getOdataTrackChangesApplied () {
    return this._odataTrackChangesApplied
  }

  /**
   * Set to true if the Preference 'odata.track-changes' was applied to the processing.
   * @param {boolean} value whether the preference has been applied
   */
  setOdataTrackChangesApplied (value) {
    this._odataTrackChangesApplied = value
  }

  /**
   * Returns the ReturnName set in Preference "return=<Preferences.ReturnValues>".
   * @returns {string} the applied return value
   * @package
   */
  getReturnApplied () {
    return this._returnApplied
  }

  /**
   * Set to the actually applied value of the Preference 'return', if it was applied to the processing.
   * @param {?Preferences.ReturnValues} value the applied return value
   */
  setReturnApplied (value) {
    this._returnApplied = value
  }

  /**
   * Returns true if Preference "respond-async" is set.
   * @returns {boolean} whether the preference has been applied
   * @package
   */
  getRespondAsyncApplied () {
    return this._respondAsyncApplied
  }

  /**
   * Set to true if the Preference 'respond-async' was applied to the processing.
   * @param {boolean} value whether the preference has been applied
   */
  setRespondAsyncApplied (value) {
    this._respondAsyncApplied = value
  }

  /**
   * Returns the number in Preference "wait=<number>"
   * @returns {?number} the applied waiting time
   * @package
   */
  getWaitApplied () {
    return this._waitApplied
  }

  /**
   * Set to actually applied value in the Preference 'wait', if it was applied to the processing.
   * @param {?number} value the applied waiting time
   */
  setWaitApplied (value) {
    this._waitApplied = value
  }

  /**
   * Adds a applied custom preference to the custom preferences map.
   * The key in the map is the name of the preference.
   * @param {CustomPreference} customPreferenceName the applied custom Preference to add to the map.
   * @param {string|boolean} [value] the actually applied value for the Preference. Defaults to true.
   */
  setCustomPreferenceApplied (customPreferenceName, value = true) {
    this._customPreferencesApplied.set(customPreferenceName, value)
  }

  /**
   * Returns the names and values of all applied custom preferences.
   * @returns {Map} The map with all applied custom preferences and their corresponding values.
   * @package
   */
  getCustomPreferencesApplied () {
    return this._customPreferencesApplied
  }
}

module.exports = PreferencesApplied
