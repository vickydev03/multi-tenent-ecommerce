import { Button } from "@/components/ui/button";
import { formateCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";
import React from "react";
interface Props {
  total: number | undefined;
  onPurchase: () => void;
  isCanceled: boolean;
  isPending: boolean;
}
function CheckOutSidebar({ total, onPurchase, isCanceled, isPending }: Props) {
  return (
    <div className=" border rounded-md overflow-hidden bg-white flex flex-col">
      <div className=" flex items-center justify-between p-4 border-b ">
        <h4 className="font-medium text-lg">total</h4>
        <p className="font-medium text-lg">{formateCurrency(total)}</p>
      </div>
      <div className="p-4 flex items-center justify-center ">
        <Button
          variant={"elevated"}
          disabled={isPending}
          onClick={onPurchase}
          size={"lg"}
          className="text-basew-full text-white bg-primary hover:bg-pink-400 hover:text-primary"
        >
          Checkout
        </Button>
      </div>
      {isCanceled && (
        <div className="p-4 flex justify-center items-center border-t ">
          <div className="bg-red-100 border border-red-400 font-medium px-4 py-3  rounded  flex items-center ">
            <div className="flex items-center ">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />
              <span>Checkout faild , Please try again.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckOutSidebar;
