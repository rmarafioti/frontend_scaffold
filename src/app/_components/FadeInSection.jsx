// Scaffold element: a section that fades in the first time it scrolls into view. The fade itself
// is the section and section.visible rules in globals.css.
"use client";

import { useVisibility } from "@/app/_hooks/useVisibility";

export default function FadeInSection({ children }) {
  const [ref, isVisible] = useVisibility(0.1);

  return (
    <section ref={ref} className={isVisible ? "visible" : ""}>
      {children}
    </section>
  );
}
