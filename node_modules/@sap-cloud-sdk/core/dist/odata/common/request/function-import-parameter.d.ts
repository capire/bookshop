import { EdmTypeShared } from '../edm-types';
/**
 * Internal representation of function import parameters. It adds metadata to the value.
 * @typeparam ValueT - Type of the value
 */
export declare class FunctionImportParameter<ValueT> {
    originalName: string;
    edmType: EdmTypeShared<'any'>;
    value: ValueT;
    /**
     * Creates an instance of FunctionImportParameter.
     * @param originalName - The original name of the parameter in the OData service
     * @param edmType - Original edm Type
     * @param value - Value to be used as parameter
     */
    constructor(originalName: string, edmType: EdmTypeShared<'any'>, value: ValueT);
}
/**
 * Internal representation of all parameters of a function import as a map
 * @typeparam ParametersT - External represenation of all parameters
 */
export declare type FunctionImportParameters<ParametersT> = {
    [K in keyof ParametersT]: FunctionImportParameter<ParametersT[K]>;
};
//# sourceMappingURL=function-import-parameter.d.ts.map