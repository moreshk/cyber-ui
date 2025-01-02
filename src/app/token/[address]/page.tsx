"use client";

import useTokenDetailsStore from "@/store/useTokenDetailsStore";
import dayjs from "dayjs";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { first4Characters } from "@/lib/utils";
import Avatar from "boring-avatars";
import Chart from "./components/chart";
import WSTokenDetails from "./components/WSTokenDetails";
import Swap from "./components/Swap";
import { Badge } from "@/components/ui/badge";
import { FaTelegram } from "react-icons/fa";
import { buttonVariants } from "@/components/ui/button";
import { CommentInput } from "./components/commentInput";
import ExistingHolders from "./components/ExistingHolders";
import BondingCurveProgress from "./components/BondingCurveProgress";
import BuyCredits from "./components/BuyCredits";
import TxList from "./components/TxList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTokenGraphDetailsStore from "@/store/useTokenGraphDetailsStore";
import MarketCap from "./components/MarketCap";
import ContractAddress from "./components/ContractAddress";

dayjs.extend(relativeTime);

const Page = () => {
  const { address } = useParams() as { address: string };
  const { fetchTokens, data, isLoading } = useTokenDetailsStore();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const pathname = usePathname();
  const {
    fetchTokenGraph,
    isLoading: fetchTokenGraphLoading,
    data: tokenGraph,
  } = useTokenGraphDetailsStore();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    fetchTokens(address);
    fetchTokenGraph(address);
  }, []);

  if (isLoading || !data || fetchTokenGraphLoading || !tokenGraph) {
    <div>Loading</div>;
  }

  if (data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mt-6 p-6">
          <div key={data.mintAddress} className="flex gap-2">
            <img
              src={data.imgUrl}
              className="w-32 h-32"
              width={128}
              height={128}
              alt="token image"
            />
            <div className="flex items-center gap-2 w-full">
              <div className="flex gap-4 flex-col w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-semibold">{data.name}</p>
                  {data?.agent?.twitterUrl && (
                    <a target="_blank" href={data.agent.telegramUrl}>
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.3263 1.90393H21.6998L14.3297 10.3274L23 21.7899H16.2112L10.894 14.838L4.80995 21.7899H1.43443L9.31743 12.78L1 1.90393H7.96111L12.7674 8.25826L18.3263 1.90393ZM17.1423 19.7707H19.0116L6.94539 3.81706H4.93946L17.1423 19.7707Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  )}
                  {data?.agent?.telegramUrl && (
                    <a target="_blank" href={data.agent.telegramUrl}>
                      <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.51239 10.8488C8.41795 8.27585 12.3559 6.57959 14.3263 5.76003C19.9521 3.42005 21.1211 3.01357 21.883 3.00014C22.0506 2.99719 22.4253 3.03872 22.668 3.23567C22.873 3.40197 22.9294 3.62661 22.9563 3.78428C22.9833 3.94195 23.0169 4.30112 22.9902 4.58177C22.6854 7.78504 21.3662 15.5585 20.6951 19.1462C20.4111 20.6643 19.852 21.1733 19.3107 21.2231C18.1343 21.3314 17.2409 20.4457 16.1015 19.6988C14.3186 18.53 13.3113 17.8025 11.5807 16.662C9.58058 15.3439 10.8772 14.6195 12.017 13.4356C12.3153 13.1258 17.4986 8.41117 17.5989 7.98348C17.6115 7.92999 17.6231 7.7306 17.5046 7.62532C17.3862 7.52004 17.2114 7.55604 17.0852 7.58467C16.9064 7.62526 14.0581 9.50789 8.54035 13.2326C7.73187 13.7877 6.99958 14.0582 6.34347 14.044C5.62016 14.0284 4.2288 13.6351 3.19447 13.2988C1.92583 12.8865 0.91753 12.6684 1.00533 11.9681C1.05106 11.6033 1.55341 11.2302 2.51239 10.8488Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  )}
                  <p className="text-[#5EA0F6] whitespace-nowrap">
                    ~ {dayjs(data.createdAt).fromNow()}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full flex-1">
                  <p className="text-sm opacity-65 w-80">{data.description}</p>
                  <div className="flex justify-between w-full">
                    <div className="flex justify-between items-center gap-5">
                      <MarketCap />
                      <ContractAddress />
                      <div className=" gap-2 text-right">
                        <p>Credits Consumed</p>
                        <p className="text-xl font-bold">
                          {data.agent.usedPoints}
                        </p>
                      </div>
                      <div className=" gap-2 text-right">
                        <p>Credits Remaining</p>
                        <p className="text-xl font-bold">{data.agent.points}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <div className="flex items-center gap-2 w-full">
                        <Avatar
                          name={data.creatorWalletAddress}
                          height={24}
                          width={24}
                          variant="pixel"
                        />
                        <p className="bg-baseSecondary text-sm text-white font-medium rounded-2xl text-center py-1 px-2">
                          {data.creatorWalletAddress.slice(0, 4)}
                        </p>
                      </div>
                      <button
                        className="text-sm bg-basePrimary text-baseSecondary py-1 px-2 rounded-3xl font-bold"
                        onClick={() =>
                          router.push(
                            pathname +
                              "?" +
                              createQueryString("type", "buy-credits")
                          )
                        }
                      >
                        Top Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-10 pt-7">
            <div className="col-span-2">
              <Chart />
              <></>
              <div className="pt-9">
                <Tabs defaultValue="comment">
                  <TabsList className="grid w-72 grid-cols-2">
                    <TabsTrigger value="comment">Thread</TabsTrigger>
                    <TabsTrigger value="tx">Trades</TabsTrigger>
                  </TabsList>
                  <TabsContent value="comment">
                    <div className="flex items-center gap-2">
                      <CommentInput />
                      {data?.agent?.telegramName && (
                        <a
                          href={`https://t.me/${data?.agent.telegramName}`}
                          className={buttonVariants({})}
                        >
                          Telegram {data?.agent.telegramName}
                          <FaTelegram />
                        </a>
                      )}
                    </div>
                    <div className="space-y-4 max-w-2xl pt-3">
                      {data.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-baseSecondary rounded-lg p-4"
                        >
                          <div className="flex gap-2">
                            <Avatar
                              name={comment.walletAddress}
                              height={20}
                              width={20}
                              variant="pixel"
                            />
                            <Badge>
                              {first4Characters(comment.walletAddress)}
                            </Badge>
                            {dayjs(comment.createdAt).fromNow()}
                          </div>
                          {comment.content}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="tx">
                    <TxList />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="flex-1 w-full">
              <Swap />
              <BondingCurveProgress />
              <ExistingHolders />
            </div>
          </div>
        </div>
        <BuyCredits
          open={type === "buy-credits"}
          onBack={() => router.push(pathname)}
        />
        <WSTokenDetails />
      </div>
    );
  }
  return <div>No token found</div>;
};

export default Page;
