// The home page: placeholder copy, the hero image and the contact form.
import ContactForm from "@/app/_components/forms/ContactForm";
import FadeInSection from "@/app/_components/FadeInSection";
import ResponsiveImage from "@/app/_components/ResponsiveImage";
import { heroPhoto } from "@/app/_data/photos";

import styles from "@/app/_styling/landing_page.module.css";

export const metadata = {
  title: "Home",
  description: "Landing page placeholder description",
};

export default function Home() {
  return (
    <main>
      <FadeInSection>
        <h1>Landing Page</h1>
        <h2>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet
          consectetur adipiscing elit quisque faucibus.
        </h2>
        <div className={styles.image_container}>
          <ResponsiveImage photoData={heroPhoto} />
        </div>
        <ContactForm />
      </FadeInSection>
    </main>
  );
}
