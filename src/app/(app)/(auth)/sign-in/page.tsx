import SignInView from "@/modules/auth/ui/view/SignInView";
import React from "react";

import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

async function page() {
  const session = await caller.auth.session();
  if(session.user){
    redirect("/")
  }
  return <SignInView />;
}

export default page;
