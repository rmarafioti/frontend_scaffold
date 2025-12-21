"use client";

import Image from "next/image";

export default function Responsive_Image({
  initialPhoto,
  secondaryPhoto,
  initialClassName,
  secondaryClassName,
}) {
  return (
    <>
      {initialPhoto && (
        <Image
          src={initialPhoto.src}
          alt={initialPhoto.alt}
          width={initialPhoto.width}
          height={initialPhoto.height}
          className={initialClassName}
          sizes="100vw"
          priority
        />
      )}
      {secondaryPhoto && (
        <Image
          src={secondaryPhoto.src}
          alt={secondaryPhoto.alt}
          width={secondaryPhoto.width}
          height={secondaryPhoto.height}
          className={secondaryClassName}
          priority
        />
      )}
    </>
  );
}
