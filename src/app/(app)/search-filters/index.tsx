"use client";
import React from "react";
import SearchInput from "./Search-input";
import Categories from "./Categories";
import CategoriesSideBar from "./CategoriesSideBar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface searchFilters {
  color: string;
  id: string;
  name: string;
}
function SearchFilters() {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="px-4 lg:px-12 flex flex-col py-8 border-b gap-4 w-full">
      <SearchInput data={data} disabled={false} />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
}

export default SearchFilters;
