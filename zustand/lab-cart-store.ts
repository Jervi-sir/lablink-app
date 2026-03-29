import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartLab = {
  id: number;
  name: string;
  logo?: string | null;
};

export type LabCartItem = {
  productId: number;
  businessId: number;
  name: string;
  productType: string;
  unit?: string | null;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

export type Cart = {
  business: CartLab;
  items: LabCartItem[];
  updatedAt: number;
};

type UpsertCartItemInput = Omit<LabCartItem, 'quantity'> & {
  quantity: number;
};

type LabCartState = {
  carts: Record<number, Cart>;
  // Actions
  upsertItem: (business: CartLab, item: UpsertCartItemInput) => void;
  updateQuantity: (businessId: number, productId: number, quantity: number) => void;
  removeItem: (businessId: number, productId: number) => void;
  clearCart: (businessId: number) => void;
  clearAllCarts: () => void;
};

export const useLabCartStore = create<LabCartState>()(
  persist(
    (set) => ({
      carts: {},

      upsertItem: (business, item) => set((state) => {
        const businessId = business.id;
        const currentCart = state.carts[businessId] || { business, items: [], updatedAt: Date.now() };
        const nextItems = [...currentCart.items];
        
        const existingIndex = nextItems.findIndex((entry) => entry.productId === item.productId);

        if (item.quantity <= 0) {
          const filteredItems = nextItems.filter((entry) => entry.productId !== item.productId);
          if (filteredItems.length === 0) {
            const nextCarts = { ...state.carts };
            delete nextCarts[businessId];
            return { carts: nextCarts };
          }
          return {
            carts: {
              ...state.carts,
              [businessId]: { ...currentCart, items: filteredItems, updatedAt: Date.now() }
            }
          };
        }

        if (existingIndex >= 0) {
          nextItems[existingIndex] = { ...nextItems[existingIndex], ...item };
        } else {
          nextItems.push(item);
        }

        return {
          carts: {
            ...state.carts,
            [businessId]: { ...currentCart, items: nextItems, updatedAt: Date.now() }
          }
        };
      }),

      updateQuantity: (businessId, productId, quantity) => set((state) => {
        const currentCart = state.carts[businessId];
        if (!currentCart) return state;

        const nextItems = quantity <= 0
          ? currentCart.items.filter((item) => item.productId !== productId)
          : currentCart.items.map((item) => item.productId === productId ? { ...item, quantity } : item);

        if (nextItems.length === 0) {
          const nextCarts = { ...state.carts };
          delete nextCarts[businessId];
          return { carts: nextCarts };
        }

        return {
          carts: {
            ...state.carts,
            [businessId]: { ...currentCart, items: nextItems, updatedAt: Date.now() }
          }
        };
      }),

      removeItem: (businessId, productId) => set((state) => {
        const currentCart = state.carts[businessId];
        if (!currentCart) return state;

        const nextItems = currentCart.items.filter((item) => item.productId !== productId);

        if (nextItems.length === 0) {
          const nextCarts = { ...state.carts };
          delete nextCarts[businessId];
          return { carts: nextCarts };
        }

        return {
          carts: {
            ...state.carts,
            [businessId]: { ...currentCart, items: nextItems, updatedAt: Date.now() }
          }
        };
      }),

      clearCart: (businessId) => set((state) => {
        const nextCarts = { ...state.carts };
        delete nextCarts[businessId];
        return { carts: nextCarts };
      }),

      clearAllCarts: () => set({ carts: {} }),
    }),
    {
      name: 'lab-multi-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
