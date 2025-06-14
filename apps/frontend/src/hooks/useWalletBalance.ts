import { useState, useEffect } from 'react';
import { fetchWalletBalance, formatBalanceFromWei } from '../services/crossmint';

interface UseWalletBalanceResult {
  balance: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWalletBalance(
  walletAddress: string,
  chain: string,
  token: string
): UseWalletBalanceResult {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchWalletBalance(walletAddress, chain, token);
      
      if (data && data.length > 0) {
        const tokenData = data.find(item => item.token === token);
        if (tokenData) {
          const formattedBalance = formatBalanceFromWei(tokenData.balances.total, tokenData.decimals);
          setBalance(formattedBalance);
        } else {
          setError(`Token ${token} not found in response`);
        }
      } else {
        setError('No balance data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [walletAddress, chain, token]);

  return { balance, loading, error, refetch: fetchBalance };
}
