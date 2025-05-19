import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  // const router = useRouter();
  console.log("mai hu id", id);

  return (
    <Link href={`/library/${id}`} >
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full w-full flex flex-col ">
        <div className=" relative aspect-square">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            className=" object-cover"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col p-4 gap-3 flex-1 border-y">
          <h2 className="text-lg font-medium line-clamp-">{name}</h2>
          <div className="flex items-center gap-2">
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
