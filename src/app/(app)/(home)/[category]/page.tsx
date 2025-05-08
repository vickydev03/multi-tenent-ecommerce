import { caller, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { getQueryClient } from "@/trpc/server";
import ProductList from "@/modules/Products/ui/components/ProductList";
import ProductFilters from "@/modules/Products/ui/components/ProductFilters";

interface Props {
  params: any;
}
async function page({ params }: Props) {
  const { category } = await params;
  // console.log("xxx", category);
  console.log(category, "snivy");

  const queryClient = getQueryClient();
  // const products = await caller.products.getMany();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: category,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className=" bg-red-3000  px-4 lg:px-12 flex flex-col gap-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-8 gap-x-12">
          <div className=" lg:col-span-2 xl:col-span-2">
            {/* <div className=" border-2 p-2"> */}
            <ProductFilters />
            {/* </div> */}
          </div>
          <div className="bg-red-300 lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<Loader />}>
              <ProductList categorySlug={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default page;

const Loader = () => {
  return <p>loading</p>;
};
