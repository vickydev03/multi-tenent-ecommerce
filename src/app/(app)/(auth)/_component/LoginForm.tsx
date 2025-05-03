"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { loginSchema } from "@/modules/auth/schema";
import { z } from "zod";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (values: z.infer<typeof loginSchema>) => void;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 p-4 lg:p-16"
      >
        <div className="flex items-center justify-between mb-8">
          <Link prefetch href="/">
            <span className={cn("text-2xl font-semibold", poppins.className)}>
              TradeNext
            </span>
          </Link>

          <Button
            asChild
            className="text-base border-none underline"
            variant={"ghost"}
            size={"sm"}
          >
            <Link href={"/sign-up"}>Sign up</Link>
          </Button>
        </div>

        <h1 className="text-4xl font-medium">
          Join over 1,500 creators earning money on TradeNext
        </h1>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isLoading}
          className="w-full bg-black text-white hover:bg-pink-400 hover:text-primary"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
