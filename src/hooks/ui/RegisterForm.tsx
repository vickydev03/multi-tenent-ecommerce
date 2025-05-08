"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { registerSchema } from "@/modules/auth/schema";
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

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (values: z.infer<typeof registerSchema>) => void;
}) {
  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;

  const preview = username && !usernameErrors;

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
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
        </div>

        <h1 className="text-4xl font-medium">
          Join over 1,500 creators earning money on TradeNext
        </h1>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Username</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormDescription className={cn("hidden", preview && "block")}>
                Your store will be available at&nbsp;
                <strong>{username}</strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input {...field} type="text" />
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
          Create account
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
