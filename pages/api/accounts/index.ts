import axios from "axios";
import { network } from "../../../config/config";
import { IElrondNFT } from "@/utils/types/sc.interface";
const BASE_URL = network.apiAddress;

const axiosLink = axios.create({
  baseURL: BASE_URL,
});

export const getNfts = async ({
  address,
  parameters,
}: {
  address: string;
  parameters?: {
    collections?: string;
    size?: number;
  };
}) => {
  const res = await axiosLink.get<IElrondNFT[]>(`/accounts/${address}/nfts`, {
    params: {
      size: parameters?.size || 1000,
      ...parameters,
    },
  });
  return res.data;
};
