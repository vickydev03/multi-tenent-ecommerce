import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

// 👇 Define the correct type manually
const uploadConfig = {
  staticDir: "media",
  staticURL: "/media",
} as unknown as NonNullable<CollectionConfig["upload"]>;
  
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {},
  upload: uploadConfig,
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
