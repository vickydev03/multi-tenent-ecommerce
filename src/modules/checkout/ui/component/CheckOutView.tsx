"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { toast } from "sonner";
import { generateTenant } from "@/lib/utils";
import CheckOutItem from "./CheckOutItem";
import CheckOutSidebar from "./CheckOutSidebar";
import { InboxIcon, Loader, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-state";
import { useRouter } from "next/navigation";
interface Props {
  tenantSlug: string;
}
function CheckOutView({ tenantSlug }: Props) {
  const [states, setStates] = useCheckoutStates();
  console.log(states.cancel, "50020");
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
        toast.error(error.message);
      },
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
    })
  );
  const { productIds, clearAllCarts, removeProduct, clearCart } =
    useCart(tenantSlug);
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );
  const router = useRouter();
  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);
  useEffect(() => {
    if (error?.data?.code == "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid product found,Cart cleared");
    }
  }, [error, clearAllCarts]);

  if (isLoading) {
    return (
      <div className="lg:p-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dased  flex items-center  justify-center  p-8 flex-col   gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="" />
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
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            isPending={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckOutView;
