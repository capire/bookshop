module.exports = {
  ALLOWED_PROPERTIES: ['code', 'message', 'target', 'details', 'innererror'],
  ADDITIONAL_MSG_PROPERTIES: ['numericSeverity', 'longtextUrl', 'transition'],
  /*
   * severities:
   *   1: success
   *   2: info
   *   3: warning
   *   4: error
   */
  DEFAULT_SEVERITY: 2,
  MIN_SEVERITY: 1,
  MAX_SEVERITY: 4,
  MULTIPLE_ERRORS: 'MULTIPLE_ERRORS'
}
