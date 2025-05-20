// import type { Stripe } from "stripe";
// import { getPayload } from "payload";
// import config from "@payload-config";
// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
// import { ExpendedLineItems } from "@/modules/checkout/type";

// export async function POST(req: Request) {
//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       await (await req.blob()).text(),
//       req.headers.get("stripe-signature") as string,
//       process.env.STRIPE_WEBHOOKS_SECRET! as string
//     );
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     if (error instanceof Error) {
//       console.error("❌", error);
//     }
//     return NextResponse.json(
//       { message: "Webhooks Error:" + errorMessage },
//       { status: 400 }
//     );
//   }

//   console.log("success", event.id);

//   const permittedEvent: string[] = [
//     "checkout.session.completed",
//     "account.updated",
//   ];

//   const payload = await getPayload({ config });

//   if (permittedEvent.includes(event.type)) {
//     let data;
//     try {
//       switch (event.type) {
//         case "checkout.session.completed":
//           data = event.data.object as Stripe.Checkout.Session;

//           if (!data.metadata?.userId) {
//             throw new Error("User id is required");
//           }

//           const user = await payload.findByID({
//             collection: "users",
//             id: data.metadata.userId,
//           });

//           if (!user) {
//             throw new Error("User not found ");
//           }

//           const expendedSession = await stripe.checkout.sessions.retrieve(
//             data.id,
//             {
//               expand: ["line_items.data.price.product"],
//             },
//             {
//               stripeAccount: event.account,
//             }
//           );

//           if (
//             !expendedSession.line_items?.data ||
//             !expendedSession.line_items.data.length
//           ) {
//             throw new Error("No line items found");
//           }

//           const lineItems = expendedSession.line_items
//             .data as ExpendedLineItems[];

//           for (const item of lineItems) {
//             await payload.create({
//               collection: "orders",
//               data: {
//                 stripeSessionId: data.id,
//                 user: user.id,
//                 product: item.price.product.metadata.id,
//                 name: item.price.product.name,
//                 price: item.price.unit_amount! / 100,
//                 stripeAccountId:event.account
//               },
//             });
//           }
//           break;
//         case "account.updated":
//           data = event.data.object as Stripe.Account;

//           await payload.update({
//             collection: "tenants",
//             where: {
//               stripeAccountId: {
//                 equals: data.id,
//               },
//             },
//             data: {
//               stripeDetailSubmitted: data.details_submitted,
//             },
//           });
//           break;
//         default:
//           throw new Error("unhandled event:" + event.type);
//       }
//     } catch (error) {
//       console.log(error);
//       return NextResponse.json(
//         {
//           message: "webhook failed ",
//         },
//         { status: 500 }
//       );
//     }
//   }

//   return NextResponse.json({ message: "Received" }, { status: 200 });
// }

import { stripe } from "@/lib/stripe";
import { getPayload } from "payload";
import payloadConfig from "@payload-config";
import { NextRequest, NextResponse } from "next/server";
import type { Stripe } from "stripe";
import { ExpendedLineItems } from "@/modules/checkout/type";

// ✅ Force Node.js runtime
export const config = {
  runtime: "nodejs",
};

async function buffer(readable: globalThis.ReadableStream<Uint8Array> | null) {
  if (!readable) throw new Error("No request body");
  const chunks = [];
  const reader = readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req.body);
    const signature = req.headers.get("stripe-signature") as string;

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  console.log("✅ Webhook received:", event.type);

  const payload = await getPayload({ config: payloadConfig });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const data = event.data.object as Stripe.Checkout.Session;

        if (!data.metadata?.userId) throw new Error("Missing user ID");

        const user = await payload.findByID({
          collection: "users",
          id: data.metadata.userId,
        });

        if (!user) throw new Error("User not found");

        const expendedSession = await stripe.checkout.sessions.retrieve(
          data.id,
          {
            expand: ["line_items.data.price.product"],
          },
          {
            stripeAccount: event.account,
          }
        );

        const lineItems = expendedSession.line_items
          ?.data as ExpendedLineItems[];
        if (!lineItems?.length) throw new Error("No line items found");

        for (const item of lineItems) {
          await payload.create({
            collection: "orders",
            data: {
              stripeSessionId: data.id,
              user: user.id,
              product: item.price.product.metadata.id,
              name: item.price.product.name,
              price: item.price.unit_amount! / 100,
              stripeAccountId: event.account,
            },
          });
        }

        break;
      }

      case "account.updated": {
        const data = event.data.object as Stripe.Account;
        await payload.update({
          collection: "tenants",
          where: {
            stripeAccountId: {
              equals: data.id,
            },
          },
          data: {
            stripeDetailSubmitted: data.details_submitted,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("❌ Handler Error:", error);
    return NextResponse.json(
      { message: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
