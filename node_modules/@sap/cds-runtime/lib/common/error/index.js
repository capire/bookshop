const entry = require('./entry')

module.exports = (...args) => {
  const e = entry(...args)
  if (e instanceof Error) return e
  return Object.assign(new Error(e.message), e)
}
