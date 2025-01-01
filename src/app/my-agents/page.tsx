"use client";
import { buttonVariants } from "@/components/ui/button";
import { Crown, Plus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { Coin } from "../../../type";
import { truncateAddress } from "@/lib/utils";
import dayjs from "dayjs";
import { FaTelegram } from "react-icons/fa";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Page = () => {
  const { data, isLoading } = useSWR<Coin[]>("/v1/agent/my-agents");

  if (isLoading || !data) {
    return <div>Loading</div>;
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">My Agents</h1>
        <Link href="/create-agent" className={buttonVariants({})}>
          <Plus className="w-5 h-5 mr-2" />
          Create Agent
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((coin: Coin) => (
          <Link
            href={`/agent/${coin.mintAddress}`}
            key={coin.mintAddress}
            className="rounded-lg hover:bg-baseSecondary border border-basePrimary p-2"
          >
            <div className="gap-2 rounded-lg hover:bg-baseSecondary flex items-center">
              <img
                src={coin.imgUrl}
                className="w-32 h-32"
                width={128}
                height={128}
                alt="token image"
              />
              <div>
                <div className="flex gap-2 items-center">
                  <p className="text-sm">
                    Create by {truncateAddress(coin.creatorWalletAddress)}
                  </p>
                </div>
                <p className="text-sm">{dayjs(coin.createdAt).fromNow()}</p>
                {coin.marketCap && (
                  <div className="text-sm text-basePrimary flex items-center gap-2 font-semibold">
                    <p>Market cap: ${coin.marketCap || "0"}</p>
                    {coin.kingOfTheHillTimeStamp && (
                      <Crown className="w-4 h-4 rotate-6" />
                    )}
                  </div>
                )}
                <p className="text-sm text-basePrimary">
                  Credits Used {coin.agent.usedPoints}
                </p>
                <p>
                  <span className="font-bold">
                    {coin.name}({coin.symbol}):
                  </span>{" "}
                  {coin.description}
                </p>
                <div className="pt-2">
                  {coin?.agent?.telegramName && (
                    <a
                      href={`https://t.me/${coin?.agent.telegramName}`}
                      className={buttonVariants({})}
                    >
                      <FaTelegram />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-7 border-t border-t-basePrimary">
              <p className="text-center py-2 text-basePrimary font-bold">
                Credits Remaining {coin.agent.points}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
