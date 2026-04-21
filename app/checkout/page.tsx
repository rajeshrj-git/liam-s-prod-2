"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Script from "next/script";

export default function CheckoutPage() {
  const { items, getSubtotal, getTotalQuantity, clearCart } = useCartStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const totalQty = getTotalQuantity();
  const [deliveryType, setDeliveryType] = useState<"pickup" | "door">("pickup");
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/checkout");
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) {
        setProfile({ ...data, email: session.user.email });
        setAddress({
          addressLine1: data.address_line1 || "",
          addressLine2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [items.length, router]);

  useEffect(() => {
    if (totalQty >= 5 && deliveryType === "door" && address.pincode.length >= 5) {
      calculateDeliveryCharge(address.pincode);
    } else {
      setDeliveryCharge(0);
    }
  }, [totalQty, deliveryType, address.pincode]);

  const calculateDeliveryCharge = async (pincode: string) => {
    try {
      const res = await fetch("/api/calculate-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      if (data.success) {
        setDistanceKm(data.distanceKm);
        setDeliveryCharge(data.charge);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayment = async () => {
    if (deliveryType === "door" && (!address.addressLine1 || !address.city || !address.pincode)) {
      toast.error("Please fill in your delivery address");
      return;
    }

    setProcessing(true);
    
    // Create Razorpay Order
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        deliveryType,
        deliveryCharge,
        distanceKm,
        address,
      }),
    });
    
    const data = await res.json();
    if (!data.success) {
      toast.error(data.error || "Failed to create order");
      setProcessing(false);
      return;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: "INR",
      name: "Liam's Products",
      description: "Premium Honey Purchase",
      order_id: data.order.id,
      handler: async function (response: any) {
        // Verify Payment
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: data.dbOrder, // Passed back to verify endpoint
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          toast.success("Payment successful! Order placed.");
          clearCart();
          router.push("/products"); // or /orders
        } else {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: profile?.full_name || "",
        email: profile?.email || "",
        contact: profile?.phone || "",
      },
      theme: { color: "#F59E0B" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      toast.error(response.error.description);
    });
    rzp.open();
    setProcessing(false);
  };

  if (loading) return <div className="min-h-screen pt-32 pb-20 text-center">Loading checkout...</div>;

  const subtotal = getSubtotal();
  const totalAmount = subtotal + deliveryCharge;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen pt-24 pb-20 bg-background flex flex-col md:flex-row container mx-auto px-4 gap-8">
        
        {/* Left Col: Details */}
        <div className="md:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold font-serif mb-6">Delivery Details</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Select Delivery Type</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setDeliveryType("pickup")}
                className={`flex-1 py-3 border rounded-xl font-bold transition-all ${deliveryType === "pickup" ? "border-accent bg-accent/10 text-accent" : "text-gray-500 border-gray-200"}`}
              >
                Self Pickup
              </button>
              {totalQty >= 5 ? (
                <button
                  onClick={() => setDeliveryType("door")}
                  className={`flex-1 py-3 border rounded-xl font-bold transition-all ${deliveryType === "door" ? "border-accent bg-accent/10 text-accent" : "text-gray-500 border-gray-200"}`}
                >
                  Door Delivery
                </button>
              ) : (
                <div className="flex-1 py-3 border rounded-xl font-bold text-gray-400 border-gray-100 bg-gray-50 text-center flex flex-col items-center justify-center text-xs">
                  <span>Door Delivery</span>
                  <span className="font-normal text-[10px]">(Min. 5 units required)</span>
                </div>
              )}
            </div>
          </div>

          {deliveryType === "door" && (
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <h3 className="font-semibold">Delivery Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Address Line 1" className="col-span-2 border p-3 rounded-xl focus:ring-accent focus:outline-none" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} />
                <input type="text" placeholder="Address Line 2" className="col-span-2 border p-3 rounded-xl focus:ring-accent focus:outline-none" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} />
                <input type="text" placeholder="City" className="border p-3 rounded-xl focus:ring-accent focus:outline-none" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                <input type="text" placeholder="State" className="border p-3 rounded-xl focus:ring-accent focus:outline-none" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                <input type="text" placeholder="Pincode" className="border p-3 rounded-xl focus:ring-accent focus:outline-none" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
              {deliveryCharge > 0 && (
                <div className="bg-amber-50 p-3 rounded-xl text-amber-800 text-sm flex justify-between font-medium">
                  <span>Distance: ~{distanceKm} km</span>
                  <span>Delivery Charge: ₹{deliveryCharge}</span>
                </div>
              )}
            </div>
          )}

          {deliveryType === "pickup" && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
              <h3 className="font-bold text-gray-800 mb-2">Self Pickup - Store Location</h3>
              <p className="text-gray-600 mb-2">{process.env.NEXT_PUBLIC_SHOP_ADDRESS || "123 Honey Lane, Nature City"}</p>
              <p className="text-sm font-medium text-accent">Collect from our store. No delivery charges.</p>
            </div>
          )}
        </div>

        {/* Right Col: Summary */}
        <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Items ({totalQty})</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-100">
              <span>Total</span>
              <span className="text-accent">₹{totalAmount}</span>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {processing ? "Processing..." : "Place Order & Pay"}
          </button>
        </div>
      </div>
    </>
  );
}
