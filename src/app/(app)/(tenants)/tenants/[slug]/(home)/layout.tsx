import Footer from "@/modules/tenants/ui/Footer";
import Navbar, { NavbarSkeleton } from "@/modules/tenants/ui/Navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React, { Suspense } from "react";
interface props {
  params: Promise<{slug:string}>;
  children: React.ReactNode;
}
async function Layout({ params, children }: props) {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug: slug,
    })
  );
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl ) mx-auto py-6 ">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
