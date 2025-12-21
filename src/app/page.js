"use client";

import { photos } from "./data/photos";
import Responsive_Image from "./components/Responsive_image";
import Contact_Form from "./components/forms/Contact_Form";

import styles from "./styling/landing_page.module.css";

export default function Home() {
  const pc_photo = photos.find((p) => p.id === 1);
  const mobile_photo = photos.find((p) => p.id === 2);

  return (
    <main>
      <h1>Landing Page</h1>
      <section>
        <h2>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet
          consectetur adipiscing elit quisque faucibus.
        </h2>
      </section>
      <Responsive_Image
        initialPhoto={pc_photo}
        secondaryPhoto={mobile_photo}
        initialClassName={styles.pc_photo}
        secondaryClassName={styles.mobile_photo}
      />
      <Contact_Form />
    </main>
  );
}
