import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
const MAX_RATTING = 5;
const MIN_RATTING = 0;

interface Props {
  rating: number;
  iconClassName?: string;
  text?: string;
}

export const StarRating = ({
  rating,
  iconClassName,
  text,
}: Props) => {
  const safeRatting = Math.max(MIN_RATTING, Math.min(rating, MAX_RATTING));
  return (
    <div className={cn("flex items-center gap-x-1 ")}>
      {Array.from({ length: MAX_RATTING }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-4",
            i < safeRatting ? "fill-black" : "",
            iconClassName
          )}
        />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
};
