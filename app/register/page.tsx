"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";

function RegisterContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get("redirect") || "/shop";
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Allow trigger to complete, wait 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        })
        .eq('id', authData.user.id);
        
      if (profileError) {
        toast.error("Account created, but profile update failed.");
      } else {
        toast.success("Account created successfully!");
        router.push(redirectParams);
        router.refresh();
      }
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl bg-white border border-gray-100 rounded-3xl p-8 flex flex-col shadow-xl relative z-10">
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Create an Account</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Sign up to place an order</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="+91..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="••••••••" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Address Line 1</label>
              <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="House/Flat No., Street" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Address Line 2 (Optional)</label>
              <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="Landmark, Area" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="State" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" placeholder="123456" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={`/login?redirect=${encodeURIComponent(redirectParams)}`} className="text-accent font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
