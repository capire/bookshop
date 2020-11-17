import { DecodedJWT, JwtKeyMapping } from '../util';
/**
 * Mapping between key name in the Tenant and key name in decoded JWT and the
 */
export declare const mapping: JwtKeyMapping<Tenant, RegisteredJWTClaimsTenant>;
/**
 * Keys in the JWT related to the user
 */
export interface RegisteredJWTClaimsTenant {
    zid?: string;
    zdn?: string;
}
/**
 * Representation of the tenant. A tenant represents the customer account on cloud foundry.
 */
export interface Tenant {
    id: string;
    name?: string;
}
/**
 * Creates a tenant object from the decoded JWT.
 *
 * @param decodedJWT - Decoded JWT token
 * @returns Representation of the tenant.
 * @exception Error Raised if no id is found in the decoded JWT.
 */
export declare function tenantFromJwt(decodedJWT: DecodedJWT): Tenant;
//# sourceMappingURL=tenant.d.ts.map