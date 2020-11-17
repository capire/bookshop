'use strict'

const CsdlAnnotationExpression = require('../../csdl/annotationExpression/CsdlAnnotationExpression')
const EdmAnnotationExpression = require('./EdmAnnotationExpression')
const validateThat = require('../../validator/ParameterValidator').validateThat

/**
 *
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752657">
 *     OData CSDL # 14.5.8 Expression edm:NavigationPropertyPath
 * </a>
 *
 * @extends EdmAnnotationExpression
 * @hideconstructor
 */
class EdmNavigationPropertyPathExpression extends EdmAnnotationExpression {
  /**
   * Constructor
   * @param {CsdlNavigationPropertyPathExpression} navigationPropertyPath the CSDL navigation-property path
   */
  constructor (navigationPropertyPath) {
    validateThat('navigationPropertyPath', navigationPropertyPath).truthy()
    super(CsdlAnnotationExpression.kinds.NavigationPropertyPath)

    this._navigationPropertyPath = navigationPropertyPath
  }

  /**
   * Returns the path to the navigation property.
   * @returns {string} the path
   */
  getNavigationPropertyPath () {
    return this._navigationPropertyPath.navigationPropertyPath
  }
}

module.exports = EdmNavigationPropertyPathExpression
