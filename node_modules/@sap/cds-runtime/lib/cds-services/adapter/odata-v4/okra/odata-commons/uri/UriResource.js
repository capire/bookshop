'use strict'

const EdmPrimitiveTypeKind = require('../edm/EdmPrimitiveTypeKind')

/**
 * The UriResource represents each resource segment in an OData URI.
 * @hideconstructor
 */
class UriResource {
  /**
   * Create an instance of UriResource.
   */
  constructor () {
    /**
     * @private
     */
    this._kind = null
    /**
     * @private
     */
    this._entitySet = null
    /**
     * @private
     */
    this._keyPredicates = []
    /**
     * @private
     */
    this._singleton = null
    /**
     * @private
     */
    this._property = null
    /**
     * @private
     */
    this._navigationProperty = null
    /**
     * @private
     */
    this._actionImport = null
    /**
     * @private
     */
    this._action = null
    /**
     * @private
     */
    this._functionImport = null
    /**
     * @private
     */
    this._function = null
    /**
     * @private
     */
    this._functionParameters = []
    /**
     * @private
     */
    this._target = null
    /**
     * @private
     */
    this._typeCast = null
    /**
     * @private
     */
    this._isCollection = false
    /**
     * @private
     */
    this._crossJoinEntitySets = []
    /**
     * @private
     */
    this._expression = null
    /**
     * @private
     */
    this._expressionVariableName = null
    /**
     * @private
     */
    this._expressionVariableEdmType = null
  }

  /**
   * Return the kind of this URI. This is one of UriResource.ResourceKind.
   * @returns {string} value from UriResource.ResourceKind
   */
  getKind () {
    return this._kind
  }

  /**
   * Set the current URI resource kind.
   * @param {string} kind kind from UriResource.ResourceKind to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setKind (kind) {
    this._kind = kind
    return this
  }

  /**
   * Return true if this resource is a collection.
   * @returns {boolean} true if this resource is a collection, else false
   */
  isCollection () {
    return this._isCollection
  }

  /**
   * Set the information if this resource is a collection.
   * @param {boolean} isCollection True if this resoure is a collection, else false
   * @returns {UriResource} this URI resource
   * @package
   */
  setIsCollection (isCollection) {
    this._isCollection = isCollection
    return this
  }

  /**
   * Return the current parsed EDM entity set or null if there is none.
   * @returns {?EdmEntitySet} the EDM entity set or null
   */
  getEntitySet () {
    return this._entitySet
  }

  /**
   * Set the current parsed EDM entity set.
   * @param {EdmEntitySet} entityCollection The current parsed EDM entity set
   * @returns {UriResource} this URI resource
   * @package
   */
  setEntitySet (entityCollection) {
    this._entitySet = entityCollection
    return this
  }

  /**
   * Return the current parsed EDM singleton or null if there is none.
   * @returns {?EdmSingleton} the EDM singleton or null
   */
  getSingleton () {
    return this._singleton
  }

  /**
   * Sets the current parsed EDM singleton.
   * @param {EdmSingleton} singleton The current parsed EDM singleton
   * @returns {UriResource} this URI resource
   * @package
   */
  setSingleton (singleton) {
    this._singleton = singleton
    return this
  }

  /**
   * Return the current parsed EDM action import or null if there is none.
   * @returns {?EdmActionImport} the EDM singleton or null
   */
  getActionImport () {
    return this._actionImport
  }

  /**
   * Set the current parsed EDM action import.
   * @param {EdmActionImport} actionImport The current parsed EDM action import.
   * @returns {UriResource} this URI resource
   * @package
   */
  setActionImport (actionImport) {
    this._actionImport = actionImport
    return this
  }

  /**
   * Returns the current parsed EDM action or null if there is none.
   * @returns {?EdmAction} Return the EDM action or null
   */
  getAction () {
    return this._action
  }

  /**
   * Set the current parsed EDM action.
   * @param {EdmAction} action The current parsed EDM action.
   * @returns {UriResource} this URI resource
   * @package
   */
  setAction (action) {
    this._action = action
    return this
  }

  /**
   * Return the current parsed EDM function import or null if there is none.
   * @returns {?EdmFunctionImport} the EDM function import or null
   */
  getFunctionImport () {
    return this._functionImport
  }

  /**
   * Set the current parsed EDM function import.
   * @param {EdmFunctionImport} functionImport The current parsed EDM function import
   * @returns {UriResource} this URI resource
   * @package
   */
  setFunctionImport (functionImport) {
    this._functionImport = functionImport
    return this
  }

  /**
   * Return the current parsed EDM key predicates.
   * @returns {UriParameter[]} an array of UriParameter
   */
  getKeyPredicates () {
    return this._keyPredicates
  }

  /**
   * Set the current parsed EDM key predicates.
   * @param {UriParameter[]} keyPredicates The current parsed EDM key predicates.
   * @returns {UriResource} this URI resource
   * @package
   */
  setKeyPredicates (keyPredicates) {
    this._keyPredicates = keyPredicates
    return this
  }

  /**
   * Return the current parsed EDM property or null if there is none.
   * @returns {?EdmProperty} Return the EDM function import or null
   */
  getProperty () {
    return this._property
  }

  /**
   * Set the current parsed EDM property.
   * @param {EdmProperty} property The current parsed EDM property
   * @returns {UriResource} this URI resource
   * @package
   */
  setProperty (property) {
    this._property = property
    return this
  }

  /**
   * Return the current parsed EDM function or null if there is none.
   * @returns {?EdmFunction} the EDM function or null
   */
  getFunction () {
    return this._function
  }

  /**
   * Sets the current parsed EDM function.
   * @param {EdmFunction} func The current parsed EDM function
   * @returns {UriResource} this URI resource
   * @package
   */
  setFunction (func) {
    this._function = func
    return this
  }

  /**
   * Return the current parsed EDMparameter.
   * @returns {UriParameter[]} an array of UriParameter
   */
  getFunctionParameters () {
    return this._functionParameters
  }

  /**
   * Set the current function parameters
   * @param {UriParameter[]} functionParameters The current function parameters to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setFunctionParameters (functionParameters) {
    this._functionParameters = functionParameters
    return this
  }

  /**
   * Return the corresponding EDM navigation property related to thissegment.
   * @returns {?EdmNavigationProperty} The navigation property or null
   */
  getNavigationProperty () {
    return this._navigationProperty
  }

  /**
   * Sets the corresponding EDM navigation property related to thissegment.
   * @param {EdmNavigationProperty} navProperty The navigation property to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setNavigationProperty (navProperty) {
    this._navigationProperty = navProperty
    return this
  }

  /**
   * Return the current navigation property binding target or null if there is none.
   * @returns {?(EdmEntitySet|EdmSingleton)} the current navigation property binding target.
   */
  getTarget () {
    return this._target
  }

  /**
   * Set the current navigation property binding target.
   * @param {EdmEntitySet|EdmSingleton} target The current navigation property binding target
   * @returns {UriResource} this URI resource
   * @package
   */
  setTarget (target) {
    this._target = target
    return this
  }

  /**
   * Returns the current EDM type cast or null if there is none.
   * @returns {?(EdmEntityType|EdmComplexType)} Returns the current EDM type cast or null if there is none
   */
  getTypeCast () {
    return this._typeCast
  }

  /**
   * Set the current EDM type cast.
   * @param {EdmEntityType|EdmComplexType} typeCast The type cast to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setTypeCast (typeCast) {
    this._typeCast = typeCast
    return this
  }

  /**
   * Add a cross join entity set.
   * @param {EdmEntitySet} entitySet the entity set to add
   * @returns {UriResource} this URI resource
   * @package
   */
  addCrossjoinEntitySet (entitySet) {
    this._crossJoinEntitySets.push(entitySet)
    return this
  }

  /**
   * Return the available crossjoin entitysets.
   * @returns {?(EdmEntitySet[])} Returns an array or null if never been added
   */
  getCrossjoinEntitySets () {
    return this._crossJoinEntitySets
  }

  /**
   * Return the current expression or null if there is none.
   * @returns {?Expression} the current expression or null if there is none
   */
  getExpression () {
    return this._expression
  }

  /**
   * Set the current expression.
   * @param {Expression} expression The expression to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setExpression (expression) {
    this._expression = expression
    return this
  }

  /**
   * Return the lambda variable name of the current 'any' or 'all' expression or null if there is none.
   * @returns {?string} the current lambda variable name or null if there is none
   */
  getExpressionVariableName () {
    return this._expressionVariableName
  }

  /**
   * Sets the lambda variable name of the 'any' or 'all' expression.
   * @param {string} name The name to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setExpressionVariableName (name) {
    this._expressionVariableName = name
    return this
  }

  /**
   * Return the EDM type of the current expression variable or null if there is none.
   * @returns {?EdmType} the EDM type or null if there is none
   */
  getExpressionVariableEdmType () {
    return this._expressionVariableEdmType
  }

  /**
   * Sets the EDM type of the current expression variable.
   * @param {EdmType} type The type to set
   * @returns {UriResource} this URI resource
   * @package
   */
  setExpressionVariableEdmType (type) {
    this._expressionVariableEdmType = type
    return this
  }

  /**
   * Returns the path segment identifier for this resource segment.
   * This is the identifier used within the URI.
   * Example:
   *      EsKeyNav(1)/NavPropertyAbc
   * The first resource path segment identifier would be 'EsKeyNav'.
   * The second resource path segment identifier would be NavPropertyAbc.
   *
   * @returns {?string} The path segment identifier. Returns null if type is not available.
   */
  getPathSegmentIdentifier () {
    switch (this.getKind()) {
      case UriResource.ResourceKind.ENTITY:
      case UriResource.ResourceKind.ENTITY_COLLECTION:
        return this.getEntitySet().getName()
      case UriResource.ResourceKind.SINGLETON:
        return this.getSingleton().getName()

      case UriResource.ResourceKind.ACTION_IMPORT:
        return this.getActionImport().getName()
      case UriResource.ResourceKind.FUNCTION_IMPORT:
        return this.getFunctionImport().getName()

      case UriResource.ResourceKind.NAVIGATION_TO_MANY:
      case UriResource.ResourceKind.NAVIGATION_TO_ONE:
        return this.getNavigationProperty().getName()

      case UriResource.ResourceKind.COUNT:
        return '$count'
      case UriResource.ResourceKind.REF:
      case UriResource.ResourceKind.REF_COLLECTION:
        return '$ref'
      case UriResource.ResourceKind.VALUE:
        return '$value'

      case UriResource.ResourceKind.PRIMITIVE_PROPERTY:
      case UriResource.ResourceKind.PRIMITIVE_COLLECTION_PROPERTY:
      case UriResource.ResourceKind.COMPLEX_PROPERTY:
      case UriResource.ResourceKind.COMPLEX_COLLECTION_PROPERTY:
        return this.getProperty().getName()

      case UriResource.ResourceKind.TYPE_CAST:
        return this.getTypeCast()
          .getFullQualifiedName()
          .toString()

      case UriResource.ResourceKind.BOUND_ACTION:
        return this.getAction()
          .getFullQualifiedName()
          .toString()
      case UriResource.ResourceKind.BOUND_FUNCTION:
      case UriResource.ResourceKind.UNBOUND_FUNCTION:
        return this.getFunction()
          .getFullQualifiedName()
          .toString()

      case UriResource.ResourceKind.IT_EXPRESSION:
        return '$it'
      case UriResource.ResourceKind.ROOT_EXPRESSION:
        return '$root'
      case UriResource.ResourceKind.ANY_EXPRESSION:
        return 'any'
      case UriResource.ResourceKind.ALL_EXPRESSION:
        return 'all'
      case UriResource.ResourceKind.EXPRESSION_VARIABLE:
        return this.getExpressionVariableName()

      default:
        return null
    }
  }

  /**
   * Return the EDM type of this resource or null if there is none.
   * @returns {?EdmType} the EDM type or null if there is none
   */
  getEdmType () {
    switch (this.getKind()) {
      case UriResource.ResourceKind.ENTITY:
      case UriResource.ResourceKind.ENTITY_COLLECTION:
        return this.getEntitySet().getEntityType()

      case UriResource.ResourceKind.SINGLETON:
        return this.getSingleton().getEntityType()

      case UriResource.ResourceKind.NAVIGATION_TO_ONE:
      case UriResource.ResourceKind.NAVIGATION_TO_MANY:
        return this.getNavigationProperty().getEntityType()

      case UriResource.ResourceKind.TYPE_CAST:
        return this.getTypeCast()

      case UriResource.ResourceKind.FUNCTION_IMPORT:
      case UriResource.ResourceKind.BOUND_FUNCTION:
      case UriResource.ResourceKind.UNBOUND_FUNCTION:
        return this.getFunction()
          .getReturnType()
          .getType()

      case UriResource.ResourceKind.ACTION_IMPORT:
      case UriResource.ResourceKind.BOUND_ACTION:
        return this.getAction().getReturnType()
          ? this.getAction()
            .getReturnType()
            .getType()
          : null

      case UriResource.ResourceKind.PRIMITIVE_PROPERTY:
      case UriResource.ResourceKind.PRIMITIVE_COLLECTION_PROPERTY:
      case UriResource.ResourceKind.COMPLEX_PROPERTY:
      case UriResource.ResourceKind.COMPLEX_COLLECTION_PROPERTY:
        return this.getProperty().getType()

      case UriResource.ResourceKind.ANY_EXPRESSION:
      case UriResource.ResourceKind.ALL_EXPRESSION:
        return EdmPrimitiveTypeKind.Boolean

      case UriResource.ResourceKind.EXPRESSION_VARIABLE:
      case UriResource.ResourceKind.IT_EXPRESSION:
        return this.getExpressionVariableEdmType()

      default:
        return null
    }
  }
}

/**
 * Possible URI resource kinds.
 * @enum {string}
 * @readonly
 */
UriResource.ResourceKind = {
  // Non-resource segment kinds
  SERVICE: 'SERVICE',
  METADATA: 'METADATA',
  BATCH: 'BATCH',
  CROSSJOIN: 'CROSSJOIN',
  ALL: 'ALL',
  ENTITY_ID: 'ENTITY.ID',

  // Leading segment kinds
  ENTITY: 'ENTITY',
  ENTITY_COLLECTION: 'ENTITY.COLLECTION',
  SINGLETON: 'SINGLETON',
  ACTION_IMPORT: 'ACTION.IMPORT',
  FUNCTION_IMPORT: 'FUNCTION.IMPORT',

  // Following segment kinds
  NAVIGATION_TO_MANY: 'NAVIGATION.TO.MANY',
  NAVIGATION_TO_ONE: 'NAVIGATION.TO.ONE',
  COUNT: 'COUNT',
  REF: 'REF',
  REF_COLLECTION: 'REF.COLLECTION',
  VALUE: 'VALUE',
  PRIMITIVE_PROPERTY: 'PRIMITIVE.PROPERTY',
  COMPLEX_PROPERTY: 'COMPLEX.PROPERTY',
  PRIMITIVE_COLLECTION_PROPERTY: 'PRIMITIVE.COLLECTION.PROPERTY',
  COMPLEX_COLLECTION_PROPERTY: 'COMPLEX.COLLECTION.PROPERTY',
  TYPE_CAST: 'TYPE.CAST',
  BOUND_ACTION: 'BOUND.ACTION',
  BOUND_FUNCTION: 'BOUND.FUNCTION',

  // only possible in expressions (filter/orderby)
  UNBOUND_FUNCTION: 'UNBOUND.FUNCTION',
  IT_EXPRESSION: 'IT.EXPRESSION',
  ROOT_EXPRESSION: 'ROOT.EXPRESSION',
  ANY_EXPRESSION: 'ANY.EXPRESSION',
  ALL_EXPRESSION: 'ALL.EXPRESSION',
  EXPRESSION_VARIABLE: 'EXPRESSION.VARIABLE'
}

module.exports = UriResource
