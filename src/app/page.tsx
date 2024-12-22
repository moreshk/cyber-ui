"use client";

import WSHome from "@/components/custom/WSHome";
import { truncateAddress } from "@/lib/utils";
import useTokenStore from "@/store/useTokenStore";
import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function Home() {
  const { data, isLoading, fetchTokens } = useTokenStore();

  useEffect(() => {
    fetchTokens();
  }, []);

  if (isLoading || !data) {
    <div>Loading</div>;
  }
  return (
    <div className="max-w-7xl mx-auto pt-2">
      {data?.map((coin) => (
        <Link
          href={`/token/${coin.mintAddress}`}
          key={coin.mintAddress}
          className="flex gap-2"
        >
          <img
            src={coin.imgUrl}
            className="w-32 h-32 border rounded-lg"
            width={128}
            height={128}
            alt="token image"
          />
          <div>
            <p>Create by {truncateAddress(coin.creatorWalletAddress)}</p>
            <p>{dayjs(coin.createdAt).fromNow()}</p>
            <p>{coin.description}</p>
          </div>
        </Link>
      ))}
      <WSHome />
    </div>
  );
}
