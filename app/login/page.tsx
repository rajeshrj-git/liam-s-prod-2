"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get("redirect") || "/shop";
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful");
      router.push(redirectParams);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xl relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <UserCircle2 size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Log in to continue your purchase</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 px-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href={`/register?redirect=${encodeURIComponent(redirectParams)}`} className="text-accent font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
