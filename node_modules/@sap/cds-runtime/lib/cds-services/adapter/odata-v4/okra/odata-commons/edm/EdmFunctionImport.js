'use strict'

const AbstractEdmOperationImport = require('./AbstractEdmOperationImport')

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752614">
 *     OData CSDL # 13.6 Element edm:FunctionImport
 * </a>
 *
 * @extends AbstractEdmOperationImport
 * @hideconstructor
 */
class EdmFunctionImport extends AbstractEdmOperationImport {
  /**
   * Constructor
   * @param {Edm} edm the EDM
   * @param {EdmEntityContainer} container the entity container
   * @param {CsdlFunctionImport} functionImport the CSDL function import
   */
  constructor (edm, container, functionImport) {
    super(edm, container, functionImport)
    this._functionImport = functionImport
  }

  /**
   * Return full qualified name of the function import's function.
   * @returns {FullQualifiedName} the full-qualified name of the function
   */
  getFunctionFqn () {
    return this._functionImport.functionName
  }

  /**
   * Return unbound function for given parameter names.
   * @param {string[]} parameterNames the parameter names
   * @returns {EdmFunction} the function
   */
  getUnboundFunction (parameterNames) {
    return this.edm.getUnboundFunction(this.getFunctionFqn(), parameterNames)
  }

  /**
   * Return all unbound functions.
   * @returns {EdmFunction[]} the functions
   */
  getUnboundFunctions () {
    return this.edm.getUnboundFunctions(this.getFunctionFqn())
  }

  /**
   * If true the function import is included in the service document
   * @returns {boolean} whether to include the function import in the service document
   */
  isIncludeInServiceDocument () {
    return this._functionImport.includeInServiceDocument
  }
}

module.exports = EdmFunctionImport
