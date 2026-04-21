import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import ProductCarousel from "@/components/ProductCarousel";
import ConditionBadge from "@/components/ConditionBadge";
import { Phone, MessageCircle, ChevronRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
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

            <div className="mb-10 w-full">
              <AddToCartButton product={product} />
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
