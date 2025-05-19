import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import { DEFAULT_LIMIT } from "@/constant";
export const TagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      // console.log(input, "singhajay"); 

      const data = await ctx.payload.find({
        collection: "tags",
        depth: 1,
        page: input.cursor,
        limit: input.limit,
      });

      return data;
    }),
});
