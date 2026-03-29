import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StudentBusinessFilters = {
  businessType: 'all' | 'laboratory' | 'supplier';
  wilayaId: number | null;
  sortBy: 'recent' | 'featured' | 'name';
};

export const defaultStudentBusinessFilters: StudentBusinessFilters = {
  businessType: 'all',
  wilayaId: null,
  sortBy: 'featured',
};

type StudentBusinessSearchStore = {
  filters: StudentBusinessFilters;
  recentSearches: string[];
  setFilters: (filters: StudentBusinessFilters) => void;
  resetFilters: () => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
};

export const useStudentBusinessSearchStore = create<StudentBusinessSearchStore>()(
  persist(
    (set, get) => ({
      filters: defaultStudentBusinessFilters,
      recentSearches: [],
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: defaultStudentBusinessFilters }),
      addRecentSearch: (term) => {
        const normalized = term.trim();

        if (!normalized) return;

        const filtered = get().recentSearches.filter(
          (item) => item.toLowerCase() !== normalized.toLowerCase()
        );

        set({ recentSearches: [normalized, ...filtered].slice(0, 10) });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'student-business-search-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
