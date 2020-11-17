'use strict'

const HttpHeaderReader = require('./HttpHeaderReader')

class HttpHeader {
  /**
   * Parses a content-type header.
   * @param {string|Buffer} contentType - Header value to be parsed
   * @param {?ContentTypeInfo} contentTypeInfo Provide this if a special subtype of class ContentTypeInfo should be filled
   * @returns {ContentTypeInfo} the content-type information
   */
  static parseContentTypeHeader (contentType, contentTypeInfo) {
    return new HttpHeaderReader(
      Buffer.isBuffer(contentType) ? contentType : Buffer.from(contentType, 'latin1')
    ).readContentType(contentTypeInfo)
  }
}

/**
 * HTTP header names
 * @enum {string}
 * @readonly
 */
HttpHeader.HeaderNames = {
  ACCEPT: 'accept',
  ACCEPT_CHARSET: 'accept-charset',
  CONTENT_TYPE: 'content-type',
  CONTENT_ENCODING: 'content-encoding',
  CONTENT_LENGTH: 'content-length',
  CONTENT_LANGUAGE: 'content-language',
  LOCATION: 'Location',
  ODATA_ENTITYID: 'OData-EntityID',
  ODATA_VERSION: 'OData-Version',
  ODATA_MAXVERSION: 'OData-MaxVersion',
  PREFER: 'prefer',
  PREFERENCE_APPLIED: 'Preference-Applied',
  IF_NONE_MATCH: 'If-None-Match',
  IF_MATCH: 'If-Match',
  ETAG: 'ETag'
}

module.exports = HttpHeader
