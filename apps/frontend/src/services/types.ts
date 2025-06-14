export interface WalletBalance {
  token: string;
  decimals: number;
  balances: {
    [chain: string]: string;
    total: string;
  };
}

export interface CrossmintBalanceResponse {
  token: string;
  decimals: number;
  balances: Record<string, string>;
}
