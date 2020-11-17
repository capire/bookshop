'use strict'

const AbstractEdmOperation = require('./AbstractEdmOperation')

/**
 * <a href="./../ODataSpecification/odata-v4.0-errata03-os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752579">
 *     OData CSDL # 12.1 Element edm:Action
 * </a>
 *
 * @extends AbstractEdmOperation
 * @hideconstructor
 */
class EdmAction extends AbstractEdmOperation {}

module.exports = EdmAction
