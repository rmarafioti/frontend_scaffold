// The site's own images (not CMS content). The template's hero is in its frontend_scaffold
// Cloudinary folder, the others are neutral placeholders in public/placeholders/. A client
// website replaces each with its own image, in public/ or in its static image folder on
// Cloudinary (docs/site.md), keeping real width, height and alt.

// The home page hero: one image with a desktop and a mobile source (ResponsiveImage).
export const heroPhoto = {
  alt: "Picture of a 1980s desktop computer with the words 'pc view' overlayed ontop of the image",
  desktop: {
    src: "https://res.cloudinary.com/dzpne110u/image/upload/v1766331084/frontend_scaffold/pc_view_fm6skx.png",
    height: 418,
    width: 662,
  },
  mobile: {
    src: "https://res.cloudinary.com/dzpne110u/image/upload/v1766331102/frontend_scaffold/mobile_view_sh76yr.png",
    height: 632,
    width: 426,
  },
};

// The navbar logo: one image with a light and a dark source (ResponsiveThemeImage).
export const logo = {
  alt: "Placeholder logo, home page",
  srcLight: "/placeholders/logo-light.svg",
  srcDark: "/placeholders/logo-dark.svg",
  width: 179,
  height: 118,
};

// The photo in the contact form's success modal.
export const formPhoto = {
  alt: "Placeholder photo",
  src: "/placeholders/form-photo.svg",
  width: 560,
  height: 320,
};
