const cds = require('@sap/cds')

module.exports = class AdminService extends cds.ApplicationService { init(){

  /** Auto-fill integer primary keys */
  this.before (['NEW','CREATE'], ['Books','Authors'], async req => {
    const entries = Array.isArray(req.data) ? req.data : [req.data]
    if (entries.every(each => each.ID)) return
    let recent = await SELECT.one`max(ID) as ID`.from(req.target)
    let ID = entries.reduce((max, each) => Math.max(max, each.ID??0), recent.ID??0)
    for (const each of entries) each.ID ??= ++ID
  })

  return super.init()
}}
