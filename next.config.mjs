// Next.js config. next/image may load remote images only from this website's own Cloudinary
// folders (docs/cms/client-website.md → Images), never from all of res.cloudinary.com.

// FILL: this website's CMS media folder (docs/site.md), given by the CMS.
const MEDIA_FOLDER = "media_folder";
// FILL: the Cloudinary folder of the site's own images (docs/site.md), or delete it and its entry
// below if they live in public/. The template's own hero images are in frontend_scaffold.
const STATIC_FOLDER = "frontend_scaffold";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Uploads from the CMS: production, then local testing.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/dzpne110u/image/upload/*/3dwd/${MEDIA_FOLDER}/**`,
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/dzpne110u/image/upload/*/3dwd-dev/${MEDIA_FOLDER}/**`,
      },
      // This website's own static images.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/dzpne110u/image/upload/**/${STATIC_FOLDER}/**`,
      },
    ],
  },
};

export default nextConfig;
