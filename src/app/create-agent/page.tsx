"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Coin } from "../../../type";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Min character 2",
    })
    .max(10, "max changes 10"),
  symbol: z.string().min(2, {
    message: "Min character 2",
  }),
  description: z.string().min(2, {
    message: "Min character 2",
  }),
  personality: z.string().min(2, {
    message: "Min character 2",
  }),
  instruction: z.string().min(2, {
    message: "Min character 2",
  }),
  twitter: z.string().optional(),
  knowledge: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().optional(),
  image: z
    .instanceof(File, {
      message: "Please upload a valid image file",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPEG, PNG, or WEBP files are allowed",
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image size must be less than 5MB",
    }),
});

function Page() {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      personality: "",
      instruction: "",
      knowledge: "",
      twitter: "",
      telegram: "",
      website: "",
    },
  });
  const image = form.watch("image");
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("symbol", values.symbol);
      formData.append("description", values.description);
      formData.append("personality", values.personality);
      formData.append("instruction", values.instruction);
      formData.append("knowledge", values.knowledge || "");
      formData.append("twitter", values.twitter || "");
      formData.append("telegram", values.telegram || "");
      formData.append("website", values.website || "");
      const response = await api.post<Coin>("/v1/coin/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      push(`/token/${response.data.mintAddress}`);
      toast.success("Token created successfully!");
    } catch (error: unknown) {
      console.log(error);
      toast.error("Unable to create Token");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    {image && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Image Preview:</p>
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="mt-2 h-32 w-32 rounded border"
                        />
                      </div>
                    )}
                  </>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cyber (Agent) Name</FormLabel>
                      <FormControl>
                        <Input placeholder="FATBOY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="FATBOY" {...field} />
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
                        <Textarea
                          rows={3}
                          placeholder={`How would your character describe themselves?
e.g. I’m a physicist who’s curious about how the universe works.
What’s their backstory? What information should they know about themselves?`}
                          id="description"
                          {...field}
                        />
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
                        <Textarea
                          rows={3}
                          placeholder={`e.g. Quirky, Flirtatious, Curt,
Angry, Cheerful, Psychotic,
Drunk, Indifferent, Wholesome`}
                          {...field}
                        />
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
                          rows={4}
                          placeholder={`Talking style - short answers or verbose?
Should they use emojis?
Any no-go topics?
Should they make things up?`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="name" className="text-lg font-bold"></label>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMoreOptions(!showMoreOptions);
                }}
                className="flex items-center gap-2"
              >
                More options{" "}
                <ChevronDown
                  className={`w-4 h-4 text-secondary-foreground ${
                    showMoreOptions ? "" : "rotate-180"
                  }`}
                />
              </button>
              <div
                className={
                  showMoreOptions ? "hidden space-y-2" : "block space-y-2"
                }
              >
                <FormField
                  control={form.control}
                  name="knowledge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Knowledge Base</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder={`Talking style - short answers or verbose?
Should they use emojis?
Any no-go topics?
Should they make things up?`}
                          id="kn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="https://x.com/test" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telegram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram</FormLabel>
                      <FormControl>
                        <Input placeholder="FATBOY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://cyber.app" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between w-full">
              <Button
                loading={loading}
                loadingText="Creating..."
                className="w-full rounded-xl"
                size="lg"
              >
                Create Agent
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

export default Page;
