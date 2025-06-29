import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Articles: CollectionConfig = {
  slug: "articles",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "title",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
        name: "isPrivate",
        label: "private",
        defaultValue: false,
        type: "checkbox",
        admin: {
          description:
            "If checked, this article will be private and not show to anyone",
        },
      },
      {
        name: "content",
        type: "richText",
        admin: {
          description:
            "write the article for your blog",
        },
      },
      {
        name: "tags",
        type: "relationship",
        relationTo: "tags",
        hasMany: true,
      },
  ],
};
