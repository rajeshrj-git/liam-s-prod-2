"use client";

import { useForm } from "react-hook-form";
import { Product } from "@/lib/types";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

type AdminProductFormProps = {
  initialData?: Partial<Product>;
  onSuccess?: () => void;
};

export default function AdminProductForm({ initialData, onSuccess }: AdminProductFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    defaultValues: {
      ...initialData,
      is_available: initialData?.is_available ?? true,
      is_featured: initialData?.is_featured ?? false,
      is_sold: initialData?.is_sold ?? false,
      stock_count: initialData?.stock_count ?? 1,
    }
  });

  const uploadImages = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
        
      urls.push(publicData.publicUrl);
    }
    return urls;
  };

  const onSubmit = async (data: Product) => {
    setIsSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        uploadedUrls = await uploadImages(images);
      }

      const finalImages = [...existingImages, ...uploadedUrls];
      
      const payload = {
        ...data,
        images: finalImages,
        is_sold: data.is_sold,
      };

      if (initialData?.id) {
        // Update
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        // Create
        const { error } = await supabase
          .from("products")
          .insert([payload]);
        if (error) throw error;
        toast.success("Product created successfully!");
      }
      
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card border border-white/10 p-6 md:p-8 rounded-2xl max-w-4xl w-full mx-auto shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialData?.id ? "Edit Product" : "Add New Product"}
      </h2>

      {/* Images Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-300">Product Images</label>
        <ImageUploader
          existingImages={existingImages}
          onChange={setImages}
          onRemoveExisting={(url: string) => setExistingImages((prev: string[]) => prev.filter((u: string) => u !== url))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Product Name *</label>
          <input
            {...register("name", { required: true })}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
            placeholder="e.g. Raw Acacia Honey"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Brand *</label>
          <input
            {...register("brand", { required: true })}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
            placeholder="e.g. Liam's Products"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Category *</label>
          <select
            {...register("category", { required: true })}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          >
            <option value="raw_honey">Raw Honey</option>
            <option value="infused_honey">Infused Honey</option>
            <option value="honeycomb">Honeycomb</option>
            <option value="health_wellness">Health & Wellness</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Price (INR) *</label>
          <input
            type="number"
            {...register("price", { required: true, valueAsNumber: true })}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />
        </div>
        
          <input
            type="number"
            {...register("original_price", { valueAsNumber: true })}
            className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
          />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Product Quality *</label>
          <div className="flex gap-4">
            {["premium", "organic", "natural"].map((cond) => (
              <label key={cond} className="cursor-pointer relative flex items-center justify-center">
                <input
                  type="radio"
                  value={cond}
                  {...register("condition", { required: true })}
                  className="peer sr-only"
                />
                <div className={`
                  px-4 py-2 rounded-full border border-gray-200 text-sm font-medium capitalize text-gray-500
                  peer-checked:border-accent peer-checked:text-white transition-all
                  ${cond === 'premium' ? 'peer-checked:bg-[#E6A817] peer-checked:border-[#E6A817]' : 
                    cond === 'organic' ? 'peer-checked:bg-green-600 peer-checked:border-green-600' : 
                    'peer-checked:bg-amber-600 peer-checked:border-amber-600'}
                `}>
                  {cond}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Honey Details */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Honey Type (e.g. Acacia)</label>
          <input {...register("honey_type")} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Weight (e.g. 500g)</label>
          <input {...register("weight")} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Purity Level (%)</label>
          <input {...register("purity")} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Origin / Farm Location</label>
          <input {...register("origin")} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Harvest Season</label>
          <input {...register("harvest_season")} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Color / Texture</label>
          <input {...register("color_shade")} className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("is_featured")} className="w-5 h-5 accent-accent" />
          <span className="text-sm font-medium text-gray-900">Featured</span>
        </label>
        
        <label className="flex items-center gap-2 cursor-pointer mr-auto">
          <input type="checkbox" {...register("is_available")} className="w-5 h-5 accent-accent" />
          <span className="text-sm font-medium text-gray-900">Available</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent-hover text-black font-bold text-lg py-4 rounded-xl transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
