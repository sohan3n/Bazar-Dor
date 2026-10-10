// src/app/(auth)/signin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "সাইন ইন করতে সমস্যা হয়েছে।");
      }
      
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "সাইন ইন করতে সমস্যা হয়েছে।";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED FUNCTION: Added callbackURL for guaranteed redirect
  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({ 
        provider,
        callbackURL: "/"
      });
    } catch (err) {
      console.error(`${provider} sign in failed`, err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col items-center justify-center p-4">
      {/* Header section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">সাইন ইন</h1>
        <p className="text-slate-500 text-sm">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-100 max-w-md w-full">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F8A43] hover:bg-green-700 text-white font-medium rounded-md py-2.5 mt-2 transition-colors disabled:opacity-70"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
          <div className="grow border-t border-slate-200"></div>
          <span className="shrink-0 mx-4 text-slate-400 text-xs">অথবা</span>
          <div className="grow border-t border-slate-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => handleSocialSignIn("google")}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-md py-2.5 hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-sm font-medium text-slate-700">Google দিয়ে চালিয়ে যান</span>
          </button>
          
          <button 
            onClick={() => handleSocialSignIn("github")}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-md py-2.5 hover:bg-slate-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-sm font-medium text-slate-700">GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            অ্যাকাউন্ট নেই? <Link href="/signup" className="text-green-600 font-semibold hover:underline">সাইন আপ করুন</Link>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}