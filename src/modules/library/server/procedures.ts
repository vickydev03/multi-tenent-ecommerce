import { Category, Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { CustomCategory } from "@/types";
import { z } from "zod";
import type { Sort, Where } from "payload";
import { headers as getHeaders } from "next/headers";
import { DEFAULT_LIMIT } from "@/constant";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )

    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "orders",

        where: {
          and: [
            {
              product: {
                equals: input.productId,
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

      const order = data.docs[0];

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const productData = await ctx.payload.findByID({
        collection: "Product",
        id: input.productId,
      });

      if (!productData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return productData;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )

    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "orders",
        depth: 0,
        page: input.cursor,
        limit: input.limit,

        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = data.docs.map((order) => order.product);
      console.log(productIds, "this is data from order procedure");

      // console.log(data, "lalu");
      const productData = await ctx.payload.find({
        collection: "Product",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const dataWithSummrizedReviews = await Promise.all(
        productData.docs.map(async (doc) => {
          const reviewsData = await ctx.payload.find({
            collection: "Review",
            pagination: false,
            where: {
              product: {
                equals: doc.id,
              },
            },
          });
          return {
            ...doc,
            reviewCount: reviewsData.totalDocs,
            reviewRating:
              reviewsData.docs.length === 0
                ? 0
                : reviewsData.docs.reduce(
                    (acc, review) => acc + review.rating,
                    0 / reviewsData.totalDocs
                  ),
          };
        })
      );


      return {
        ...productData,
        docs: dataWithSummrizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
