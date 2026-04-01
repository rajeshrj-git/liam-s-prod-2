import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Leaf, Ban, HeartHandshake } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabaseServer";

export const revalidate = 60; // Revalidate every 60s

export default async function Home() {
  const supabase = createClient();
  
  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .limit(4);

  const features = [
    { icon: <ShieldCheck size={32}/>, title: "100% Raw & Unprocessed", desc: "Straight from the hive, retaining all natural enzymes and nutrients." },
    { icon: <Leaf size={32}/>, title: "Naturally Harvested", desc: "Sourced from pristine, untouched floral environments." },
    { icon: <Ban size={32}/>, title: "No Preservatives", desc: "Absolutely no artificial additives, sugars, or chemicals." },
    { icon: <HeartHandshake size={32}/>, title: "Ethical Beekeeping", desc: "Sustainably produced prioritizing the health of the bees." },
  ];

  return (
    <>
      <HeroSection />

      {/* Stats Bar */}
      <section className="border-y border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex-1 w-full pt-4 md:pt-0">
              <h3 className="text-4xl font-bold font-serif text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">Jars Sold</p>
            </div>
            <div className="flex-1 w-full pt-6 md:pt-0">
              <h3 className="text-4xl font-bold font-serif text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">Quality Assurance</p>
            </div>
            <div className="flex-1 w-full pt-6 md:pt-0">
              <h3 className="text-4xl font-bold font-serif text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600 uppercase tracking-wider text-sm">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-4">Featured Collection</h2>
              <p className="text-gray-600 text-lg">Handpicked premium honey varieties just for you.</p>
            </div>
            <a href="/products" className="hidden md:inline-flex text-accent hover:text-accent-hover font-medium transition-colors">
              View All Products &rarr;
            </a>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 bg-white rounded-2xl border border-gray-200">
              No featured products available right now.
            </div>
          )}
        </div>
      </section>

      {/* Why Liam Products Section */}
      <section className="py-24 bg-[#FFFBEB] border-t border-amber-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6">Why Choose Liam Products?</h2>
            <p className="text-gray-600 text-lg">
              We eliminate the risk of adulterated honey by offering 100% pure, lab-tested, naturally sourced honey that tastes incredible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-md border border-amber-100 shadow-sm p-8 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 text-accent mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-serif text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
