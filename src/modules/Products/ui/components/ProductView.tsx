"use client";

import { StarRating } from "@/app/(app)/(home)/_component/StarRatting";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formateCurrency, generateTenant } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import {
  defaultJSXConverters,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCheckIcon, LinkIcon, LoaderIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { toast } from "sonner";
import { SerializedEditorState } from "lexical";
// import CartButton from "./CartButton";

const CartButton = dynamic(() => import("./CartButton"), {
  ssr: false,
  loading: () => (
    <Button disabled className="flex-1 bg-pink-400 ">
      Add to Cart
    </Button>
  ),
});

interface Props {
  productId: string;
  tenantSlug: string;
}
function ProductView({ productId, tenantSlug }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative  aspect-[3.9] border-b">
          <Image
            src={data.image?.url || "/placeholder.png"}
            alt={data.name}
            fill
            className=" object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="col-span-3">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="border-y flex">
              <div className="px-6 py-4 flex items-center justify-center border-r">
                <div className=" relative px-2 py-1 border bg-pink-400 w-fit">
                  <p className="text-base font-medium">{`${formateCurrency(data.price)}`}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex justify-center items-center lg:border-r">
                <Link
                  href={generateTenant(tenantSlug)}
                  className=" flex items-center gap-2"
                >
                  {data.tenant?.image ? (
                    <Image
                      src={data.tenant.image as string}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  ) : (
                    <Image
                      src={"/placeholder.png"}
                      alt={data.tenant.name}
                      width={20}
                      height={20}
                      className="rounded-full border shrink-0 size-[20px]"
                    />
                  )}

                  <p className="text-base underline font-medium">
                    {data.tenant.name}
                  </p>
                </Link>
              </div>
              <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                <div className="flex  gap-1 items-center">
                  <StarRating
                    rating={data.reviewRating}
                    iconClassName="size-4"
                  />
                  <p className=" text-base  font-medium ">
                    {data.reviewCount} ratings
                  </p>
                </div>
              </div>
            </div>

            <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className="flex items-center gap-2">
                <StarRating rating={data.reviewCount} iconClassName="size-3" />
                <p className="text-base font-medium">
                  {data.reviewCount} rating
                </p>
              </div>
            </div>
            <div className="p-6 ">
              {data.description ? (
                <RichText
                  data={data.description as unknown as SerializedEditorState}
                  converters={defaultJSXConverters}
                />
              ) : (
                <p className=" font-medium text-muted-foreground italic ">
                  No description provoided
                </p>
              )}
            </div>
          </div>
          <div className="col-span-2 ">
            <div className="border-t lg:border-t-0 lg:border-l h-full ">
              <div className="flex flex-col gap-4 p-6 border-b ">
                <div className="flex flex-row  ic gap-2  ">
                  {data.isPurchased ? (
                    <Button
                      className="flex-1 bg-white font-medium"
                      variant={"elevated"}
                      asChild
                    >
                      {/* or remove the process  */}
                      <Link
                        href={`${process.env.NEXT_PUBLIC_URL}/library/${productId}`}
                      >
                        View in Library
                      </Link>
                    </Button>
                  ) : (
                    <CartButton productId={productId} tenantSlug={tenantSlug} />
                  )}
                  <Button
                    variant={"elevated"}
                    disabled={isCopied}
                    className="size-12"
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("URl copied to clipboard");
                      setTimeout(() => {
                        setIsCopied(false);
                      }, 1000);
                    }}
                  >
                    {isCopied ? <CheckCheckIcon /> : <LinkIcon />}
                  </Button>
                </div>
                <p className="text-center font-medium ">
                  {data.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${data.refundPolicy} money back guarantee `}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between ">
                  <h3 className="text-xl font-medium"> Ratings</h3>
                  <div className=" flex items-center gap-x-1  font-medium">
                    <StarIcon className="size-4 fill-black " />
                    <p className="">({data.reviewRating})</p>
                    <p className="text-base">{data.reviewCount} ratings</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4 ">
                  {[5, 4, 3, 2, 1].map((e, i) => (
                    <Fragment key={i}>
                      <div className="font-medium ">
                        {e} {e == 1 ? " star" : "stars"}
                      </div>
                      <Progress
                        value={data.ratingDistribution[e]}
                        className="h-[1lh] "
                      />
                      <div className="font-medium ">
                        {data.ratingDistribution[e]}%
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;

export const ProductViewSkeleton = () => {
  return (
    <div className="border border-black border-dased  flex items-center  justify-center  p-8 flex-col   gap-y-4 bg-white w-full rounded-lg">
      <LoaderIcon className="" />
      <p className="text-base font-medium "> Loading ...</p>
    </div>
  );
};
