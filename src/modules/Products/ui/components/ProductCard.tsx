import { generateTenant } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  id?: string;
  name: string;
  imageUrl: string | undefined | null;
  authorUsername: string;
  reviewRatting: number;
  price: number;
  reviewCount: number;
  authorImage?: string | null;
}
function ProductCard({
  id,
  name,
  imageUrl,
  authorUsername,
  reviewCount,
  reviewRatting,
  price,
  authorImage,
}: Props) {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(generateTenant(authorUsername));
  };
  console.log("mai hu id",id);
  
  return (
    <Link href={`${generateTenant(authorUsername)}/products/${id}`}>
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full w-full flex flex-col ">
        <div className=" relative aspect-square">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            className=" object-contain"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col p-4 gap-3 flex-1 border-y">
          <h2 className="text-lg font-medium line-clamp-">{name}</h2>
          <div className="flex items-center gap-2" onClick={handleClick}>
            {authorImage && (
              <Image
                alt={authorUsername}
                src={authorImage}
                width={16}
                height={16}
                className=" rounded-full border shrink-0 size-[16px]"
              />
            )}
            <p className="text-sm underline font-medium ">{authorUsername}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-[3.5] fill-black" />
              <p className="text-sm font-medium">
                {reviewRatting} ({reviewCount})
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit ">
            <p className="text-sm font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(price))}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
export const ProductCardSkeleton = () => {
  return (
    <div className="W-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};

export default ProductCard;
