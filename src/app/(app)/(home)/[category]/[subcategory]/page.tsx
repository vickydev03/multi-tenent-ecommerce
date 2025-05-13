// import { caller, trpc } from "@/trpc/server";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import React, { Suspense } from "react";
// import { getQueryClient } from "@/trpc/server";
// import ProductList from "@/modules/Products/ui/components/ProductList";

// interface Props {
//   params: any
// }
// async function page({ params }: Props) {
//   const {subcategory} = await params;
//   // console.log("xxx", category);
//   // console.log(category,'snivy');

//   const queryClient = getQueryClient();
//   // const products = await caller.products.getMany();
//   void queryClient.prefetchQuery(
//     trpc.products.getMany.queryOptions({
//       categorySlug:subcategory,
//     })
//   );
//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <Suspense fallback={<Loader />}>
//         <ProductList categorySlug={subcategory} />
//       </Suspense>
//     </HydrationBoundary>
//   );
// }

// export default page;

// const Loader = () => {
//   return <p>loading</p>;
// };

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
    const {subcategory} = await params;

  const filters = await loadProductFilters(searchParams);
  console.log(JSON.stringify(filters), "mai hu gians");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      tags: [], // Assuming an empty array is a valid default for tags
      categorySlug: subcategory,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView categorySlug={subcategory} />
    </HydrationBoundary>
  );
}

export default page;

const Loader = () => {
  return <p>loading</p>;
};
