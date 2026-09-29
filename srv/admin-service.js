import cds from '@sap/cds'
const { SELECT } = cds.ql

export class AdminService extends cds.ApplicationService { init(){
  this.before (['NEW','CREATE'], ['Books','Authors'], async req => {
    if (req.data.ID) return // skip if ID is already set
    let {id} = await SELECT.one`max(ID) as id`.from(req.target)
    req.data.ID = id + 4 // not safe, but ok for demo purposes
  })
  return super.init()
}}
