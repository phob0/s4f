import { getNFTs } from "../pages/api/accounts/index";
import useSWR from "swr";
import {
  BigUIntValue,
  BytesValue
} from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";


const useGetNfts = (identifiers?: string) => {
  const { data, error, isLoading } = useSWR(
      identifiers
        ? {
            identifiers,
          }
        : null,
      { fetcher: getNFTs }
    );

  return {
    nfts: data,
    isLoading: isLoading,
    isError: error,
  };
};

export default useGetNfts;
