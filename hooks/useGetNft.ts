import { getNft } from "../pages/api/accounts/index";
import useSWR from "swr";
import {
  BigUIntValue,
  BytesValue
} from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";

const useGeNft = (token: string, nonce: number) => {
  let identifier = token;
  let nonce_hex = (new BigNumber(nonce)).toString(16);

  if (nonce_hex.length % 2 == 1) {
    nonce_hex = '0' + nonce_hex
  }

  identifier += "-" + nonce_hex;

  const { data, error } = useSWR(
    identifier
      ? {
          identifier: identifier
        }
      : null,
    getNft,
    {}
  );

  return {
    nft: data || [],
    isLoadingNft: !error && !data,
    isErrorNft: error,
  };
};

export default useGeNft;
