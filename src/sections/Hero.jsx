import { ArrowDown, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const content = {
  fr: {
    eyebrow: "Un voyage à travers la France",
    titleTop: "La Cuisine",
    titleBottom: "Française",
    description:
      "Découvrez les saveurs, les traditions et les histoires qui ont façonné l'une des cuisines les plus célèbres du monde.",
    button: "Commencer le voyage",
    scroll: "Défiler pour découvrir",
    location: "France",
  },

  en: {
    eyebrow: "A journey through France",
    titleTop: "French",
    titleBottom: "Cuisine",
    description:
      "Discover the flavors, traditions and stories that shaped one of the world's most celebrated cuisines.",
    button: "Begin the journey",
    scroll: "Scroll to discover",
    location: "France",
  },
};

export default function Hero() {
  const { language } = useLanguage();
  const text = content[language];

  const handleExplore = () => {
    const history = document.getElementById("history");

    if (history) {
      history.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero__background">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />

        <div className="hero__plate">
          <div className="hero__plate-inner">
            <div className="hero__dish hero__dish--one" />
            <div className="hero__dish hero__dish--two" />
            <div className="hero__dish hero__dish--three" />
            <div className="hero__herb hero__herb--one">✦</div>
            <div className="hero__herb hero__herb--two">✦</div>
            <div className="hero__herb hero__herb--three">✦</div>
          </div>
        </div>

        <div className="hero__grain" />
      </div>

      <div className="hero__content">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <span>{text.eyebrow}</span>
          <span className="hero__eyebrow-line" />
        </div>

        <h1 className="hero__title">
          <span>{text.titleTop}</span>
          <em>{text.titleBottom}</em>
        </h1>

        <p className="hero__description">{text.description}</p>

        <button className="hero__button" onClick={handleExplore}>
          <span>{text.button}</span>
          <ArrowDown size={16} />
        </button>
      </div>

      <div className="hero__location">
        <MapPin size={14} strokeWidth={1.5} />
        <span>{text.location}</span>
      </div>

      <div className="hero__scroll">
        <span>{text.scroll}</span>

        <div className="hero__scroll-line">
          <span />
        </div>
      </div>

      <div className="hero__corner hero__corner--left">01</div>
      <div className="hero__corner hero__corner--right">2026</div>
    </section>
  );
}