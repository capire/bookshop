/// <reference types="node" />
import { IncomingMessage } from 'http';
import { AxiosRequestConfig } from 'axios';
import { Cache } from '../scp-cf';
import { RegisteredJWTClaimsTenant } from '../scp-cf/tenant';
import { RegisteredJWTClaimsUser, Scope } from '../scp-cf/user';
/**
 * Decode JWT.
 * @param token - JWT to be decoded
 * @returns Decoded payload.
 */
export declare function decodeJwt(token: string): DecodedJWT;
/**
 * Decode JWT and return the complete decoded token.
 * @param token - JWT to be decoded
 * @returns Decoded token containing payload, header and signature.
 */
export declare function decodeJwtComplete(token: string): CompleteDecodedJWT;
/**
 * Retrieve JWT from a request that is based on the node `IncomingMessage`. Fails if no authorization header is given or has the wrong format. Expected format is 'Bearer <TOKEN>'.
 * @param req - Request to retrieve the JWT from
 * @returns JWT found in header
 */
export declare function retrieveJwt(req: IncomingMessage): string | undefined;
/**
 * Verifies the given JWT and returns the decoded payload.
 *
 * @param token - JWT to be verified
 * @param options - Options to control certain aspects of JWT verification behavior.
 * @returns A Promise to the decoded and verified JWT.
 */
export declare function verifyJwt(token: string, options?: VerifyJwtOptions): Promise<DecodedJWT>;
/**
 * Options to control certain aspects of JWT verification behavior.
 */
export interface VerifyJwtOptions {
    cacheVerificationKeys?: boolean;
}
export declare const verificationKeyCache: Cache<unknown>;
/**
 * Verifies the given JWT with the given key and returns the decoded payload.
 *
 * @param token - JWT to be verified
 * @param key - Key to use for verification
 * @returns A Promise to the decoded and verified JWT.
 */
export declare function verifyJwtWithKey(token: string, key: string): Promise<DecodedJWT>;
/**
 * Compare two decoded JWTs based on their tenantIds.
 * @param decodedUserToken - User JWT
 * @param decodedProviderToken - Provider JWT
 * @returns Whether the tenant is identical.
 */
export declare function isIdenticalTenant(decodedUserToken: DecodedJWT, decodedProviderToken: DecodedJWT): boolean;
/**
 * Get the issuer url of a decoded JWT.
 * @param decodedToken - Token to read the issuer url from.
 * @returns The issuer url if available.
 */
export declare function issuerUrl(decodedToken: DecodedJWT): string | undefined;
/**
 * Get the user id of a decoded JWT.
 * @param decodedToken - Token to read the user id from.
 * @returns The user id if available.
 */
export declare function userId(decodedToken: DecodedJWT): string | undefined;
/**
 * Get the user's given name of a decoded JWT.
 * @param decodedToken - Token to read the user id from.
 * @returns The user id if available.
 */
export declare function userGivenName(decodedToken: DecodedJWT): string | undefined;
/**
 * Get the user's family name of a decoded JWT.
 * @param decodedToken - Token to read the user id from.
 * @returns The user id if available.
 */
export declare function userFamilyName(decodedToken: DecodedJWT): string | undefined;
/**
 * Get the user name of a decoded JWT.
 * @param decodedToken - Token to read the user id from.
 * @returns The user id if available.
 */
export declare function userName(decodedToken: DecodedJWT): string | undefined;
/**
 * Get the user's email of a decoded JWT.
 * @param decodedToken - Token to read the user id from.
 * @returns The user id if available.
 */
export declare function userEmail(decodedToken: DecodedJWT): string | undefined;
/**
 * Get the user's scopes of a decoded JWT.
 * @param decodedToken - Token to read the user id from.
 * @returns The user id if available.
 */
export declare function userScopes(decodedToken: DecodedJWT): Scope[] | [];
/**
 * Get the tenant id of a decoded JWT.
 * @param decodedToken - Token to read the tenant id from.
 * @returns The tenant id if available.
 */
export declare function tenantId(decodedToken: DecodedJWT): string | undefined;
/**
 * Extracts the custom attributes in the JWT
 * @param decodedToken - Token to read the custom attributes
 * @returns custom attributes added by the xsuaa to the issued JWT.
 */
export declare function customAttributes(decodedToken: DecodedJWT): Map<string, string[]>;
/**
 * Get the tenant name of a decoded JWT.
 * @param decodedToken - Token to read the tenant id from.
 * @returns The tenant id if available.
 */
export declare function tenantName(decodedToken: DecodedJWT): string | undefined;
/**
 * Retrieve the audiences of a decoded JWT based on the audiences and scopes in the token.
 * @param decodedToken - Token to retrieve the audiences from.
 * @returns A set of audiences.
 */
export declare function audiences(decodedToken: DecodedJWT): Set<string>;
/**
 * Wraps the access token in header's authorization.
 * @param token - Token to attach in request header
 * @returns The request header that holds the access token
 */
export declare function wrapJwtInHeader(token: string): AxiosRequestConfig;
/**
 * Interface to represent the registered claims of a JWT.
 */
export declare type RegisteredJWTClaims = RegisteredJWTClaimsBasic & RegisteredJWTClaimsUser & RegisteredJWTClaimsTenant;
/**
 * Interface to represent the basic properties like issuer, audience etc.
 */
export interface RegisteredJWTClaimsBasic {
    iss?: string;
    exp?: number;
    sub?: string;
    aud?: string[];
    nbf?: string;
    iat?: number;
    jti?: string;
}
/**
 * Interface to represent the basic properties of a jwt header
 */
export interface JWTHeader {
    alg: string;
    typ: string;
    jku?: string;
}
/**
 * @Deprecated Since v1.20.0. Use [[JWTPayload]] if you want to represent the decoded JWT payload or [[CompleteDecodedJWT]] for the full decoded object.
 * Interface to represent the payload of a JWT.
 */
export interface DecodedJWT extends RegisteredJWTClaims {
    [otherKey: string]: any;
}
/**
 * Interface to represent the payload of a JWT.
 */
export interface JWTPayload extends RegisteredJWTClaims {
    [otherKey: string]: any;
}
/**
 * Interface to represent header and  payload of a JWT.
 */
export interface CompleteDecodedJWT extends RegisteredJWTClaims {
    header: JWTHeader;
    payload: JWTPayload;
    signature: string;
}
export declare type JwtKeyMapping<TypescriptKeys, JwtKeys> = {
    [key in keyof TypescriptKeys]: {
        keyInJwt: keyof JwtKeys;
        extractorFunction: (decodedJWT: DecodedJWT) => any;
    };
};
/**
 * Checks if a given key is in the decoded JWT. If not an error is raised
 * @param key - The key of the representation in typescript
 * @param mapping - The mapping between the typescript keys and the JWT key
 * @param decodedJWT - Decoded token on which the check is done
 * @exception Error is thrown if the key is not present.
 */
export declare function checkMandatoryValue<TypeScriptKeys, JwtKeys>(key: keyof TypeScriptKeys, mapping: JwtKeyMapping<TypeScriptKeys, JwtKeys>, decodedJWT: DecodedJWT): void;
//# sourceMappingURL=jwt.d.ts.map