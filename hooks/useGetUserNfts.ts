import { getAddressNfts } from "../pages/api/accounts/index";
import useSWR from "swr";
import useUser from "../lib/useUser";

const useGetUserNfts = (user: string, collections?: string) => {
  const { data, error } = useSWR(
    user
      ? {
          address: user,
          parameters: { collections: collections },
        }
      : null,
    getAddressNfts,
    {}
  );

  return {
    nfts: data || [],
    isLoadingNfts: !error && !data,
    isErrorNfts: error,
  };
};

export default useGetUserNfts;
