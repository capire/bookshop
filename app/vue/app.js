import { createApp, reactive, ref } from './vue.js'
import cds from './cap.js'

const { GET, POST } = cds.connect.to ('/rest/catalog')
const $ = s => document.querySelector (s)

createApp ({ setup() {

  const stars = [ '☆☆☆☆☆', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★' ]
  const books = ref([]), details = ref()
  const order = reactive({ quantity:1 })

  return { books, details, order, stars,

    async fetch (terms) {
      books.value = await GET `ListOfBooks${ terms ? `?$search=${terms}` : '' }`
    },

    async inspect (index) {
      let b = details.value = books.value [index], ID = order.book = b.ID
      Object.assign (b, await GET `Books/${ID}?$select=descr,stock`)
      setTimeout (()=> $('form > input').focus(), 11) // focus input field after rendering
      order.succeeded = order.failed = undefined // reset messages displayed before
    },

    async submitOrder() {
      order.succeeded = order.failed = undefined // reset messages displayed before
      try {
        let { book, quantity } = order
        let { stock } = await POST (`submitOrder`, { book, quantity })
        order.succeeded = `Successfully ordered ${order.quantity} item(s).`
        details.value.stock = stock
      } catch (e) {
        order.failed = e.message
        throw e
      }
    },
  }

}}) .mount('#app') .fetch() // initially fill list of books
$('#app > input').focus()
