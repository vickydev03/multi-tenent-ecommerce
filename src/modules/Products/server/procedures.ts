import { Category, Media } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { CustomCategory } from "@/types";
import { z } from "zod";
import type { Sort, Where } from "payload";

import { sortValues } from "../hooks/useProductFilterHook";
import { DEFAULT_LIMIT } from "@/constant";

export const ProductRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        categorySlug: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.any(),
        sort: z.any(),
      })
    )

    .query(async ({ ctx, input }) => {
      const where: Where = {};
      // console.log(input, "singhajay");
      let sort: Sort = "createdAt";

      if (input.sort === "newest") {
        sort = "-createdAt";
      } else if (input.sort === "oldest") {
        sort = "+createdAt";
      } else if (input.sort === "default") {
        sort = "-createdAt";
      }

      if (input.minPrice && input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.categorySlug) {
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.categorySlug,
            },
          },
        });

        const formattedData: CustomCategory[] = categoriesData.docs.map(
          (doc: any) => ({
            ...doc,
            subCategories:
              doc?.subCategories.docs ??
              []?.map((doc) => ({ ...(doc as Category) })),
            subcategories: undefined,
          })
        );
        const subcategoriesSlug: any = [];

        console.log(subcategoriesSlug, "aaradhya singh");
        const category = formattedData[0];
        if (category) {
          subcategoriesSlug.push(
            ...category.subCategories.map((subcategory) => subcategory.slug)
          );
        }
        if (category) {
          where["category.slug"] = {
            // equals: category.slug,
            in: [category.slug, ...subcategoriesSlug],
          };
        }
      }
      console.log("mai hu tera where", where);

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.payload.find({
        collection: "Product",
        depth: 1,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
        })),
      };
    }),
});
