import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'fr' | 'ar';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
  reset: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      isRTL: false,
      setLanguage: async (language: Language) => {
        const isRTL = language === 'ar';
        const currentIsRTL = get().isRTL;
        const currentLanguage = get().language;

        if (language === currentLanguage) return;

        set({ language, isRTL });
      },
      reset: () => set({ language: 'en', isRTL: false }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

