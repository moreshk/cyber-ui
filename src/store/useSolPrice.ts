import { create } from "zustand";
import api from "@/lib/axios";

interface SolPriceState {
  solPrice: number | null;
  loading: boolean;
  error: string | null;
  fetchSolPrice: () => Promise<void>;
}

const useSolPriceStore = create<SolPriceState>((set) => ({
  solPrice: null,
  loading: false,
  error: null,
  fetchSolPrice: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/v1/token/sol-price");
      set({ solPrice: response.data.price, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch SOL price.",
        loading: false,
      });
    }
  },
}));

export default useSolPriceStore;
