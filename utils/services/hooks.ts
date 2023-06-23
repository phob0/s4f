import { IScCanUserCompleteTasks, IScTokensInfo, IScTotalClaimed, IScUserClaimable } from "../types/sc.interface";
import useSwr from "swr";
import { fetchCanUserCompleteTasks, fetchTokensInfo, fetchTotalClaimed, fetchUserClaimable } from "./queries";


export const useGetTotalClaimed = (address: string) => {

    const {
        data: amount,
        isLoading,
        error,
    } = useSwr<IScTotalClaimed>(
        `claimWsp:totalClaimed:${address}`,
        async () => {
            return await fetchTotalClaimed(address);
        },
        {
            fallbackData: {
                amount: 0
            },
        }
    );

    return {
        totalClaimed: amount,
        isLoadingTotalClaimed: isLoading,
        errorTotalClaimed: error,
    };
};

export const useGetTokensInfo = () => {

    const {
        data: tokensInfo,
        isLoading,
        error,
    } = useSwr<IScTokensInfo[]>(
        `claimWsp:getTokensInfo`,
        async () => {
            return await fetchTokensInfo();
        },
        {
            fallbackData: [],
        }
    );

    return {
        tokensInfo: tokensInfo,
        isLoadingTokensInfo: isLoading,
        errorTokensInfo: error,
    };
};

export const useGetCanUserCompleteTasks = (address: string) => {

    const {
        data: canCompleteTasks,
        isLoading,
        error,
    } = useSwr<IScCanUserCompleteTasks>(
        `claimWsp:canUserCompleteTasks:${address}`,
        async () => {
            return await fetchCanUserCompleteTasks(address);
        },
        {
            fallbackData: {
                canCompleteTasks: false
            },
        }
    );

    return {
        canCompleteTasks: canCompleteTasks,
        isLoadingCanCompleteTasks: isLoading,
        errorCanCompleteTasks: error,
    };
};

export const useGetUserClaimable = (address: string) => {

    const {
        data: userClaimable,
        isLoading,
        error,
    } = useSwr<IScUserClaimable>(
        `claimWsp:getUserClaimable:${address}`,
        async () => {
            return await fetchUserClaimable(address);
        },
        {
            fallbackData: {
                amount: 0
            },
        }
    );

    return {
        userClaimable: userClaimable,
        isLoadingUserClaimable: isLoading,
        errorUserClaimable: error,
    };
};