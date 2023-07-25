import {
  Address,
  ContractFunction,
  TokenTransfer
} from "@multiversx/sdk-core/out";
import { ChainID } from "../../../../config/config";
import {
  WspTypes,
  getInterface,
  runTransactions
} from "../sc";
import { SmartContract, Interaction, Account} from "@multiversx/sdk-core";

/* Messages */
const defaultProcessingMessage = "Processing transaction";
const defaultPerrorMessage = "An error has occured";
const defaultSuccessMessage = "Transaction successful";
const defaulttransactionDuration = 1000 * 60 * 2;

export const ScCallwithNoTransfer = async ({
  workspace,
  sender,
  funcName,
  args = [],
  gasLimit = 50000000,
} : {
  workspace: WspTypes;
  sender: string;
  funcName: string;
  args?: any[];
  gasLimit?: number;
  amount?: number;
  bigAmount?: number;
}) => {
  let { simpleAddress } = getInterface(workspace);

  if (simpleAddress === "") {
    simpleAddress = workspace;
  }

  const senderAddress = new Address(sender);

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  let tx = interaction
    .withSender(senderAddress)
    .useThenIncrementNonceOf(new Account(senderAddress))
    .withValue(0)
    .withGasLimit(gasLimit)
    .withChainID(ChainID)
    .buildTransaction();

  let transactionInput = { transactions: [tx] };

  return await runTransactions(transactionInput);
};

// export const ScCallwithEGLDTransfer = async ({
//   workspace,
//   funcName,
//   args = [],
//   gasLimit = 50000000,
//   amount = 0,
//   bigAmount = null,
//   sender = null,
// } : {
//   workspace: WspTypes;
//   funcName: string;
//   args?: any[];
//   gasLimit?: number;
//   amount?: number;
//   bigAmount?: number | null;
//   sender?: any;
// }) => {
//   let { simpleAddress } = getInterface(workspace);

//   if (simpleAddress === "") {
//     simpleAddress = workspace;
//   }

//   const connectedAddress = store.getState().userAccount.connectedAddress;
//   const senderAddress = new Address(sender ?? connectedAddress);

//   const contract = new SmartContract({ address: new Address(simpleAddress)});
//   let interaction = new Interaction(contract, new ContractFunction(funcName), args);

//   let tx = interaction
//     .withSender(senderAddress)
//     .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
//     .withValue(bigAmount ?? amount * EGLD_VAL)
//     .withGasLimit(gasLimit)
//     .withChainID(ChainID)
//     .buildTransaction();

//   let transactionInput = { transactions: [tx] };

//   return await runTransactions(transactionInput);
// };

// export const ScCallwithESDTTransfer = async ({
//   workspace,
//   funcName,
//   token,
//   args = [],
//   gasLimit = 50000000,
//   bigAmount = null,
//   sender = null,
// } : {
//   workspace: WspTypes;
//   funcName: string;
//   token: any;
//   args?: any[];
//   gasLimit?: number;
//   bigAmount?: number | null;
//   sender?: any;
// }) => {
//   let { simpleAddress } = getInterface(workspace);

//   if (simpleAddress === "") {
//     simpleAddress = workspace;
//   }

//   const connectedAddress = store.getState().userAccount.connectedAddress;
//   const senderAddress = new Address(sender ?? connectedAddress);

//   const contract = new SmartContract({ address: new Address(simpleAddress)});
//   let interaction = new Interaction(contract, new ContractFunction(funcName), args);

//   let tx = interaction
//     .withSender(senderAddress)
//     .withSingleESDTTransfer(TokenTransfer.fungibleFromBigInteger(token.identifier, bigAmount, token.decimals))
//     .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
//     .withValue(0)
//     .withGasLimit(gasLimit)
//     .withChainID(ChainID)
//     .buildTransaction();

//   let transactionInput = { transactions: [tx] };

//   return await runTransactions(transactionInput);
// };


export const ScCallwithESDTNFTTransfer = async ({
    workspace,
    sender,
    funcName,
    token_identifier,
    token_nonce,
    args = [],
    gasLimit = 50000000,
  } : {
    workspace: WspTypes;
    sender: string;
    funcName: string;
    token_identifier: any;
    token_nonce: any;
    args?: any[];
    gasLimit?: number;
  }) => {
    let { simpleAddress } = getInterface(workspace);

    if (simpleAddress === "") {
      simpleAddress = workspace;
    }

    const senderAddress = new Address(sender);

    const contract = new SmartContract({ address: new Address(simpleAddress)});
    let interaction = new Interaction(contract, new ContractFunction(funcName), args);

    let tx = interaction
      .withSender(senderAddress)
      .withSingleESDTNFTTransfer(TokenTransfer.nonFungible(token_identifier, token_nonce))
      .withValue(0)
      .withGasLimit(gasLimit)
      .withChainID(ChainID)
      .buildTransaction();

    let transactionInput = { transactions: [tx] };

    return await runTransactions(transactionInput);
    };

export const ScCallwithMultiESDTNFTTransfer = async ({
  workspace,
  sender,
  funcName,
  token_identifiers,
  token_nonces,
  args = [],
  gasLimit = 50000000,
} : {
  workspace: WspTypes;
  sender: string;
  funcName: string;
  token_identifiers: any[];
  token_nonces: any[];
  args?: any[];
  gasLimit?: number;
}) => {
    let { simpleAddress } = getInterface(workspace);

    if (simpleAddress === "") {
      simpleAddress = workspace;
    }

    const senderAddress = new Address(sender);

    const contract = new SmartContract({ address: new Address(simpleAddress)});
    let interaction = new Interaction(contract, new ContractFunction(funcName), args);

    const tokenTransfers = [];

    for (let i = 0; i < token_identifiers.length; i++) {
      const token_identifier = token_identifiers[i];
      const token_nonce = token_nonces[i];

      // Create the TokenTransfer object and add it to the array
      const tokenTransfer = TokenTransfer.nonFungible(token_identifier, token_nonce);

      tokenTransfers.push(tokenTransfer);
    }

    // The tokenTransfers array will now contain objects in the format: TokenTransfer.nonFungible(token_identifier, token_nonce)

    let tx = interaction
      .withSender(senderAddress)
      .withMultiESDTNFTTransfer(tokenTransfers)
      .withValue(0)
      .withGasLimit(gasLimit)
      .withChainID(ChainID)
      .buildTransaction();

    let transactionInput = { transactions: [tx] };

    return await runTransactions(transactionInput);
};