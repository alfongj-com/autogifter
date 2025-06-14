import { CrossmintBalanceResponse } from './types';

const CROSSMINT_API_BASE = process.env.NEXT_PUBLIC_CROSSMINT_API_BASE || 'https://staging.crossmint.com/api';
const CLIENT_KEY = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_KEY;

export async function fetchWalletBalance(
  walletAddress: string,
  chains: string,
  tokens: string
): Promise<CrossmintBalanceResponse[]> {
  if (!CLIENT_KEY) {
    throw new Error('Crossmint client key not configured');
  }

  const url = `${CROSSMINT_API_BASE}/v1-alpha2/wallets/${walletAddress}/balances?chains=${chains}&tokens=${tokens}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': CLIENT_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wallet balance: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export function formatBalanceFromWei(balance: string, decimals: number): number {
  const balanceNum = parseFloat(balance);
  return balanceNum / Math.pow(10, decimals);
}
