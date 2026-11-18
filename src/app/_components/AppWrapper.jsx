// Holds the visitor's accessibility settings (theme, plain font, font size), renders the
// accessibility menu, and applies the settings: the theme to <html data-theme>, the font settings
// to the page content. A theme choice wins over the system preference; Reset (theme null) goes
// back to following the system.
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Outfit } from "next/font/google";

import AccessMenu from "@/app/_components/accessibility/AccessMenu";

const outfit = Outfit({
  variable: "--main-font",
  weight: ["300", "600"],
  subsets: ["latin"],
});

const DARK_SYSTEM_QUERY = "(prefers-color-scheme: dark)";
const MIN_FONT_SIZE_ADJUST = 1;
const MAX_FONT_SIZE_ADJUST = 2.5;
// The four font size steps (1, 1.5, 2, 2.5) give 1rem, 1.125rem, 1.25rem and 1.375rem.
// theme: null follows the system preference; "light" or "dark" is the visitor's choice.
const DEFAULT_SETTINGS = {
  theme: null,
  isRemoveFontStyle: false,
  fontSizeAdjust: MIN_FONT_SIZE_ADJUST,
};

function subscribeToSystemTheme(onChange) {
  const query = window.matchMedia(DARK_SYSTEM_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getIsSystemDark() {
  return window.matchMedia(DARK_SYSTEM_QUERY).matches;
}

// The server can't know the system preference; the client corrects it on hydration.
function getIsSystemDarkOnServer() {
  return false;
}

export default function AppWrapper({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const isSystemDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getIsSystemDark,
    getIsSystemDarkOnServer,
  );

  const isThemeDark =
    settings.theme === "dark" || (settings.theme === null && isSystemDark);

  // With no choice, <html> has no data-theme and the CSS follows the system preference.
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme) root.setAttribute("data-theme", settings.theme);
    else root.removeAttribute("data-theme");
  }, [settings.theme]);

  function toggleTheme() {
    setSettings((prev) => ({ ...prev, theme: isThemeDark ? "light" : "dark" }));
  }

  function toggleRemoveFontStyle() {
    setSettings((prev) => ({
      ...prev,
      isRemoveFontStyle: !prev.isRemoveFontStyle,
    }));
  }

  function adjustFontSize(increment) {
    setSettings((prev) => ({
      ...prev,
      fontSizeAdjust: Math.max(
        MIN_FONT_SIZE_ADJUST,
        Math.min(MAX_FONT_SIZE_ADJUST, prev.fontSizeAdjust + increment),
      ),
    }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <>
      <AccessMenu
        isThemeDark={isThemeDark}
        isRemoveFontStyle={settings.isRemoveFontStyle}
        fontSizeAdjust={settings.fontSizeAdjust}
        toggleTheme={toggleTheme}
        toggleRemoveFontStyle={toggleRemoveFontStyle}
        adjustFontSize={adjustFontSize}
        resetSettings={resetSettings}
      />
      <article
        className={`appContainer ${
          settings.isRemoveFontStyle ? "accessible-font" : outfit.className
        }`}
        style={{ fontSize: `${0.75 + 0.25 * settings.fontSizeAdjust}rem` }}
      >
        {children}
      </article>
    </>
  );
}
