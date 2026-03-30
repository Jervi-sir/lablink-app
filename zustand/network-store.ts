import { create } from 'zustand';

type NetworkState = {
  isOffline: boolean;
  setIsOffline: (status: boolean) => void;
  reset: () => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  isOffline: false,
  setIsOffline: (status) => set({ isOffline: status }),
  reset: () => set({ isOffline: false }),
}));

