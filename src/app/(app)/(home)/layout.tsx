// import React from "react";
import Navbar from "./_component/Navbar";
import Footer from "./_component/Footer";
import SearchFilters from "../search-filters";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Category } from "@/payload-types";

interface type {
  subcategories: any;
}
async function layout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 2,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc: any) => ({
    ...doc,
    subCategories:
      doc?.subcategories.docs ?? []?.map((doc) => ({ ...(doc as Category) })),
    subcategories: undefined,
  }));

  console.log(data);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />

      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}

export default layout;
