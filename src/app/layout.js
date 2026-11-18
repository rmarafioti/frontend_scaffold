// The root layout around every page: the navbar, the accessibility settings (AppWrapper) around
// the page content, the footer, and the site-wide metadata. The favicon is src/app/favicon.ico.
import AppWrapper from "@/app/_components/AppWrapper";
import Navbar from "@/app/_layout/Navbar";
import Footer from "@/app/_layout/Footer";

import "./globals.css";

// FILL: the website's name and a one-sentence description for search results.
const SITE_NAME = "Site Name";
const SITE_DESCRIPTION = "Site description";

export const metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
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
