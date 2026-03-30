import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const STUDENT_LABORATORY_SERVICE_MAX_PRICE = 100000;

export type StudentLaboratoryServiceFilters = {
  productType: 'all' | 'product' | 'service';
  wilayaId: number | null;
  categoryIds: number[];
  minPrice: number;
  maxPrice: number;
  safetyLevels: number[];
  sortBy: 'recent' | 'price_asc' | 'price_desc';
};

export const defaultStudentLaboratoryServiceFilters: StudentLaboratoryServiceFilters = {
  productType: 'all',
  wilayaId: null,
  categoryIds: [],
  minPrice: 0,
  maxPrice: STUDENT_LABORATORY_SERVICE_MAX_PRICE,
  safetyLevels: [],
  sortBy: 'recent',
};

type StudentLaboratoryServiceStore = {
  filters: StudentLaboratoryServiceFilters;
  recentSearches: string[];
  setFilters: (filters: StudentLaboratoryServiceFilters) => void;
  resetFilters: () => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  reset: () => void;
};

export const useStudentLaboratoryServiceStore = create<StudentLaboratoryServiceStore>()(
  persist(
    (set, get) => ({
      filters: defaultStudentLaboratoryServiceFilters,
      recentSearches: [],
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: defaultStudentLaboratoryServiceFilters }),
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
      reset: () => set({ filters: defaultStudentLaboratoryServiceFilters, recentSearches: [] }),
    }),

    {
      name: 'student-laboratory-service-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
