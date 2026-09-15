import { useEffect, useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const navigation = {
  fr: [
    { label: "Accueil", path: "/" },
    { label: "Histoire", path: "/history" },
    { label: "Régions", path: "/regions" },
    { label: "Plats", path: "/dishes" },
    { label: "Pâtisserie", path: "/pastries" },
    { label: "Vocabulaire", path: "/vocabulary" },
  ],
  en: [
    { label: "Home", path: "/" },
    { label: "History", path: "/history" },
    { label: "Regions", path: "/regions" },
    { label: "Dishes", path: "/dishes" },
    { label: "Pastries", path: "/pastries" },
    { label: "Vocabulary", path: "/vocabulary" },
  ],
};

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 35);

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`navbar ${hidden ? "navbar--hidden" : ""} ${
        scrolled ? "navbar--scrolled" : ""
      }`}
    >
      <div className="navbar__inner">

        {/* BRAND */}
        <Link className="navbar__brand" to="/">
          <span className="navbar__brand-mark">
            ✦
          </span>

          <span className="navbar__brand-text">
            <span>La Cuisine</span>
            <span>Française</span>
          </span>
        </Link>

        {/* DESKTOP / MOBILE NAVIGATION */}
        <nav
          className={`navbar__links ${
            mobileOpen ? "navbar__links--open" : ""
          }`}
        >
          {navigation[language].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "navbar__link navbar__link--active"
                  : "navbar__link"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="navbar__actions">

          {/* LANGUAGE */}
          <button
            className="language-switch"
            onClick={toggleLanguage}
            aria-label="Switch language"
          >
            <Globe
              size={15}
              strokeWidth={1.7}
            />

            <span className={language === "fr" ? "active" : ""}>
              FR
            </span>

            <span className="language-switch__divider">
              /
            </span>

            <span className={language === "en" ? "active" : ""}>
              EN
            </span>
          </button>

          {/* MOBILE MENU */}
          <button
            className="menu-button"
            onClick={() =>
              setMobileOpen((current) => !current)
            }
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={21} strokeWidth={1.6} />
            ) : (
              <Menu size={21} strokeWidth={1.6} />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}