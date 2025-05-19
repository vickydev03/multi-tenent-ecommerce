// ReviewSidebar.tsx
// 'use client'
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import ReviewForm from "./ReviewForm";
import StarRating from "@/components/ui/StarRating";

interface Props {
  productId: string;
}

function ReviewSidebar({ productId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({ productId })
  );

  return (
    <>
      <ReviewForm productId={productId} intialData={data} />
    </>
  );
}

export default ReviewSidebar;
