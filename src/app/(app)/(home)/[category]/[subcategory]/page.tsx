import React from "react";
interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}
async function page({ params }: Props) {
  const { category, subcategory } = await params;
  return (
    <div>
      category{category} <br />
      subcategory{subcategory} <br />

    </div>
  );
}

export default page;
