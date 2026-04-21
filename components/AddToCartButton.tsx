"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    weight_options?: string[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedWeight, setSelectedWeight] = useState(
    product.weight_options?.[0] || "1kg"
  );
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price, // Assuming base price here for simplicity
      qty,
      image_url: product.images?.[0],
      weight_option: selectedWeight,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 shadow-xl z-20 mb-10 w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Add to Cart</h3>

      {product.weight_options && product.weight_options.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Weight</label>
          <div className="flex flex-wrap gap-2">
            {product.weight_options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedWeight(option)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                  selectedWeight === option
                    ? "border-accent bg-accent/10 text-accent font-bold ring-1 ring-accent"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <label className="block text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            -
          </button>
          <span className="px-4 py-1 font-semibold text-gray-900 min-w-[2.5rem] text-center border-x border-gray-200">
            {qty}
          </span>
          <button
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white py-4 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 shadow-md shadow-accent/20"
      >
        <ShoppingCart size={22} />
        Add to Cart
      </button>
    </div>
  );
}
