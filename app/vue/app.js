import { createApp, reactive, ref } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js"
import cds from './cap.js'

const { GET, POST } = cds.connect.to ('/rest/browse')
const $ = s => document.querySelector (s)

createApp ({ setup() {

  const stars = [ '☆☆☆☆☆', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★' ]
  const books = ref([]), details = ref()
  const order = reactive({ quantity:1 })

  return { books, details, order, stars,

    async fetch (terms) {
      let q = `ListOfBooks`
      if (terms) q += `?$search=${terms}`
      books.value = await GET(q)
    },

    async inspect (index) {
      const {ID} = details.value = books.value [index]
      let { descr, stock } = await GET `Books/${ID}?$select=descr,stock`
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
        order.succeeded = `Successfully ordered ${quantity} item(s).`
        details.value.stock = stock
      } catch (e) {
        order.failed = e.message
        throw e
      }
    },
  }

}}) .mount('#app') .fetch() // initially fill list of books
$('#app > input').focus()
