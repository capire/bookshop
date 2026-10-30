import * as cds from '@cap.core/connect'
const { GET } = await cds.connect.to `CatalogService`

let [{ descr, stock }] = await GET `descr, stock` .from `Books` .where `ID = ${ID}`
let { descr, stock } = await GET `one descr, stock from Books where ID = ${ID}`
let { descr, stock } = await GET `descr, stock from Books [${ID}]`
let { descr, stock } = await GET `descr, stock` .from (`Books`,ID)
let { descr, stock } = await GET `Books [${ID}] { descr, stock }`
let { descr, stock } = await GET (`Books`,ID,`{ descr, stock }`)
let { descr, stock } = await GET (`Books`,ID,`descr, stock`)
