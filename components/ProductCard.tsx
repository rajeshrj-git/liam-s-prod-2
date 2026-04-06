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
  const isComingSoon = !product.is_available; // If unavailable, label as "Coming Soon"

  return (
    <div className={`glass-card rounded-2xl overflow-hidden group flex flex-col h-full bg-white ${isComingSoon ? "opacity-90" : ""}`}>
      <Link href={isComingSoon ? "#" : `/products/${product.id}`} className={`block relative aspect-[4/3] bg-gray-100 overflow-hidden ${isComingSoon ? "cursor-default" : ""}`}>
        {product.images && product.images.length > 0 ? (
          <>
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
              <Image
                src={product.images[0]}
                alt="Background blur"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={`object-cover blur-[30px] scale-125 opacity-40 transition-transform duration-700 ${isComingSoon ? "grayscale-[40%]" : "group-hover:scale-150 group-hover:opacity-60"}`}
              />
            </div>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className={`object-contain p-4 z-10 drop-shadow-xl transition-transform duration-500 ${isComingSoon ? "grayscale-[20%]" : "group-hover:scale-110"}`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            <ImageIcon size={48} className="opacity-20" />
          </div>
        )}
        
        {/* Coming Soon Badge */}
        {isComingSoon && (
          <div className="absolute top-4 left-4 z-10 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
            Coming Soon
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 bg-white">
        <Link href={isComingSoon ? "#" : `/products/${product.id}`} className={`block transition-colors ${isComingSoon ? "cursor-default text-gray-700" : "group-hover:text-accent"}`}>
          <h3 className="text-lg font-bold mb-4 line-clamp-2">{product.name}</h3>
        </Link>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <div>
            {isComingSoon ? (
              <div className="text-lg font-bold font-sans text-gray-400">
                TBA
              </div>
            ) : (
              <>
                <div className="text-xl font-bold font-sans text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {hasDiscount && (
                  <div className="text-sm text-gray-400 line-through">
                    {formatPrice(product.original_price!)}
                  </div>
                )}
              </>
            )}
          </div>
          
          {isComingSoon ? (
             <div
             className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 text-gray-500 font-bold text-sm select-none"
           >
             Coming Soon
           </div>
          ) : (
            <Link
              href={`/products/${product.id}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-all shadow-md shadow-accent/20 flex-shrink-0"
            >
              View Details
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
