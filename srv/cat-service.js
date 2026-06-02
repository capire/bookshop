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
    let { book:id, quantity } = req.data
    if (quantity < 1) return req.error (400, `quantity has to be 1 or more`)
    let {affected} = await UPDATE (Books,id)
      .with `stock = stock - ${quantity}`
      .where `stock >= ${quantity}`
    if (affected) return //> update was successful, so we are done
    else if (!cds.db.exists(Books,id)) req.error (404, `Book #${id} doesn't exist`)
    else req.error (409, `${quantity} exceeds stock for book #${id}`)
  })

  // Delegate requests to the underlying generic service
  return super.init()
}}

module.exports = CatalogService
