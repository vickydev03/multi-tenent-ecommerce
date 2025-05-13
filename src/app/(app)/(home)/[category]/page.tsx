// "use client";
import { caller, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { getQueryClient } from "@/trpc/server";
import ProductList from "@/modules/Products/ui/components/ProductList";
import ProductFilters from "@/modules/Products/ui/components/ProductFilters";
import type { SearchParams } from "nuqs/server";
// import { loadProductFilters } from "@/modules/Products/hooks/useProductFilterHook";
import { loadProductFilters } from "@/modules/Products/hooks/searchParams";
import ProductSort from "@/modules/Products/ui/components/ProductSort";
import ProductListView from "@/modules/Products/views/ProductListView";

interface Props {
  params: any;
  searchParams: Promise<SearchParams>;
}
async function page({ params, searchParams }: Props) {
  const { category } = await params;

  const filters = await loadProductFilters(searchParams);
  console.log(JSON.stringify(filters), "mai hu gians");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      tags: [], // Assuming an empty array is a valid default for tags
      categorySlug: category,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
     <ProductListView categorySlug={category}/>
    </HydrationBoundary>
  );
}

export default page;

const Loader = () => {
  return <p>loading</p>;
};
