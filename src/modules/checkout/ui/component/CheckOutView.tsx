"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { toast } from "sonner";
import { generateTenant } from "@/lib/utils";
import CheckOutItem from "./CheckOutItem";
import CheckOutSidebar from "./CheckOutSidebar";
import { InboxIcon, Loader, LoaderIcon } from "lucide-react";
interface Props {
  tenantSlug: string;
}
function CheckOutView({ tenantSlug }: Props) {
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  useEffect(() => {
    if (error?.data?.code == "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid product found,Cart cleared");
    }
  }, [error, clearAllCarts]);

  if (isLoading) {
    return (
      <div className="lg:p-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dased  flex items-center  justify-center  p-8 flex-col   gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="" />
          <p className="text-base font-medium "> No Product found</p>
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className="lg:p-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dased  flex items-center  justify-center  p-8 flex-col   gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon className="" />
          <p className="text-base font-medium "> No Product found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:p-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7  gap-4 lg:gap-16 ">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckOutItem
                key={index}
                id={product.id}
                isLast={index == data.docs.length - 1}
                imageUrl={product?.image?.url}
                name={product.name}
                productUrl={`${generateTenant(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenant(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckOutSidebar
            total={data?.totalPrice || 0}
            onCheckOut={() => {}}
            isCanceled={false}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckOutView;
