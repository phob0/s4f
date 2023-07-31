import { getUserToken } from "../pages/api/accounts/index";
import useSWR from "swr";
import useUser from "../lib/useUser";

const useGetUserToken = (user: string, token: string) => {
  const { data, error } = useSWR(
    user
      ? {
          address: user,
          token: token,
        }
      : null,
      getUserToken,
    {}
  );

  return {
    userToken: data || [],
    isLoadingUserToken: !error && !data,
    isErrorUserToken: error,
  };
};

export default useGetUserToken;
