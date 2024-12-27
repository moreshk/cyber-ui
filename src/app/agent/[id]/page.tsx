"use client";

import React from "react";
import {
  Edit,
  MessageSquare,
  Share2,
  Code,
  AlertCircle,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { Agents, Coin, Owner } from "../../../../type";

const Page = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useSWR<Agents & { coin: Coin; owner: Owner }>(
    `/v1/agent/details?token=${params.id}`
  );

  if (isLoading || !data) {
    return <div>Loading</div>;
  }
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">i</h1>
          <Button variant="ghost">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span>Credits</span>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{data.points}</span>
              <Button variant="link" className=" text-sm">
                Promo code
              </Button>
            </div>
          </div>
          <Button className="text-white">Top Up</Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Telegram
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Discord
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Twitter
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Token
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          API
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4" />
          Sandbox
        </Button>
      </div>
      <div className="bg-black text-white p-4 rounded-lg mb-8">
        You have successfully created your agent! Link TG bot to start talking &
        training your agent.
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p>{data.description}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Personality</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p>{data.personality}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Instruction</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p>{data.instruction}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Knowledge Base</h2>
          <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[100px]">
            {data.knowledge}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
