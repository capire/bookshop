const CreateBuilder = require('../../db/sql-builder').CreateBuilder

class CustomCreateBuilder extends CreateBuilder {
  get SelectBuilder () {
    const SelectBuilder = require('./CustomSelectBuilder')
    Object.defineProperty(this, 'SelectBuilder', { value: SelectBuilder })
    return SelectBuilder
  }
}

module.exports = CustomCreateBuilder
