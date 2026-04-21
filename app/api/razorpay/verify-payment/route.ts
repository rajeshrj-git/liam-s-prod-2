import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is verified
      // Save order to Supabase
      const { data, error } = await supabase.from('orders').insert([{
        user_id: orderData.userId,
        product_id: orderData.productId,
        quantity: orderData.quantity,
        total_amount: orderData.totalAmount,
        status: 'Confirmed',
        name: orderData.name,
        address: orderData.address,
        phone: orderData.phone,
        delivery_type: orderData.deliveryType,
        distance_km: orderData.distanceKm,
        razorpay_order_id,
        razorpay_payment_id
      }]).select();

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
      }

      return NextResponse.json({ success: true, order: data[0] });
    } else {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
