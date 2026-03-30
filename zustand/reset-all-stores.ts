import { useAuthStore } from './auth-store';
import { useLanguageStore } from './language-store';
import { useNetworkStore } from './network-store';
import { useLabCartStore } from '../screens/student/zustand/lab-cart-store';
import { useStudentBusinessSearchStore } from '../screens/student/zustand/student-business-search-store';
import { useStudentCatalogStore } from '../screens/student/zustand/student-catalog-store';
import { useInventoryStore } from '../screens/business/zustand/inventory-store';

/**
 * Resets all Zustand stores to their initial states.
 * Useful for logout or clearing application data.
 */
export const resetAllStores = () => {
  useAuthStore.getState().reset();
  useLanguageStore.getState().reset();
  useNetworkStore.getState().reset();
  useLabCartStore.getState().reset();
  useStudentBusinessSearchStore.getState().reset();
  useStudentCatalogStore.getState().reset();
  useInventoryStore.getState().reset();
};
