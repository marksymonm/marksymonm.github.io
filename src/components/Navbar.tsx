import { useState, useRef, useEffect, type MouseEvent } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { motion } from "motion/react";

const LINKS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "BACKGROUND", href: "#background" },
];

function Navbar() {
  const [active, setActive] = useState("HOME");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      document.body.classList.toggle("has-scrolled", isScrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = LINKS.map((link) =>
      document.getElementById(link.href.substring(1))
    ).filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const current = LINKS.find(
              (link) => link.href === `#${entry.target.id}`
            );

            if (current) {
              setActive(current.label);
            }
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;

    const rect = navRef.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    navRef.current.style.setProperty("--glow-x", `${x}%`);
    navRef.current.style.setProperty("--glow-y", `${y}%`);
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleLinkClick = (label: string) => {
    setActive(label);
    setMenuOpen(false);
  };

  return (
    <div className={`navbar-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className="navbar"
        ref={navRef}
        onMouseMove={handleMouseMove}
      >
        <a
          className="navbar-logo"
          href="#top"
          onClick={handleLogoClick}
        >
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo-img"
          />
        </a>

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          {LINKS.map((link) => (
            <li key={link.label} className="navbar-item">
              <a
                href={link.href}
                className={`navbar-link ${
                  active === link.label ? "is-active" : ""
                }`}
                onClick={() => setActive(link.label)}
              >
                {active === link.label && (
                  <motion.span
                    layoutId="navbar-active"
                    className="navbar-active-bg"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                <span className="navbar-link-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Burger */}
        <button
          type="button"
          className={`navbar-burger${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Backdrop FIRST */}
      {menuOpen && (
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`navbar-mobile-panel${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar-mobile-links">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`navbar-mobile-link ${
                  active === link.label ? "is-active" : ""
                }`}
                onClick={() => handleLinkClick(link.label)}
              >
                {active === link.label && (
                  <motion.span
                    layoutId="navbar-active-mobile"
                    className="navbar-active-bg"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                <span className="navbar-mobile-link-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;