import { NextResponse } from 'next/server';
import { makeCrossmintRequest, resolvePaymentConfig } from '@/app/utils/crossmint';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Send Transaction API - Request body:', JSON.stringify(body, null, 2));

    const { serializedTransaction, token, chain } = body;

    if (!serializedTransaction) {
      return NextResponse.json(
        { error: 'Missing required parameter: serializedTransaction' },
        { status: 400 }
      );
    }

    const walletAddress = process.env.AGENT_WALLET_ADDRESS || process.env.WALLET_ADDRESS;
    if (!walletAddress) {
      console.error('Send Transaction API - Wallet address not configured');
      return NextResponse.json(
        { error: 'Wallet address not configured' },
        { status: 500 }
      );
    }

    const { chain: resolvedChain } = resolvePaymentConfig(token, chain);

    const response = await makeCrossmintRequest(`/api/2022-06-09/wallets/${walletAddress}`, 'GET');
    
    if (!response.config?.adminSigner?.locator) {
      throw new Error('Admin signer not found');
    }

    const adminSigner = response.config.adminSigner.locator;

    const txResponse = await makeCrossmintRequest(`/api/2022-06-09/wallets/${walletAddress}/transactions`, 'POST', {
      params: {
        calls: [
          {
            transaction: serializedTransaction
          }
        ],
        chain: resolvedChain,
        signer: adminSigner
      }
    });

    if (!txResponse.id) {
      throw new Error('Failed to send transaction: No transaction ID returned');
    }

    console.log('Send Transaction API - Success:', JSON.stringify(txResponse, null, 2));

    return NextResponse.json({
      success: true,
      transactionId: txResponse.id,
      status: txResponse.status,
      message: `Transaction sent! Transaction ID: ${txResponse.id}, Status: ${txResponse.status}`
    });

  } catch (error) {
    console.error('Send Transaction API - Error:', error);
    
    const errorMessage = typeof error === 'object' && error && 'message' in error
      ? (error as Error).message
      : String(error);

    return NextResponse.json(
      { 
        success: false,
        error: `Transaction failed. The purchase process cannot continue. Error: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}
