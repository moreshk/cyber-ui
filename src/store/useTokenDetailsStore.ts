import { create } from "zustand";
import { Coin } from "../../type";
import api from "@/lib/axios";

interface TokenDetailsStore {
  data: Coin | null;
  isLoading: boolean;
  error: string | null;
  fetchTokens: (address: string) => Promise<void>;
  mutate: (updater: (currentData: Coin | null) => Coin | null) => void;
}

const useTokenDetailsStore = create<TokenDetailsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchTokens: async (address: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Coin>(
        `/v1/token/details?token=${address}`
      );
      set({ data: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  mutate: (updater) => {
    set((state) => ({ data: updater(state.data) }));
  },
}));

export default useTokenDetailsStore;
