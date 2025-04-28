
import { getQueryClient, trpc } from "@/trpc/server";
import React from "react";

async function Home() {
  const queryClient = getQueryClient();
  const data = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions());


  return <div>{JSON.stringify(data)}</div>;
}

export default Home;
