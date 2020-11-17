module.exports = name => {
  name = Array.isArray(name) ? name[0] : name
  try {
    return require(name)
  } catch (e) {
    throw new Error(`Unable to require required package/file "${name}"`)
  }
}
