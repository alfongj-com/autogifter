import { CROSSMINT_CONFIG } from '@/app/config/crossmint';

export async function makeCrossmintRequest(endpoint: string, method: 'GET' | 'POST', data?: Record<string, unknown>) {
  const API_KEY = process.env.CROSSMINT_API_KEY;
  if (!API_KEY) {
    throw new Error('Crossmint API key not configured');
  }

  const url = `${CROSSMINT_CONFIG.baseUrl}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  };

  if (data && method === 'POST') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Crossmint API error: ${response.status} - ${errorData.message || response.statusText}`);
  }

  return await response.json();
}

type SupportedToken = 'usdxm' | 'usdc' | 'eth';
type SupportedChain = 'base-sepolia' | 'ethereum' | 'polygon';

const SUPPORTED_PAYMENT_METHODS: SupportedToken[] = ['usdxm', 'usdc', 'eth'];
const SUPPORTED_CHAINS: Record<SupportedChain, SupportedToken[]> = {
  'base-sepolia': ['usdxm', 'usdc'],
  'ethereum': ['usdc', 'eth'],
  'polygon': ['usdc']
};

export function resolvePaymentConfig(token?: string, chain?: string) {
  const defaultToken = process.env.CURRENCY || 'usdxm';
  const defaultChain = process.env.CHAIN || 'base-sepolia';
  
  const userToken = (token || defaultToken).toLowerCase();
  const userChain = (chain || defaultChain).toLowerCase();

  if (!SUPPORTED_PAYMENT_METHODS.includes(userToken as SupportedToken)) {
    throw new Error(`Unsupported payment method: ${userToken}`);
  }

  if (!(userChain in SUPPORTED_CHAINS)) {
    throw new Error(`Unsupported chain: ${userChain}`);
  }
  
  const supportedTokens = SUPPORTED_CHAINS[userChain as SupportedChain];
  if (!supportedTokens.includes(userToken as SupportedToken)) {
    throw new Error(`Token '${userToken}' is not supported on chain '${userChain}'`);
  }

  return {
    token: userToken,
    chain: userChain,
  };
}
