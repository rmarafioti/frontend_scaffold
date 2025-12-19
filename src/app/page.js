import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div className={styles.intro}>
        <h1>Landing Page.</h1>
        <h2>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet
          consectetur adipiscing elit quisque faucibus.
        </h2>
      </div>
    </main>
  );
}
