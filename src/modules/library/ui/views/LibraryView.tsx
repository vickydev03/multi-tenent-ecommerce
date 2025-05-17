import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import ProductList, { ProductListSkeleton } from "../component/ProductList";
import { ProductCardSkeleton } from "../component/ProductCard";

function LibraryView() {
  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-[#F4F4F4] w-full border-b">
        <Link href={"/"} className="flex items-center gap-2 ">
          <ArrowLeftIcon className="size-4" />
          <span className="text font-medium">Continue shopping</span>
        </Link>
      </nav>

      {/*  */}

      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
          <h1 className="text-[40px] font-medium">Library</h1>
          <p className="font-medium "> Your purchases and reviews</p>
        </div>
      </header>

      {/*  */}

      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <Suspense fallback={<ProductListSkeleton narrowView />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
}

export default LibraryView;
