import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { CustomCategory } from "@/types";
import { z } from "zod";
import type { Sort, Where } from "payload";
import { headers as getHeaders } from "next/headers";
import { DEFAULT_LIMIT } from "@/constant";
import { TRPCError } from "@trpc/server";

export const ProductRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const sessions = await ctx.payload.auth({ headers });

      const product = await ctx.payload.findByID({
        collection: "Product",
        id: input.id,
      });

      if (product.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      let isPurchased = false;

      if (sessions.user) {
        const OderData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: sessions.user.id,
                },
              },
            ],
          },
        });
        isPurchased = !!OderData.docs[0];
      }
      const reviews = await ctx.payload.find({
        collection: "Review",
        pagination: false,
        where: {
          product: {
            equals: input.id,
          },
        },
      });

      const reviewRating =
        reviews.docs.length > 0
          ? reviews.docs.reduce(
              (acc, review) => acc + review.rating,
              0 / reviews.totalDocs
            )
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;
          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });
        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;

          ratingDistribution[rating] =
            Math.round(count / reviews.totalDocs) * 100;
        });
      }
      return {
        ...product,
        image: product.image as Media | null,
        isPurchased,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
      };
    }),
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
        tenantSlug: z.string().nullable().optional(),
      })
    )

    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: {
          not_equals: true,
        },
      };
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

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      } else {
        // this means we are loading product on public front since there is  no tenant slug
        // make sure to not load  product set to isPrivate true using reverse not_equals
        where["isPrivate"] = {
          not_equals: true,
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
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false,
        },
      });
      console.log(data, "lalu");

      const dataWithSummrizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
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
        ...data,
        docs: dataWithSummrizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
