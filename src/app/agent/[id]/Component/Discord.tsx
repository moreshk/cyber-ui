import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const Discord = () => {
  const [dbotTokenValue, setDBotTokenValue] = useState("");
  return (
    <div className="max-w-xl mx-auto p-6 rounded-xl shadow bg-gradient-to-b from-gray-300 to-white">
      <div className="flex gap-4 items-center justify-center flex-col py-8 text-center px-12">
        <p className="text-2xl font-bold">
          Set Your Discord BOT Token to interact with the agent
        </p>
        <Input
          value={dbotTokenValue}
          placeholder="Discord bot token"
          onChange={(e) => {
            setDBotTokenValue(e.target.value);
          }}
        />
        <Button
          className="w-full"
          size="lg"
          disabled={!dbotTokenValue}
          onClick={() => console.log("button clicked")}
        >
          Confirm
        </Button>
        <div className="text-left">
          <ol className="list-decimal list-inside space-y-4">
            <li>
              Open{" "}
              <a
                href="https://discord.com/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://discord.com/developers
              </a>
            </li>
            <li>
              Create a new application by clicking on{" "}
              <span>&quot;New Application&quot;</span>.
            </li>
            <li>
              Go to the <span>&quot;Bot&quot;</span> tab on the left:
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  If you don&apos;t have a token, click{" "}
                  <span>&quot;Reset Token&quot;</span> to generate one.
                </li>
                <li>
                  Make sure the{" "}
                  <span className="text-purple-600">
                    &quot;Message Content Intent&quot;
                  </span>{" "}
                  is turned <span>ON</span>.
                </li>
                <li>Copy and paste the bot token here and bind it.</li>
              </ul>
            </li>
            <li>
              Go to the <span>&quot;Installation&quot;</span> tab on the left:
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  Untick <span>&quot;User Install&quot;</span>.
                </li>
                <li>
                  Add <span>&quot;bot&quot;</span> for Default Install Settings
                  - Guild Install - Scopes.
                </li>
              </ul>
            </li>
            <li>
              Copy and open the install link in your browser, which will direct
              you to install the agent in your server.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Discord;
