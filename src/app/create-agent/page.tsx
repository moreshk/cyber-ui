"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Upload } from "lucide-react";

export function Page() {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  return (
    <div className="flex justify-center items-center py-10">
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            Create Agent & token
          </CardTitle>
          <CardDescription className="text-center text-secondary-foreground">
            Don’t worry — you can edit it in the future
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex-1 flex justify-center">
            <div className="mt-2 flex items-center gap-x-3">
              <div className="rounded-full border w-40 h-40 flex flex-col items-center justify-center">
                <Upload />
                <label htmlFor="image-upload">Image</label>
                <input type="file" className="hidden" id="image-upload" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-lg font-bold">
              Cyber (Agent) Name
            </label>
            <Input
              id="name"
              placeholder="FATBOY"
              className="!text-lg font-medium rounded-lg !px-2 !py-1.5 h-auto"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-lg font-bold">
              Token Symbol
            </label>
            <Input
              id="name"
              placeholder="$FAT"
              className="!text-lg font-medium rounded-lg !px-2 !py-1.5 h-auto"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="name" className="text-lg font-bold">
              Description
            </label>
            <Textarea
              rows={3}
              placeholder={`How would your character describe themselves?
e.g. I’m a physicist who’s curious about how the universe works.
What’s their backstory? What information should they know about themselves?`}
              id="description"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="Personality" className="text-lg font-bold">
              Personality
            </label>
            <Textarea
              rows={3}
              placeholder={`e.g. Quirky, Flirtatious, Curt,
Angry, Cheerful, Psychotic,
Drunk, Indifferent, Wholesome`}
              id="Personality"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="name" className="text-lg font-bold">
              Instruction
            </label>
            <Textarea
              rows={4}
              placeholder={`Talking style - short answers or verbose?
Should they use emojis?
Any no-go topics?
Should they make things up?`}
              id="Personality"
            />
          </div>

          <button
            onClick={() => {
              setShowMoreOptions(!showMoreOptions);
            }}
            className="flex items-center gap-2"
          >
            More options{" "}
            <ChevronDown
              className={`w-4 h-4 text-secondary-foreground ${
                showMoreOptions ? "rotate-180" : ""
              }`}
            />
          </button>
          {showMoreOptions && (
            <>
              <div className="space-y-1">
                <label htmlFor="name" className="text-lg font-bold">
                  Knowledge Base (Optional)
                </label>
                <Textarea
                  rows={3}
                  id="Personality"
                  placeholder="Any additional information you’d like to provide such as specific project information, twitter archives/text, articles, whitepapers, journals etc."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-lg font-bold">
                  Twitter
                </label>
                <Input
                  id="name"
                  placeholder="https://x.com/test"
                  className="!text-lg font-medium rounded-lg !px-2 !py-1.5 h-auto"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-lg font-bold">
                  Telegram
                </label>
                <Input
                  placeholder="https://t.com/test"
                  id="name"
                  className="!text-lg font-medium rounded-lg !px-2 !py-1.5 h-auto"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-lg font-bold">
                  Website
                </label>
                <Input
                  id="name"
                  placeholder="https://cyber.app"
                  className="!text-lg font-medium rounded-lg !px-2 !py-1.5 h-auto"
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between w-full">
          <Button className="w-full rounded-xl" size="lg">
            Create Agent
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
