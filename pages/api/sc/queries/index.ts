import {
    AbiRegistry,
    Address,
    ContractFunction,
    ResultsParser,
    SmartContract,
} from "@multiversx/sdk-core/out";

import { getInterface, provider, WspTypes } from "../sc";

export const scQuery = async (
    workspace: WspTypes,
    funcName = "",
    args:any = [],
    endpointDef?: string,
) => {
    try {
        
        const { address, abiUrl, implementsInterfaces } = getInterface(workspace);

        const abiRegistry = await AbiRegistry.create(abiUrl);
        const contract = new SmartContract({
            address: new Address(address),
            abi: abiRegistry,
        });
        const query = contract.createQuery({
            func: new ContractFunction(funcName),
            args: args,
        });

        const queryResponse = await provider.queryContract(query);
        const endpointDefinition = contract.getEndpoint(endpointDef || funcName);
        const parser = new ResultsParser();
        const data = parser.parseQueryResponse(queryResponse, endpointDefinition);

        return data;
    } catch (error) {
        console.log(`query error for ${funcName}  : `, error );
    }
};