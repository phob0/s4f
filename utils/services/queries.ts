import {
    Address,
    AddressValue,
    BooleanValue
} from "@multiversx/sdk-core/out";
import { scQuery } from "../../pages/api/sc/queries/index";
import { IScCanUserCompleteTasks, IScTokensInfo, IScTotalClaimed, IScUserClaimable } from "../types/sc.interface";
import BigNumber from "bignumber.js";

export const fetchTotalClaimed = async (address: string): Promise<IScTotalClaimed> => {

    if (address == "" || address == Address.Zero().toString()) {
        const finalData: IScTotalClaimed = {
            amount: 0
        };
        return finalData;
    } else {
        const scRes = await scQuery("claimWsp", "totalClaimed", [
            new AddressValue(new Address(address))
        ]);

        const data = scRes?.firstValue?.valueOf();

        const finalData: IScTotalClaimed = {
            amount: BigNumber(data.valueOf()).toNumber()
        };
    
        return finalData;
    }
};

export const fetchTokensInfo = async (): Promise<IScTokensInfo[]> => {

    const scRes = await scQuery("claimWsp", "getTokensInfo", []);

    const data = scRes?.firstValue?.valueOf();

    const finalData: IScTokensInfo[] = data.map((item: any) => {
        const data: IScTokensInfo = {
            token: item.valueOf().toString(),
        };
        return data;
    });

    return finalData;
};

export const fetchCanUserCompleteTasks = async (address: string): Promise<IScCanUserCompleteTasks> => {

    if (address == "" || address == Address.Zero().toString()) {
        const finalData: IScCanUserCompleteTasks = {
            canCompleteTasks: false
        };
        return finalData;
    } else {
        const scRes = await scQuery("claimWsp", "canUserCompleteTasks", [
            new AddressValue(new Address(address))
        ]);

        const data = scRes?.firstValue?.valueOf();

        const finalData: IScCanUserCompleteTasks = {
            canCompleteTasks: new BooleanValue(data.valueOf()).valueOf()
        };
    
        return finalData;
    }
};

export const fetchUserClaimable = async (address: string): Promise<IScUserClaimable> => {

    if (address == "" || address == Address.Zero().toString()) {
        const finalData: IScUserClaimable = {
            amount: 0
        };
        return finalData;
    } else {
        const scRes = await scQuery("claimWsp", "getUserClaimable", [
            new AddressValue(new Address(address))
        ]);

        const data = scRes?.firstValue?.valueOf();

        const finalData: IScUserClaimable = {
            amount: BigNumber(data.valueOf()).toNumber()
        };
    
        return finalData;
    }
};