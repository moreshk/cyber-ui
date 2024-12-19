"use client";
import dynamic from "next/dynamic";

const AppWalletProvider = dynamic(
  () => import("@/providers/AppWalletProvider"),
  {
    ssr: false,
  }
);

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <AppWalletProvider>{children}</AppWalletProvider>;
};

export default Wrapper;
