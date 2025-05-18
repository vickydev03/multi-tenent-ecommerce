import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
  },
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  //   auth: true,
  fields: [
    {
      name: "name",
      required: true,
      label: "Store name",
      type: "text",
      admin: {
        description: "This is the name of the store (e.g. Ajay store)",
      },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: "this is the subdomain of (e.g. [slug].nexttrade.com) ",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      // admin: { readOnly: true },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
      admin: {
        description: "Stripe Account Id associated with your shop",
      },
    },
    {
      name: "stripeDetailSubmitted",
      type: "checkbox",
      admin: {
        description:
          "You can not create products until you submit your account details",
      },
    },
  ],
};
