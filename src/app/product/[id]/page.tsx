"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Utility functions
const toBnNum = (num: number | string): string => {
  if (num === undefined || num === null) return "০";
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

const translateUnit = (unit: string): string => {
  if (!unit) return "";
  const unitMap: Record<string, string> = {
    kg: "কেজি",
    l: "লিটার",
    liter: "লিটার",
    piece: "পিস",
    pcs: "পিস",
    hali: "হালি",
    gm: "গ্রাম",
  };
  return unitMap[unit.toLowerCase()] || unit;
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://openapi.programming-hero.com/api/bazardor/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full bg-[#F4F6F4] min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 w-48 bg-slate-200 rounded mb-6"></div>
          <div className="h-32 bg-white rounded-xl mb-8"></div>
          <div className="h-24 bg-white rounded-xl mb-8"></div>
          <div className="h-64 bg-white rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-slate-500">পণ্য পাওয়া যায়নি।</div>;

  // Calculations
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const priceDiff = Math.abs((product.today || 0) - (product.yesterday || 0));
  
  let globalMin = 0;
  let globalMax = 0;
  
  if (product.markets && product.markets.length > 0) {
    globalMin = Math.min(...product.markets.map((m: any) => m.min));
    globalMax = Math.max(...product.markets.map((m: any) => m.max));
  }

  return (
    <div className="w-full bg-[#F4F6F4] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-green-600 transition-colors">হোম</Link>
          <span>›</span>
          <span className="text-slate-600">{product.categoryNameBn || "ক্যাটাগরি"}</span>
          <span>›</span>
          <span className="text-slate-800 font-medium">{product.nameBn}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Header Left */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
              {product.image || product.categoryIcon}
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-1">{product.nameBn}</h1>
              <p className="text-sm text-slate-500 mb-2">প্রতি {translateUnit(product.unit)} - {product.categoryNameBn}</p>
              <p className="text-[13px] text-slate-600">
                গতকালকের তুলনায় আজকের দাম <span className="font-semibold">{isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত"} {toBnNum(priceDiff)} টাকা</span>
              </p>
            </div>
          </div>

          {/* Header Right - Price Badge */}
          <div className="bg-[#F5FAF6] border border-green-100 rounded-xl p-4 min-w-[140px] text-center shrink-0 w-full md:w-auto">
            <p className="text-xs text-slate-500 mb-1">আজকের দাম</p>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {toBnNum(product.today)}
            </div>
            <p className="text-[11px] text-slate-400 mb-2">টাকা / {translateUnit(product.unit)}</p>
            
            <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-white
              ${isUp ? 'text-red-500' : ''}
              ${isDown ? 'text-green-600' : ''}
              ${!isUp && !isDown ? 'text-slate-400' : ''}
            `}>
              {isUp && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M10 4.5l5 7h-10l5-7z" /></svg>
              )}
              {isDown && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M10 15.5l-5-7h10l-5 7z" /></svg>
              )}
              {product.change?.pct ? `${toBnNum(product.change.pct)}%` : '-'}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-center">
              <p className="text-sm text-slate-500 mb-2">সর্বনিম্ন দাম</p>
              <p className="text-2xl font-bold text-[#0F8A43] mb-1">{toBnNum(globalMin)} <span className="text-sm font-normal text-slate-500">টাকা</span></p>
              <p className="text-xs text-slate-400">সবচেয়ে কম পাওয়া যাচ্ছে</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-center">
              <p className="text-sm text-slate-500 mb-2">সর্বোচ্চ দাম</p>
              <p className="text-2xl font-bold text-red-500 mb-1">{toBnNum(globalMax)} <span className="text-sm font-normal text-slate-500">টাকা</span></p>
              <p className="text-xs text-slate-400">সবচেয়ে বেশি পাওয়া যাচ্ছে</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-center">
              <p className="text-sm text-slate-500 mb-2">গড় দাম</p>
              <p className="text-2xl font-bold text-slate-800 mb-1">{toBnNum(product.today)} <span className="text-sm font-normal text-slate-500">টাকা</span></p>
              <p className="text-xs text-slate-400">প্রতি {translateUnit(product.unit)}-এর হিসাব</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {product.markets && product.markets.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">বাজারভিত্তিক আজকের দাম</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAF9] text-sm text-slate-500">
                    <th className="py-4 px-6 font-medium">বাজার</th>
                    <th className="py-4 px-6 font-medium">বিভাগ</th>
                    <th className="py-4 px-6 font-medium">সর্বনিম্ন</th>
                    <th className="py-4 px-6 font-medium">সর্বোচ্চ</th>
                    <th className="py-4 px-6 font-medium text-right">গড়</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                  {product.markets.map((m: any, idx: number) => {
                    const avg = Math.round((m.min + m.max) / 2);
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-900">{m.market}</td>
                        <td className="py-4 px-6">{m.division}</td>
                        <td className="py-4 px-6">{toBnNum(m.min)} টাকা</td>
                        <td className="py-4 px-6">{toBnNum(m.max)} টাকা</td>
                        <td className="py-4 px-6 text-right font-medium">{toBnNum(avg)} টাকা</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}