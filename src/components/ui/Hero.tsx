"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Dynamically generate today's date in Bengali format
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const formattedDate = new Intl.DateTimeFormat('bn-BD', options).format(date);
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="bg-[#F5FAF6] rounded-2xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center justify-between border border-green-50 shadow-sm relative overflow-hidden">
      
      {/* Content Side */}
      <div className="flex-1 z-10">
        
        {/* Eyebrow Date */}
        <div className="inline-block bg-[#E8F3EB] text-[#0F8A43] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          {currentDate || "লোড হচ্ছে..."}
        </div>
        
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
          আজকের বাজারের দাম এক নজরে
        </h1>
        
        {/* Subtitle */}
        <p className="text-slate-500 text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        
        {/* CTA Button */}
        <Link 
          href="#সব-পণ্য" 
          className="inline-block bg-[#0F8A43] hover:bg-green-700 text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors"
        >
          সব পণ্য দেখুন
        </Link>
      </div>

      <div className="mt-8 md:mt-0 flex-shrink-0 z-10 pl-0 md:pl-10 flex justify-center">
        <Image 
          src="/bazar-hero.png" 
          alt="BazarDor Hero Basket" 
          width={280} 
          height={220} 
          className="w-48 md:w-64 object-contain"
          priority
        />
      </div>
      
    </div>
  );
}