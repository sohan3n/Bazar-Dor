import Hero from "@/components/ui/Hero";
import ProductSection from "@/components/ui/ProductSection";


export default function Home() {
  return (
    <div className="w-full bg-[#F4F6F4]">
      {/* This container centers the content and aligns it with the Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        <ProductSection />
      </div>
    </div>
  );
};
