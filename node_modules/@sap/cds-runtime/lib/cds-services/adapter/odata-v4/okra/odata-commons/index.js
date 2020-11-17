'use strict'
/* eslint-disable global-require */

module.exports = {
  FullQualifiedName: require('./FullQualifiedName'),
  FeatureSupport: require('./FeatureSupport'),
  csdl: {
    CsdlJsonProvider: require('./csdl/CsdlJsonProvider'),
    annotationExpression: {
      CsdlAnnotationExpression: require('./csdl/annotationExpression/CsdlAnnotationExpression')
    }
  },
  edm: {
    EdmProvider: require('./edm/EdmProvider'),
    EdmType: require('./edm/EdmType'),
    EdmPrimitiveType: require('./edm/EdmPrimitiveType'),
    EdmPrimitiveTypeKind: require('./edm/EdmPrimitiveTypeKind')
  },
  errors: {
    IllegalArgumentError: require('./errors/IllegalArgumentError'),
    AbstractError: require('./errors/AbstractError'),
    NotImplementedError: require('./errors/NotImplementedError'),
    UriSyntaxError: require('./errors/UriSyntaxError'),
    UriSemanticError: require('./errors/UriSemanticError'),
    UriQueryOptionSemanticError: require('./errors/UriQueryOptionSemanticError')
  },
  format: {
    RepresentationKind: require('./format/RepresentationKind'),
    ContentTypeInfo: require('./format/ContentTypeInfo'),
    JsonContentTypeInfo: require('./format/JsonContentTypeInfo'),
    JsonFormat: require('./format/JsonFormat')
  },
  http: {
    HttpStatusCode: require('./http/HttpStatusCode'),
    HttpMethod: require('./http/HttpMethod'),
    HttpHeader: require('./http/HttpHeader'),
    HttpHeaderReader: require('./http/HttpHeaderReader'),
    Preferences: require('./http/Preferences')
  },
  logging: {
    LoggerFacade: require('./logging/LoggerFacade')
  },
  uri: {
    UriParser: require('./uri/UriParser'),
    UriHelper: require('./uri/UriHelper'),
    UriResource: require('./uri/UriResource'),
    UriInfo: require('./uri/UriInfo'),
    UriParameter: require('./uri/UriParameter'),
    ExpandItem: require('./uri/ExpandItem'),
    SelectItem: require('./uri/SelectItem'),
    Expression: require('./uri/Expression'),
    BinaryExpression: require('./uri/BinaryExpression'),
    UnaryExpression: require('./uri/UnaryExpression'),
    MethodExpression: require('./uri/MethodExpression'),
    apply: {
      Transformation: require('./uri/apply/Transformation'),
      AggregateExpression: require('./uri/apply/AggregateExpression'),
      BottomTopTransformation: require('./uri/apply/BottomTopTransformation')
    }
  },
  utils: {
    PrimitiveValueDecoder: require('./utils/PrimitiveValueDecoder'),
    PrimitiveValueEncoder: require('./utils/PrimitiveValueEncoder')
  },
  validator: {
    ParameterValidator: require('./validator/ParameterValidator'),
    ValueValidator: require('./validator/ValueValidator')
  }
}
