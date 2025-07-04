"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useProdcutFilters } from "../../hooks/useProductFilterHook";
import { ProductCardSkeleton } from "./ProductCard";
import { DEFAULT_LIMIT } from "@/constant";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "./ProductCard";

function ProductList({
  narrowView,
}: {
  categorySlug: string | undefined;
  tenantSlug?: string;
  narrowView?: boolean;
}) {
  // console.log(categorySlug, "aarab sig");
  const [filters] = useProdcutFilters();
  const trpc = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );
  console.log(data, "ghritachi");

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dased  flex items-center  justify-center  p-8 flex-col   gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon className="" />
        <p className="text-base font-medium "> No Product found</p>
      </div>
    );
  }
  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-4",
          narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        )}
      >
        {data.pages
          .flatMap((e) => e.docs)
          .map((e) => (
            <ProductCard
              key={e.id}
              name={e.name}
              imageUrl={e.image?.url}
              authorUsername={e.tenant?.slug}
              authorImage={e.tenant?.image?.url || ""}
              reviewCount={e.reviewCount}
              reviewRatting={e.reviewRating}
              price={e.price}
              id={e.id}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8   ">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="font-medium disabled-opacity-50 text-base bg-white  "
            variant={"elevated"}
          >
            Load more ...
          </Button>
        )}
      </div>
    </>
  );
}

export default ProductList;

export const ProductListSkeleton = ({
  narrowView,
}: {
  narrowView: boolean | undefined;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-4",
        narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
