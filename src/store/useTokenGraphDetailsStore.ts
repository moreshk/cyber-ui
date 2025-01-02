import { create } from "zustand";
import api from "@/lib/axios";

export interface GraphDetails {
  id: number;
  updatedAt: Date | null;
  createdAt: Date | null;
  deletedAt: Date | null;
  coinId: string;
  unixTimestamp: string;
  timestamp: Date;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  solQuantity: string;
  tokenQuantity: string;
  numberOfTrades: number;
}
interface TokenDetailsStore {
  data: GraphDetails[] | null;
  isLoading: boolean;
  error: string | null;
  fetchTokenGraph: (address: string) => Promise<void>;
  mutate: (
    updater: (currentData: GraphDetails[] | null) => GraphDetails[] | null
  ) => void;
}

const useTokenGraphDetailsStore = create<TokenDetailsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchTokenGraph: async (address: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<GraphDetails[]>(
        `/v1/token/ohlc?token=${address}`
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

export default useTokenGraphDetailsStore;
