import { Cache } from './cache';
import { ClientCredentials, ClientCredentialsResponse } from './xsuaa-service-types';
export declare function getGrantTokenCacheKey(url: string, credentials: ClientCredentials): string;
export declare const clientCredentialsTokenCache: {
    getGrantTokenFromCache: (url: any, credentials: ClientCredentials) => ClientCredentialsResponse | undefined;
    cacheRetrievedToken: (url: any, credentials: ClientCredentials, token: ClientCredentialsResponse) => void;
    clear: () => void;
    getCacheInstance: () => Cache<ClientCredentialsResponse>;
};
//# sourceMappingURL=client-credentials-token-cache.d.ts.map