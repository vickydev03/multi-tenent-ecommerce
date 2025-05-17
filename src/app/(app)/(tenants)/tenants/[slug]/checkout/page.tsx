import CheckOutView from "@/modules/checkout/ui/component/CheckOutView";
import React from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function page({ params }: Props) {
  const { slug } = await params;
  return <CheckOutView tenantSlug={slug} />;
}

export default page;
