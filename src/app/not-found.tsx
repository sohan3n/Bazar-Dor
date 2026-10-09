import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <Image 
        src="/404-page-img.png" 
        alt="Page Not Found" 
        width={350} 
        height={350} 
        className="mb-6 object-contain"
      />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">দুঃখিত, পেজটি পাওয়া যায়নি!</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        আপনি যে পেজটি খুঁজছেন তা সম্ভবত সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে বা সাময়িকভাবে অনুপলব্ধ।
      </p>
      <Link 
        href="/" 
        className="bg-green-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-700 transition-colors inline-block"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}