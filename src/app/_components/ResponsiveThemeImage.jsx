// Scaffold element: one image with a light and a dark source. Both are rendered; CSS in
// responsive_image.module.css shows the one matching the theme, so the visitor's choice in the
// accessibility menu wins over the system preference, with no flash on load.
import Image from "next/image";

import styles from "@/app/_styling/responsive_image.module.css";

export default function ResponsiveThemeImage({ photoData, className = "" }) {
  const { srcLight, srcDark, alt, width, height } = photoData;

  return (
    <>
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.lightImage} ${className}`}
      />
      <Image
        src={srcDark}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.darkImage} ${className}`}
      />
    </>
  );
}
