"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilter, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import CategoriesSideBar from "./CategoriesSideBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CustomCategory } from "@/types";

function SearchInput({
  disabled,
  data,
}: {
  disabled: boolean;
  data: CustomCategory[];
}) {
  console.log(data, "this comes from any data ");

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
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
