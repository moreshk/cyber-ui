import { Button } from "@/components/ui/button";
import React from "react";

const Twitter = () => {
  return (
    <div className="max-w-sm mx-auto p-6 rounded-xl shadow bg-gradient-to-b">
      <div className="flex gap-4 items-center justify-center flex-col">
        <p className="text-xl font-bold">Bind Your Twitter Account</p>
        <p className="text-sm text-center opacity-70 tracking-wide">
          Bind existing Twitter account with the agent for the agent to
          autonomously send tweets on this account. The default limit is the
          agent can tweet maximum once every 15 minutes. Don’t forget to add
          &quot;@Tophat_One 🎩&quot; to the agent’s bio!
        </p>
        <Button className="text-white w-full mt-5" size="lg">
          Click to bind
        </Button>
      </div>
    </div>
  );
};

export default Twitter;
