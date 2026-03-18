import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, ShieldCheck, Tag, Zap, Cpu, Star, Headphones, Truck } from "lucide-react";
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
    { icon: <ShieldCheck size={32}/>, title: "Quality Tested", desc: "Rigorous 50-point inspection on every device." },
    { icon: <Zap size={32}/>, title: "Best Prices", desc: "Premium technology at unbeatable wholesale rates." },
    { icon: <Headphones size={32}/>, title: "Expert Support", desc: "Dedicated team to help you choose right." },
    { icon: <Truck size={32}/>, title: "Fast Delivery", desc: "Same day dispatch for all verified orders." },
  ];

  return (
    <>
      <HeroSection />

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex-1 w-full pt-4 md:pt-0">
              <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Devices Sold</p>
            </div>
            <div className="flex-1 w-full pt-6 md:pt-0">
              <h3 className="text-4xl font-bold text-white mb-2">100%</h3>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Quality Assurance</p>
            </div>
            <div className="flex-1 w-full pt-6 md:pt-0">
              <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
              <p className="text-gray-400 uppercase tracking-wider text-sm">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Featured Collection</h2>
              <p className="text-gray-400 text-lg">Handpicked premium devices just for you.</p>
            </div>
            <a href="/products" className="hidden md:inline-flex text-accent hover:text-white font-medium transition-colors">
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
            <div className="text-center py-12 text-gray-500 bg-card rounded-2xl border border-white/5">
              No featured products available right now.
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <a href="/products" className="inline-flex text-accent hover:text-white font-medium transition-colors">
              View All Products &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Why Jarvis Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why Choose Jarvis?</h2>
            <p className="text-gray-400 text-lg">
              We eliminate the risk of buying refurbished tech by offering enterprise-grade devices that look and perform like brand new.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 text-accent mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-black transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
