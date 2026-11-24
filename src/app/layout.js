// The root layout around every page: the navbar, the accessibility settings (AppWrapper) around
// the page content, the footer, and the site-wide metadata (including the link to the RSS feed).
// The favicon is src/app/favicon.ico.
import AppWrapper from "@/app/_components/AppWrapper";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/app/_data/site";
import Navbar from "@/app/_layout/Navbar";
import Footer from "@/app/_layout/Footer";

import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  // <link rel="alternate" type="application/rss+xml">, so readers and newsletter vendors find
  // the feed.
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: SITE_NAME }],
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <AppWrapper>{children}</AppWrapper>
        <Footer />
      </body>
    </html>
  );
}
