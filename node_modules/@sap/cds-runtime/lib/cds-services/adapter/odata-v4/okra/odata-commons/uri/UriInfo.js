'use strict'

/**
 * The UriInfo object is the result object of the URI parsing. It holds also relevant
 * information about the EDM entities found/parsed and the types and kinds of resources.
 * @hideconstructor
 */
class UriInfo {
  /**
   * Creates an instance of UriInfo.
   */
  constructor () {
    this._pathSegments = []
    this._queryOptions = {}
    this._aliases = {}
    this._finalEdmType = undefined
  }

  /**
   * Sets the current query-options object.
   * Expected format is the output like node.js module querystring produces.
   *
   * @param {Object} queryOptions The query options to set.
   * @returns {UriInfo} this instance of UriInfo
   * @package
   */
  setQueryOptions (queryOptions) {
    this._queryOptions = queryOptions
    return this
  }

  /**
   * Sets a query option with its value.
   * @param {string} name name of the query option
   * @param {*} value value of the query option
   * @returns {UriInfo} this instance of UriInfo
   * @package
   */
  setQueryOption (name, value) {
    this._queryOptions[name] = value
    return this
  }

  /**
   * Returns the corresponding query option found by its name.
   * For OData query options the value is already parsed and interpreted.
   *
   * @param {string} optionName Name of the query option.
   * @returns {*} the corresponding value for the query option
   */
  getQueryOption (optionName) {
    return this._queryOptions ? this._queryOptions[optionName] : null
  }

  /**
   * Returns available query options.
   * @returns {Object} all available query options
   */
  getQueryOptions () {
    return this._queryOptions
  }

  /**
   * Sets an alias with its value.
   * @param {string} name the alias name to set
   * @param {string} value the alias value to set
   * @returns {UriInfo} this instance of UriInfo
   * @package
   */
  setAlias (name, value) {
    this._aliases[name] = value
    return this
  }

  /**
   * Returns available aliases.
   * @returns {Object} all available aliases
   */
  getAliases () {
    return this._aliases
  }

  /**
   * Sets the current parsed URI segments.
   * @param {UriResource[]} segments the segments to set
   * @returns {UriInfo} this instance of UriInfo
   * @package
   */
  setPathSegments (segments) {
    this._pathSegments = segments
    return this
  }

  /**
   * Returns the current parsed URI segments.
   * @returns {UriResource[]} the current URI segments
   */
  getPathSegments () {
    return this._pathSegments
  }

  /**
   * Returns the last (or a previous, if the parameter offset is provided) path resource segment.
   * Example: getLastSegment(-1) returns the segment before the last segment.
   * @param {number} offset a negative integer that describes how far to go back from the end
   * @returns {?UriResource} the selected resource segment
   */
  getLastSegment (offset = 0) {
    return this._pathSegments[this._pathSegments.length - 1 + offset]
  }

  /**
   * Returns the final EDM type of the resource path or of the $apply option if present.
   * @returns {?EdmType} the final EDM type or null if it is unknown
   */
  getFinalEdmType () {
    if (this._finalEdmType === undefined) {
      this._finalEdmType =
        this.getLastSegment().getEdmType() ||
        (this._pathSegments.length > 1 ? this.getLastSegment(-1).getEdmType() : null)
    }
    return this._finalEdmType
  }

  /**
   * Sets the final EDM type in case it is different from the final EDM type of the resource path.
   * @param {EdmType} edmType the final EDM type
   * @returns {UriInfo} this instance of UriInfo
   * @package
   */
  setFinalEdmType (edmType) {
    this._finalEdmType = edmType
    return this
  }
}

/**
 * Query parameters
 * System query parameters defined by the OData specification start with an $
 *
 * @enum {string}
 * @readonly
 */
UriInfo.QueryOptions = {
  ODATA_DEBUG: 'odata-debug',
  FORMAT: '$format',
  ID: '$id',
  APPLY: '$apply',
  SEARCH: '$search',
  FILTER: '$filter',
  COUNT: '$count',
  ORDERBY: '$orderby',
  EXPAND: '$expand',
  SELECT: '$select',
  SKIP: '$skip',
  TOP: '$top',
  SKIPTOKEN: '$skiptoken',
  DELTATOKEN: '$deltatoken'
}

module.exports = UriInfo
