import { useCallback, useEffect, useState } from "react";

export function useComponentBounds(element: HTMLElement | null) {
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  const update = useCallback(() => {
    if (!element) return;
    setBounds(element.getBoundingClientRect());
  }, [element]);

  // Set the initial bounds
  useEffect(() => {
    update();
  }, [update]);

  // Update the bounds when the elements size changes
  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(() => {
      update();
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, update]);

  // Update the bounds after scrolling
  useEffect(() => {
    if (!element) return;

    window.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("scroll", update);
    };
  }, [element, update]);

  return bounds;
}
