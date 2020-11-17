/**
 * If the client is behind a proxy, the x-forwarded-for header needs to be evaluated. Falls back to req.ip or 'unknown'.
 * - x-forwarded-for syntax: "<client>, <proxy1>, <proxy2>, ..."
 * - req.ip: "{left-most entry in the X-Forwarded-* header} || req.connection.remoteAddress" depending on express' trust proxy setting
 * @param {object} req - the request object
 * @returns {string} - the client ip as string
 * @private
 */
const getIpFromRequest = req => {
  const xForwardedFor = req.headers['x-forwarded-for']
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  return req.ip || 'unknown'
}

module.exports = {
  getIpFromRequest
}
