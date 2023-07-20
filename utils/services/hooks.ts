import { IScCanUserCompleteTasks, IScTokensInfo, IScTotalClaimed, IScUnbondingDuration, IScUserClaimable, IScUserStakedInfo, OwnedSFIT } from "../types/sc.interface";
import useSwr from "swr";
import { fetchCanUserCompleteTasks, fetchTokensInfo, fetchTotalClaimed, fetchUserClaimable, fetchSFITToken, fetchAllowedGymNfts, fetchUnbondingDuration, fetchUserStakedInfo } from "./queries";


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

// export const useGetOwnedSFIT = (address: string) => {

//     const {
//         data: fetchSFITToken,
//         isLoading,
//         error,
//     } = useSwr<OwnedSFIT>(
//         `claimWsp:sfitToken:${address}`,
//         async () => {
//             return await fetchSFITToken(address);
//         },
//         {
//             fallbackData: {
//                 token: ''
//             },
//         }
//     );

//     return {
//         fetchSFITToken: fetchSFITToken,
//         isLoadingSFITToken: isLoading,
//         errorSFITToken: error,
//     };
// };

export const useGetAllowedGymNfts = () => {

    const {
        data: allwedGymNfts,
        isLoading,
        error,
    } = useSwr<IScTokensInfo[]>(
        `gymStakingWsp:allowedGymNfts`,
        async () => {
            return await fetchAllowedGymNfts();
        },
        {
            fallbackData: [],
        }
    );

    return {
        gymNftsInfo: allwedGymNfts,
        isLoadingGymNftsInfo: isLoading,
        errorGymNftsInfo: error,
    };
};

export const useGetUnbondingDuration = () => {

    const {
        data: unbondingDuration,
        isLoading,
        error,
    } = useSwr<IScUnbondingDuration>(
        `gymStakingWsp:unbondingDuration`,
        async () => {
            return await fetchUnbondingDuration();
        },
        {
            fallbackData: {
                seconds: 0
            },
        }
    );

    return {
        unbondingDuration: unbondingDuration,
        isLoadingUnbondingDuration: isLoading,
        errorUnbondingDuration: error,
    };
};

export const useGetUserStakedInfo = (address: string) => {

    const {
        data: userStakedInfo,
        isLoading,
        error,
    } = useSwr<IScUserStakedInfo[]>(
        `gymStakingWsp:getUserStakedInfo:${address}`,
        async () => {
            return await fetchUserStakedInfo();
        },
        {
            fallbackData: [],
        }
    );

    return {
        userStakedInfo: userStakedInfo,
        isLoadingUserStakedInfo: isLoading,
        errorUserStakedInfo: error,
    };
};