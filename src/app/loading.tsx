// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Title Skeleton */}
      <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse mb-8"></div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="border border-slate-100 bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3"
          >
            {/* Image / Icon Placeholder */}
            <div className="w-full aspect-square bg-slate-100 rounded-lg animate-pulse"></div>
            
            {/* Text Content Skeleton */}
            <div className="space-y-2 mt-2">
              {/* Product Name Line */}
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
              {/* Price Line */}
              <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse"></div>
              {/* Status Badge Line */}
              <div className="h-6 w-1/3 bg-slate-100 rounded animate-pulse mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}