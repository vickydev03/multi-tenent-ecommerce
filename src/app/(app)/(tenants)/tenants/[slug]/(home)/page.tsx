import React from "react";
import ProductListView from "@/modules/Products/views/ProductListView";
import { getQueryClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constant";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
interface Props {
  // searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}
async function page({ params }: Props) {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      tags: [], // Assuming an empty array is a valid default for tags
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
}

export default page;
