export interface ResilienceOptions {
    /**
     * A boolean value that indicates whether to execute request to SCP-CF services using circuit breaker.
     */
    enableCircuitBreaker?: boolean;
}
export declare const circuitBreakerDefaultOptions: {
    timeout: number;
    errorThresholdPercentage: number;
    resetTimeout: number;
};
//# sourceMappingURL=resilience-options.d.ts.map