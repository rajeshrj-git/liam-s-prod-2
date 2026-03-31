"use client";

import { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sort");

  const categories = [
    { id: "all", label: "All Items" },
    { id: "raw", label: "Raw Honey" },
    { id: "infused", label: "Infused Honey" },
    { id: "gift", label: "Gift Sets" },
  ];

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (!sort) {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Mobile Toggle */}
        <div className="flex items-center justify-between md:hidden">
          <span className="font-semibold text-white flex items-center gap-2">
            <Filter size={18} className="text-accent" />
            Filters
          </span>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-white/10 rounded-lg hover:border-accent transition-colors"
          >
            {isOpen ? <X size={20} /> : <SlidersHorizontal size={20} />}
          </button>
        </div>

        {/* Categories (Desktop + Mobile AnimatePresence) */}
        <div className={`md:flex gap-2 ${isOpen ? "flex flex-col mt-4" : "hidden"} md:mt-0 md:flex-row`}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (currentCategory === cat.id || (!currentCategory && cat.id === "all"))
                  ? "bg-accent text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className={`md:flex items-center gap-3 ${isOpen ? "flex" : "hidden"} mt-4 md:mt-0`}>
          <span className="text-sm text-gray-400 hidden md:block">Sort by:</span>
          <select
            value={currentSort || ""}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent w-full md:w-auto"
          >
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

      </div>
    </div>
  );
}
