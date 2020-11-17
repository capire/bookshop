const ReferenceBuilder = require('../../db/sql-builder').ReferenceBuilder

class CustomReferenceBuilder extends ReferenceBuilder {
  _parseReference (refArray) {
    if (refArray[0].id && refArray[0].args) {
      this._outputObj.sql.push(this._quoteElement(refArray[0].id))

      const args = Object.keys(refArray[0].args)
        .map(argKey => {
          this._outputObj.values.push(refArray[0].args[argKey].val)
          return `${argKey} => ${this._options.placeholder}`
        })
        .join(', ')

      this._outputObj.sql.push('(', args, ')')
    } else {
      this._outputObj.sql.push(refArray.map(el => this._quoteElement(el)).join('.'))
    }
  }
}

module.exports = CustomReferenceBuilder
