import { DecodedJWT, JwtKeyMapping } from '../util';
/**
 * Representation of the user i.e. authenticated persona. The authentication is done by the XSUAA.
 */
export interface UserData {
    id: string;
    userName: string;
    givenName?: string;
    familyName?: string;
    email?: string;
    scopes: Scope[];
    customAttributes: Map<string, string[]>;
}
export interface User extends UserData {
    hasScope: (scope: Scope) => boolean;
}
/**
 * Mapping between key name in the User and key name in decoded JWT and the
 */
export declare const mapping: JwtKeyMapping<UserData, RegisteredJWTClaimsUser>;
/**
 * Keys in the JWT related to the user
 */
export interface RegisteredJWTClaimsUser {
    user_id?: string;
    user_name?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    scope?: string[];
    'xs.user.attributes'?: Map<string, string[]>;
}
/**
 * Representation of the scope. A scope is assigned to a user via role-collection in cloud foundry.
 */
export interface Scope {
    name: string;
}
/**
 * Creates a user object from the decoded JWT.
 *
 * @param decodedJWT - Decoded JWT toeken
 * @returns Representation of the user
 * @exception Error Raised if no id is found in the decoded JWT.
 */
export declare function userFromJwt(decodedJWT: DecodedJWT): User;
//# sourceMappingURL=user.d.ts.map