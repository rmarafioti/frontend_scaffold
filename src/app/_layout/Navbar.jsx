// The site navigation: the logo and links on desktop, a Home link and a menu button on mobile.
// The current page's link is highlighted and marked aria-current. A Client Component for the
// mobile menu's open state and the current path.
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ResponsiveThemeImage from "@/app/_components/ResponsiveThemeImage";
import { logo } from "@/app/_data/photos";

/* naming conventions to define responsive design */
import pc from "@/app/_styling/navbar.module.css";
import mobile from "@/app/_styling/mobile_nav.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/featureOne", label: "One" },
  { href: "/featureTwo", label: "Two" },
  { href: "/featureThree", label: "Three" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href) {
    return pathname === href;
  }

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <nav>
        <ResponsiveThemeImage photoData={logo} className={pc.nav_icon} />
        <div className={pc.link_container}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${pc.nav_link} ${isActive(href) ? pc.active_link : ""}`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* mobile navigation menu below */}
        <div className={pc.mobile_nav}>
          <Link
            href="/"
            className={pc.nav_link}
            aria-current={isActive("/") ? "page" : undefined}
            onClick={closeMenu}
          >
            Home
          </Link>
          {/* hamburger menu */}
          <button
            type="button"
            id={mobile.hamMenuContainer}
            onClick={toggleMenu}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`${mobile.menuButtonBurger} ${
                isMenuOpen ? mobile.open : ""
              }`}
            ></span>
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <menu
        id="mobile-menu"
        className={`${pc.menu} ${isMenuOpen ? pc.active : ""}`}
        aria-label="Mobile Navigation"
      >
        {NAV_LINKS.filter(({ href }) => href !== "/").map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={mobile.nav_link}
            aria-current={isActive(href) ? "page" : undefined}
            onClick={closeMenu}
          >
            {label}
          </Link>
        ))}
      </menu>
    </>
  );
}
