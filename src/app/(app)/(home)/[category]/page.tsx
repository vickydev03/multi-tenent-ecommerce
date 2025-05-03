import React from "react";
interface Props {
  params: string;
}
async function page({ params }: Props) {
  return <div>singh is the king</div>;
}

export default page;
