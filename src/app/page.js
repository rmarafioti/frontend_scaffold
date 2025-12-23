"use client";

import { heroPhoto } from "./data/photos";
import Responsive_Image from "./components/Responsive_image";
import Contact_Form from "./components/forms/Contact_Form";

import styles from "./styling/landing_page.module.css";

export default function Home() {
  return (
    <main>
      <section>
        <h1>Landing Page</h1>
        <h2>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet
          consectetur adipiscing elit quisque faucibus.
        </h2>
      </section>
      <div className={styles.image_container}>
        <Responsive_Image photoData={heroPhoto} />
      </div>
      <Contact_Form />
    </main>
  );
}
