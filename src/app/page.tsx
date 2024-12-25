"use client";

import WSHome from "@/components/custom/WSHome";
import { truncateAddress } from "@/lib/utils";
import useTokenStore from "@/store/useTokenStore";
import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
      <div className="flex justify-center items-center pt-6">
        <Link
          href="/create-agent"
          className={buttonVariants({
            variant: "default",
          })}
        >
          Create Agent
        </Link>
      </div>
      <p className="text-center text-2xl font-semibold italic pt-7">
        King of the hill
      </p>
      <div className="max-w-7xl mx-auto pt-8">
        <div className="grid grid-cols-3 gap-4">
          {data?.map((coin) => (
            <Link
              href={`/token/${coin.mintAddress}`}
              key={coin.mintAddress}
              className="flex gap-2 hover:bg-gray-200 rounded-lg p-4"
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
        </div>
      </div>
      <WSHome />
    </div>
  );
}
