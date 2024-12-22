import { create } from "zustand";
import { Agents, Coin, Comment } from "../../type";
import api from "@/lib/axios";
export interface TokenDetails extends Coin {
  comments: Comment[];
  agent: Agents;
}
interface TokenDetailsStore {
  data: TokenDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchTokens: (address: string) => Promise<void>;
  mutate: (
    updater: (currentData: TokenDetails | null) => TokenDetails | null
  ) => void;
}

const useTokenDetailsStore = create<TokenDetailsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchTokens: async (address: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<TokenDetails>(
        `/v1/token/details?token=${address}`
      );
      set({ data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  mutate: (updater) => {
    set((state) => ({ data: updater(state.data) }));
  },
}));

export default useTokenDetailsStore;
