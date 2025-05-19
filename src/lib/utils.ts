import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenant(tenant: string) {
  if (process.env.NODE_ENV === "development") {
    return `${process.env.NEXT_PUBLIC_URL}/tenants/${tenant}`;
  }

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  return `${protocol}://${tenant}.${domain}`;
}

export function formateCurrency(value: number | string | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}
