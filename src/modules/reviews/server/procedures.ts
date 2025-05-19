import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const ReviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // console.log(input, "singhajay");

      const product = await ctx.payload.findByID({
        collection: "Product",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const reviewsData = await ctx.payload.find({
        collection: "Review",
        where: {
          and: [
            {
              product: {
                equals: product.id,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      return reviewsData.totalDocs === 0 ? null : reviewsData.docs[0];
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1, { message: "Ratting is required" }).max(5),
        description: z.string().min(1, { message: "Description is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.payload.findByID({
        collection: "Product",
        id: input.productId,
      });

      console.log(product,"here");
      
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const existingReviewsData = await ctx.payload.find({
        collection: "Review",
        where: {
          and: [
            { product: { equals: input.productId } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
      });

      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product.",
        });
      }

      const review = await ctx.payload.create({
        collection: "Review",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });

      return review;
    }),

  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1, { message: "Ratting is required" }).max(5),
        description: z.string().min(1, { message: "Description is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.payload.findByID({
        collection: "Review",
        id: input.reviewId,
        depth: 0,
      });

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review",
        });
      }

      const updatedReview = await ctx.payload.update({
        collection: "Review",
        id: input.reviewId,
        data: {
          rating: input.rating,
          description: input.description,
        },
      });

      return updatedReview;
    }),
});
