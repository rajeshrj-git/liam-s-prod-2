"use client";

import { useCartStore } from "@/lib/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalQuantity } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-background flex flex-col items-center">
        <h1 className="text-3xl font-bold font-serif mb-6">Your Cart is Empty</h1>
        <Link
          href="/shop"
          className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent-hover transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product_id}-${item.weight_option}`} className="bg-white border text-black border-gray-100 rounded-2xl p-4 flex gap-4 shadow-sm items-center">
                <div className="w-24 h-24 relative bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                  {item.weight_option && (
                    <p className="text-sm text-gray-500">{item.weight_option}</p>
                  )}
                  <div className="font-semibold text-accent mt-1">{formatPrice(item.price)}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.product_id, item.weight_option)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex text-black items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      onClick={() => updateQuantity(item.product_id, Math.max(1, item.qty - 1), item.weight_option)}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold min-w-[2rem] text-center border-x border-gray-200">
                      {item.qty}
                    </span>
                    <button
                      className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      onClick={() => updateQuantity(item.product_id, item.qty + 1, item.weight_option)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border text-black border-gray-100 rounded-2xl p-6 shadow-xl sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-medium text-gray-900">{getTotalQuantity()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-sm italic">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total (Excl. Delivery)</span>
                <span className="text-accent">{formatPrice(getSubtotal())}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white py-4 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 shadow-md shadow-accent/20"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
