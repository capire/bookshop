import { EntityBase } from '../entity';
import { Orderable } from '../order';
/**
 * Get an object containing the given order bys as query parameter, or an empty object if none was given.
 *
 * @typeparam EntityT - Type of the entity to order
 * @param orderBy - A list of orderables to get the query parameters for
 * @returns An object containing the query parameter or an empty object
 */
export declare function getOrderBy<EntityT extends EntityBase>(orderBy: Orderable<EntityT>[]): Partial<{
    orderby: string;
}>;
//# sourceMappingURL=get-orderby.d.ts.map