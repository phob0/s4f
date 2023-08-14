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
import { ScCallwithESDTNFTTransfer, ScCallwithESDTTransfer, ScCallwithMultiESDTNFTTransfer, ScCallwithNoTransfer } from "../../pages/api/sc/calls/index";
import BigNumber from "bignumber.js";

export const completeTasks = async (connectedUser: string) => {

    const res = await ScCallwithNoTransfer({
        workspace: "claimWsp",
        sender: connectedUser,
        funcName: "completeTasks",
        args: [],
        gasLimit: 6_000_000
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
        gasLimit: 8_000_000
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
        gasLimit: 10_000_000
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
        gasLimit: 10_000_000
    });

    return res;
};

export const unstake = async (connectedUser: string, nft_token: string, nft_nonce: number) => {
    const res = await ScCallwithNoTransfer({
        workspace: "gymStakingWsp",
        sender: connectedUser,
        funcName: "unstake",
        args: [
            BytesValue.fromUTF8(nft_token),
            new BigUIntValue(new BigNumber(nft_nonce))
        ],
        gasLimit: 10_000_000
    });

    return res;
};

export const unstakeMulti = async (connectedUser: string, nft_token: string, nft_nonces: number[]) => {

    const nonces = nft_nonces.map((nonce) => {
        return new BigUIntValue(new BigNumber(nonce));
    });

    const res = await ScCallwithNoTransfer({
        workspace: "gymStakingWsp",
        sender: connectedUser,
        funcName: "unstakeMulti",
        args: [
            BytesValue.fromUTF8(nft_token),
            ...nft_nonces.map((nonce) => new BigUIntValue(new BigNumber(nonce)))
        ],
        gasLimit: 10_000_000
    });

    return res;
};

export const depositRewards = async (connectedUser: string, token: string, bigAmount: number) => {

    const res = await ScCallwithESDTTransfer({
        workspace: "claimWsp",
        sender: connectedUser,
        funcName: "deposit",
        token_identifier: token,
        bigAmount: bigAmount,
        args: [],
        gasLimit: 10_000_000
    });

    return res;
};