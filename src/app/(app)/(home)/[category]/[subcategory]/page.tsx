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
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<SearchParams>;
}
async function page({ params, searchParams }: Props) {
  const { subcategory } = await params;

  const filters = await loadProductFilters(searchParams);
  // console.log(JSON.stringify(filters), "mai hu gians");
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      categorySlug: subcategory,
      tags: [],
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView categorySlug={subcategory} />
    </HydrationBoundary>
  );
}

export default page;
