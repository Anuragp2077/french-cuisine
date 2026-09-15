import { useEffect, useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Navbar.css";

const navItems = [
  {
    path: "/",
    fr: "Accueil",
    en: "Home",
  },
  {
    path: "/history",
    fr: "Histoire",
    en: "History",
  },
  {
    path: "/regions",
    fr: "Régions",
    en: "Regions",
  },
  {
    path: "/dishes",
    fr: "Plats",
    en: "Dishes",
  },
  {
    path: "/pastries",
    fr: "Pâtisseries",
    en: "Pastries",
  },
  {
    path: "/vocabulary",
    fr: "Vocabulaire",
    en: "Vocabulary",
  },
];

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (menuOpen) {
        setHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [menuOpen]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`site-navbar ${hidden ? "site-navbar--hidden" : ""} ${
          menuOpen ? "site-navbar--menu-open" : ""
        }`}
      >
        <div className="navbar-inner">
          {/* LOGO */}
          <Link
            to="/"
            className="navbar-logo"
            aria-label="La Cuisine Française — Home"
          >
            <span className="navbar-logo-mark">
              <span>✦</span>
            </span>

            <span className="navbar-logo-text">
              <span>La Cuisine</span>
              <span>Française</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="navbar-desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-link ${
                  isActive(item.path) ? "navbar-link--active" : ""
                }`}
              >
                {language === "fr" ? item.fr : item.en}
              </Link>
            ))}
          </nav>

          {/* DESKTOP LANGUAGE SWITCH */}
          <button
            type="button"
            className="navbar-language"
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === "fr" ? "English" : "French"}`}
          >
            <Globe size={15} strokeWidth={1.5} />

            <span className={language === "fr" ? "active-language" : ""}>
              FR
            </span>

            <span className="language-divider">/</span>

            <span className={language === "en" ? "active-language" : ""}>
              EN
            </span>
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="navbar-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={23} strokeWidth={1.6} />
            ) : (
              <Menu size={23} strokeWidth={1.6} />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-navigation ${menuOpen ? "is-open" : ""}`}>
          <nav className="mobile-navigation-links" aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-navigation-link ${
                  isActive(item.path)
                    ? "mobile-navigation-link--active"
                    : ""
                }`}
                style={{
                  "--mobile-index": index,
                }}
              >
                <span className="mobile-navigation-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>
                  {language === "fr" ? item.fr : item.en}
                </span>

                <span className="mobile-navigation-arrow">↗</span>
              </Link>
            ))}
          </nav>

          <div className="mobile-navigation-bottom">
            <span>
              {language === "fr"
                ? "La gastronomie française"
                : "French gastronomy"}
            </span>

            <button
              type="button"
              className="mobile-language-switch"
              onClick={toggleLanguage}
            >
              <Globe size={15} strokeWidth={1.5} />

              <span className={language === "fr" ? "active-language" : ""}>
                FR
              </span>

              <span>/</span>

              <span className={language === "en" ? "active-language" : ""}>
                EN
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}