const cds = require('@sap/cds')

class CatalogService extends cds.ApplicationService { init() {

  const { Books } = cds.entities ('sap.capire.bookshop')
  const { ListOfBooks } = this.entities

  // Add some discount for overstocked books
  this.after('each', ListOfBooks, book => {
    if (book.stock > 111) book.title += ` -- 11% discount!`
  })

  // Reduce stock of ordered books if available stock suffices
  this.on ('submitOrder', async req => {

    // Try to reduce the stock of the ordered book, the good case
    let { book:id, quantity=1 } = req.data
    let { affected } = await UPDATE (Books,id)
      .with `stock = stock - ${quantity}`
      .where `stock >= ${quantity}`
    if (affected) return //> done, the update was successful

    // The update failed, let's check why, and respond accordingly...
    let exists = await SELECT.one`stock`.from(Books,id)
    if (!exists) req.error (404, `Book #${id} doesn't exist`)
    else req.error (409, `${quantity} exceeds stock for book #${id}`, { id, quantity, ...exists })
  })

  // Delegate requests to the underlying generic service
  return super.init()
}}

module.exports = CatalogService
