import { RefObject } from "react";


export function useDropDownPosition(
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) {
  const getDropDownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; //w-60=15rem=240px

    const top = rect.top + window.screenY;
    let left = rect.left + window.screenX;

    // check if dropdown would go off the right edge of the viewport

    if (left + dropdownWidth > window.innerWidth) {
      // align to right edge of button instead
      left = rect.right + window.screenX - dropdownWidth;

      // If still off-screen, align to the right edge of viewport with some padding

      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }

    // ensure dropdown does not go off left edge

    if (left < 0) {
      left = 16;
    }

    return { left, top };
  };

  return {getDropDownPosition}
}

  
