import axios from "axios";
import { network } from "../../../config/config";
import { IElrondNFT } from "@/utils/types/sc.interface";
const BASE_URL = network.apiAddress;

const axiosLink = axios.create({
  baseURL: BASE_URL,
});

export const getAddressNfts = async ({
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

export const getNft = async ({
  identifier,
}: {
  identifier: string;
}) => {
  const res = await axiosLink.get<IElrondNFT[]>(`/nfts/${identifier}`);
  return res.data;
};

export const getNFTs = async ({
  size = 10000,
  name = undefined,
  identifier = undefined,
  identifiers = undefined,
  search = undefined,
}) => {
  const res = await axiosLink.get<IElrondNFT[]>("/nfts", {
    params: {
      identifier,
      identifiers,
      name,
      size,
      search,
    },
  });

  return res.data;
};


export const getUserToken = async ({
  address,
  token
}: {
  address: string;
  token: string;
}) => {
  
  const res = await axiosLink.get(`/accounts/${address}/tokens`, {
  params: {
    identifier: token
  }});

  return res.data;
}

export const getNrOfHolders = async ({
  collection = undefined
}) => {
  try {
    const res = await axiosLink.get(`/collections/${collection}`);

    return res.data.holderCount || 0;
  } catch (error) {
    return 0;
  }
};
