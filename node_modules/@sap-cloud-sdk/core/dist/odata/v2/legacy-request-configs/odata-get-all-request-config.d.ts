import { EntityBase, Constructable } from '../../common';
import { ODataGetAllRequestConfig as Base } from '../../common/request/odata-get-all-request-config';
/**
 * @deprecated Since v1.21.0. Use superclass instead.
 * OData delete request configuration for an entity type.
 *
 * @typeparam EntityT - Type of the entity to setup a request for
 */
export declare class ODataGetAllRequestConfig<EntityT extends EntityBase> extends Base<EntityT> {
    /**
     * Creates an instance of ODataGetAllRequestConfig.
     *
     * @param _entityConstructor - Constructor type of the entity to create a configuration for
     */
    constructor(_entityConstructor: Constructable<EntityT>);
}
//# sourceMappingURL=odata-get-all-request-config.d.ts.map