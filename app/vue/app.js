import { createApp, reactive, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js"
const $ = s => document.querySelector (s)

import * as cds from '@cap.core/connect'
const { GET, POST } = await cds.connect.to `CatalogService`

createApp ({ setup() {

  const stars = [ '☆☆☆☆☆', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★' ]
  const books = ref([]), details = ref()
  const order = reactive({ quantity:1 })

  return { books, details, order, stars,

    async fetch (terms) {
      const q = GET `ListOfBooks` .orderBy `title` .limit(10)
      if (terms) q.where`$search(${terms})`
      books.value = await q
    },

    async inspect (index) {
      const {ID} = details.value = books.value [index]
      // let [{ descr, stock }] = await GET `descr, stock` .from `Books` .where `ID = ${ID}`
      // let { descr, stock } = await GET `one descr, stock from Books where ID = ${ID}`
      // let { descr, stock } = await GET `descr, stock from Books [${ID}]`
      let { descr, stock } = await GET `descr, stock` .from (`Books`,ID)
      // let { descr, stock } = await GET `Books [${ID}] { descr, stock }`
      // let { descr, stock } = await GET (`Books`,ID,`{ descr, stock }`)
      // let { descr, stock } = await GET (`Books`,ID,`descr, stock`)
      details.value.descr = descr
      details.value.stock = stock
      setTimeout (()=> $('form > input').focus(), 11) // focus input field after rendering
      order.succeeded = order.failed = undefined // reset messages displayed before
    },

    async submitOrder() {
      order.succeeded = order.failed = undefined // reset messages displayed before
      try {
        const { ID:book } = details.value, { quantity } = order
        const { stock } = await POST (`submitOrder`, { book, quantity })
        details.value.stock = stock
        order.succeeded = `Successfully ordered ${quantity} item(s).`
      } catch (e) {
        order.failed = e.message
        throw e
      }
    },
  }

}}) .mount('#app') .fetch() // initially fill list of books
$('#app > input').focus()
