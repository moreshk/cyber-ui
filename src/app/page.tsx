"use client";

import WSHome from "@/components/custom/WSHome";
import useTokenStore from "@/store/useTokenStore";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading, fetchTokens } = useTokenStore();

  useEffect(() => {
    fetchTokens();
  }, []);

  if (isLoading || !data) {
    <div>Loading</div>;
  }

  return (
    <div>
      {data?.map((coin) => (
        <div key={coin.mintAddress}>
          <img src={coin.imgUrl} alt="token image" />
          <p>Create by {coin.creatorWalletAddress}</p>
          <p>{coin.description}</p>
        </div>
      ))}
      <WSHome />
    </div>
  );
}
