const to = service => {
  const Rest = require('./Rest')
  const rest = new Rest(service)

  return rest.router
}

module.exports = to
