export type ProductCategory = "raw_honey" | "infused_honey" | "honeycomb" | "health_wellness";
export type ProductCondition = "premium" | "organic" | "natural";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  original_price: number | null;
  condition: ProductCondition;
  is_sold: boolean;
  weight: string | null;      // e.g., "500g", "1kg"
  purity: string | null;      // e.g., "100% Pure", "95% Raw"
  origin: string | null;      // e.g., "Western Ghats", "Black Forest"
  honey_type: string | null;  // e.g., "Acacia", "Multifloral"
  color_shade: string | null; // e.g., "Deep Amber", "Pale Gold"
  harvest_season: string | null; // e.g., "Spring 2024"
  description: string | null;
  images: string[];
  is_featured: boolean;
  is_available: boolean;
  stock_count: number;
  created_at: string;
  updated_at: string;
}
