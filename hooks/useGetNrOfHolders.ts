import { getNrOfHolders } from "../pages/api/accounts/index";
import useSWR from "swr";
import useUser from "../lib/useUser";

const useGetNrOfHolders = (collection: string) => {
  const { data, error } = useSWR(
    collection,
    getNrOfHolders,
    {}
  );

  return {
    nrOfHolders: data || 0,
    isLoadingNrOfHolders: !error && !data,
    isErrorNrOfHolders: error,
  };
};

export default useGetNrOfHolders;
