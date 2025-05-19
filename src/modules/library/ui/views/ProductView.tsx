"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import ProductList, { ProductListSkeleton } from "../component/ProductList";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import ReviewSidebar from "@/modules/reviews/ui/component/ReviewSidebar";
import {
  RichText,
  defaultJSXConverters,
} from "@payloadcms/richtext-lexical/react";
import { SerializedEditorState } from "lexical";
import { Media } from "@/payload-types";
import { ReviewFormSkeleton } from "@/modules/reviews/ui/component/ReviewForm";

interface Props {
  productId: string;
}
function ProductView({ productId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-[#F4F4F4] w-full border-b">
        <Link href={"/library"} className="flex items-center gap-2 ">
          <ArrowLeftIcon className="size-4" />
          <span className="text font-medium">Back to Library</span>
        </Link>
      </nav>

      {/*  */}

      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex ">
          <h1 className="text-[40px] font-medium">{data.name}</h1>
        </div>
      </header>

      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7  gap-4 lg:gap-16 ">
          <div className="lg:col-span-2">
            <div className="p-4  bg-white rounded-md border gap-4 ">
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewSidebar productId={productId} />
              </Suspense>
            </div>
          </div>
          <div className="lg:col-span-5">
            {data.content ? (
              <RichText
                data={data.content as unknown as SerializedEditorState}
              />
            ) : (
              <p className=" italic  font-medium text-muted-foreground">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductView;

export const ProductViewSkeleton = () => {
  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-[#F4F4F4] w-full border-b">
        <div className="flex items-center gap-2 ">
          <ArrowLeftIcon className="size-4" />
          <span className="text font-medium">Back to Library</span>
        </div>
      </nav>
    </div>
  );
};
