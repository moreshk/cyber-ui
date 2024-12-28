import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Sandbox = () => {
  const [scenario, setScenario] = useState("Telegram Reply");
  const [userMessage, setUserMessage] = useState("");

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <p className="text-sm text-gray-500 mb-4 text-center">
        Sandbox is an environment for testing, used to preview the agent&apos;s
        response content. <br /> It does not consume credits.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="scenario"
            className="block text-xl font-semibold text-gray-700 mb-4"
          >
            Select Scenario
          </label>
          <select
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="block w-full h-10 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="Telegram Reply">Telegram Reply</option>
            <option value="Other Scenario">Other Scenario</option>
          </select>

          <label
            htmlFor="userMessage"
            className="block text-xl font-semibold text-gray-700 mt-4 mb-4"
          >
            User Message
          </label>
          <textarea
            id="userMessage"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter user message here"
            className=" p-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
          ></textarea>

          <div className="flex items-center justify-end">
            <Button className="mt-4">Preview Response</Button>
          </div>
        </div>

        {/* Response Preview Section */}
        <div>
          <label className="block text-xl font-semibold text-gray-700 mb-4">
            Response Preview
          </label>
          <div className="w-full h-[calc(100%-2rem)] border rounded-md bg-gray-100 p-4 text-gray-500 flex items-center justify-center">
            Your response will appear here. Generate a response to see the
            preview.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;
