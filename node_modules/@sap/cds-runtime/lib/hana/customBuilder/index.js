const dependencies = {
  get CreateBuilder () {
    const CustomCreateBuilder = require('./CustomCreateBuilder')
    Object.defineProperty(dependencies, 'CreateBuilder', { value: CustomCreateBuilder })
    return CustomCreateBuilder
  },
  get DropBuilder () {
    const CustomDropBuilder = require('./CustomDropBuilder')
    Object.defineProperty(dependencies, 'DropBuilder', { value: CustomDropBuilder })
    return CustomDropBuilder
  },
  get SelectBuilder () {
    const CustomSelectBuilder = require('./CustomSelectBuilder')
    Object.defineProperty(dependencies, 'SelectBuilder', { value: CustomSelectBuilder })
    return CustomSelectBuilder
  },
  get ReferenceBuilder () {
    const CustomReferenceBuilder = require('./CustomReferenceBuilder')
    Object.defineProperty(dependencies, 'ReferenceBuilder', { value: CustomReferenceBuilder })
    return CustomReferenceBuilder
  }
}

module.exports = dependencies
