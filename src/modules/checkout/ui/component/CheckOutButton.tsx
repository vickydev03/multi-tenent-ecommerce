"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useCart } from "../../hooks/useCart";
import { cn, generateTenant } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";

interface Props {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}

function CheckOutButton({ className, hideIfEmpty, tenantSlug }: Props) {
  // const [isMounted, setIsMounted] = React.useState(false);
  const cart = useCart(tenantSlug);

  // React.useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // if (!isMounted) {
  //   return (
  //     <Button variant={"elevated"} className={cn("bg-white", className)}>
  //       <ShoppingCartIcon />
  //     </Button>
  //   );
  // }

  if (hideIfEmpty && (!cart?.totalItems || cart.totalItems === 0)) return null;

  return (
    <Button variant={"elevated"} asChild className={cn("bg-white", className)}>
      <Link href={`${generateTenant(tenantSlug)}/checkout`}>
        <ShoppingCartIcon />
        {cart?.totalItems > 0 ? cart.totalItems : ""}
      </Link>
    </Button>
  );
}

export default CheckOutButton;
