import { Category, Media, Tenant } from "@/payload-types";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { PLATFORMFEEPERCENT } from "@/constant";
export const CheckOutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.payload.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0,
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const tenantId = user.tenants?.[0]?.tenant as string;

    const tenant = await ctx.payload.findByID({
      collection: "tenants",
      id: tenantId,
    });

    if (!tenant) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tenant not found",
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_URL}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_URL}/admin`,
      type: "account_onboarding",
    });

    if (!accountLink) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create a verification link",
      });
    }

    return { url: accountLink.url };
  }),
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.payload.find({
        collection: "Product",
        depth: 2,
        select: {
          content: false,
        },
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (product.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const tenantData = await ctx.payload.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "tenant not found",
        });
      }
      if (!tenant.stripeDetailSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "tenant not allowed to sell products",
        });
      }

      // to do throw error if stripe details is not provoidedcosnt
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        product.docs.map((e) => ({
          quantity: 1,
          price_data: {
            unit_amount: e.price * 100,
            currency: "USD",
            product_data: {
              name: e.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: e.id,
                name: e.name,
                price: String(e.price),
              },
            },
          },
        }));

      const totalAmount = product.docs.reduce(
        (acc, item) => acc + item.price * 100,
        0
      );

      const platformFeeAmount = Math.round(
        totalAmount * (PLATFORMFEEPERCENT / 100)
      );
      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${process.env.NEXT_PUBLIC_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: {
            enabled: true,
          },
          metadata: {
            userId: ctx.session.user.id,
          },
          payment_intent_data: {
            application_fee_amount: platformFeeAmount,
          },
        },
        {
          stripeAccount: tenant.stripeAccountId,
        }
      );
      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a checkout session",
        });
      }

      return { url: checkout.url };
    }),

  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "Product",
        id: input.id,
      });

      return {
        ...product,
        image: product.image as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
      };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )

    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "Product",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.ids,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
      });

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return {
        ...data,
        totalPrice: data.docs.reduce((acc, product) => acc + product.price, 0),
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
