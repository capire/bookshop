'use strict'

const EdmPrimitiveType = require('./EdmPrimitiveType')
const IllegalArgumentError = require('../errors/IllegalArgumentError')

/**
 * Enum for primitive types
 * @hideconstructor
 */
class EdmPrimitiveTypeKind {
  /**
   * @param {string} name Name
   * @returns {EdmPrimitiveType|undefined} the primitive type
   */
  static fromName (name) {
    return EdmPrimitiveTypeKind[name]
  }

  /**
   *
   * @param {string} fqn e.g. namespace.name
   * @returns {EdmPrimitiveType} the primitive type
   */
  static fromNameSpaceName (fqn) {
    if (!fqn.startsWith(EdmPrimitiveType.EDM_NAMESPACE + '.')) {
      throw IllegalArgumentError.createForIllegalInstance(fqn, 'Edm primitive type')
    }

    return this.fromName(fqn.substring(4))
  }
}

EdmPrimitiveTypeKind.Binary = new EdmPrimitiveType('Binary')
EdmPrimitiveTypeKind.Boolean = new EdmPrimitiveType('Boolean')
EdmPrimitiveTypeKind.Byte = new EdmPrimitiveType('Byte')
EdmPrimitiveTypeKind.SByte = new EdmPrimitiveType('SByte')
EdmPrimitiveTypeKind.Date = new EdmPrimitiveType('Date')
EdmPrimitiveTypeKind.DateTimeOffset = new EdmPrimitiveType('DateTimeOffset')
EdmPrimitiveTypeKind.TimeOfDay = new EdmPrimitiveType('TimeOfDay')
EdmPrimitiveTypeKind.Duration = new EdmPrimitiveType('Duration')
EdmPrimitiveTypeKind.Decimal = new EdmPrimitiveType('Decimal')
EdmPrimitiveTypeKind.Single = new EdmPrimitiveType('Single')
EdmPrimitiveTypeKind.Double = new EdmPrimitiveType('Double')
EdmPrimitiveTypeKind.Guid = new EdmPrimitiveType('Guid')
EdmPrimitiveTypeKind.Int16 = new EdmPrimitiveType('Int16')
EdmPrimitiveTypeKind.Int32 = new EdmPrimitiveType('Int32')
EdmPrimitiveTypeKind.Int64 = new EdmPrimitiveType('Int64')
EdmPrimitiveTypeKind.String = new EdmPrimitiveType('String')
EdmPrimitiveTypeKind.Stream = new EdmPrimitiveType('Stream')

// Abstract types are not supported.
// EdmPrimitiveTypeKind.Geography = new EdmPrimitiveType('Geography');
// EdmPrimitiveTypeKind.Geometry = new EdmPrimitiveType('Geometry');

EdmPrimitiveTypeKind.GeographyPoint = new EdmPrimitiveType('GeographyPoint')
EdmPrimitiveTypeKind.GeographyLineString = new EdmPrimitiveType('GeographyLineString')
EdmPrimitiveTypeKind.GeographyPolygon = new EdmPrimitiveType('GeographyPolygon')
EdmPrimitiveTypeKind.GeographyMultiPoint = new EdmPrimitiveType('GeographyMultiPoint')
EdmPrimitiveTypeKind.GeographyMultiLineString = new EdmPrimitiveType('GeographyMultiLineString')
EdmPrimitiveTypeKind.GeographyMultiPolygon = new EdmPrimitiveType('GeographyMultiPolygon')
EdmPrimitiveTypeKind.GeographyCollection = new EdmPrimitiveType('GeographyCollection')
EdmPrimitiveTypeKind.GeometryPoint = new EdmPrimitiveType('GeometryPoint')
EdmPrimitiveTypeKind.GeometryLineString = new EdmPrimitiveType('GeometryLineString')
EdmPrimitiveTypeKind.GeometryPolygon = new EdmPrimitiveType('GeometryPolygon')
EdmPrimitiveTypeKind.GeometryMultiPoint = new EdmPrimitiveType('GeometryMultiPoint')
EdmPrimitiveTypeKind.GeometryMultiLineString = new EdmPrimitiveType('GeometryMultiLineString')
EdmPrimitiveTypeKind.GeometryMultiPolygon = new EdmPrimitiveType('GeometryMultiPolygon')
EdmPrimitiveTypeKind.GeometryCollection = new EdmPrimitiveType('GeometryCollection')

module.exports = EdmPrimitiveTypeKind
