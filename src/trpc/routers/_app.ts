import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { authRouter } from "@/modules/auth/Server/procedures";
import { ProductRouter } from "@/modules/Products/server/procedures";
import { TagsRouter } from "@/modules/tags/server/procedures";
import { TenantsRouter } from "@/modules/tenants/server/procedures";
import { CheckOutRouter } from "@/modules/checkout/server/procedures";
import { libraryRouter } from "@/modules/library/server/procedures";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
  products: ProductRouter,
  tags: TagsRouter,
  tenants: TenantsRouter,
  checkout: CheckOutRouter,
  library:libraryRouter
});

export type AppRouter = typeof appRouter;
