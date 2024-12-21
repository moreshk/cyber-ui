import { create } from "zustand";
import { Coin } from "../../type";
import api from "@/lib/axios";

interface TokenStore {
  data: Coin[] | null;
  isLoading: boolean;
  error: string | null;
  fetchTokens: () => Promise<void>;
  mutate: (updater: (currentData: Coin[] | null) => Coin[] | null) => void;
}

const useTokenStore = create<TokenStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchTokens: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/v1/token/all");
      set({ data: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  mutate: (updater) => {
    set((state) => ({ data: updater(state.data) }));
  },
}));

export default useTokenStore;
