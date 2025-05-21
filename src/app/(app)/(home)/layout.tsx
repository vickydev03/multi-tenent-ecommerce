// import React from "react";
import Navbar from "./_component/Navbar";
import Footer from "./_component/Footer";
import SearchFilters from "../search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import SearchInput from "../search-filters/Search-input";


async function layout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFilterLoader/>}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>

      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}

export default layout;

const SearchFilterLoader = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <SearchInput disabled data={[]} />
      {/* <p>loading</p> */}
      <div className="hidden lg:block ">
        <div className="h-11" />
      </div>
    </div>
  );
};
