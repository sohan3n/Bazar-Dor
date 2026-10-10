"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Sync the input field with the user's actual name once loaded
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      await authClient.updateUser({
        name: name,
      });
      setMessage({ type: "success", text: "প্রোফাইল সফলভাবে আপডেট হয়েছে!" });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: "আপডেট করতে সমস্যা হয়েছে।" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#F4F6F4] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Fallback avatar if no image exists
  const avatarUrl =
    user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0F8A43&color=fff`;

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F4F6F4] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header section[cite: 27] */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            আমার প্রোফাইল
          </h1>
          <p className="text-slate-500 text-sm">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Card 1: User Overview[cite: 27] */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Image
              src={avatarUrl}
              alt="Profile"
              width={56}
              height={56}
              className="rounded-full border border-slate-200"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-800 capitalize">
                {user?.name}
              </h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            সাইন আউট
          </button>
        </div>

        {/* Card 2: Edit Information[cite: 27] */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">তথ্য</h3>

          {message.text && (
            <div
              className={`mb-4 p-3 text-sm rounded-md border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-100"}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateName}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating || name === user?.name}
              className="w-full bg-[#0F8A43] hover:bg-green-700 text-white font-medium rounded-md py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
