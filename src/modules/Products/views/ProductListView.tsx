// "use client";
import { caller, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { getQueryClient } from "@/trpc/server";
import ProductList, {
  ProductListSkeleton,
} from "@/modules/Products/ui/components/ProductList";
import ProductFilters from "@/modules/Products/ui/components/ProductFilters";
import type { SearchParams } from "nuqs/server";
// import { loadProductFilters } from "@/modules/Products/hooks/useProductFilterHook";
import { loadProductFilters } from "@/modules/Products/hooks/searchParams";
import ProductSort from "@/modules/Products/ui/components/ProductSort";
import { ProductCardSkeleton } from "../ui/components/ProductCart";
interface Prop {
  categorySlug?: string | undefined;
  tenantSlug?: string;
  narrowView?: boolean;
}
interface Props {
  params: any;
  searchParams: Promise<SearchParams>;
}
async function ProductListView({ categorySlug, tenantSlug, narrowView }: Prop) {
  //   const { category } = await params;

  //   const filters = await loadProductFilters(searchParams);
  //   console.log(JSON.stringify(filters), "mai hu gians");

  //   const queryClient = getQueryClient();
  //   void queryClient.prefetchQuery(
  //     trpc.products.getMany.queryOptions({
  //       tags: [], // Assuming an empty array is a valid default for tags
  //       categorySlug: category,
  //     })
  //   );
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <div className="bg-red-3000 px-4 lg:px-12 flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between ">
        <p className="font-medium uppercase text-2xl ">Curated for you</p>
        <ProductSort />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-8 gap-x-12">
        <div className=" lg:col-span-2 xl:col-span-2">
          {/* <div className=" border-2 p-2"> */}
          <ProductFilters />
          {/* </div> */}
        </div>
        <div className="bg-red-3000 lg:col-span-4 xl:col-span-6 ">
          <Suspense fallback={<ProductListSkeleton narrowView={narrowView} />}>
            <ProductList
              categorySlug={categorySlug}
              tenantSlug={tenantSlug}
              narrowView={narrowView}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProductListView;

const Loader = () => {
  return <p>loading</p>;
};
