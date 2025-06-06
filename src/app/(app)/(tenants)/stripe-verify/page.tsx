"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import React, { useEffect } from "react";
export const dynamic = "force-dynamic";
function StripeVerifyPage() {
  const useTrpc = useTRPC();

  const { mutate: verify } = useMutation(
    useTrpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: () => {
        window.location.href = "/";
      },
    })
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="min-h-screen flex items-center  justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
}

export default StripeVerifyPage;
