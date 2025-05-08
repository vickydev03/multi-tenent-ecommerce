import { caller, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { getQueryClient } from "@/trpc/server";
import ProductList from "@/modules/Products/ui/components/ProductList";

interface Props {
  params: any 
}
async function page({ params }: Props) {
  const {subcategory} = await params;
  // console.log("xxx", category);
  // console.log(category,'snivy');
  

  const queryClient = getQueryClient();
  // const products = await caller.products.getMany();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug:subcategory,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Loader />}>
        <ProductList categorySlug={subcategory} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;

const Loader = () => {
  return <p>loading</p>;
};
