"use client";
import React from "react";
import Link from "next/link";
import { generateTenant } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  slug: string;
}

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
