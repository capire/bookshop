const WHITE_LIST = [
  'zh_CN',
  'zh_HK',
  'zh_TW',
  'en_GB',
  'fr_CA',
  'pt_PT',
  'es_CO',
  'es_MX',
  'en_US_x_saptrc',
  'en_US_x_sappsd'
]
const cds = global.cds || require('@sap/cds/lib')

/**
 *
 * @param {string} lang
 * @returns {string}
 *
 * @example:
 * en
 * en-EN
 * en_EN
 * fr-CH, fr;q=0.9
 * de-DE-1996
 * sr-Lat
 * en_US_x_saptrc
 * en_US_x_sappsd
 *
 * @private
 */
const _getLanguage = (lang = '') => {
  if (WHITE_LIST.includes(lang)) {
    return lang
  }

  const [match] =
    lang
      .split(/[,;]+/)[0]
      .trim()
      .match(/^([a-z]{2}(?:[-_][A-Z][A-z]{1,2}(?:[_-][0-9]{4})?(?:[_-][a-z]+)*)?)$/) || []

  return match ? match.substring(0, 2) : undefined
}
const _getFromRequestQuery = reqQuery => {
  if (reqQuery) {
    return _getLanguage(reqQuery['sap-language'])
  }
}

const _getFromRequestHeaders = reqHeaders => {
  if (reqHeaders) {
    return _getLanguage(reqHeaders['x-sap-request-language']) || _getLanguage(reqHeaders['accept-language'])
  }
}

const _getFromRequest = req => {
  if (req) {
    return _getFromRequestQuery(req.query) || _getFromRequestHeaders(req.headers)
  }
}

const _getFromConfig = () => {
  if (cds.config.i18n) {
    return _getLanguage(cds.config.i18n.default_language)
  }
}

const _getFromOdata = odataReq => {
  if (odataReq) {
    return (
      _getLanguage(odataReq.getUriInfo().getQueryOption('sap-language')) ||
      _getLanguage(odataReq.getHeader('x-sap-request-language')) ||
      _getLanguage(odataReq.getHeader('accept-language'))
    )
  }
}
/**
 * Negotiate locale using the following priority list:
 * sap-language (Query Parameter)
 * Sap language (Header)
 * JWT (TBD)
 * Locale Header
 * Default Language from service option (defaultLocale)
 * Configuration at package.json
 * 'en'
 *
 * @param {Object} _
 * @param {string} defaultLocale
 * @returns {string}
 */
const negotiateLocale = (_, defaultLocale) => {
  return _getFromOdata(_.odataReq) || _getFromRequest(_.req) || _getLanguage(defaultLocale) || _getFromConfig() || 'en'
}

module.exports = negotiateLocale
