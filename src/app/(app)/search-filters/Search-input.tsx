import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

function SearchInput({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex items-center gap-2 w-full  ">
      <div className=" relative w-full ">
        <SearchIcon className=" absolute  left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 " />
        <Input placeholder="Search products" className="pl-8" disabled={disabled} />
      </div>
    </div>
  );
}

export default SearchInput;
