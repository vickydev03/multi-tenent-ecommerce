import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Stripe } from "stripe";
import { ExpendedLineItems } from "@/modules/checkout/type";

// 👇 Helper function to read raw buffer from request
async function readStreamToBuffer(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader();
  const chunks = [];
  let done, value;

  while (!done) {
    ({ done, value } = await reader.read());
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    const bodyBuffer = await readStreamToBuffer(req.body!); // ✅ get raw buffer
    const signature = req.headers.get("stripe-signature") as string;

    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET!
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Webhook signature verification failed:", errorMessage);
    return NextResponse.json(
      { message: "Webhook Error: " + errorMessage },
      { status: 400 }
    );
  }

  console.log("✅ Webhook received:", event.id);

  const permittedEvents = ["checkout.session.completed", "account.updated"];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) {
            throw new Error("User ID is missing in metadata.");
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) throw new Error("User not found.");

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
            { stripeAccount: event.account }
          );

          const lineItems = expandedSession.line_items
            ?.data as ExpendedLineItems[];

          if (!lineItems?.length) {
            throw new Error("No line items found.");
          }

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
              stripeAccountId: { equals: data.id },
            },
            data: {
              stripeDetailSubmitted: data.details_submitted,
            },
          });

          break;
        }
        default:
          throw new Error("Unhandled event type: " + event.type);
      }
    } catch (error) {
      console.error("⚠️ Error processing webhook:", error);
      return NextResponse.json({ message: "Webhook handling failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Event received" }, { status: 200 });
}
