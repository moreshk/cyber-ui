"use client";

import WSHome from "@/components/custom/WSHome";
import { truncateAddress } from "@/lib/utils";
import useTokenStore from "@/store/useTokenStore";
import { useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import useSWR from "swr";
import { Coin } from "../../type";
import { Crown } from "lucide-react";
import { FaTelegram } from "react-icons/fa";

dayjs.extend(relativeTime);

export default function Home() {
  const { data, isLoading, fetchTokens } = useTokenStore();
  const { data: kingOfTheHill } = useSWR<Coin>("/v1/token/king-of-the-hill");

  useEffect(() => {
    fetchTokens();
  }, []);

  if (isLoading || !data) {
    <div>Loading</div>;
  }
  return (
    <div className="mx-auto pt-2">
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
      {kingOfTheHill && (
        <>
          <p className="text-center text-2xl font-semibold italic py-7">
            King of the hill
          </p>
          <div className="flex justify-center items-center">
            <Link
              href={`/token/${kingOfTheHill.mintAddress}`}
              key={kingOfTheHill.mintAddress}
              className="flex gap-2 rounded-lg p-4 hover:bg-baseSecondary"
            >
              <img
                src={kingOfTheHill.imgUrl}
                className="w-32 h-32"
                width={128}
                height={128}
                alt="token image"
              />
              <div>
                <div className="flex gap-2 items-center">
                  <p className="text-sm">
                    Create by{" "}
                    {truncateAddress(kingOfTheHill.creatorWalletAddress)}
                  </p>
                </div>
                <p className="text-sm">
                  {dayjs(kingOfTheHill.createdAt).fromNow()}
                </p>
                {kingOfTheHill.marketCap && (
                  <div className="text-sm text-basePrimary flex items-center gap-2 font-semibold">
                    <p>Market cap: ${kingOfTheHill.marketCap || "0"}</p>
                    {kingOfTheHill.kingOfTheHillTimeStamp && (
                      <Crown className="w-4 h-4 rotate-6" />
                    )}
                  </div>
                )}
                <p className="text-sm text-basePrimary">
                  Credits Used {kingOfTheHill.agent.usedPoints}
                </p>
                <p>
                  <span className="font-bold">
                    {kingOfTheHill.name}({kingOfTheHill.symbol}):
                  </span>{" "}
                  {kingOfTheHill.description}
                </p>
                <div className="pt-2">
                  {kingOfTheHill?.agent?.telegramName && (
                    <a
                      href={`https://t.me/${kingOfTheHill?.agent.telegramName}`}
                      className={buttonVariants({})}
                    >
                      <FaTelegram />
                    </a>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </>
      )}
      <div className="px-10 mx-auto pt-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-cols-3 gap-4">
          {data?.map((coin) => (
            <Link
              href={`/token/${coin.mintAddress}`}
              key={coin.mintAddress}
              className="flex gap-2 rounded-lg p-4 hover:bg-baseSecondary"
            >
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
            </Link>
          ))}
        </div>
      </div>
      <WSHome />
    </div>
  );
}
