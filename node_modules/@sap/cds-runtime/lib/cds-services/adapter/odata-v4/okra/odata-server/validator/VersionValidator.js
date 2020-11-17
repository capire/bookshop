'use strict'

const BadRequestError = require('../errors/BadRequestError')

const MINIMUM_VERSION = '4.0'
const SUPPORTED_VERSIONS = [MINIMUM_VERSION, '4.01']

const MAX_VERSION_REG_EXP = new RegExp('^\\d+\\.\\d+$')

/**
 * Utilities for the OData Version
 */
class VersionValidator {
  /**
   * Creates an instance of VersionValidator.
   * @param {?string} version - the input OData version, as a string
   * @throws {Error} if version exists and is not a string or an invalid string
   */
  constructor (version) {
    if (version) this._validateVersionString(version)
    this._version = version
  }

  /**
   * Validates the given version against the supported OData version(s).
   * @param {string} version - The version to be tested. Its string must follow the
   *                           odata-abnf-construction-rules: 1*DIGIT "." 1*DIGIT
   * @throws {BadRequestError} if version is not one of the supported versions
   */
  validateVersion (version) {
    this._validateVersionString(version)

    if ((this._version && version !== this._version) || !SUPPORTED_VERSIONS.includes(version)) {
      throw new BadRequestError("OData-Version '" + version + "' is not a supported version.")
    }
  }

  /**
   * Compares the given max-acceptable version to the required OData version.
   * @param {string} maxVersion - The maximum version to be tested; its string must follow the
   *                              odata-abnf-construction-rules: 1*DIGIT "." 1*DIGIT
   * @throws {BadRequestError} if maxVersion is lower than the required version
   */
  validateMaxVersion (maxVersion) {
    this._validateVersionString(maxVersion)
    if ((this._version && Number(maxVersion) < Number(this._version)) || Number(maxVersion) < Number(MINIMUM_VERSION)) {
      throw new BadRequestError("OData-MaxVersion '" + maxVersion + "' is not supported.")
    }
  }

  /**
   * Validates that a version string follows the odata-abnf-construction-rules: 1*DIGIT "." 1*DIGIT
   * @param {string} version - version string to be tested
   * @throws {BadRequestError} if the version string is invalid
   * @private
   */
  _validateVersionString (version) {
    if (!MAX_VERSION_REG_EXP.test(version)) throw new BadRequestError('"' + version + '" is not a valid version')
  }
}

module.exports = VersionValidator
