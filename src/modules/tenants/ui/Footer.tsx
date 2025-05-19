import React from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });
function Footer() {
  return (
    <footer className="h-20  border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl) mx-auto flex gap-2 items-center h-full px-4 lg:px-12">
        <p>Powered by</p>
        <Link href={process.env.NEXT_PUBLIC_URL!}>
          <span className={cn("text-2xl font-semibold", poppins.className)}>
            TradeNext
          </span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
