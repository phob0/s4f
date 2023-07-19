export interface IScPayment {
    token: string;
    nonce: number;
    amount: number;
}

export interface IScTotalClaimed {
  amount: number;
}

export interface IScTokensInfo {
  token: string;
}

export interface IScCanUserCompleteTasks {
  canCompleteTasks: boolean;
}

export interface IScUserClaimable {
  amount: number;
}

export interface OwnedSFIT {
  token: string;
}

type ElrondType =
  | "NonFungibleESDT"
  | "SemiFungibleESDT"
  | "MetaESDT "
  | "FungibleESDT";

interface IElrondSocial {
  blog?: string;
  twitter?: string;
  whitepaper?: string;
  discord?: string;
  telegram?: string;
}

export interface IElrondNFT {
  identifier: string;
  collection: string;
  timestamp: number;
  attributes: string;
  nonce: number;
  type: ElrondType;
  name: string;
  creator: string;
  royalties?: number;
  uris?: string[];
  url: string;
  media?: {
    url: string;
    fileSize?: number;
    fileType?: string;
    originalUrl?: string;
    thumbnailUrl?: string;
  }[];
  isWhitelistedStorage?: boolean;
  metadata?: {
    description: string;
    compiler?: string;
    attributes?: any[];
  };
  supply?: string;
  ticker: string;
  rarities?: any;

  thumbnailUrl?: string;
  tags?: string[];

  owner?: string;
  balance?: string;
  decimals?: number;
  assets: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
    ledgerSignature?: string;
    lockedAccounts?: string;
    extraTokens?: string[];
    preferredRankAlgorithm?: string;

    social?: IElrondSocial;
  };
  scamInfo?: {
    type?: string;
    info: string;
  };
  score?: number;
  rank?: number;

  isNsfw?: boolean;

  unlockSchedule?: {
    remainingEpochs: number;
    percent: number;
  }[];
}