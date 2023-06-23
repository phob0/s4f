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
import { ScCallwithESDTNFTTransfer, ScCallwithNoTransfer } from "../../pages/api/sc/calls/index";
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
    });

    return res;
};
