import { createApp, ref, reactive } from './vue.js'
import cds from './cap.js'

const { GET, POST } = cds.connect.to ('/hcql/catalog')
const $ = s => document.querySelector (s)

createApp ({ setup() {

  const books = ref([])
  const book = ref(undefined)
  const order = reactive({ quantity:1 })
  const message = reactive({ reset() { this.succeeded = this.failed = undefined } })
  const stars = [ '☆☆☆☆☆', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★' ]


  return { books, book, order, message, stars,

    async fetch ($) {
      books.value = await GET `ListOfBooks { *, genre.name as genre, currency.symbol as currency } ${
        $ ? `where $search('${$}')` : ''
      }`
    },

    async inspect (index) { message.reset()
      let { ID } = book.value = books.value [index]
      Object.assign (book.value, await GET `Books/${ID} { descr, stock }`)
      Object.assign (order, { book: ID, quantity: 1 }) // reset order for selected book
      setTimeout (()=> $('form > input').focus(), 11) // focus input field after rendering
    },

    async submitOrder() { message.reset()
      try {
        let { stock } = await POST (`submitOrder`, order)
        book.value.stock = stock
        message.succeeded = `Successfully ordered ${order.quantity} item(s).`
      } catch (e) {
        message.failed = e.message
        throw e
      }
    },
  }

}}) .mount('#app') .fetch() // initially fill list of books
$('#app > input').focus()
