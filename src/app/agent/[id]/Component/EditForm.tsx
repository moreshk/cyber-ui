import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleHelp } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EditForm = () => {
  const [selectedMode, setSelectedMode] = useState("Neutral");
  const [loading, setLoading] = useState(false);

  const modes = [
    {
      label: "Wild Mode (Beta)",
      value: "Wild",
      tooltip:
        "Strong degeneracy tendencies, please specify the exact nsfw directions the agent should amplify",
    },
    {
      label: "Neutral",
      value: "Neutral",
      tooltip:
        "Generally safe-for-work, light nsfw tendencies when explicitly prompted",
    },
    { label: "Safe Mode", value: "Safe", tooltip: "Reject all NSFW requests." },
  ];

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Min character 2",
      })
      .max(20, "max changes 20"),
    description: z.string().min(2, {
      message: "Min character 2",
    }),
    personality: z.string().min(2, {
      message: "Min character 2",
    }),
    instruction: z.string().min(2, {
      message: "Min character 2",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      personality: "",
      instruction: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log("submitted edit form data", values);
      toast.success("Token created successfully!");
    } catch (error: unknown) {
      console.log(error);
      toast.error("Unable to edit");
    } finally {
      setLoading(false);
    }
  }

  console.log("loading", loading);
  return (
    <div className="p-6 rounded-xl shadow w-full bg-gradient-to-b from-gray-300 to-white">
      <div className="flex items-center justify-end p-4 rounded-lg">
        {modes.map((mode) => (
          <label
            key={mode.value}
            className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition ${
              selectedMode === mode.value ? "bg-gray-100" : "bg-transparent"
            }`}
          >
            <input
              type="radio"
              name="mode"
              value={mode.value}
              checked={selectedMode === mode.value}
              onChange={() => setSelectedMode(mode.value)}
              className="hidden"
            />
            <div
              className={`w-4 h-4 rounded-full border-4 ${
                selectedMode === mode.value
                  ? "border-gray-300 bg-purple-600"
                  : "border-gray-300"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                selectedMode === mode.value
                  ? "text-purple-600"
                  : "text-gray-700"
              }`}
            >
              {mode.label}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-400">
                    <CircleHelp className="w-4" />{" "}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mode.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality</FormLabel>
                  <FormControl>
                    <Textarea placeholder="personality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instruction</FormLabel>
                  <FormControl>
                    <Textarea
                      className=""
                      placeholder="instruction"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="showMore">
                <AccordionTrigger>Show more options</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="instruction"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Project information, Twitter text, article text, whitepaper text..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="flex gap-1 items-center mt-4">
                    Or add link to automatically extract knowledge base{" "}
                    <span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-gray-400">
                              <CircleHelp className="w-4" />{" "}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Always preview the links to make sure it’s
                              accessible. Websites that require logins such as
                              Twitter is not supported.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className={`w-56 text-lg ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditForm;
