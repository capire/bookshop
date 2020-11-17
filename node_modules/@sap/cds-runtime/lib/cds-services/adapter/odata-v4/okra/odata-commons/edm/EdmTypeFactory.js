'use strict'

const EdmPrimitiveType = require('./EdmPrimitiveType')
const EdmPrimitiveTypeKind = require('./EdmPrimitiveTypeKind')
const EdmVocabularyTermType = require('./EdmVocabularyTermType')

class EdmTypeFactory {
  /**
   * Performs an EDM look-up for the type described by 'fullQualifiedName'.
   * Supported EDM types are: {@link EdmPrimitiveType}, {@link EdmVocabularyTermType},
   * {@link EdmEntityType}, {@link EdmComplexType}, {@link EdmTypeDefinition}, and {@link EdmEnumType}.
   *
   * @param {Edm} edm The EDM itself
   * @param {FullQualifiedName} fullQualifiedName qualified name of the type to be searched
   * @returns {?EdmType} the EDM type
   */
  static createTypeFromFQN (edm, fullQualifiedName) {
    return fullQualifiedName.namespace === EdmPrimitiveType.EDM_NAMESPACE
      ? EdmPrimitiveTypeKind.fromName(fullQualifiedName.name) || EdmVocabularyTermType.fromName(fullQualifiedName.name)
      : edm.getEntityType(fullQualifiedName) ||
          edm.getComplexType(fullQualifiedName) ||
          edm.getTypeDefinition(fullQualifiedName) ||
          edm.getEnumType(fullQualifiedName) ||
          null
  }
}

module.exports = EdmTypeFactory
