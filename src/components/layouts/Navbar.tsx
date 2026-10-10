"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // BetterAuth client

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Fetch real authentication state
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setIsDropdownOpen(false);
      router.push("/");
      router.refresh(); // Forces Next.js to clear client cache and reflect logged-out state
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  // Hydration-safe date rendering
  const banglaDate = mounted 
    ? new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date())
    : "";

  // Dynamic Avatar fallback based on user's name
  const avatarUrl = user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0F8A43&color=fff`;

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo & Auth */}
        <div className="flex justify-between items-center py-4 border-b border-slate-100">
          
          {/* Left: Logo & Date */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image 
              src="/nav-logo.png" 
              alt="BazarDor Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 leading-tight">বাজার দর</span>
              <span className="text-xs text-slate-500 h-4">{banglaDate}</span>
            </div>
          </Link>

          {/* Right: Auth Buttons / Profile Dropdown */}
          <div className="relative">
            {isPending ? (
              // Loading Skeleton to prevent UI flickering
              <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-md"></div>
            ) : !user ? (
              // Logged Out State
              <div className="flex items-center gap-4">
                <Link href="/signin" className="text-sm font-semibold text-slate-700 hover:text-green-600 cursor-pointer transition-colors">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="text-sm font-semibold bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                  সাইন আপ
                </Link>
              </div>
            ) : (
              // Logged In State
              <div>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Image 
                    src={avatarUrl} 
                    alt="Profile" 
                    width={36} 
                    height={36} 
                    className="rounded-full border border-slate-200"
                  />
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {user.name.split(' ')[0]} ▾
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-semibold text-slate-800 capitalize">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 আমার প্রোফাইল
                    </Link>
                    <button 
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      ↪ সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Category Links */}
        <nav className="flex items-center gap-8 overflow-x-auto py-3 no-scrollbar">
          {categories.length === 0 ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-5 w-20 bg-slate-200 animate-pulse rounded"></div>
            ))
          ) : (
            categories.map((category) => {
              const href = `/category/${category.id}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={category.id}
                  href={href}
                  className={`flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer transition-colors ${
                    isActive 
                      ? "text-green-600 font-bold border-b-2 border-green-600 pb-1" 
                      : "text-slate-600 hover:text-green-600"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.nameBn}</span>
                </Link>
              );
            })
          )}
        </nav>
      </div>
    </header>
  );
}