interface Props {
  tenantSlug: string;
  productId: string;
}
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/useCart";
import React from "react";

function CartButton({ tenantSlug, productId }: Props) {
  const cart = useCart(tenantSlug);

  return (
    <Button
      variant={"elevated"}
      className={cn(
        "flex-1 bg-pink-400",
        cart.isProductInCart(productId) && "bg-white "
      )}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove to cart" : "Add to cart"}
    </Button>
  );
}

export default CartButton;
