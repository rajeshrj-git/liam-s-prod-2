import { createClient } from "@/lib/supabaseServer";
import { Box, TrendingUp, Users, ShoppingBag } from "lucide-react";

export const revalidate = 0; // Don't cache admin dashboard

export default async function AdminDashboardPage() {
  const supabase = createClient();
  
  // Basic queries to populate stats
  const today = new Date();
  today.setHours(0,0,0,0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    { count: totalOrdersToday },
    { count: totalOrdersMonth },
    { count: totalCustomers },
    { data: revenueTodayData },
    { data: revenueMonthData },
    { count: pendingOrders },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("orders").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount").eq("payment_status", "paid").gte("created_at", today.toISOString()),
    supabase.from("orders").select("total_amount").eq("payment_status", "paid").gte("created_at", startOfMonth.toISOString()),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("order_status", "confirmed"),
  ]);

  const revenueToday = revenueTodayData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
  const revenueMonth = revenueMonthData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

  const StatCard = ({ title, value, icon, subtitle }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Revenue Today" value={`₹${revenueToday}`} icon={<TrendingUp />} subtitle="Paid orders only" />
        <StatCard title="Orders Today" value={totalOrdersToday || 0} icon={<ShoppingBag />} />
        <StatCard title="Revenue (Month)" value={`₹${revenueMonth}`} icon={<TrendingUp />} />
        <StatCard title="Total Customers" value={totalCustomers || 0} icon={<Users />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
            Pending Orders <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs">{pendingOrders || 0}</span>
          </h2>
          <p className="text-gray-500 text-sm">Orders confirmed and awaiting dispatch.</p>
        </div>
      </div>
    </div>
  );
}
