"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";

/** Pixels of scroll direction change before toggling (lower = snappier). */
const SCROLL_DELTA = 3;
/** Always show nav when this close to the top of the page. */
const TOP_ALWAYS_VISIBLE = 56;

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  visible,
}: {
  pathname: string | null;
  visible: boolean;
}) {
  return (
    <ul className="site-navbar__list">
      {nav.map((item) => {
        const active =
          pathname !== null ? isNavActive(pathname, item.href) : false;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`site-navbar__link${active ? " site-navbar__link--active" : ""}`}
              aria-current={active ? "page" : undefined}
              tabIndex={visible ? undefined : -1}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NavLinksWithPathname({ visible }: { visible: boolean }) {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} visible={visible} />;
}

export function SiteNavbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      return;
    }

    lastScrollY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y <= TOP_ALWAYS_VISIBLE) {
        setVisible(true);
      } else if (delta < -SCROLL_DELTA) {
        setVisible(true);
      } else if (delta > SCROLL_DELTA) {
        setVisible(false);
      }

      lastScrollY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-navbar${visible ? " site-navbar--visible" : " site-navbar--hidden"}`}
      data-visible={visible}
      style={{ paddingTop: "2rem", paddingBottom: "1rem" }}
    >
      <div className="site-navbar__inner">
        <nav className="site-navbar__nav" aria-label="Main">
          <div className="site-navbar__track">
            <Suspense fallback={<NavLinks pathname={null} visible={visible} />}>
              <NavLinksWithPathname visible={visible} />
            </Suspense>
          </div>
        </nav>
      </div>
    </header>
  );
}
