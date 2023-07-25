import {
    BytesValue,
    Address,
    AddressValue,
    BigUIntValue,
    BooleanValue,
    ContractFunction,
    Transaction,
    TransactionPayload,
    SmartContract,
    Interaction,
    Account,
    TokenTransfer,
    NothingValue,
    TokenIdentifierType
} from "@multiversx/sdk-core/out";
// import { EGLDPayment } from "api/sc/calls";
import { IScPayment } from "../types/sc.interface";
import { ScCallwithESDTNFTTransfer, ScCallwithMultiESDTNFTTransfer, ScCallwithNoTransfer } from "../../pages/api/sc/calls/index";
import BigNumber from "bignumber.js";

export const completeTasks = async (connectedUser: string) => {

    const res = await ScCallwithNoTransfer({
        workspace: "claimWsp",
        sender: connectedUser,
        funcName: "completeTasks",
        args: [],
    });

    return res;
};

export const claim = async (connectedUser: string, nft_token: string, nft_nonce: number) => {

    const res = await ScCallwithESDTNFTTransfer({
        workspace: "claimWsp",
        sender: connectedUser,
        funcName: "claim",
        token_identifier: nft_token,
        token_nonce: nft_nonce,
        args: [],
        gasLimit: 20_000_000
    });

    return res;
};

export const stake = async (connectedUser: string, nft_token: string, nft_nonce: number) => {

    const res = await ScCallwithESDTNFTTransfer({
        workspace: "gymStakingWsp",
        sender: connectedUser,
        funcName: "stake",
        token_identifier: nft_token,
        token_nonce: nft_nonce,
        args: [],
        gasLimit: 20_000_000
    });

    return res;
};

export const stakeMulti = async (connectedUser: string, nft_tokens: string[], nft_nonces: number[]) => {

    if ( nft_tokens.length != nft_nonces.length ) {
        console.log("ERROR: NFT tokens and NFT nonces have different size");
        return null;
    }

    const res = await ScCallwithMultiESDTNFTTransfer({
        workspace: "gymStakingWsp",
        sender: connectedUser,
        funcName: "stakeMulti",
        token_identifiers: nft_tokens,
        token_nonces: nft_nonces,
        args: [],
        gasLimit: 20_000_000
    });

    return res;
};

export const unstake = async (connectedUser: string, nft_token: string, nft_nonce: number) => {
    // console.log(connectedUser, nft_token, nft_nonce)
    const res = await ScCallwithNoTransfer({
        workspace: "gymStakingWsp",
        sender: connectedUser,
        funcName: "unstake",
        args: [nft_token, nft_nonce],
        gasLimit: 20_000_000
    });

    return res;
};
