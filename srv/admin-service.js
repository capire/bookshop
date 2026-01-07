const cds = require('@sap/cds')

module.exports = class AdminService extends cds.ApplicationService { init(){
  this.before (['NEW','CREATE'],'Authors', genid)
  this.before (['NEW','CREATE'],'Books', genid)
  this.after('DELETE','*', keepTombstones)
  return super.init()
}}

/** Generate primary keys for target entity in request */
async function genid (req) {
  if (req.data.ID) return
  const {id} = await SELECT.one.from(req.target).columns('max(ID) as id')
  req.data.ID = id + 4 // Note: that is not safe! ok for this sample only.
}



// -----------------------------------------------------


async function keepTombstones (req) {
  if (!req.target['@delta.enabled']) return
  await INSERT.into (req.target+':tombstones') .entries (req.subject)
  const tombstone = { ...req.data, __deleted: true }
  delete tombstone.ID // let it be generated anew
}

async function keepTombstonesForAuthors (req) {
  if (!req.target['@delta.enabled']) return
  await INSERT.into ('AdminService.Authors:tombstones') .entries ({ ID: req.data.ID })
}