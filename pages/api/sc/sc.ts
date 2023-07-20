import { ChainID, contractAddress, network } from "../../../config/config";
import { Address, Transaction } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

//abis import
import claimAbi from "../../../claim.abi.json";
import gymStakingAbi from "../../../gymstaking.abi.json";

/* Queries */
export const provider = new ProxyNetworkProvider(network.gatewayAddress, {
    timeout: 30000,
});

export const abiPath = "/api";

/* Messages */
const defaultProcessingMessage = "Processing transaction";
const defaultPerrorMessage = "An error has occured";
const defaultSuccessMessage = "Transaction successful";
const defaulttransactionDuration = 1000 * 60;

export const EGLD_VAL = 1000000000000000000;

/* Calls */
export const runTransactions = async ({
    transactions,
    processingMessage = null,
    errorMessage = null,
    successMessage = null,
    transactionDuration = null,
}: {
    transactions: any;
    processingMessage?: string | null;
    errorMessage?: string | null;
    successMessage?: string | null;
    transactionDuration?: number | null;
}) => {
  
    const res = await sendTransactions({
      transactions: transactions,
      transactionsDisplayInfo: {
        processingMessage: processingMessage || defaultProcessingMessage,
        errorMessage: errorMessage || defaultPerrorMessage,
        successMessage: successMessage || defaultSuccessMessage,
        transactionDuration: transactionDuration || 60000,
      },
    });

    return res;
};

export type WspTypes = 
            | "claimWsp"
            | "gymStakingWsp"

export const getInterface = (workspace: WspTypes) => {

    let address = Address.Zero();
    // let address = contractAddress.claim;
    let abiUrl: any = null;
    let implementsInterfaces = "";
    let simpleAddress = "";

    switch (workspace) {
        case "claimWsp":
            simpleAddress = contractAddress.claim;
            address = new Address(simpleAddress);
            abiUrl = claimAbi;
            implementsInterfaces = "ClaimWsp";
            break;
        case "gymStakingWsp":
            simpleAddress = contractAddress.gymStaking;
            address = new Address(simpleAddress);
            abiUrl = gymStakingAbi;
            implementsInterfaces = "GymStakingWsp";
            break;

        default:
            break;
    }

    return { address, abiUrl, implementsInterfaces, simpleAddress };
}