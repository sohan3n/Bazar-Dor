// src/components/layout/PriceTicker.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";

// Helper functions for Bengali formatting
const engToBng = (num: number | string) => {
  const bngDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num?.toString().replace(/\d/g, (d) => bngDigits[parseInt(d)]) || "০";
};

const translateUnit = (unit: string) => {
  const units: Record<string, string> = {
    kg: "কেজি",
    ltr: "লিটার",
    pcs: "পিস",
    dozen: "ডজন",
  };
  return units[unit?.toLowerCase()] || unit;
};

// Types based on the actual API response
type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTickerProducts = async () => {
      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch ticker products:", error);
      }
    };
    fetchTickerProducts();
  }, []);

  if (products.length === 0) {
    return (
      <div className="w-full bg-slate-50 border-b border-slate-200 py-3 text-center text-sm text-slate-500">
        বাজারের হালনাগাদ তথ্য লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 py-2.5">
      <Marquee speed={90} gradient={false} pauseOnHover={true}>
        <div className="flex items-center gap-8 px-4">
          {products.map((item) => {
            const isUp = item.change?.dir === "up";
            const isDown = item.change?.dir === "down";

            return (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-green-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span className="text-lg">{item.image}</span>
                <span>{item.nameBn}</span>
                <span className="text-slate-900 font-semibold">
                  {engToBng(item.today)} টাকা/{translateUnit(item.unit)}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                    isUp
                      ? "text-red-600 bg-red-50"
                      : isDown
                      ? "text-green-600 bg-green-50"
                      : "text-slate-500 bg-slate-100"
                  }`}
                >
                  {isUp ? "▲" : isDown ? "▼" : "—"} {engToBng(item.change?.pct)}%
                </span>
              </Link>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
}