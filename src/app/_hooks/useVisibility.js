// Reports when an element first scrolls into view. Returns a ref to attach and whether the
// element has been seen; it stays true once seen, so a fade-in plays only once.
import { useEffect, useRef, useState } from "react";

export function useVisibility(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
