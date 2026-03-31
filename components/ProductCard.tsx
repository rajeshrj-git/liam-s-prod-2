"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import ConditionBadge from "./ConditionBadge";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full bg-white">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <ImageIcon size={48} className="opacity-20" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.is_featured && (
            <span className="bg-accent text-white shadow-sm text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
          <ConditionBadge condition={product.condition} />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
          {product.brand} • {product.category}
        </div>
        <Link href={`/products/${product.id}`} className="block group-hover:text-accent transition-colors">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {formatPrice(product.price)}
            </div>
            {hasDiscount && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price!)}
              </div>
            )}
          </div>
          
          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all group/btn"
          >
            <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
