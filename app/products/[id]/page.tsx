import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import ProductCarousel from "@/components/ProductCarousel";
import ConditionBadge from "@/components/ConditionBadge";
import { Phone, MessageCircle, ChevronRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("name, description, images").eq("id", params.id).single();
  
  if (!product) return { title: "Product Not Found" };
  
  return {
    title: `${product.name} | Liam's Products`,
    description: product.description || `Buy premium ${product.name}`,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  let waNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  if (waNumber.length === 10) waNumber = `91${waNumber}`; // Prepend India code if missing

  const prefilledMessage = encodeURIComponent(
    `Hi Liam's Products! I'm interested in the [${product.name}] priced at ${formatPrice(product.price)}.\n\nLink: https://liamsproducts.in`
  );
  
  const whatsappLink = `https://wa.me/${waNumber}?text=${prefilledMessage}`;
  const phoneLink = `tel:${(process.env.NEXT_PUBLIC_PHONE_NUMBER || "").replace(/\s/g, "")}`;

  const renderSpec = (label: string, value: string | null) => {
    if (!value) return null;
    return (
      <div className="py-3 flex items-center justify-between border-b border-gray-100 last:border-0">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-gray-900 transition-colors">Products</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Images */}
          <div className="w-full">
            <ProductCarousel images={product.images || []} altText={product.name} />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <ConditionBadge condition={product.condition} />
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">
                  {product.brand}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-end gap-x-4 gap-y-2 mb-6">
                <div className="text-4xl text-accent font-bold tracking-tight">
                  {formatPrice(product.price)}
                </div>
                {hasDiscount && (
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.original_price!)}
                    </span>
                    <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                      {discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="bg-green-500/20 text-green-400 p-1 rounded-full"><Check size={14}/></div>
                100% Pure & Natural
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="bg-accent/20 text-accent p-1 rounded-full"><Check size={14}/></div>
                Quality Tested
              </div>
            </div>

            <div className="mb-10 bg-white/80 border border-gray-200 rounded-2xl p-6 shadow-xl z-20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Buy?</h3>
              <p className="text-sm text-gray-600 mb-6">Contact us directly to confirm availability and discuss delivery options.</p>
              {/* Warranty Flex Banner */}
              <div className="my-8 bg-gradient-to-r from-accent/20 to-transparent border border-accent/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-accent">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">Liam's Purity Guarantee</h3>
                    <p className="text-gray-600 text-sm">
                      <strong className="text-accent">100% Raw & Filtered</strong> + <strong className="text-accent">Laboratory Tested</strong>. This is our promise.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4 mt-8">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                >
                  <MessageCircle size={22} />
                  WhatsApp Us Now
                </a>
                <a 
                  href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || '+910000000000'}`}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 py-4 rounded-xl font-bold transition-colors"
                >
                  <Phone size={20} />
                  Call {process.env.NEXT_PUBLIC_PHONE_NUMBER || "Us"}
                </a>
              </div>
            </div>

            <div className="space-y-10 order-last lg:order-none mt-10 lg:mt-0">
              {product.description && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Description
                  </h3>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-2">
                  {renderSpec("Honey Type", product.honey_type)}
                  {renderSpec("Net Weight", product.weight)}
                  {renderSpec("Purity Level", product.purity)}
                  {renderSpec("Harvest Region", product.origin)}
                  {renderSpec("Harvest Season", product.harvest_season)}
                  {renderSpec("Texture / Color", product.color_shade)}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
