import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get callback data
    const merchantOid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const totalAmount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    const failedReasonCode = formData.get('failed_reason_code') as string;
    const failedReasonMsg = formData.get('failed_reason_msg') as string;
    const testMode = formData.get('test_mode') as string;
    const paymentType = formData.get('payment_type') as string;
    const currency = formData.get('currency') as string;
    const paymentAmount = formData.get('payment_amount') as string;
    
    // Verify hash
    const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;
    
    const hashStr = merchantOid + merchantSalt + status + totalAmount;
    const calculatedHash = crypto
      .createHmac('sha256', merchantKey)
      .update(hashStr)
      .digest('base64');
    
    if (hash !== calculatedHash) {
      console.error('Invalid hash in PayTR callback');
      return new NextResponse('PAYTR notification failed: invalid hash', { status: 400 });
    }
    
    // Process the payment result
    if (status === 'success') {
      // Payment successful
      console.log(`Payment successful for order ${merchantOid}`);
      
      // Update order status in database
      // await updateOrderStatus(merchantOid, 'paid');
      
      // Send confirmation email
      // await sendOrderConfirmationEmail(merchantOid);
      
    } else {
      // Payment failed
      console.log(`Payment failed for order ${merchantOid}: ${failedReasonMsg}`);
      
      // Update order status in database
      // await updateOrderStatus(merchantOid, 'failed', failedReasonMsg);
    }
    
    // PayTR expects "OK" response
    return new NextResponse('OK', { status: 200 });
    
  } catch (error) {
    console.error('PayTR Callback Error:', error);
    return new NextResponse('PAYTR notification failed', { status: 500 });
  }
}