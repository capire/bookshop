'use strict'

class ServiceResolutions {
  /**
   * The service resolution uses a base path.
   * @param {string} basePath the base path
   * @param {boolean} [isBatch] whether the request is part of a batch request
   * @returns {Function} the service-resolution function
   */
  static viaBasePath (basePath, isBatch = false) {
    return pathname => {
      if (pathname.startsWith(basePath)) return pathname.substring(basePath.length)
      // In $batch the following patterns are allowed:
      // - Absolute URI with schema, host, port, and absolute resource path,
      //   like http://server:port/path/service/EntitySet(1)
      // - Absolute resource path, like /path/service/EntitySet(1), and separate Host header
      // - Resource path relative to the batch request URI, like EntitySet(1)
      if (isBatch) return pathname
      throw new Error("Configured base path '" + basePath + "' does not match provided url path '" + pathname + "'")
    }
  }
}

module.exports = ServiceResolutions
