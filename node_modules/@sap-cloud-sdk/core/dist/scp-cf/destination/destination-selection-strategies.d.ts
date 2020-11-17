import { AllDestinations } from './destination-accessor-types';
import { Destination } from './destination-service-types';
export declare type DestinationSelectionStrategy = (allDestinations: AllDestinations, destinationName: string) => Destination | null;
/**
 * Constraints the selection to provider destinations.
 *
 * @param allDestinations - Retrieved destinations
 * @param destinationName - Name of the destination to retrieve
 * @returns the destination to retrieve, returns null if no matched provider destination is found
 */
export declare function alwaysProvider(allDestinations: AllDestinations, destinationName: string): Destination | null;
/**
 * Constraints the selection to subscriber destinations.
 *
 * @param allDestinations - Retrieved destinations
 * @param destinationName - Name of the destination to retrieve
 * @returns the destination to retrieve, returns null if no matched subscriber destination is found
 */
export declare function alwaysSubscriber(allDestinations: AllDestinations, destinationName: string): Destination | null;
/**
 * Prioritizes the selection of subscriber destinations.
 *
 * @param allDestinations - Retrieved destinations
 * @param destinationName - Name of the destination to retrieve
 * @returns the destination to retrieve, returns null if no matched destination is found
 */
export declare function subscriberFirst(allDestinations: AllDestinations, destinationName: string): Destination | null;
/**
 * Selector of destination selection strategies. See [[alwaysProvider]], [[alwaysSubscriber]] and [[subscriberFirst]] for more information available selection strategies.
 */
export declare const DestinationSelectionStrategies: {
    alwaysProvider: typeof alwaysProvider;
    alwaysSubscriber: typeof alwaysSubscriber;
    subscriberFirst: typeof subscriberFirst;
};
//# sourceMappingURL=destination-selection-strategies.d.ts.map