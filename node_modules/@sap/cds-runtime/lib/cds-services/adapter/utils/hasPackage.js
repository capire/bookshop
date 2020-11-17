const hasPackage = name => {
  try {
    require.resolve(name)
    return true
  } catch (err) {
    return false
  }
}

module.exports = hasPackage
