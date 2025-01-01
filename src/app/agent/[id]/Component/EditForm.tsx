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
import api from "@/lib/axios";
import useAgentDetailsStore from "@/store/useAgentDetailsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const EditForm = () => {
  const [loading, setLoading] = useState(false);
  const { data } = useAgentDetailsStore();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

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
    knowledge: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      personality: data?.personality || "",
      instruction: data?.instruction || "",
      knowledge: data?.knowledge || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await api.post("/v1/agent/update", {
        token: data?.coinId,
        name: values.name,
        description: values?.description || "",
        personality: values?.personality || "",
        instruction: values?.instruction || "",
        knowledge: values?.knowledge || "",
      });
      setLoading(false);
      toast.success("Updated Details");
    } catch (error: unknown) {
      setLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
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
                    <Textarea placeholder="description" {...field} rows={4} />
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
                    <Textarea placeholder="personality" {...field} rows={4} />
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
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => {
                setShowMoreOptions(!showMoreOptions);
              }}
              className="flex items-center gap-2 text-basePrimary font-bold"
            >
              More options{" "}
              <ChevronDown
                className={`w-4 h-4 text-basePrimary font-bold ${
                  showMoreOptions ? "" : "rotate-180"
                }`}
              />
            </button>
            <div
              className={
                showMoreOptions ? "block space-y-10" : "hidden space-y-2"
              }
            >
              <FormField
                control={form.control}
                name="knowledge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Knowledge</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Project information, Twitter text, article text, whitepaper text..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full"
              size="lg"
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
