import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import useAgentDetailsStore from "@/store/useAgentDetailsStore";
import React, { useState } from "react";
import { toast } from "sonner";

const Telegram = () => {
  const { data, revalidate } = useAgentDetailsStore();
  const [tbotTokenValue, setTBotTokenValue] = useState(
    data?.telegramToken || ""
  );
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await api.post("/v1/agent/telegram", {
        token: data?.coinId,
        telegramId: tbotTokenValue,
      });
      if (data?.coinId) revalidate(data?.coinId);
      setLoading(false);
    } catch (e: any) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-xl shadow bg-gradient-to-b">
      <div className="flex gap-4 items-center justify-center flex-col py-8 text-center px-12">
        <p className="text-2xl font-bold">
          Set Your Telegram BOT Token to interact with the agent
        </p>
        {data?.telegramName && (
          <a
            href={`https:t.me/${data?.telegramName}`}
            target="_blank"
            className=""
          >
            {data?.telegramName}
          </a>
        )}
        <Input
          value={tbotTokenValue}
          placeholder="Telegram bot token"
          onChange={(e) => {
            setTBotTokenValue(e.target.value);
          }}
        />
        <Button
          loading={loading}
          className="w-full"
          size="lg"
          disabled={!tbotTokenValue}
          onClick={onConfirm}
        >
          Confirm
        </Button>
        <div className="text-left">
          <ol className="list-decimal list-inside space-y-4">
            <li>
              Open{" "}
              <a
                href="https://t.me/botfather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://discord.com/developers
              </a>
              Telegram&apos;s official Bot creation tool
            </li>
            <li>
              Send /newbot to create your bot, it will return a Bot token after
              setting the name
            </li>
            <li>Copy and paste the bot token here</li>
            <li>
              Edit the bot&apos;s information / add pfp and etc in the BotFather
            </li>
            <li>
              Don&apos;t forget to make the bot{" "}
              <span className="text-purple-600">admin in your group chat</span>{" "}
              for it to work.
            </li>
            <li>
              Tag &quot;@&quot; the agent&apos;s handle or reply to its messages
              to interact with the agent
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Telegram;
