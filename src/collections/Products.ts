import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "Product",
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;

      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;

      return Boolean(tenant?.stripeDetailSubmitted);
    },
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;

      // it will allow the user to update theier info themself
      return req.user?.id === id;
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "price in USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      // to-do rich text
      name: "content",
      type: "textarea",
      admin: {
        description:
          "Protected content only visible to customers after purchase. Add product documentation,downloadable files,getting started guides,and bonus materials. support markdown formating",
      },
    },
  ],
};
