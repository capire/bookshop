'use strict'

const CsdlExpressionKinds = require('../../csdl/annotationExpression/CsdlAnnotationExpression').kinds
const EdmAnnotationPathExpression = require('./EdmAnnotationPathExpression')
const EdmApplyExpression = require('./EdmApplyExpression')
const EdmArithmeticExpression = require('./EdmArithmeticExpression')
const EdmBinaryExpression = require('./EdmBinaryExpression')
const EdmCastExpression = require('./EdmCastExpression')
const EdmCollectionExpression = require('./EdmCollectionExpression')
const EdmConstantExpression = require('./EdmConstantExpression')
const EdmUnknownExpression = require('./EdmUnknownExpression')
const EdmIfExpression = require('./EdmIfExpression')
const EdmIsOfExpression = require('./EdmIsOfExpression')
const EdmLabeledElementExpression = require('./EdmLabeledElementExpression')
const EdmLabeledElementReferenceExpression = require('./EdmLabeledElementReferenceExpression')
const EdmModelElementPathExpression = require('./EdmModelElementPathExpression')
const EdmNavigationPropertyPathExpression = require('./EdmNavigationPropertyPathExpression')
const EdmNegationExpression = require('./EdmNegationExpression')
const EdmNotExpression = require('./EdmNotExpression')
const EdmNullExpression = require('./EdmNullExpression')
const EdmPathExpression = require('./EdmPathExpression')
const EdmPropertyPathExpression = require('./EdmPropertyPathExpression')
const EdmPropertyValueExpression = require('./EdmPropertyValueExpression')
const EdmRecordExpression = require('./EdmRecordExpression')
const EdmUrlRefExpression = require('./EdmUrlRefExpression')

/**
 * Factory to build Edm annotation expressions from Csdl annotation expressions.
 *
 * !!!This is not implemented as class and so module.exports is not reassigned. This is important to resolve
 * cyclic dependencies!!!
 */

/**
 * Builds an expression tree from nested CsdlAnnotationExpression classes.
 * The returned tree is built with nodes of type EdmAnnotationExpression.
 *
 * @param {Edm} edm the EDM itself
 * @param {CsdlAnnotationExpression} csdlExpression a valid CsdlAnnotationExpression (it must contain a kind attribute)
 * @returns {EdmAnnotationExpression} tree of EDM annotation expressions
 */
module.exports.createEdmExpressionFromCsdlExpression = function createEdmExpressionFromCsdlExpression (
  edm,
  csdlExpression
) {
  switch (csdlExpression.kind) {
    case CsdlExpressionKinds.AnnotationPath:
      return new EdmAnnotationPathExpression(csdlExpression)

    case CsdlExpressionKinds.Apply:
      return new EdmApplyExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Arithmetic:
      return new EdmArithmeticExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Binary:
      return new EdmBinaryExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Cast:
      return new EdmCastExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Collection:
      return new EdmCollectionExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Constant:
      return new EdmConstantExpression(edm, csdlExpression)

    case CsdlExpressionKinds.If:
      return new EdmIfExpression(edm, csdlExpression)

    case CsdlExpressionKinds.IsOf:
      return new EdmIsOfExpression(edm, csdlExpression)

    case CsdlExpressionKinds.LabeledElement:
      return new EdmLabeledElementExpression(edm, csdlExpression)

    case CsdlExpressionKinds.LabeledElementReference:
      return new EdmLabeledElementReferenceExpression(csdlExpression)

    case CsdlExpressionKinds.ModelElementPath:
      return new EdmModelElementPathExpression(csdlExpression)

    case CsdlExpressionKinds.NavigationPropertyPath:
      return new EdmNavigationPropertyPathExpression(csdlExpression)

    case CsdlExpressionKinds.Null:
      return new EdmNullExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Path:
      return new EdmPathExpression(csdlExpression)

    case CsdlExpressionKinds.PropertyPath:
      return new EdmPropertyPathExpression(csdlExpression)

    case CsdlExpressionKinds.PropertyValue:
      return new EdmPropertyValueExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Record:
      return new EdmRecordExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Negation:
      return new EdmNegationExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Not:
      return new EdmNotExpression(edm, csdlExpression)

    case CsdlExpressionKinds.UrlRef:
      return new EdmUrlRefExpression(edm, csdlExpression)

    case CsdlExpressionKinds.Unknown:
      return new EdmUnknownExpression(edm, csdlExpression)

    default:
      return null
  }
}

/**
 * Creates an EdmAnnotation from a given CsdlAnnotation.
 * @param {Edm} edm the EDM itself
 * @param {CsdlAnnotation} annotation CSDL annotation
 * @returns {EdmAnnotation} the EDM annotation
 */
module.exports.createAnnotation = function createAnnotation (edm, annotation) {
  // This avoids an error in the cyclic dependency chain:
  // anywhere->require('EdmAnnotation')->require('AnnotationExpressionFactory')->require('EdmAnnotation')
  // EdmAnnotation replaces module.exports which actually destroys the chain.
  const EdmAnnotation = require('../EdmAnnotation') // eslint-disable-line global-require
  return new EdmAnnotation(edm, annotation)
}
