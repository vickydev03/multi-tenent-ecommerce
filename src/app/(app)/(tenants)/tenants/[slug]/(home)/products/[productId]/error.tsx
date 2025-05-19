"use client";
import { InboxIcon, TriangleAlert } from "lucide-react";
import React from "react";

function ErrorPage() {
  return (
    <div className="border border-black border-dased  flex items-center  justify-center  p-8 flex-col   gap-y-4 bg-white w-full rounded-lg">
      <TriangleAlert className="" />
      <p className="text-base font-medium "> Something went wrong</p>
    </div>
  );
}

export default ErrorPage;
