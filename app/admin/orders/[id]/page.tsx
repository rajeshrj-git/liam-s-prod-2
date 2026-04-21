"use client";

import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(*)")
      .eq("id", params.id)
      .single();
      
    if (data) setOrder(data);
    setLoading(false);
  };

  const updateStatus = async (status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: status })
      .eq("id", params.id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated!");
      setOrder({ ...order, order_status: status });
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found.</div>;

  const doorStatuses = ["confirmed", "dispatched", "delivered"];
  const pickupStatuses = ["confirmed", "ready_for_pickup", "collected"];
  const statuses = order.delivery_type === "door" ? doorStatuses : pickupStatuses;

  return (
    <div>
      <Link href="/admin/orders" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
        <ArrowLeft size={18} /> Back to Orders
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Details</h1>
          <p className="text-sm text-gray-500">ID: {order.id}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <label className="text-sm text-gray-500 font-medium">Status:</label>
          <select 
            value={order.order_status} 
            onChange={(e) => updateStatus(e.target.value)}
            className="border-none bg-transparent font-semibold capitalize focus:ring-0 cursor-pointer"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.weight_option} x {item.qty}</p>
                  </div>
                  <div className="font-medium">₹{item.price * item.qty}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between font-bold">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="pt-2 flex justify-between font-medium text-gray-600">
              <span>Delivery Charge</span>
              <span>₹{order.delivery_charge}</span>
            </div>
            <div className="pt-4 flex justify-between font-bold text-xl text-accent">
              <span>Total amount</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-4">Customer Info</h3>
            <p className="font-medium text-gray-900 mb-1">{order.profiles?.full_name}</p>
            <p className="text-sm text-gray-600 mb-1">{order.profiles?.email}</p>
            <p className="text-sm text-gray-600">{order.profiles?.phone}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-4">Delivery Info</h3>
            <p className="text-sm font-semibold text-gray-900 mb-2 capitalize">
              Type: {order.delivery_type} Delivery
            </p>
            {order.delivery_type === "door" && order.delivery_address && (
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.delivery_address.addressLine1}</p>
                {order.delivery_address.addressLine2 && <p>{order.delivery_address.addressLine2}</p>}
                <p>{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
