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
