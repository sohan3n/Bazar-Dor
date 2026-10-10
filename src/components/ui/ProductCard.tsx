import Link from "next/link";

// Shared interface for all product data
export interface Product {
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
    gm: "প্রতি গ্রাম",
  };
  return unitMap[unit.toLowerCase()] || `প্রতি ${unit}`;
};

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isNone = product.change.dir === "none";

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between group">
        
        {/* Top: Icon, Name, Unit */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-xl shrink-0">
            {product.image || product.categoryIcon}
          </div>
          <div>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-900 group-hover:text-green-700 transition-colors line-clamp-1">
              {product.nameBn}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{translateUnit(product.unit)}</p>
          </div>
        </div>

        {/* Bottom: Price and Percentage */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">আজকের দাম</span>
            <div className="text-lg sm:text-xl font-bold text-slate-900 flex items-baseline gap-1">
              {toBnNum(product.today)} <span className="text-sm font-normal text-slate-500">টাকা</span>
            </div>
          </div>
          
          {/* Dynamic Percentage Badge */}
          <div className={`flex items-center gap-1 text-[13px] font-bold
            ${isUp ? 'text-red-500' : ''}
            ${isDown ? 'text-green-600' : ''}
            ${isNone ? 'text-slate-400' : ''}
          `}>
            {isUp && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10 4.5l5 7h-10l5-7z" />
              </svg>
            )}
            {isDown && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10 15.5l-5-7h10l-5 7z" />
              </svg>
            )}
            {isNone && (
              <span className="mr-0.5 text-lg leading-none">-</span>
            )}
            {toBnNum(product.change.pct)}%
          </div>
        </div>
        
      </div>
    </Link>
  );
}