// The site footer, on every page: the newsletter signup form and the copyright line.
import NewsletterForm from "@/app/_components/forms/NewsletterForm";

// FILL: the site owner's name, as it should appear in the copyright line.
const SITE_OWNER = "Site Owner";

export default function Footer() {
  return (
    <footer>
      <NewsletterForm />
      <p>
        &copy; {new Date().getFullYear()} {SITE_OWNER}. All rights reserved.
      </p>
    </footer>
  );
}
