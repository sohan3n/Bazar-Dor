"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

interface Product {
  id: string | number;
  nameBn: string;
  categoryIcon: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: "up" | "down" | "none";
    pct: number;
  };
}

// Utility to convert English numbers to Bengali numerals
const toBnNum = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

// Utility to map standard units to Bengali
const translateUnit = (unit: string): string => {
  const unitMap: Record<string, string> = {
    kg: "প্রতি কেজি",
    l: "প্রতি লিটার",
    liter: "প্রতি লিটার",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    hali: "প্রতি হালি",
  };
  return unitMap[unit.toLowerCase()] || `প্রতি ${unit}`;
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortBy, setSortBy] = useState<"default" | "asc" | "desc">("default");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const [categoryRes, productsRes] = await Promise.all([
          fetch(
            `https://openapi.programming-hero.com/api/bazardor/categories/${categoryId}`,
          ),
          fetch(
            `https://openapi.programming-hero.com/api/bazardor/products?category=${categoryId}`,
          ),
        ]);

        if (categoryRes.ok && productsRes.ok) {
          const categoryData = await categoryRes.json();
          const productsData = await productsRes.json();
          setCategory(categoryData);
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchCategoryData();
  }, [categoryId]);

  // Derived state: Sorted products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "asc") return a.today - b.today;
    if (sortBy === "desc") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#F4F6F4] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 mb-6 flex gap-4 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
            <div className="space-y-3 flex-1 py-1">
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 animate-pulse h-32"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#F4F6F4] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-700">
          ক্যাটাগরি খুঁজে পাওয়া যায়নি
        </h2>
        <Link href="/" className="text-green-600 mt-4 hover:underline">
          ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F4F6F4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header Banner */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 flex items-center justify-center rounded-full text-3xl">
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {category.nameBn}
            </h1>
            <p className="text-sm text-slate-500">
              {toBnNum(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sub-header & Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-slate-500">
            মোট {toBnNum(products.length)}টি পণ্য দেখানো হচ্ছে
          </div>

          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <span className="text-sm text-slate-600">সাজান</span>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors focus:outline-none"
            >
              {sortBy === "default" && "ডিফল্ট"}
              {sortBy === "asc" && "দাম: কম থেকে বেশি"}
              {sortBy === "desc" && "দাম: বেশি থেকে কম"}
              <span className="text-[10px]">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-10">
                <button
                  onClick={() => {
                    setSortBy("default");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-4">{sortBy === "default" ? "✓" : ""}</span>{" "}
                  ডিফল্ট
                </button>
                <button
                  onClick={() => {
                    setSortBy("asc");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-4">{sortBy === "asc" ? "✓" : ""}</span>{" "}
                  দাম: কম থেকে বেশি
                </button>
                <button
                  onClick={() => {
                    setSortBy("desc");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="w-4">{sortBy === "desc" ? "✓" : ""}</span>{" "}
                  দাম: বেশি থেকে কম
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.map((product) => {
              const isUp = product.change.dir === "up";
              const isDown = product.change.dir === "down";
              const isNone = product.change.dir === "none";

              return (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between group">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-xl">
                        {product.image || product.categoryIcon}
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-green-700 transition-colors">
                          {product.nameBn}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {translateUnit(product.unit)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-0.5">
                          আজকের দাম
                        </span>
                        <div className="text-xl font-bold text-slate-900 flex items-baseline gap-1">
                          {toBnNum(product.today)}{" "}
                          <span className="text-sm font-normal text-slate-500">
                            টাকা
                          </span>
                        </div>
                      </div>

                      {/* Styled Percentage Badge */}
                      <div
                        className={`px-2 py-1 rounded-md flex items-center gap-1 text-[13px] font-semibold
                        ${isUp ? "bg-red-50 text-red-600" : ""}
                        ${isDown ? "bg-green-50 text-green-600" : ""}
                        ${isNone ? "bg-slate-50 text-slate-500" : ""}
                      `}
                      >
                        {isUp && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M10 4.5l5 7h-10l5-7z" />
                          </svg>
                        )}
                        {isDown && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M10 15.5l-5-7h10l-5 7z" />
                          </svg>
                        )}
                        {isNone && (
                          <span className="font-bold text-[10px] mr-0.5">
                            ━
                          </span>
                        )}
                        {toBnNum(product.change.pct)}%
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
