const { COMMON, ODATA } = require('../constants/annotation')
const cds = global.cds || require('@sap/cds/lib')

const isDraftEnabled = entity => {
  return (
    entity &&
    typeof entity === 'object' &&
    Boolean(entity[ODATA.DRAFT] || entity[COMMON.DRAFT_ROOT.PREP_ACTION] || entity[COMMON.DRAFT_NODE.PREP_ACTION])
  )
}

const _4sqlite = cds.env.i18n ? cds.env.i18n.for_sqlite || [] : []
const localized = []
_4sqlite.forEach(lang => {
  localized.push(`localized.${lang}`)
  localized.push(`localized_${lang}`)
})
localized.push('localized')

const ensureUnlocalized = table => {
  const localizedPrefix = localized.find(element => {
    return table.startsWith(element)
  })
  return localizedPrefix ? table.substring(localizedPrefix.length + 1) : table
}

const ensureDraftsSuffix = name => {
  if (name.endsWith('_drafts')) {
    return name
  }

  return `${ensureUnlocalized(name)}_drafts`
}

const ensureNoDraftsSuffix = name => name.replace(/_drafts$/, '')

module.exports = {
  isDraftEnabled,
  ensureUnlocalized,
  ensureDraftsSuffix,
  ensureNoDraftsSuffix
}
