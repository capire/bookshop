'use strict'

const ContentTypeInfo = require('./ContentTypeInfo')

/**
 * Stores information which has been negotiated between client and server.
 * This includes the negotiated content type.
 * @extends ContentTypeInfo
 */
class JsonContentTypeInfo extends ContentTypeInfo {
  /**
   * Creates an instance of JsonContentTypeInfo.
   * @param {ContentTypeInfo} contentTypeInfo The general content type info
   */
  constructor (contentTypeInfo = new ContentTypeInfo()) {
    super()
    super.setMimeType(contentTypeInfo.getMimeType())
    for (const parameter of contentTypeInfo.getParameters()) this.addParameter(parameter.name, parameter.value)
  }

  /**
   * @returns {?JsonContentTypeInfo.FormatParameterMetadataValues} the metadata setting
   */
  getMetadataSetting () {
    const value = this.getParameter(JsonContentTypeInfo.FormatParameter.ODATA_METADATA)
    if (Array.isArray(value)) {
      throw new Error('Ambiguous odata.metadata parameters in content type ' + this.toString())
    }
    return value === JsonContentTypeInfo.FormatParameterMetadataValues.NONE ||
      value === JsonContentTypeInfo.FormatParameterMetadataValues.MINIMAL ||
      value === JsonContentTypeInfo.FormatParameterMetadataValues.FULL
      ? value
      : JsonContentTypeInfo.FormatParameterMetadataValues.MINIMAL
  }

  /**
   * @returns {boolean} the streaming parameter
   */
  getStreamingSetting () {
    return this.getParameter(JsonContentTypeInfo.FormatParameter.STREAMING) === 'true'
  }

  /**
   * @returns {boolean} the IEEE754Compatible parameter
   */
  getIEEE754Setting () {
    return this.getParameter(JsonContentTypeInfo.FormatParameter.IEEE754) === 'true'
  }

  /**
   * @returns {boolean} the setting for exponential decimals
   */
  getExponentialDecimalsSetting () {
    return this.getParameter(JsonContentTypeInfo.FormatParameter.EXPONENTIAL_DECIMALS) === 'true'
  }
}

/**
 * Available format parameters for JSON format
 * @enum {string}
 * @readonly
 */
JsonContentTypeInfo.FormatParameter = {
  ODATA_METADATA: 'odata.metadata', // OData JSON # 3.1 Controlling the Amount of Control
  // information in Responses
  IEEE754: 'IEEE754Compatible', // OData JSON # 3.2 Controlling the Representation of Numbers
  EXPONENTIAL_DECIMALS: 'ExponentialDecimals', // OData JSON # 3.2 Controlling the Representation of Numbers
  STREAMING: 'odata.streaming', // OData JSON # 3   Requesting the JSON Format
  CHARSET: 'charset'
}

/**
 * Possible values for the odata.metadata format parameter
 * @enum {string}
 * @readonly
 */
JsonContentTypeInfo.FormatParameterMetadataValues = {
  NONE: 'none',
  MINIMAL: 'minimal',
  FULL: 'full'
}

module.exports = JsonContentTypeInfo
