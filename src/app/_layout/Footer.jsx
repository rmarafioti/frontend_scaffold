// The site footer, on every page.

// FILL: the site owner's name, as it should appear in the copyright line.
const SITE_OWNER = "Site Owner";

export default function Footer() {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} {SITE_OWNER}. All rights reserved.
      </p>
    </footer>
  );
}
