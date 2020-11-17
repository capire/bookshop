'use strict'

const AbstractEdmBindingTarget = require('./AbstractEdmBindingTarget')

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752604">
 *     OData CSDL # 13.3 Element edm:Singleton
 * </a>
 *
 * @extends AbstractEdmBindingTarget
 * @hideconstructor
 */
class EdmSingleton extends AbstractEdmBindingTarget {}

module.exports = EdmSingleton
