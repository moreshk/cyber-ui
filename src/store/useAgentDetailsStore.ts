import { create } from "zustand";
import { Agents, Coin, Owner } from "../../type";
import api from "@/lib/axios";

export interface AgentDetails extends Agents {
  coin: Coin;
  owner: Owner;
}
interface AgentDetailsStore {
  data: AgentDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchAgents: (address: string) => Promise<void>;
  mutate: (
    updater: (currentData: AgentDetails | null) => AgentDetails | null
  ) => void;
  revalidate: (address: string) => Promise<void>;
}

const useAgentDetailsStore = create<AgentDetailsStore>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetchAgents: async (address: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<AgentDetails>(
        `/v1/agent/details?token=${address}`
      );
      set({ data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  revalidate: async (address: string) => {
    try {
      const { data } = await api.get<AgentDetails>(
        `/v1/agent/details?token=${address}`
      );
      set({ data });
    } catch (error: any) {
      console.log(error);
    }
  },
  mutate: (updater) => {
    set((state) => ({ data: updater(state.data) }));
  },
}));

export default useAgentDetailsStore;
