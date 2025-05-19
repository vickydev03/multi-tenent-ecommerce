"use client";
import React, { useState } from "react";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/ui/StarRating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import {StarPicker}
interface Props {
  productId: string;
  intialData: ReviewsGetOneOutput;
}

const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(1, { message: "Description is required" }),
});

function ReviewForm({ productId, intialData }: Props) {
  const [isPreview, setIsPreview] = useState(!!intialData);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries;
        trpc.reviews.getOne.queryOptions({
          productId,
        });
        setIsPreview(true);
      },
      onError: (error) => {
        console.log(error);

        toast.error(error.message);
      },
    })
  );
  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries;
        trpc.reviews.getOne.queryOptions({
          productId,
        });
        setIsPreview(true);
      },
      onError: (error) => {
        console.error(error);

        toast.error(error.message);
      },
    })
  );
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: intialData?.rating ?? 0,
      description: intialData?.description ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (intialData) {
      updateReview.mutate({
        reviewId: intialData.id,
        rating: data.rating,
        description: data.description,
      });
    } else {
      createReview.mutate({
        productId,
        rating: data.rating,
        description: data.description,
      });
    }
    console.log(data, "form submited");
  };
  return (
    <Form {...form}>
      <form
        action=""
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className=" font-medium ">
          {isPreview ? "Your rating:" : "Liked it? Give it a rating "}
        </p>
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarRating
                  rating={field.value}
                  setRating={field.onChange}
                  maxRating={5}
                  size={24}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel className="text-base">Password</FormLabel> */}
              <FormControl>
                <Textarea
                  placeholder="want to leave a written  review?"
                  disabled={isPreview}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant={"elevated"}
            disabled={false}
            type="submit"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit "
            size={"lg"}
          >
            {intialData ? "Update review" : "Post review"}
          </Button>
        )}
      </form>

      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          size={"lg"}
          variant={"elevated"}
          disabled={createReview.isPending || createReview.isPending}
          type="button"
          className="w-fit mt-4"
        >
          Edit
        </Button>
      )}
    </Form>
  );
}

export default ReviewForm;

export const ReviewFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 animate-pulse">
      {/* Label */}
      <div className="h-4 w-1/3 bg-muted rounded" />

      {/* Star Rating Skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-6 w-6 bg-muted rounded-full" />
        ))}
      </div>

      {/* Textarea */}
      <div className="h-24 bg-muted rounded-md" />

      {/* Submit Button */}
      <div className="w-32 h-10 bg-muted rounded-lg" />

      {/* Optional Preview Button */}
      <div className="w-20 h-10 bg-muted rounded-lg mt-2" />
    </div>
  );
};
