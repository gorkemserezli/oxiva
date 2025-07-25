import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // PayTR credentials
    const merchantId = process.env.PAYTR_MERCHANT_ID!;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;
    
    // Extract order and card data
    const {
      orderId,
      total,
      user,
      deliveryAddress,
      items,
      cardNumber,
      cardName,
      expiryMonth,
      expiryYear,
      cvv
    } = body;
    
    // Customer info
    const userIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const email = user.email;
    const paymentAmount = Math.round(total * 100); // Convert to kuruş
    
    // Create basket
    const basket = items.map(item => [
      item.name,
      (item.price * 100).toFixed(0),
      item.quantity
    ]);
    const userBasketStr = btoa(JSON.stringify(basket));
    
    // Format user data
    const userData = {
      name: user.firstName,
      surname: user.lastName,
      address: `${deliveryAddress.address} ${deliveryAddress.district} ${deliveryAddress.city}`,
      phone: deliveryAddress.phone || user.phone || ''
    };
    
    // URLs
    const siteUrl = process.env.NODE_ENV === 'production' ? 'https://oxiva.tr' : process.env.NEXT_PUBLIC_SITE_URL;
    const merchantOkUrl = `${siteUrl}/payment/success`;
    const merchantFailUrl = `${siteUrl}/payment/fail`;
    const merchantNotifyUrl = `${siteUrl}/api/payment/callback`;
    
    // Other parameters
    const currency = 'TL';
    const testMode = process.env.PAYTR_TEST_MODE || '1'; // Default to test mode
    const nonSecure = '0'; // 3D Secure enabled
    const installment = '0';
    const timeout = '30';
    
    // Create hash for Direct API
    const hashStr = 
      merchantId + userIp + orderId + email + paymentAmount + 
      'cc' + installment + currency + testMode + nonSecure + merchantSalt;
    
    const token = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');
    
    // Prepare Direct API request
    const formData = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: orderId,
      email: email,
      payment_type: 'card',
      payment_amount: paymentAmount.toString(),
      currency: currency,
      test_mode: testMode,
      non_secure: nonSecure,
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      merchant_notify_url: merchantNotifyUrl,
      user_name: userData.name,
      user_address: userData.address,
      user_phone: userData.phone,
      user_basket: userBasketStr,
      installment_count: installment,
      card_number: cardNumber.replace(/\s/g, ''), // Remove spaces
      card_type: '', // PayTR will detect
      card_name: cardName,
      card_month: expiryMonth,
      card_year: expiryYear,
      card_cvv: cvv,
      paytr_token: token,
    });
    
    // Make Direct API request
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/direct-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    const result = await paytrResponse.json();
    
    if (result.status === 'success') {
      if (result.payment_status === 'success') {
        // Payment successful
        return NextResponse.json({
          status: 'success',
          message: 'Ödeme başarılı',
          orderId: orderId,
        });
      } else if (result.secure_status === '3d' && result.secure_url) {
        // 3D Secure required
        return NextResponse.json({
          status: '3d_required',
          secure_url: result.secure_url,
          message: '3D Secure doğrulaması gerekli',
        });
      } else {
        // Payment failed
        return NextResponse.json({
          status: 'error',
          message: result.fail_message || 'Ödeme başarısız',
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({
        status: 'error',
        message: result.reason || 'Ödeme işlemi başlatılamadı',
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('PayTR Direct API Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}