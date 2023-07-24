import toHex from "to-hex";

export const formatTokenI = (tokenIdentifier: string): string => {
  if (!tokenIdentifier) {
    return "";
  }

  return tokenIdentifier.split("-")[0];
};

export const createIndentifierByCollectionAndNonce = (
  collection: string,
  nonce: number
): string => {
  let newNonce = toHex(nonce, { evenLength: true });

  return collection + "-" + newNonce;
};
