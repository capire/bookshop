import { DecodedJWT } from '../util';
import { CachingOptions } from './cache';
import { Service } from './environment-accessor-types';
import { ResilienceOptions } from './resilience-options';
/**
 * Returns an access token that can be used to call the given service. The token is fetched via a client credentials grant with the credentials of the given service.
 * If multiple instances of the provided service exist, the first instance will be selected.
 * When a JWT is passed, the tenant of the JWT will be used when performing the grant.
 * When no JWT is passed, the grant will be performed using the provider tenant.
 *
 * Throws an error if there is no instance of the given service type or the XSUAA service, or if the request to the XSUAA service fails.
 *
 * @param service - The type of the service or an instance of [[Service]].
 * @param options - Options to influence caching and resilience behavior (see [[CachingOptions]] and [[ResilienceOptions]], respectively) and a JWT. By default, caching and usage of a circuit breaker are enabled.
 * @returns Access token.
 */
export declare function serviceToken(service: string | Service, options?: CachingOptions & ResilienceOptions & {
    userJwt?: string | DecodedJWT;
}): Promise<string>;
/**
 * Returns a user approved access token that can be used to call the given service on behalf of the given user. The token is fetched via user token + refresh token grant.
 * This can be necessary for scenarios in which a token for a service is required, but the service needs
 * to know about the user on whose behalf the request is performed (for example to let the destination
 * service perform principal propagation with SAP S/4HANA Cloud).
 *
 * Throws an error if there is no instance of the given service type or the XSUAA service, or if the request to the XSUAA service fails.
 *
 * @param userJwt - The JWT of the user for whom the access token should be fetched.
 * @param service - The type of the service or an instance of [[Service]].
 * @param options - Options to influence resilience behavior (see [[ResilienceOptions]]). By default, usage of a circuit breaker is enabled.
 * @returns A user approved access token.
 */
export declare function userApprovedServiceToken(userJwt: string, service: string | Service, options?: ResilienceOptions): Promise<string>;
//# sourceMappingURL=token-accessor.d.ts.map