// "use client";
import { trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { getQueryClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { loadProductFilters } from "@/modules/Products/hooks/searchParams";
import ProductListView from "@/modules/Products/views/ProductListView";
import { DEFAULT_LIMIT } from "@/constant";
export const dynamic="force-dynamic"

interface Props {
  params: Promise<{category:string}>;
  searchParams: Promise<SearchParams>;
}
async function page({ params, searchParams }: Props) {
  const { category } = await params;

  const filters = await loadProductFilters(searchParams);
  console.log(JSON.stringify(filters), "mai hu gians");

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      tags: [], // Assuming an empty array is a valid default for tags
      categorySlug: category,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView categorySlug={category} />
    </HydrationBoundary>
  );
}

export default page;
