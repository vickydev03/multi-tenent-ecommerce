"use client";
import React from "react";
import SearchInput from "./Search-input";
import Categories from "./Categories";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import BreadCrumNav from "./BreadCrumNav";
import { useProdcutFilters } from "@/modules/Products/hooks/useProductFilterHook";

function SearchFilters() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  
  const params = useParams();

  const categoryParams = params.category;
  const activeCategory = categoryParams || "all";
  // console.log(activeCategory, "2003");
  const [filters, setFilters] = useProdcutFilters();

  // console.log(categoryParams, "chiru singh");
  const activeData = data.find((e) => e.slug === activeCategory);
  const activeColor = activeData?.color || "#F5F5F5";
  const activeCategoryName = activeData?.name || null;

  const activeSubcategory = params.subcategory as string | undefined;

  const activeSubcategoryName =
    activeData?.subCategories.find(
      (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

  return (
    <div
      className="px-4 lg:px-12 flex flex-col py-5 border-b gap-4 w-full"
      style={{ backgroundColor: activeColor }}
    >
      <SearchInput
        data={data}
        disabled={false}
        defaultValue={filters.search}
        onChange={(value) => setFilters({ search: value })}
      />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadCrumNav
        activeCategory={activeCategory as string}
        activeCategoryName={activeCategoryName}
        activeSubCategoryName={activeSubcategoryName}
      />
    </div>
  );
}

export default SearchFilters;
