"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import NavSidebar from "./NavSidebar";
import { MenuIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const popins = Poppins({
  subsets: ["latin"],
  weight: "700",
});
interface navBarItemProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

const Navitem = ({ href, isActive = false, children }: navBarItemProps) => (
  <Button
    asChild
    variant={"outline"}
    className={cn(
      "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
      isActive && "bg-black text-white hover:bg-black hover:text-white"
    )}
  >
    <Link href={href}>{children}</Link>
  </Button>
);

const navItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];
function Navbar() {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  const pathName = usePathname();
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  return (
    <nav className="h-16 border-b flex justify-between font-medium bg-white ">
      <Link href={"/"} className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold ", popins.className)}>
          TradeNest
        </span>
      </Link>

      <div className=" items-center gap-2 md:gap-3 lg:gap-4 hidden lg:flex ">
        {navItems.map((e, i) => (
          <Navitem key={i} {...e} isActive={pathName == e.href}>
            {e.children}
          </Navitem>
        ))}
      </div>
      {session?.data?.user ? (
        <div className="hidden lg:flex">
          <Button
            asChild
            variant={"secondary"}
            className="border-l border-b-0 border-r-0 border-t-0 h-full px-12  hover:bg-pink-400 bg-white rounded-none transition-colors text-lg"
          >
            <Link prefetch href={"/admin"}>
              Dashboard
            </Link>
          </Button>
        </div>
      ) : (
        <div className="hidden lg:flex overflow-hidden">
          <Button
            asChild
            variant={"secondary"}
            className="border-l border-b-0 border-r-0 border-t-0 h-full px-10 lg:px-8  hover:bg-pink-400 bg-white rounded-none transition-colors text-lg"
          >
            <Link prefetch href={"/sign-in"}>
              Log in
            </Link>
          </Button>
          <Button
            asChild
            className="border-l border-b-0 border-r-0 border-t-0 h-full px-12  hover:bg-pink-400 hover-text-black bg-black rounded-none transition-colors text-lg "
          >
            <Link prefetch href={"/sign-up"}>
              Start selling
            </Link>
          </Button>
        </div>
      )}

      <div className="flex lg:hidden  items-center justify-center">
        <Button
          variant={"ghost"}
          className="border-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>

      <NavSidebar
        open={isSideBarOpen}
        onOpenChange={setIsSidebarOpen}
        items={navItems}
      />
    </nav>
  );
}

export default Navbar;
