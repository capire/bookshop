'use strict'

const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752658">
 *     OData CSDL # 14.5.12 Expression edm:Path
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmPathExpression extends EdmAnnotationExpression {
  /**
   * Constructor
   * @param {CsdlPathExpression} path the CSDL path
   */
  constructor (path) {
    validateThat('path', path).truthy()

    super(CsdlAnnotationExpression.kinds.Path)

    this._path = path
  }

  /**
   * Returns the path to the referenced EDM artifact.
   * @returns {string} the path
   */
  getPath () {
    return this._path.path
  }
}

module.exports = EdmPathExpression
