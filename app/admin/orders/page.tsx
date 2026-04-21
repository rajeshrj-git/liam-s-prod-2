import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { format } from "date-fns";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = createClient();
  
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, profiles(full_name, phone, email)")
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Error loading orders</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        {/* Simple CSV Export button mockup (in a real app, this would be a client component invoking a download) */}
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm">
          Export CSV (WIP)
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-accent font-medium hover:underline">
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.profiles?.full_name || "Unknown"}</div>
                    <div className="text-gray-500 text-xs">{order.profiles?.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(order.created_at), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.delivery_type === "door" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                      {order.delivery_type === "door" ? "Door" : "Pickup"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium capitalize">
                      {order.order_status.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="text-center py-12 text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
