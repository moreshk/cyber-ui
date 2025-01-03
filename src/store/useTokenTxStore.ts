import { create } from "zustand";
import { Tx } from "../../type";
import api from "@/lib/axios";

interface TxDetailsStore {
  data: Tx[] | null;
  isLoading: boolean;
  error: string | null;
  fetchTxs: (address: string) => Promise<void>;
  mutate: (updater: (currentData: Tx[] | null) => Tx[] | null) => void;
}

const useTxDetailsStore = create<TxDetailsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchTxs: async (address: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<Tx[]>(
        `/v1/token/tx-list?token=${address}`
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

export default useTxDetailsStore;
