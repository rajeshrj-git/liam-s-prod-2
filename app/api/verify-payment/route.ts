import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Insert order using service role key (bypass RLS for server insertion)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin.from("orders").insert({
      ...orderData,
      razorpay_payment_id,
      payment_status: "paid",
    });

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json({ success: false, error: "Failed to save order" });
    }

    // Send emails via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Get user profile for email
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name, email, phone")
        .eq("id", orderData.user_id)
        .single();

      // Email to Customer
      await resend.emails.send({
        from: "Liam's Products <orders@liamsproducts.in>",
        to: profile?.email || "customer@example.com",
        subject: "Your honey order is confirmed! 🍯",
        html: `<p>Hi ${profile?.full_name || "Customer"},</p>
               <p>Your order (ID: ${orderData.id}) has been placed successfully.</p>
               <p>Total Paid: ₹${orderData.total_amount}</p>
               <p>Delivery: ${orderData.delivery_type === "door" ? "Door Delivery" : "Self Pickup"}</p>
               <p>Thank you for choosing pure honey!</p>`,
      });

      // Email to Admin
      await resend.emails.send({
        from: "Orders Bot <bot@liamsproducts.in>",
        to: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: `New Order Received — ${orderData.id}`,
        html: `<p>New order received from ${profile?.full_name}.</p>
               <p>Amount: ₹${orderData.total_amount}</p>
               <p>Type: ${orderData.delivery_type}</p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
