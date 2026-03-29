import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const STUDENT_CATALOG_MAX_PRICE = 100000;

export type StudentCatalogFilters = {
  productType: 'all' | 'product' | 'service';
  wilayaId: number | null;
  categoryIds: number[];
  minPrice: number;
  maxPrice: number;
  safetyLevels: number[];
  sortBy: 'recent' | 'price_asc' | 'price_desc';
};

export const defaultStudentCatalogFilters: StudentCatalogFilters = {
  productType: 'all',
  wilayaId: null,
  categoryIds: [],
  minPrice: 0,
  maxPrice: STUDENT_CATALOG_MAX_PRICE,
  safetyLevels: [],
  sortBy: 'recent',
};

type StudentCatalogStore = {
  filters: StudentCatalogFilters;
  recentSearches: string[];
  setFilters: (filters: StudentCatalogFilters) => void;
  resetFilters: () => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
};

export const useStudentCatalogStore = create<StudentCatalogStore>()(
  persist(
    (set, get) => ({
      filters: defaultStudentCatalogFilters,
      recentSearches: [],
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: defaultStudentCatalogFilters }),
      addRecentSearch: (term) => {
        const normalized = term.trim();

        if (!normalized) {
          return;
        }

        const filtered = get().recentSearches.filter(
          (item) => item.toLowerCase() !== normalized.toLowerCase()
        );

        set({ recentSearches: [normalized, ...filtered].slice(0, 10) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'student-catalog-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
