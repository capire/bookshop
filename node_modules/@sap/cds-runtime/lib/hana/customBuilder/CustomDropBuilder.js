const DropBuilder = require('../../db/sql-builder').DropBuilder

class CustomDropBuilder extends DropBuilder {
  /**
   * IF EXISTS is not supported by HANA so we need to overwrite this method so it does not return anything.
   * @private
   */
  _ifExists () {}
}

module.exports = CustomDropBuilder
