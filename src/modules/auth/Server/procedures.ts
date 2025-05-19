// import { Category } from "@/payload-types";
// import { baseProcedure, createTRPCRouter } from "@/trpc/init";
// import { CustomCategory } from "@/types";
// import z from "zod";

// import { headers as getHeaders, cookies as getCookies } from "next/headers";
// import { TRPCError } from "@trpc/server";
// import { AUTH_COOKIE } from "../constants";

// export const authRouter = createTRPCRouter({
//   session: baseProcedure.query(async ({ ctx }) => {
//     const headers = await getHeaders();

//     const session = await ctx.payload.auth({ headers });
//     return session;
//   }),
//   register: baseProcedure
//     .input(
//       z.object({
//         email: z.any(),
//         password: z.string().min(1),
//         username: z
//           .string()
//           .min(3, "Username must be at least 3 characters")
//           .max(63, "username must be less than 63 characters ")
//           .regex(
//             /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
//             "Username can only contains lowercase letters, numbers hyphens."
//           )
//           .refine(
//             (val) => !val.includes("--"),
//             "Username cannot contain consecutive hyphens"
//           )
//           .transform((val) => val.toLowerCase()),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // TODO: Implement registration logic
//       console.log("REGISTER INPUT", input.email);

//       const existingData = await ctx.payload.find({
//         collection: "users",
//         limit: 1,
//         where: {
//           username: {
//             equals: input.username,
//           },
//         },
//       });
//       const existingUser = existingData.docs[0];

//       if (existingUser) {
//         throw new TRPCError({
//           code: "BAD_REQUEST",
//           message: "Username is already taken",
//         });
//       }
//       try {
//         const tenant = await ctx.payload.create({
//           collection: "tenants",
//           data: {
//             name: input.username,
//             slug: input.username,
//             stripeAccountId: "test",
//           },
//         });

//         await ctx.payload.create({
//           collection: "users",
//           data: {
//             email: input.email,
//             username: input.username,
//             password: input.password,
//             tenants: [{ tenant: tenant.id }],
//           },
//         });
//       } catch (error) {
//         console.log(error);
//       }

//       const data = await ctx.payload.login({
//         collection: "users",
//         data: {
//           email: input.email,
//           password: input.password,
//         },
//       });

//       if (!data.token) {
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "failed to login",
//         });
//       }
//       const cookies = await getCookies();

//       cookies.set({
//         name: AUTH_COOKIE,
//         value: data.token,
//         httpOnly: true,
//         path: "/",
//       });
//       return data;
//     }),
//   login: baseProcedure
//     .input(
//       z.object({
//         email: z.string().email(),
//         password: z.string(),
//       })
//     )
//     .mutation(async ({ input, ctx }) => {
//       // TODO: Implement registration logic
//       const data = await ctx.payload.login({
//         collection: "users",
//         data: {
//           email: input.email,
//           password: input.password,
//         },
//       });

//       if (!data.token) {
//         throw new TRPCError({
//           code: "UNAUTHORIZED",
//           message: "failed to login",
//         });
//       }
//       const cookies = await getCookies();

//       cookies.set({
//         name: AUTH_COOKIE,
//         value: data.token,
//         httpOnly: true,
//         path: "/",
//       });
//       return data;
//     }),
//   logout: baseProcedure.mutation(async () => {
//     const cookies = await getCookies();

//     cookies.delete(AUTH_COOKIE);
//   }),
// });
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { headers as getHeaders, cookies as getCookies } from "next/headers";

import { AUTH_COOKIE } from "../constants"; // Ensure AUTH_COOKIE is defined properly
import { stripe } from "@/lib/stripe";

// Define Input Schemas using zod for validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(63, "Username must be less than 63 characters")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers, and hyphens."
    ),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// Define the AuthRouter with session, register, login, and logout
export const authRouter = createTRPCRouter({
  // Session retrieval
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders(); // Retrieve headers for session
    const session = await ctx.payload.auth({ headers });
    return session;
  }),

  // Register new user
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if username already exists
        const existingUser = await ctx.payload.find({
          collection: "users",
          limit: 1,
          where: {
            username: { equals: input.username },
          },
        });

        if (existingUser.docs.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username is already taken",
          });
        }

        // Create a new tenant (assuming you have tenant logic in place)

        const account = await stripe.accounts.create({});
        if (!account) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create Stripe account",
          });
        }
        const tenant = await ctx.payload.create({
          collection: "tenants",
          data: {
            name: input.username,
            slug: input.username,
            stripeAccountId: account.id, // Example; replace with actual stripe logic
          },
        });

        // Create user
        await ctx.payload.create({
          collection: "users",
          data: {
            email: input.email,
            username: input.username,
            password: input.password,
            tenants: [{ tenant: tenant.id }],
          },
        });

        // Perform login immediately after registration
        const loginData = await ctx.payload.login({
          collection: "users",
          data: {
            email: input.email,
            password: input.password,
          },
        });

        if (!loginData.token) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Failed to log in after registration",
          });
        }

        // Set authentication cookie
        const cookies = await getCookies();
        cookies.set({
          name: AUTH_COOKIE,
          value: loginData.token,
          httpOnly: true,
          sameSite: "none",
          domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        });

        return loginData; // Return user data along with token
      } catch (error) {
        console.log("Registration Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while registering the user",
        });
      }
    }),

  // Login user
  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    try {
      const loginData = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!loginData.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Set authentication cookie
      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: loginData.token,
        httpOnly: true,
        path: "/",
        sameSite: "none",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        secure: process.env.NODE_ENV === "production",
      });

      return loginData; // Return user data and token
    } catch (error) {
      console.error("Login Error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while logging in",
      });
    }
  }),

  // Logout user
  logout: baseProcedure.mutation(async () => {
    try {
      const cookies = await getCookies();
      cookies.delete(AUTH_COOKIE); // Remove the authentication cookie
      return { message: "Logged out successfully" };
    } catch (error) {
      console.error("Logout Error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while logging out",
      });
    }
  }),
});
