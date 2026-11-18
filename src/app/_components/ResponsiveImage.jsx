// Scaffold element: one image with a desktop and a mobile source. next/image's getImageProps
// builds both, and a <picture> lets the browser pick by screen width.
import { getImageProps } from "next/image";

import styles from "@/app/_styling/responsive_image.module.css";

const MOBILE_QUERY = "(max-width: 800px)";

export default function ResponsiveImage({ photoData, className = "" }) {
  const { desktop, mobile, alt } = photoData;
  const sharedProps = { alt, preload: true };

  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...sharedProps, ...mobile });
  const { props: desktopProps } = getImageProps({
    ...sharedProps,
    ...desktop,
  });

  return (
    <picture>
      <source media={MOBILE_QUERY} srcSet={mobileSrcSet} />
      <img
        {...desktopProps}
        alt={alt}
        className={`${styles.image} ${className}`}
      />
    </picture>
  );
}
