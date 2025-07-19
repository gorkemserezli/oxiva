import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface PaymentRequest {
  email: string;
  payment_amount: number;
  user_name: string;
  user_address: string;
  user_phone: string;
  merchant_oid: string;
  user_basket: string;
  debug_on: number;
  test_mode: number;
  no_installment: number;
  max_installment: number;
  lang: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    
    // PayTR credentials from environment
    const merchantId = process.env.PAYTR_MERCHANT_ID!;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;
    
    // Use provided order ID
    const merchantOid = body.merchant_oid;
    
    // Customer info
    const userIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const email = body.email;
    const paymentAmount = body.payment_amount; // Already in kuruş from frontend
    
    // Parse and re-encode basket
    const userBasket = JSON.parse(body.user_basket);
    const userBasketStr = btoa(JSON.stringify(userBasket));
    
    // Parse user info from provided data
    const nameParts = body.user_name.split(' ');
    const user = {
      name: nameParts[0],
      surname: nameParts.slice(1).join(' ') || nameParts[0],
      address: body.user_address,
      phone: body.user_phone
    };
    
    // Success and fail URLs
    const merchantOkUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`;
    const merchantFailUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/payment/fail`;
    
    // Other required parameters
    const currency = 'TL';
    const testMode = body.test_mode.toString();
    const noInstallment = body.no_installment.toString();
    const maxInstallment = body.max_installment.toString();
    const timeout = '30'; // 30 minutes timeout
    
    // Create hash string
    const hashStr = 
      merchantId + userIp + merchantOid + email + paymentAmount + 
      userBasketStr + noInstallment + maxInstallment + currency + 
      testMode + merchantSalt;
    
    // Generate token
    const token = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');
    
    // Prepare form data - all values must be strings for URLSearchParams
    const formData = {
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: email,
      payment_amount: paymentAmount.toString(),
      user_basket: userBasketStr,
      user_name: user.name,
      user_address: user.address,
      user_phone: user.phone,
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      currency: currency,
      test_mode: testMode,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      timeout_limit: timeout,
      paytr_token: token,
    };
    
    // Make request to PayTR
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
    });
    
    const result = await paytrResponse.json();
    
    if (result.status === 'success') {
      // Save order to database (optional)
      // await saveOrderToDatabase({ merchantOid, ...body });
      
      return NextResponse.json({
        status: 'success',
        token: result.token,
        merchantOid,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.reason || 'Payment initialization failed' 
        },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('PayTR API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}