"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";

import { registerSchema } from "../../schema";
import { useForm } from "react-hook-form";
import RegisterForm from "@/components/ui/RegisterForm";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// let formSchema = registerSchema;

export function SignUpView() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const trpc = useTRPC();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        router.push("/");
      },
    })
  );
  const onSubmit =  (values: z.infer<typeof registerSchema>) => {
    console.log("Form values:", values); // check email value here
     register.mutate(values);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 ">
      <div className="bg-[#F4F4F4] h-screen w-full lg:col-span-3 overflow-y-hidden">
        <RegisterForm form={form} onSubmit={onSubmit} />
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
