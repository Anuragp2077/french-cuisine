import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import heroImage from "../assets/home/Hero.png";
import introImage from "../assets/home/Intro.png";
import historyImage from "../assets/home/History.png";
import pastriesImage from "../assets/home/Pastries.png";
import ratatouilleImage from "../assets/home/Ratatouille.jpg";
import boeufImage from "../assets/home/BoeufBourguignon.jpg";
import cassouletImage from "../assets/home/cassoulet.jpg";
import finalImage from "../assets/home/Final.jpg";
import FranceMap from "../components/FranceMap";

const dishes = [
  {
    number: "01",
    regionFr: "PROVENCE",
    regionEn: "PROVENCE",
    nameFr: "Ratatouille",
    nameEn: "Ratatouille",
    image: ratatouilleImage,
  },
  {
    number: "02",
    regionFr: "BOURGOGNE",
    regionEn: "BURGUNDY",
    nameFr: "Bœuf Bourguignon",
    nameEn: "Beef Bourguignon",
    image: boeufImage,
  },
  {
    number: "03",
    regionFr: "OCCITANIE",
    regionEn: "OCCITANIA",
    nameFr: "Cassoulet",
    nameEn: "Cassoulet",
    image: cassouletImage,
  },
];

const vocabulary = [
  {
    fr: "CUISINER",
    en: "TO COOK",
  },
  {
    fr: "MIJOTER",
    en: "TO SIMMER",
  },
  {
    fr: "SAUTER",
    en: "TO SAUTÉ",
  },
  {
    fr: "ASSAISONNER",
    en: "TO SEASON",
  },
];

export default function Home() {
  const { language } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const t = (fr, en) => (language === "fr" ? fr : en);

  const heroParallax = Math.min(scrollY * 0.12, 100);
  const heroScale = 1 + Math.min(scrollY * 0.00008, 0.04);

  return (
    <main className="home-page">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="home-hero" id="top">
        <div
          className="home-hero__image"
          style={{
            transform: `translateY(${heroParallax}px) scale(${heroScale})`,
            backgroundImage: `url(${heroImage})`,
          }}
        />

        <div className="home-hero__overlay" />

        <div className="home-hero__grain" />

        <div className="home-hero__content">
          <p className="eyebrow">
            {t("UN VOYAGE À TRAVERS LA FRANCE", "A JOURNEY THROUGH FRANCE")}
          </p>

          <h1>
            <span>French</span>
            <em>Cuisine</em>
          </h1>

          <p className="home-hero__description">
            {t(
              "Découvrez les saveurs, les traditions et les histoires qui ont façonné l'une des cuisines les plus célèbres du monde.",
              "Discover the flavours, traditions and stories that shaped one of the world's most celebrated cuisines."
            )}
          </p>

          <a className="editorial-button" href="#intro">
            <span>
              {t("COMMENCER LE VOYAGE", "BEGIN THE JOURNEY")}
            </span>
            <ArrowDown size={16} strokeWidth={1.5} />
          </a>
        </div>

        <div className="home-hero__meta home-hero__meta--left">
          <MapPin size={14} strokeWidth={1.4} />
          <span>FRANCE</span>
        </div>

        <div className="home-hero__meta home-hero__meta--center">
          <span>01</span>
        </div>

        <div className="home-hero__meta home-hero__meta--right">
          <span>SCROLL TO DISCOVER</span>
        </div>

        <div className="home-hero__year">2026</div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="home-intro" id="intro">
        <div className="section-number">00</div>

        <div className="home-intro__content reveal">
          <p className="eyebrow eyebrow--rose">
            {t("BIENVENUE EN FRANCE", "WELCOME TO FRANCE")}
          </p>

          <h2>
            {t(
              <>
                Une cuisine qui raconte
                <span> une histoire.</span>
              </>,
              <>
                A cuisine that tells
                <span> a story.</span>
              </>
            )}
          </h2>

          <p className="home-intro__description">
            {t(
              "La gastronomie française est bien plus qu'une collection de recettes. Elle est façonnée par le terroir, la tradition, le savoir-faire et les personnes qui la transmettent.",
              "French gastronomy is more than a collection of recipes. It is shaped by terroir, tradition, craftsmanship and the people who pass it on."
            )}
          </p>
        </div>

        <div className="home-intro__visual reveal reveal--delay">
          <div
            className="image-frame image-frame--intro"
            style={{ backgroundImage: `url(${introImage})` }}
          >
            <div className="image-frame__overlay" />
            <span className="image-frame__caption">
              {t("LE TERROIR", "THE TERROIR")}
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          HISTORY
      ========================================================= */}

      <section className="home-history">
        <div className="home-history__visual reveal">
          <div
            className="history-image"
            style={{ backgroundImage: `url(${historyImage})` }}
          >
            <div className="history-image__overlay" />

            <div className="history-image__stamp">
              <span>XV</span>
              <small>SIÈCLE</small>
            </div>
          </div>
        </div>

        <div className="home-history__content reveal reveal--delay">
          <p className="eyebrow">
            01 — {t("L'HISTOIRE", "THE HISTORY")}
          </p>

          <h2>
            {t(
              <>
                Des siècles de
                <span> savoir-faire.</span>
              </>,
              <>
                Centuries of
                <span> savoir-faire.</span>
              </>
            )}
          </h2>

          <p>
            {t(
              "Des cuisines médiévales aux tables royales, de la Révolution à la gastronomie moderne, découvrez comment la cuisine française s'est transformée au fil des siècles.",
              "From medieval kitchens to royal tables, from the Revolution to modern gastronomy, discover how French cuisine evolved through the centuries."
            )}
          </p>

          <Link to="/history" className="text-link">
            <span>
              {t("EXPLORER L'HISTOIRE", "EXPLORE THE HISTORY")}
            </span>
            <ArrowRight size={18} strokeWidth={1.4} />
          </Link>
        </div>
      </section>

      {/* =========================================================
          REGIONS
      ========================================================= */}

      <section className="home-regions">
        <div className="home-regions__content reveal">
          <p className="eyebrow eyebrow--rose">
            02 — {t("LES RÉGIONS", "THE REGIONS")}
          </p>

          <h2>
            {t(
              <>
                Une France,
                <br />
                mille <span>saveurs.</span>
              </>,
              <>
                One France,
                <br />
                a thousand <span>flavours.</span>
              </>
            )}
          </h2>

          <p>
            {t(
              "Chaque région possède son propre caractère, ses ingrédients et ses traditions culinaires.",
              "Every region has its own character, ingredients and culinary traditions."
            )}
          </p>

          <Link to="/regions" className="text-link">
            <span>
              {t("DÉCOUVRIR LES RÉGIONS", "DISCOVER THE REGIONS")}
            </span>
            <ArrowRight size={18} strokeWidth={1.4} />
          </Link>
        </div>

            <div className="home-regions__map reveal reveal--delay">
          <FranceMap />
        </div>
      </section>

      {/* =========================================================
          DISHES
      ========================================================= */}

      <section className="home-dishes">
        <div className="home-dishes__heading reveal">
          <p className="eyebrow eyebrow--rose">
            03 — {t("GRANDS PLATS", "GREAT DISHES")}
          </p>

          <h2>
            {t("Les classiques français", "French classics")}
          </h2>
        </div>

        <div className="dish-grid">
          {dishes.map((dish, index) => (
            <article
              className={`dish-card reveal ${
                index === 1 ? "reveal--delay" : ""
              }`}
              key={dish.nameEn}
            >
              <div className="dish-card__image">
                <img
                  src={dish.image}
                  alt={
                    language === "fr"
                      ? dish.nameFr
                      : dish.nameEn
                  }
                />

                <div className="dish-card__image-overlay" />

                <span className="dish-card__number">
                  {dish.number}
                </span>

                <span className="dish-card__discover">
                  {t("DÉCOUVRIR", "DISCOVER")}
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                  />
                </span>
              </div>

              <div className="dish-card__info">
                <span>
                  {language === "fr"
                    ? dish.regionFr
                    : dish.regionEn}
                </span>

                <h3>
                  {language === "fr"
                    ? dish.nameFr
                    : dish.nameEn}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div className="home-dishes__footer reveal">
          <Link to="/dishes" className="text-link">
            <span>
              {t("VOIR TOUS LES PLATS", "VIEW ALL DISHES")}
            </span>
            <ArrowRight size={18} strokeWidth={1.4} />
          </Link>
        </div>
      </section>

      {/* =========================================================
          PÂTISSERIE
      ========================================================= */}

      <section className="home-pastries">
        <div className="home-pastries__visual reveal">
          <div
            className="pastry-image"
            style={{
              backgroundImage: `url(${pastriesImage})`,
            }}
          />

          <div className="pastry-image__frame" />

          <div className="floating-star floating-star--one">
            ✦
          </div>

          <div className="floating-star floating-star--two">
            ✦
          </div>
        </div>

        <div className="home-pastries__content reveal reveal--delay">
          <p className="eyebrow eyebrow--rose">
            04 — PÂTISSERIE
          </p>

          <h2>
            {t(
              <>
                L'art de la
                <span> douceur.</span>
              </>,
              <>
                The art of
                <span> sweetness.</span>
              </>
            )}
          </h2>

          <p>
            {t(
              "Croissants, macarons, tartes et crèmes : découvrez l'univers délicat de la pâtisserie française.",
              "Croissants, macarons, tarts and creams: discover the delicate world of French pastry."
            )}
          </p>

          <Link to="/pastries" className="text-link">
            <span>
              {t("ENTRER EN PÂTISSERIE", "ENTER PÂTISSERIE")}
            </span>
            <ArrowRight size={18} strokeWidth={1.4} />
          </Link>
        </div>
      </section>

      {/* =========================================================
          VOCABULARY
      ========================================================= */}

      <section className="home-vocabulary">
        <div className="home-vocabulary__content reveal">
          <p className="eyebrow eyebrow--gold">
            05 — VOCABULAIRE
          </p>

          <h2>
            {t(
              <>
                Apprendre le français
                <br />
                à travers la <span>cuisine.</span>
              </>,
              <>
                Learn French
                <br />
                through <span>food.</span>
              </>
            )}
          </h2>

          <p>
            {t(
              "Découvrez les mots essentiels de la cuisine française et enrichissez votre vocabulaire.",
              "Discover essential French culinary words and expand your vocabulary."
            )}
          </p>

          <Link to="/vocabulary" className="text-link">
            <span>
              {t("COMMENCER À APPRENDRE", "START LEARNING")}
            </span>
            <ArrowRight size={18} strokeWidth={1.4} />
          </Link>
        </div>

        <div className="home-vocabulary__words reveal reveal--delay">
          {vocabulary.map((word, index) => (
            <div className="vocabulary-word" key={word.fr}>
              <span className="vocabulary-word__number">
                0{index + 1}
              </span>

              <div>
                <strong>
                  {language === "fr" ? word.fr : word.en}
                </strong>

                <small>
                  {language === "fr"
                    ? word.en
                    : word.fr}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FINAL
      ========================================================= */}

      <section className="home-final">
        <div
          className="home-final__image"
          style={{
            backgroundImage: `url(${finalImage})`,
          }}
        />

        <div className="home-final__overlay" />

        <div className="home-final__content reveal">
          <span className="final-star">✦</span>

          <h2>À table.</h2>

          <p>
            {t(
              "La cuisine française vous attend.",
              "French cuisine awaits."
            )}
          </p>

          <Link to="/dishes" className="editorial-button">
            <span>
              {t("EXPLORER LA CUISINE", "EXPLORE THE CUISINE")}
            </span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </section>

    </main>
  );
}