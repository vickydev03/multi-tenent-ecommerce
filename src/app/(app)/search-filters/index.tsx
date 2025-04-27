import React from "react";
import SearchInput from "./Search-input";
import Categories from "./Categories";

interface searchFilters {
  color: string;
  id: string;
  name: string;
}
function SearchFilters({ data }: { data: any }) {
  return (
    <div className="px-4 lg:px-12 flex flex-col py-8 border-b gap-4 w-full">
      <SearchInput disabled={false} />
      <Categories data={data} />
    </div>
  );
}

export default SearchFilters;
