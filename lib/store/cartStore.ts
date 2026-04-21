import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
  weight_option?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, weight_option?: string) => void;
  updateQuantity: (product_id: string, qty: number, weight_option?: string) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.product_id === item.product_id && i.weight_option === item.weight_option
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.product_id === item.product_id && i.weight_option === item.weight_option
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (product_id, weight_option) => {
        set({
          items: get().items.filter(
            (i) => !(i.product_id === product_id && i.weight_option === weight_option)
          ),
        });
      },
      updateQuantity: (product_id, qty, weight_option) => {
        set({
          items: get().items.map((i) =>
            i.product_id === product_id && i.weight_option === weight_option ? { ...i, qty } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalQuantity: () => get().items.reduce((total, item) => total + item.qty, 0),
      getSubtotal: () => get().items.reduce((total, item) => total + item.price * item.qty, 0),
    }),
    {
      name: 'honey-cart-storage',
    }
  )
);
