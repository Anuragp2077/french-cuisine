import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import medievalImage from "../assets/history/medieval.png";
import renaissanceImage from "../assets/history/renaissance.png";
import versaillesImage from "../assets/history/versailles.png";
import revolutionImage from "../assets/history/revolution.avif";
import escoffierImage from "../assets/history/escoffier.jpg";
import nouvelleCuisineImage from "../assets/history/nouvelle-cuisine.png";
import todayImage from "../assets/history/today.png";

import "../styles/history.css";

const eras = [
  {
    id: "medieval",
    number: "01",
    period: "500 — 1500",
    labelFr: "CUISINE MÉDIÉVALE",
    labelEn: "MEDIEVAL CUISINE",
    titleFr: "Les tables du\nMoyen Âge",
    titleEn: "The Tables of\nthe Middle Ages",
    subtitleFr: "Quand manger était aussi une question de statut.",
    subtitleEn: "When eating was also a question of status.",
    textFr:
      "Les tables médiévales françaises étaient façonnées par les saisons, les récoltes et le statut social. Les épices venues de terres lointaines étaient précieuses, tandis que les viandes rôties, les pains et les préparations mijotées occupaient une place centrale.",
    textEn:
      "Medieval French tables were shaped by seasons, harvests and social status. Spices from distant lands were precious, while roasted meats, breads and hearty preparations were central to the meal.",
    factFr:
      "Les premiers grands livres de cuisine français apparaissent au Moyen Âge.",
    factEn:
      "Some of the earliest major French cookbooks appeared during the Middle Ages.",
    image: medievalImage,
  },
  {
    id: "renaissance",
    number: "02",
    period: "1500 — 1650",
    labelFr: "RENAISSANCE",
    labelEn: "RENAISSANCE",
    titleFr: "L'art entre\ndans la cuisine",
    titleEn: "Art Enters the\nKitchen",
    subtitleFr: "Une cuisine plus raffinée apparaît à la cour.",
    subtitleEn: "A more refined cuisine emerges at court.",
    textFr:
      "La Renaissance transforme progressivement les goûts des élites françaises. Les influences italiennes, de nouveaux ingrédients et une attention croissante portée à la présentation contribuent à faire de la cuisine un véritable art de cour.",
    textEn:
      "The Renaissance gradually transformed the tastes of French elites. Italian influences, new ingredients and growing attention to presentation helped turn cooking into an art of the court.",
    factFr:
      "Les livres de cuisine deviennent progressivement essentiels à la transmission des techniques culinaires.",
    factEn:
      "Cookbooks gradually became important tools for transmitting culinary techniques.",
    image: renaissanceImage,
  },
  {
    id: "versailles",
    number: "03",
    period: "1650 — 1789",
    labelFr: "CUISINE ROYALE",
    labelEn: "ROYAL CUISINE",
    titleFr: "Versailles &\nla cuisine royale",
    titleEn: "Versailles &\nRoyal Cuisine",
    subtitleFr: "Quand le repas devient un spectacle.",
    subtitleEn: "When dining became a spectacle.",
    textFr:
      "À Versailles, les repas deviennent de véritables cérémonies. La cuisine française se structure davantage, les recettes sont progressivement codifiées et les cuisiniers occupent une place essentielle dans la culture gastronomique.",
    textEn:
      "At Versailles, meals became elaborate ceremonies. French cooking became more structured, recipes were increasingly codified and chefs gained an essential place in gastronomic culture.",
    factFr:
      "Le service à la française présentait plusieurs plats simultanément sur la table.",
    factEn:
      "Service à la française presented numerous dishes simultaneously across the table.",
    image: versaillesImage,
  },
  {
    id: "revolution",
    number: "04",
    period: "1789 — 1800s",
    labelFr: "LA RÉVOLUTION",
    labelEn: "THE REVOLUTION",
    titleFr: "La cuisine quitte\nles palais",
    titleEn: "Cuisine Leaves\nthe Palaces",
    subtitleFr: "Les chefs entrent dans la vie publique.",
    subtitleEn: "Chefs enter public life.",
    textFr:
      "La Révolution française bouleverse la société et transforme aussi le monde de la cuisine. Des cuisiniers autrefois employés par l'aristocratie se tournent vers le public, contribuant à l'essor d'une culture des restaurants.",
    textEn:
      "The French Revolution transformed society and changed the culinary world as well. Cooks who had once worked for aristocratic households increasingly served the public, contributing to the growth of restaurant culture.",
    factFr:
      "Le restaurant devient progressivement un lieu où la cuisine peut être découverte par un public plus large.",
    factEn:
      "The restaurant gradually became a place where a wider public could experience sophisticated cuisine.",
    image: revolutionImage,
  },
  {
    id: "modern",
    number: "05",
    period: "1880 — 1930",
    labelFr: "CUISINE MODERNE",
    labelEn: "MODERN CUISINE",
    titleFr: "Escoffier &\nla cuisine moderne",
    titleEn: "Escoffier &\nModern Cuisine",
    subtitleFr: "La cuisine professionnelle entre dans une nouvelle ère.",
    subtitleEn: "Professional cooking enters a new era.",
    textFr:
      "Auguste Escoffier contribue à organiser la cuisine professionnelle moderne. Il simplifie certaines pratiques, structure le travail en brigade et participe à la diffusion internationale du modèle gastronomique français.",
    textEn:
      "Auguste Escoffier helped organize modern professional kitchens. He simplified certain practices, structured kitchen work into a brigade system and helped spread the French culinary model internationally.",
    factFr:
      "Le Guide Culinaire, publié en 1903, devient une référence majeure de la cuisine classique française.",
    factEn:
      "Le Guide Culinaire, published in 1903, became a major reference for classical French cuisine.",
    image: escoffierImage,
  },
  {
    id: "nouvelle",
    number: "06",
    period: "1960 — 1980",
    labelFr: "NOUVELLE CUISINE",
    labelEn: "NOUVELLE CUISINE",
    titleFr: "Une nouvelle\nphilosophie",
    titleEn: "A New\nPhilosophy",
    subtitleFr: "Moins de lourdeur. Plus de fraîcheur.",
    subtitleEn: "Less heaviness. More freshness.",
    textFr:
      "Dans les années 1960 et 1970, une nouvelle génération de chefs remet en question certaines règles de la cuisine classique. Les cuissons deviennent plus courtes, les produits plus visibles et la présentation plus légère.",
    textEn:
      "During the 1960s and 1970s, a new generation of chefs questioned some traditions of classical cuisine. Cooking became lighter, ingredients more visible and presentation more refined.",
    factFr:
      "La Nouvelle Cuisine place la fraîcheur, la simplicité et l'expression du produit au centre de l'assiette.",
    factEn:
      "Nouvelle Cuisine placed freshness, simplicity and the expression of ingredients at the heart of the plate.",
    image: nouvelleCuisineImage,
  },
  {
    id: "today",
    number: "07",
    period: "1980 — AUJOURD'HUI",
    labelFr: "GASTRONOMIE CONTEMPORAINE",
    labelEn: "CONTEMPORARY GASTRONOMY",
    titleFr: "La cuisine\ncontinue d'évoluer",
    titleEn: "Cuisine\nKeeps Evolving",
    subtitleFr: "Tradition, innovation et terroir.",
    subtitleEn: "Tradition, innovation and terroir.",
    textFr:
      "Aujourd'hui, la gastronomie française continue de se transformer. Les chefs revisitent les traditions, valorisent les produits locaux et explorent de nouvelles techniques tout en conservant une relation profonde avec le terroir et le patrimoine.",
    textEn:
      "Today, French gastronomy continues to evolve. Chefs reinterpret traditions, celebrate local ingredients and explore new techniques while maintaining a deep connection with terroir and culinary heritage.",
    factFr:
      "En 2010, le repas gastronomique des Français est inscrit au patrimoine culturel immatériel de l'UNESCO.",
    factEn:
      "In 2010, the gastronomic meal of the French was added to UNESCO's intangible cultural heritage list.",
    image: todayImage,
  },
];

function EraCard({ era, language, index, onNext, onPrevious }) {
  const isFirst = index === 0;
  const isLast = index === eras.length - 1;

  return (
    <article className="history-era" id={era.id}>
      <div className="history-era__image">
        <img
          src={era.image}
          alt={language === "fr" ? era.titleFr : era.titleEn}
        />
      </div>

      <div className="history-era__shade" />

      <div className="history-era__grain" />

      <div className="history-era__content">
        <div className="history-era__eyebrow">
          <span className="history-era__number">{era.number}</span>

          <span className="history-era__period">
            <Clock3 size={14} />
            {era.period}
          </span>

          <span className="history-era__label">
            {language === "fr" ? era.labelFr : era.labelEn}
          </span>
        </div>

        <h2>
          {(language === "fr" ? era.titleFr : era.titleEn)
            .split("\n")
            .map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex <
                  (language === "fr" ? era.titleFr : era.titleEn).split("\n")
                    .length -
                    1 && <br />}
              </span>
            ))}
        </h2>

        <p className="history-era__subtitle">
          {language === "fr" ? era.subtitleFr : era.subtitleEn}
        </p>

        <p className="history-era__description">
          {language === "fr" ? era.textFr : era.textEn}
        </p>

        <div className="history-era__fact">
          <span className="history-era__fact-mark">✦</span>

          <p>{language === "fr" ? era.factFr : era.factEn}</p>
        </div>

        <div className="history-era__controls">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirst}
            aria-label="Previous era"
          >
            <ArrowLeft size={17} />
          </button>

          <span>
            {era.number} / {String(eras.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={isLast}
            aria-label="Next era"
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function History() {
  const { language } = useLanguage();
  const [activeEra, setActiveEra] = useState("medieval");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll(".history-era");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveEra(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const value =
        documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, value)));
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const scrollToEra = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const getEraIndex = () =>
    eras.findIndex((era) => era.id === activeEra);

  const goNext = (index) => {
    if (index < eras.length - 1) {
      scrollToEra(eras[index + 1].id);
    }
  };

  const goPrevious = (index) => {
    if (index > 0) {
      scrollToEra(eras[index - 1].id);
    }
  };

  const activeIndex = getEraIndex();

  return (
    <main className="history-page">
      <div
        className="history-progress"
        style={{ width: `${progress}%` }}
      />

      <section className="history-intro">
        <div className="history-intro__top">
          <span>01</span>

          <span>
            {language === "fr"
              ? "PLUS DE MILLE ANS D'ÉVOLUTION"
              : "MORE THAN A THOUSAND YEARS OF EVOLUTION"}
          </span>
        </div>

        <div className="history-intro__main">
          <div className="history-intro__copy">
            <h1>
              {language === "fr" ? (
                <>
                  L'histoire de
                  <br />
                  la cuisine
                  <br />
                  française.
                </>
              ) : (
                <>
                  The history of
                  <br />
                  French
                  <br />
                  cuisine.
                </>
              )}
            </h1>

            <p>
              {language === "fr"
                ? "Des tables médiévales à la gastronomie contemporaine, découvrez les moments qui ont façonné l'une des cuisines les plus influentes au monde."
                : "From medieval tables to contemporary gastronomy, discover the moments that shaped one of the world's most influential cuisines."}
            </p>

            <button
              type="button"
              className="history-intro__button"
              onClick={() => scrollToEra("medieval")}
            >
              {language === "fr"
                ? "COMMENCER LE VOYAGE"
                : "BEGIN THE JOURNEY"}

              <ArrowDown size={17} />
            </button>
          </div>

          <div className="history-intro__years">
            <span>500</span>
            <div />
            <span>
              {language === "fr" ? "AUJOURD'HUI" : "TODAY"}
            </span>
          </div>
        </div>

        <div className="history-intro__scroll">
          <span>
            <ChevronDown size={15} />
          </span>

          {language === "fr"
            ? "FAITES DÉFILER POUR DÉCOUVRIR"
            : "SCROLL TO DISCOVER"}
        </div>
      </section>

      <div className="history-timeline">
        <div className="history-timeline__line">
          <div
            className="history-timeline__fill"
            style={{
              height: `${progress}%`,
            }}
          />
        </div>

        {eras.map((era) => (
          <button
            type="button"
            key={era.id}
            className={
              activeEra === era.id
                ? "history-timeline__item is-active"
                : "history-timeline__item"
            }
            onClick={() => scrollToEra(era.id)}
          >
            <span>{era.number}</span>

            <strong>
              {language === "fr" ? era.labelFr : era.labelEn}
            </strong>
          </button>
        ))}
      </div>

      <section className="history-eras">
        {eras.map((era, index) => (
          <EraCard
            key={era.id}
            era={era}
            language={language}
            index={index}
            onNext={() => goNext(index)}
            onPrevious={() => goPrevious(index)}
          />
        ))}
      </section>

      <section className="history-end">
        <span>FIN / BEGINNING</span>

        <h2>
          {language === "fr" ? (
            <>
              Une histoire
              <br />
              qui continue.
            </>
          ) : (
            <>
              A history
              <br />
              still being written.
            </>
          )}
        </h2>

        <p>
          {language === "fr"
            ? "La cuisine française n'est pas figée dans le passé. Elle continue de changer, de surprendre et de transmettre."
            : "French cuisine is not frozen in the past. It continues to change, surprise and pass its knowledge forward."}
        </p>
      </section>
    </main>
  );
}