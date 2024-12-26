"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const Page = () => {
  const { data, isLoading } = useSWR("/v1/agent/my-agents");

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
        {data.agents.map((agent: any) => (
          <Link key={agent.id} href={`/agent/${agent.coinId}`}>
            <Card className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">{agent.name}</h2>
              </div>

              <p className="text-gray-600 mb-8">{agent.description}</p>

              <div className="border-t border-black my-4"></div>

              <div className="flex justify-center">
                <p className="text-gray-600">
                  Credits: <span className="font-semibold">{agent.points}</span>
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
