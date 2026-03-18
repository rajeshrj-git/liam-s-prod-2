import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { createClient } from "@/lib/supabaseServer";
import { Suspense } from "react";
import { Laptop } from "lucide-react";

export const revalidate = 60; // Revalidate every 60s

async function ProductGrid({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const supabase = createClient();
  let query = supabase.from("products").select("*");

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  // Handle simple sort for now
  if (searchParams.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (searchParams.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else if (searchParams.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    // default (featured first or just newest)
    query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-white/5 mx-auto max-w-2xl">
        <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Laptop size={32} className="text-gray-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
        <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Collection</h1>
          <p className="text-gray-400 text-lg">Browse our premium refurbished technology.</p>
        </div>

        <Suspense fallback={<div className="h-16 bg-card/50 rounded-xl mb-8 border border-white/10" />}>
          <FilterBar />
        </Suspense>

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonLoader key={i} />)}
          </div>
        }>
          <ProductGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
