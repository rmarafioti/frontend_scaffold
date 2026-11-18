// The accessibility menu: Theme, Remove Font Style and Font Size (four steps), with Reset. Every
// control is a real button, so the menu works by keyboard. The settings live in AppWrapper.
"use client";

import { useState } from "react";
import { FaCircle, FaMinus, FaPlus } from "react-icons/fa6";
import { IoAccessibility } from "react-icons/io5";

import Toggle from "./Toggle";

import styles from "@/app/_styling/access_menu.module.css";

const FONT_SIZE_LEVELS = [1, 1.5, 2, 2.5];
const FONT_SIZE_STEP = 0.5;

export default function AccessMenu({
  isThemeDark,
  isRemoveFontStyle,
  fontSizeAdjust,
  toggleTheme,
  toggleRemoveFontStyle,
  adjustFontSize,
  resetSettings,
}) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.accessIcon}
        onClick={() => setIsMenuVisible(true)}
        aria-label="Open accessibility menu"
        aria-expanded={isMenuVisible}
        aria-controls="access-menu"
      >
        <IoAccessibility aria-hidden="true" />
      </button>

      {isMenuVisible && (
        <menu id="access-menu" className={styles.accessMenu}>
          <div className={styles.headerSection}>
            <p className={styles.menuHeader}>Accessibility Menu</p>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsMenuVisible(false)}
            >
              Close
            </button>
          </div>
          <article className={styles.controls}>
            <div className={styles.controlSection}>
              <p className={styles.controlItem}>Theme</p>
              <div className={styles.controlItem}>
                <Toggle
                  label="Dark theme"
                  onToggle={toggleTheme}
                  isToggled={isThemeDark}
                />
              </div>
            </div>
            <div className={styles.controlSection}>
              <p className={styles.controlItem}>Remove Font Style</p>
              <div className={styles.controlItem}>
                <Toggle
                  label="Remove font style"
                  onToggle={toggleRemoveFontStyle}
                  isToggled={isRemoveFontStyle}
                />
              </div>
            </div>
            <div className={styles.controlSection}>
              <p className={styles.controlItem}>Font Size</p>
              <div className={styles.resizingContainer}>
                <button
                  type="button"
                  className={styles.sizeItem}
                  onClick={() => adjustFontSize(-FONT_SIZE_STEP)}
                  aria-label="Decrease font size"
                >
                  <FaMinus aria-hidden="true" />
                </button>
                <div className={styles.indicators} aria-hidden="true">
                  {FONT_SIZE_LEVELS.map((level) => (
                    <FaCircle
                      key={level}
                      className={`${styles.indicator} ${
                        fontSizeAdjust === level ? styles.active : ""
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.sizeItem}
                  onClick={() => adjustFontSize(FONT_SIZE_STEP)}
                  aria-label="Increase font size"
                >
                  <FaPlus aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
          <button
            type="button"
            className={styles.resetButton}
            onClick={resetSettings}
          >
            Reset
          </button>
        </menu>
      )}
    </>
  );
}
