"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";

import { loginSchema } from "../../schema";
import { useForm } from "react-hook-form";
import LoginForm from "@/app/(app)/(auth)/_component/LoginForm";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// let formSchema = loginSchema;

function SignInView() {
  const router = useRouter();
  const login = useMutation({
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errors = await res.json();
        throw new Error(errors.message || "Login failed");
      }

      return res.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    login.mutate(values);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 ">
      <div className="bg-[#F4F4F4] h-screen w-full lg:col-span-3 overflow-y-hidden">
        <LoginForm form={form} onSubmit={onSubmit} />
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url(/bg-auth.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
}

export default SignInView;
