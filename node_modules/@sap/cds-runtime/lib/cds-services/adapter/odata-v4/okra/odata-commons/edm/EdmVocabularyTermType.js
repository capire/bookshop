'use strict'

const EdmType = require('./EdmType')
const EdmPrimitiveType = require('./EdmPrimitiveType')
const FullQualifiedName = require('../FullQualifiedName')

/**
 * Represents a type that can only be used for vocabulary terms.
 * @extends EdmType
 * @hideconstructor
 */
class EdmVocabularyTermType extends EdmType {
  /**
   * Constructor
   * @param {string} name the name
   */
  constructor (name) {
    super(new FullQualifiedName(EdmPrimitiveType.EDM_NAMESPACE, name), EdmType.TypeKind.VOCABULARY_TERM)
  }

  /**
   * @param {string} name name
   * @returns {undefined|EdmVocabularyTermType} the created type
   */
  static fromName (name) {
    return EdmVocabularyTermType[name]
  }

  /**
   * @returns {string} a string representation
   */
  toString () {
    return EdmPrimitiveType.EDM_NAMESPACE + '.' + this.getName()
  }
}

EdmVocabularyTermType.AnnotationPath = new EdmVocabularyTermType('AnnotationPath')
EdmVocabularyTermType.PropertyPath = new EdmVocabularyTermType('PropertyPath')
EdmVocabularyTermType.NavigationPropertyPath = new EdmVocabularyTermType('NavigationPropertyPath')

module.exports = EdmVocabularyTermType
