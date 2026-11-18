// An on/off switch for the accessibility menu: a real button with aria-pressed, so it works by
// keyboard and screen readers announce its state.
import styles from "@/app/_styling/toggle.module.css";

export default function Toggle({ label, onToggle, isToggled }) {
  return (
    <article className={styles.toggleSection}>
      <button
        type="button"
        className={styles.toggleContainer}
        onClick={onToggle}
        aria-label={label}
        aria-pressed={isToggled}
      >
        <span
          className={`${styles.toggleButton} ${isToggled ? styles.toggled : ""}`}
        ></span>
      </button>
    </article>
  );
}
