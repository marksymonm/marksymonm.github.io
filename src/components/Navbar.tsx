import { useState, useRef, useEffect, type MouseEvent } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";

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
  const navRef = useRef<HTMLDivElement>(null);

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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = navRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    el.style.setProperty("--glow-x", `${x}%`);
    el.style.setProperty("--glow-y", `${y}%`);
  };

  return (
    <div className={`navbar-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className="navbar"
        ref={navRef}
        onMouseMove={handleMouseMove}
      >
        <a className="navbar-logo" href="#top">
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo-img"
          />
        </a>

        <ul className="navbar-links">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={active === link.label ? "is-active" : ""}
                onClick={() => setActive(link.label)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;