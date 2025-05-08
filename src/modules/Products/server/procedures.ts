import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { CustomCategory } from "@/types";
import { z } from "zod";
import type { Where } from "payload";

export const ProductRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({ categorySlug: z.string().nullable().optional() }))
    .query(async ({ ctx, input }) => {
      console.log(input, "singhajay");

      const where: Where = {};

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
        const subcategoriesSlug:any = [];
        
        console.log(subcategoriesSlug,"aaradhya singh");
        const category = formattedData[0];
        if (category) {
          subcategoriesSlug.push(
            ...category.subCategories.map((subcategory) => subcategory.slug)
          );
        }
        if (category) {
          where["category.slug"] = {
            // equals: category.slug,
            in: [category.slug,...subcategoriesSlug],
          };
        }
      }
      console.log("mai hu tera where", where);

      const data = await ctx.payload.find({
        collection: "Product",
        depth: 1,
        sort: "name",
        where,
      });

      return data;
    }),
});
