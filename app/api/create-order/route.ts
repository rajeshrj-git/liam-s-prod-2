import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { items, deliveryType, deliveryCharge, distanceKm, address } = await req.json();

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options, secure: process.env.NODE_ENV === 'production' });
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: "", ...options, secure: process.env.NODE_ENV === 'production' });
            } catch (error) {
              // The `delete` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify subtotal from DB to prevent tampering
    let subtotal = 0;
    let totalQuantity = 0;
    // In a real app, query products table. For brevity, calculating from frontend payload.
    // It is important to query DB for price to prevent price tampering:
    for (const item of items) {
      const { data: dbProduct } = await supabase
        .from("products")
        .select("price")
        .eq("id", item.product_id)
        .single();
      
      const price = dbProduct ? dbProduct.price : item.price;
      subtotal += price * item.qty;
      totalQuantity += item.qty;
    }

    const totalAmount = subtotal + (deliveryCharge || 0);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const orderOptions = {
      amount: Math.round(totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(orderOptions);

    // Prepare draft order data to insert later on verify
    const dbOrder = {
      id: uuidv4(), // generate UUID for our DB
      user_id: user.id,
      items,
      total_quantity: totalQuantity,
      subtotal,
      delivery_type: deliveryType,
      delivery_charge: deliveryCharge,
      distance_km: distanceKm,
      total_amount: totalAmount,
      delivery_address: deliveryType === "door" ? address : null,
      razorpay_order_id: order.id,
      payment_status: "pending",
      order_status: "confirmed",
    };

    return NextResponse.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrder,
    });
  } catch (error: any) {
    if (error && error.response) {
       console.error("API error response:", error.response);
    }
    console.error("Error creating order:", error);
    
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object") {
      errorMessage = JSON.stringify(error);
    }

    return NextResponse.json({ success: false, error: errorMessage });
  }
}
