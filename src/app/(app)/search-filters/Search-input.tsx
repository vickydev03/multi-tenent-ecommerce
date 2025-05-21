"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilter, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import CategoriesSideBar from "./CategoriesSideBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CustomCategory } from "@/types";
import { useProdcutFilters } from "@/modules/Products/hooks/useProductFilterHook";

function SearchInput({
  disabled,
  data,
}: {
  disabled: boolean;
  data: CustomCategory[];
}) {
  // console.log(data, "this comes from any data ");
  const [filters, setFilters] = useProdcutFilters();
  const [searchValue, setSearchValue] = useState(filters.search);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  useEffect(() => {
    const searchSetTimeOut = setTimeout(() => {
      setFilters({ search: searchValue });
    }, 500);

    return () => clearTimeout(searchSetTimeOut);
  }, [searchValue, setFilters]);
  return (
    <div className="flex items-center gap-2 w-full  ">
      <CategoriesSideBar
        data={data}
        open={isSideBarOpen}
        onOpenChange={setIsSideBarOpen}
      />

      <div className=" relative w-full ">
        <SearchIcon className=" absolute  left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 " />
        <Input
          placeholder="Search products"
          className="pl-8"
          disabled={disabled}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div>
        <Button
          className="size-12 shrink-0 flex lg:hidden"
          variant={"elevated"}
          onClick={() => setIsSideBarOpen(true)}
        >
          <ListFilter />
        </Button>
        {session.data?.user && (
          <Button
            asChild
            // className="size-12 shrink-0 flex lg:hidden "
            variant={"elevated"}
          >
            <Link href={"/library"}>
              <BookmarkCheckIcon />
              Library
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
