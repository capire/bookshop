/**
 * Converts a string to the case used by static methods on entity classes. Use this for serialization.
 *
 * @param str - The string to be transformed.
 * @returns The input string in the case used by static methods on entity-classes.
 */
export declare function toStaticPropertyFormat(str: string): string;
/**
 * Converts a string to the format used by properties. Use this for serialization.
 *
 * @param str - The string to be transformed.
 * @returns The transformed string.
 */
export declare function toPropertyFormat(str: string): string;
/**
 * Converts a string to PascalCase format e.g. "MyNameInPascalCase".
 *
 * @param str - The string to be transformed.
 * @returns The transformed string.
 */
export declare function toPascalCase(str: string): string;
/**
 * Converts a string to a human readable format, e.g. it transforms `to_BusinessPartner` to `To Business Partner`. Use this for serialization.
 *
 * @param str - The string to be transformed.
 * @returns The transformed string.
 */
export declare function toTitleFormat(str: string): string;
/**
 * Converts a string to the format used by properties. Use this for serialization.
 * @param str - The string to be transformed.
 * @returns The transformed string.
 */
export declare function toTypeNameFormat(str: string): string;
//# sourceMappingURL=name-converter.d.ts.map