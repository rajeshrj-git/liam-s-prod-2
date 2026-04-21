import { createClient } from "@/lib/supabaseServer";
import { format } from "date-fns";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const supabase = createClient();
  
  const { data: customers, error } = await supabase
    .from("profiles")
    .select("*, auth_users:id (email)") // Note: accessing auth.users email directly in select is tricky due to schema differences, so using profiles itself
    .order("created_at", { ascending: false });

  // Wait, email is not guaranteed in profiles unless added. Let's assume joining to auth.users is blocked by RLS / schema or we just show phone.
  // The trigger can be modified to add email. For now we use what's there.

  if (error) {
    return <div>Error loading customers</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Registered Date</th>
                <th className="px-6 py-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {customer.full_name || "Guest User"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{customer.phone || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {customer.city ? `${customer.city}, ${customer.state}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(customer.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${customer.is_admin ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-700"}`}>
                      {customer.is_admin ? "Admin" : "Customer"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!customers || customers.length === 0) && (
            <div className="text-center py-12 text-gray-500">No customers found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
