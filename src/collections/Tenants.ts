import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
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
      admin: { readOnly: true },
    },
    {
      name: "stripeDetailSubmitted",
      type: "checkbox",
      admin: {
        readOnly: true,
        description:
          "You can not create products until you submit your account details",
      },
    },
  ],
};
