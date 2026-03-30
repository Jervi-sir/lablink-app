import { create } from "zustand";
import api from "@/utils/api/axios-instance";
import { ApiRoutes } from "@/utils/api/api";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  images: Array<{ url: string }>;
  category: {
    code: string;
  };
}

interface InventoryState {
  products: Product[];
  total: number;
  nextPage: number | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  fetchInventory: (page?: number, shouldRefresh?: boolean, searchQuery?: string, activeTab?: string) => Promise<void>;
  addProductLocal: (product: Product) => void;
  updateProductLocal: (productId: string | number, updates: Partial<Product>) => void;
  deleteProductLocal: (productId: string | number) => void;
  reset: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  products: [],
  total: 0,
  nextPage: 1,
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,

  fetchInventory: async (page = 1, shouldRefresh = false, searchQuery = "", activeTab = "All") => {
    // Correct loading states
    if (page === 1) {
      if (shouldRefresh) {
        set({ isRefreshing: true });
      } else {
        set({ isLoading: true });
      }
    } else {
      set({ isLoadingMore: true });
    }

    try {
      const response: any = await api.get(ApiRoutes.products.inventory, {
        params: {
          page,
          search: searchQuery,
          status: activeTab,
          per_page: 10,
        },
      });

      const { data, next_page, total } = response;

      set((state) => ({
        products: page === 1 ? (data || []) : [...state.products, ...(data || [])],
        nextPage: next_page,
        total: total || 0,
      }));
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      set({
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
      });
    }
  },
  
  addProductLocal: (product) => {
    set((state) => ({
      products: [product, ...state.products],
      total: state.total + 1,
    }));
  },

  updateProductLocal: (productId, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id.toString() === productId.toString() ? { ...p, ...updates } : p
      ),
    }));
  },

  deleteProductLocal: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id.toString() !== productId.toString()),
      total: Math.max(0, state.total - 1),
    }));
  },

  reset: () => set({
    products: [],
    total: 0,
    nextPage: 1,
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
  }),
}));

