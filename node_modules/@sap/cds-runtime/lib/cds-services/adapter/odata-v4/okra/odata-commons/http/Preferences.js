'use strict'

module.exports = {
  /**
   * Values for the return preference
   *
   * @enum {string}
   * @readonly
   */
  ReturnValues: {
    MINIMAL: 'minimal',
    REPRESENTATION: 'representation'
  },
  /**
   * Names of the odata prefer headers
   *
   * @enum {string}
   * @readonly
   * @package
   */
  Names: {
    ALLOW_ENTITYREFERENCES: 'odata.allow-entityreferences',
    CALLBACK: 'odata.callback',
    CONTINUE_ON_ERROR: 'odata.continue-on-error',
    INCLUDE_ANNOTATIONS: 'odata.include-annotations',
    MAXPAGESIZE: 'odata.maxpagesize',
    RESPOND_ASYNC: 'respond-async',
    RETURN: 'return',
    TRACK_CHANGES: 'odata.track-changes',
    WAIT: 'wait'
  }
}
