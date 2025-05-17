import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpendedLineItems } from "@/modules/checkout/type";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOKS_SECRET! as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (error instanceof Error) {
      console.error("❌", error);
    }
    return NextResponse.json(
      { message: "Webhooks Error:" + errorMessage },
      { status: 400 }
    );
  }

  console.log("success", event.id);

  const permittedEvent: string[] = ["checkout.session.completed"];

  const payload = await getPayload({ config });

  if (permittedEvent.includes(event.type)) {
    let data;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) {
            throw new Error("User id is required");
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            throw new Error("User not found ");
          }

          const expendedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            }
          );

          if (
            !expendedSession.line_items?.data ||
            !expendedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }

          const lineItems = expendedSession.line_items
            .data as ExpendedLineItems[];

          for (const item of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeSessionId: data.id,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name,
                price: item.price.unit_amount! / 100,
              },
            });
          }
          break;
        default:
          throw new Error("unhandled event:" + event.type);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          message: "webhook failed ",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Received" }, { status: 200 });
}
