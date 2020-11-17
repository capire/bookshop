'use strict'

const commons = require('../odata-commons')

module.exports = {
  FullQualifiedName: commons.FullQualifiedName,
  edm: {
    EdmTypeKind: commons.edm.EdmType.TypeKind,
    EdmPrimitiveTypeKind: commons.edm.EdmPrimitiveTypeKind
  },
  uri: {
    UriResource: commons.uri.UriResource,
    Expression: commons.uri.Expression,
    BinaryExpression: commons.uri.BinaryExpression,
    UnaryExpression: commons.uri.UnaryExpression,
    MethodExpression: commons.uri.MethodExpression,
    Transformation: commons.uri.apply.Transformation,
    BottomTopTransformation: commons.uri.apply.BottomTopTransformation,
    AggregateExpression: commons.uri.apply.AggregateExpression
  },
  QueryOptions: commons.uri.UriInfo.QueryOptions,
  HttpMethods: commons.http.HttpMethod.Methods,
  HttpStatusCodes: commons.http.HttpStatusCode.StatusCodes,
  PreferenceReturnValues: commons.http.Preferences.ReturnValues,
  ContentTypes: commons.format.ContentTypeInfo.ContentTypes,
  RepresentationKinds: commons.format.RepresentationKind.Kinds,

  ServiceFactory: require('./ServiceFactory'), // eslint-disable-line global-require
  ApplicationError: require('./errors/ApplicationError'), // eslint-disable-line global-require
  Components: require('./core/ComponentManager').Components, // eslint-disable-line global-require
  BatchExitHandler: require('./batch/BatchExitHandler') // eslint-disable-line global-require
}
