import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface NavItems {
  href: string;
  children: React.ReactNode;
}

interface Props {
  items: NavItems[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function NavSidebar({ items, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((e, i) => {
            return (
              
                <Link
                  key={i}
                  className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                  href={e.href}
                  onClick={()=>onOpenChange(false)}
                >
                  {e.children}
                </Link>
              
            );
          })}

          <div className="border-t">
            <Link
              href={"/sign-in"}
              className="w-full text-left flex items-center  p-4 text-base font-medium hover:bg-black hover:text-white   "
            >
              Sign in
            </Link>
            <Link
              href={"/sign-in"}
              className="w-full text-left hover:bg-black hover:text-white p-4  text-base font-medium flex items-center"
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default NavSidebar;
