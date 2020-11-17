const negotiateLocale = require('../../utils/locale')
const { toODataResult } = require('../utils/event')

/**
 * Provide handler for localization negotiation.
 * @param {string} defaultLocale
 * @return {Function}
 */
const negotiate = defaultLocale => {
  return (req, res, next) => {
    const _ = {
      req: req.getIncomingRequest(),
      odataReq: req
    }
    next(null, toODataResult(negotiateLocale(_, defaultLocale)))
  }
}

module.exports = negotiate
