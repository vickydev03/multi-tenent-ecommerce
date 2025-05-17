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

export const libraryRouter = createTRPCRouter({
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
      console.log(productIds,"this is data from order procedure");
      
      // console.log(data, "lalu");
      const productData = await ctx.payload.find({
        collection: "Product",
        pagination: false,
        where: {
          id: {
            in:productIds
          },
        },
      });

      return {
        ...productData,
        docs: productData.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
