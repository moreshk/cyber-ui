"use client";
import api from "@/lib/axios";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

const AppWalletProvider = dynamic(
  () => import("@/providers/AppWalletProvider"),
  {
    ssr: false,
  }
);
const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppWalletProvider>
      <SWRConfig
        value={{
          fetcher: (url: string) => fetcher(url),
        }}
      >
        {children}
      </SWRConfig>
    </AppWalletProvider>
  );
};

export default Wrapper;
