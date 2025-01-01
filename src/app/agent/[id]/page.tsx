"use client";

import React, { useCallback, useEffect } from "react";
import { CircleFadingArrowUp, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Discord from "./Component/Discord";
import Sandbox from "./Component/Sandbox";
import Telegram from "./Component/Telegram";
import EditForm from "./Component/EditForm";
import useAgentDetailsStore from "@/store/useAgentDetailsStore";
import WSAgentDetails from "@/app/token/[address]/components/WSAgentDetails";
import Buy from "./Component/Buy";
import { FaTelegram } from "react-icons/fa";

const Page = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, fetchAgents } = useAgentDetailsStore();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchAgents(params.id);
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3 justify-between w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{data.name}</h1>
            <Button
              variant="ghost"
              onClick={() =>
                router.push(pathname + "?" + createQueryString("type", "edit"))
              }
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <Button
            onClick={() =>
              router.push(pathname + "?" + createQueryString("type", "buy"))
            }
          >
            Credits Remaining
            <span className="text-2xl font-bold">{data.points}</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          className="flex items-center gap-2"
          onClick={() =>
            router.push(pathname + "?" + createQueryString("type", "telegram"))
          }
        >
          <FaTelegram className="w-4 h-4" />
          Telegram
        </Button>
        {/* <Button
          className="flex items-center gap-2"
          onClick={() =>
            router.push(pathname + "?" + createQueryString("type", "discord"))
          }
        >
          <FaDiscord className="w-4 h-4" />
          Discord
        </Button> */}
        {/* <Button
          className="flex items-center gap-2"
          onClick={() =>
            router.push(pathname + "?" + createQueryString("type", "sandbox"))
          }
        >
          <FlaskConical className="w-4 h-4" />
          Sandbox
        </Button> */}
        <Button
          onClick={() =>
            router.push(pathname + "?" + createQueryString("type", "buy"))
          }
        >
          <CircleFadingArrowUp className="w-4 h-4" />
          Top Up
        </Button>
      </div>
      {type !== "buy" && !data.telegramName && (
        <div className="bg-baseSecondary text-white p-4 rounded-lg mb-8">
          You have successfully created your agent! Link TG bot to start talking
          & training your agent.
        </div>
      )}
      {type == "telegram" ? (
        <Telegram />
      ) : type == "discord" ? (
        <Discord />
      ) : type == "buy" ? (
        <Buy />
      ) : type == "sandbox" ? (
        <Sandbox />
      ) : type == "edit" ? (
        <EditForm />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div className="bg-baseSecondary p-4 rounded-lg font-medium">
              <p>{data.description}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Personality</h2>
            <div className="bg-baseSecondary p-4 rounded-lg font-medium">
              <p>{data.personality}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Instruction</h2>
            <div className="bg-baseSecondary p-4 rounded-lg font-medium">
              <p>{data.instruction}</p>
            </div>
          </div>
          {data.knowledge && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Knowledge Base</h2>
              <div className="bg-baseSecondary p-4 rounded-lg font-medium">
                {data.knowledge}
              </div>
            </div>
          )}
        </div>
      )}
      <WSAgentDetails />
    </div>
  );
};

export default Page;
