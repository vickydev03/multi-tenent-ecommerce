"use client";
import { useTRPC } from "@/trpc/client";
import {
  dehydrate,
  HydrationBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React from "react";


function ProductList({categorySlug}:{categorySlug:string}) {
  console.log(categorySlug,"aarab sig");
  
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({
   categorySlug: categorySlug
  }));
  return <div>{JSON.stringify(data)}</div>;
}

export default ProductList;
