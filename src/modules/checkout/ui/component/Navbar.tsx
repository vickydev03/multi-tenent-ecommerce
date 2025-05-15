"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { tenantField } from "@payloadcms/plugin-multi-tenant/fields";
import { generateTenant } from "@/lib/utils";
// import CheckOutButton from "@/modules/checkout/ui/component/CheckOutButton";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
// import { useCart } from "../../hooks/useCart";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
}

const CheckOutButton = dynamic(
  () => import("@/modules/checkout/ui/component/CheckOutButton"),
  {
    ssr: true,
    loading: () => (
      <Button variant="elevated" className="bg-white">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon />
          <span></span>
        </div>
      </Button>
    ),
  }
);

function Navbar({ slug }: Props) {
  return (
    <nav className="h-20  border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link className="flex items-center gap-2 " href={generateTenant(slug)}>
          <p className="text-xl">Checkout</p>
        </Link>
        <Button variant={"elevated"} asChild>
          <Link href={generateTenant(slug)}> Continue Shopping</Link>
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
