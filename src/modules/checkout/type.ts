import type Stripe from "stripe";

export interface ProductMetaData {
  stripeAccountId: string;
  id: string;
  name: string;
  price: string | number;
}

export type ExpendedLineItems = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata:ProductMetaData
    };
  };
};
