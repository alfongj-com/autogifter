import { NextResponse } from 'next/server';
import { CROSSMINT_CONFIG } from '@/app/config/crossmint';

interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  province: string;
}

const uppercaseShippingAddress = (address: ShippingAddress): ShippingAddress => {
  return {
    name: address.name.toUpperCase(),
    address1: address.address1.toUpperCase(),
    address2: address.address2?.toUpperCase(),
    city: address.city.toUpperCase(),
    postalCode: address.postalCode.toUpperCase(),
    country: address.country.toUpperCase(),
    province: address.province.toUpperCase()
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Amazon Purchase API - Request body:', JSON.stringify(body, null, 2));

    const { asin, email, shippingAddress }: {
      asin: string;
      email: string;
      shippingAddress: ShippingAddress;
    } = body;

    if (!asin || !email || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: asin, email, and shippingAddress are required' },
        { status: 400 }
      );
    }

    const uppercasedEmail = email.toUpperCase();
    const uppercasedShippingAddress = uppercaseShippingAddress(shippingAddress);

    const API_KEY = process.env.CROSSMINT_API_KEY;
    const walletAddress = process.env.WALLET_ADDRESS;
    const chain = process.env.CHAIN;
    const currency = process.env.CURRENCY;
    
    if (!API_KEY || !walletAddress || !chain || !currency) {
      console.error('Amazon Purchase API - Required environment variables not configured');
      return NextResponse.json(
        { error: 'Required environment variables not configured' },
        { status: 500 }
      );
    }

    const checkoutResponse = await fetch(`${CROSSMINT_CONFIG.baseUrl}/api/2022-06-09/orders`, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: {
          email: uppercasedEmail,
          physicalAddress: {
            name: uppercasedShippingAddress.name,
            line1: uppercasedShippingAddress.address1,
            line2: uppercasedShippingAddress.address2 || "",
            city: uppercasedShippingAddress.city,
            postalCode: uppercasedShippingAddress.postalCode,
            country: uppercasedShippingAddress.country,
            state: uppercasedShippingAddress.province
          }
        },
        locale: "en-US",
        payment: {
          receiptEmail: uppercasedEmail,
          method: chain,
          currency: currency,
          payerAddress: walletAddress
        },
        lineItems: [
          {
            productLocator: `amazon:${asin}`
          }
        ]
      })
    } as RequestInit & { agent?: https.Agent });

    console.log('Crossmint Checkout Order API - Response status:', checkoutResponse.status);
    const checkoutData = await checkoutResponse.json();
    console.log('Crossmint Checkout Order API - Response:', JSON.stringify(checkoutData, null, 2));

    if (!checkoutResponse.ok) {
      return NextResponse.json(
        { error: checkoutData.message || 'Failed to create checkout session' },
        { status: checkoutResponse.status }
      );
    }

    return NextResponse.json(checkoutData);
  } catch (error) {
    console.error('Amazon Purchase API - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
