"use client";

import { useState, useEffect } from "react";
import ProductCard, { Product } from "@/components/ui/ProductCard";

const toBnNum = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const pricesUp = products.filter((p) => p.change.dir === "up").slice(0, 6);
  const pricesDown = products.filter((p) => p.change.dir === "down").slice(0, 6);

  if (loading) {
    return (
      <>
        <div className="h-6 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 animate-pulse h-32"></div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {pricesUp.length > 0 && (
        <div className="mb-12">
          <h2 className="text-[17px] font-bold text-slate-800 mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-600">
              <path d="M10 4.5l5 7h-10l5-7z" />
            </svg>
            আজ দাম বেড়েছে
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricesUp.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      {pricesDown.length > 0 && (
        <div className="mb-12">
          <h2 className="text-[17px] font-bold text-slate-800 mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600">
              <path d="M10 15.5l-5-7h10l-5 7z" />
            </svg>
            আজ দাম কমেছে
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricesDown.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      )}

      <div id="সব-পণ্য" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-[17px] font-bold text-slate-800 mb-1">সব পণ্য</h2>
          <p className="text-xs text-slate-500">মোট {toBnNum(products.length)}টি পণ্য দেখানো হচ্ছে</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </>
  );
}