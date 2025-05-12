import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { authRouter } from "@/modules/auth/Server/procedures";
import { ProductRouter } from "@/modules/Products/server/procedures";
import { TagsRouter } from "@/modules/tags/server/procedures";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
  products:ProductRouter,
  tags:TagsRouter
});

export type AppRouter = typeof appRouter;
