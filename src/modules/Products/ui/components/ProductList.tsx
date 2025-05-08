"use client";
import { useTRPC } from "@/trpc/client";
import {
  dehydrate,
  HydrationBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React from "react";

function ProductList({ categorySlug }: { categorySlug: string }) {
  console.log(categorySlug, "aarab sig");

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getMany.queryOptions({
      categorySlug: categorySlug,
    })
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-4  ">
      {data.docs.map((e) => (
        <div className="border border-black bg-white " key={e.id}>
          <h2 className="text-xl font-medium"> {e.name}</h2>
          <p>{e.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
