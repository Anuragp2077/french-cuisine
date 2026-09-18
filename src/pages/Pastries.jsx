import { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Pastries.css";

import tarteFlambee from "../assets/pastries/tarte-flambee.jpg";
import crepesSalees from "../assets/pastries/crepes-salees.jpg";
import gateau from "../assets/pastries/Gâteau.jpg";
import gougeres from "../assets/pastries/gougeres.jpg";
import chouquette from "../assets/pastries/chouquette.jpg";
import pissaladiere from "../assets/pastries/pissaladiere.jpg";
import chaussonsAuxPommes from "../assets/pastries/chaussons-aux-pommes.jpg";
import volAuVent from "../assets/pastries/vol-au-vent.jpg";
import painAuxRaisins from "../assets/pastries/pain-aux-raisins.jpg";
import boucheeALaReine from "../assets/pastries/bouchee-a-la-reine.jpg";

const pastries = [
  {
    id: 1,
    name: "Tarte flambée",
    category: "savoury",
    location: "Alsace, France",
    rating: "4.3",
    image: tarteFlambee,
    fr: {
      name: "Tarte flambée",
      description:
        "Une fine pâte croustillante garnie de fromage blanc, de crème fraîche, de lardons et d'oignons finement tranchés."
    },
    en: {
      name: "Tarte flambée",
      description:
        "A thin, crispy base topped with fromage blanc, crème fraîche, bacon and finely sliced onions."
    }
  },
  {
    id: 2,
    name: "Crêpes salées",
    category: "savoury",
    location: "Brittany, France",
    rating: "4.2",
    image: crepesSalees,
    fr: {
      name: "Crêpes salées",
      description:
        "Des crêpes fines et savoureuses, souvent préparées avec de la farine de sarrasin et garnies de fromage, jambon, œufs ou légumes."
    },
    en: {
      name: "Crêpes salées",
      description:
        "Thin savoury crêpes, often made with buckwheat flour and filled with cheese, ham, eggs or vegetables."
    }
  },
  {
    id: 3,
    name: "Gâteau",
    category: "sweet",
    location: "France",
    rating: "4.0",
    image: gateau,
    fr: {
      name: "Gâteau",
      description:
        "Une création pâtissière française mettant à l'honneur la douceur, la texture et le savoir-faire traditionnel."
    },
    en: {
      name: "Gâteau",
      description:
        "A French pastry creation celebrating sweetness, texture and traditional pâtisserie craftsmanship."
    }
  },
  {
    id: 4,
    name: "Gougères",
    category: "savoury",
    location: "Yonne, France",
    rating: "4.1",
    image: gougeres,
    fr: {
      name: "Gougères",
      description:
        "De petits choux légers et creux préparés avec une pâte à choux et du fromage, notamment du Comté, de l'Emmental ou du Gruyère."
    },
    en: {
      name: "Gougères",
      description:
        "Small, light cheese puffs made from choux pastry, commonly prepared with Comté, Emmental or Gruyère."
    }
  },
  {
    id: 5,
    name: "Chouquette",
    category: "sweet",
    location: "France",
    rating: "4.0",
    image: chouquette,
    fr: {
      name: "Chouquette",
      description:
        "Une petite pâtisserie légère en pâte à choux, recouverte de gros grains de sucre perlé qui deviennent croustillants à la cuisson."
    },
    en: {
      name: "Chouquette",
      description:
        "A light choux pastry puff covered with pearl sugar, traditionally enjoyed for breakfast or as an afternoon treat."
    }
  },
  {
    id: 6,
    name: "Pissaladière",
    category: "savoury",
    location: "Nice, France",
    rating: "4.0",
    image: pissaladiere,
    fr: {
      name: "Pissaladière",
      description:
        "Une tarte salée de Nice garnie d'oignons caramélisés, d'anchois, d'olives et d'herbes fraîches."
    },
    en: {
      name: "Pissaladière",
      description:
        "A savoury tart from Nice topped with caramelized onions, anchovies, olives and fresh herbs."
    }
  },
  {
    id: 7,
    name: "Chaussons aux pommes",
    category: "sweet",
    location: "Saint-Calais, France",
    rating: "3.9",
    image: chaussonsAuxPommes,
    fr: {
      name: "Chaussons aux pommes",
      description:
        "Des chaussons traditionnels en pâte feuilletée garnis d'une compote de pommes et cuits jusqu'à obtenir une belle couleur dorée."
    },
    en: {
      name: "Chaussons aux pommes",
      description:
        "Traditional French turnovers made with puff pastry and filled with apple compote before being baked until golden."
    }
  },
  {
    id: 8,
    name: "Vol-au-vent",
    category: "savoury",
    location: "Paris, France",
    rating: "3.8",
    image: volAuVent,
    fr: {
      name: "Vol-au-vent",
      description:
        "Une pâtisserie feuilletée légère et croustillante dont le centre est retiré pour accueillir une garniture salée."
    },
    en: {
      name: "Vol-au-vent",
      description:
        "A light, airy puff pastry shell with a hollow centre designed to hold a savoury filling."
    }
  },
  {
    id: 9,
    name: "Pain aux raisins",
    category: "sweet",
    location: "France",
    rating: "3.7",
    image: painAuxRaisins,
    fr: {
      name: "Pain aux raisins",
      description:
        "Une viennoiserie française en spirale préparée avec une pâte levée beurrée, des raisins secs et de la crème pâtissière."
    },
    en: {
      name: "Pain aux raisins",
      description:
        "A French spiral pastry made with buttery laminated dough, raisins and crème pâtissière."
    }
  },
  {
    id: 10,
    name: "Bouchée à la reine",
    category: "savoury",
    location: "Versailles, France",
    rating: "3.7",
    image: boucheeALaReine,
    fr: {
      name: "Bouchée à la reine",
      description:
        "De petites bouchées en pâte feuilletée garnies d'une sauce blanche accompagnée de poulet, champignons, truffes ou autres ingrédients."
    },
    en: {
      name: "Bouchée à la reine",
      description:
        "Small puff pastry cases filled with a rich white sauce and ingredients such as chicken, mushrooms or truffles."
    }
  }
];

export default function Pastries() {
  const { language } = useLanguage();

  const [filter, setFilter] = useState("all");
  const [selectedPastry, setSelectedPastry] = useState(null);
  const [hoveredPastry, setHoveredPastry] = useState(null);

  const visiblePastries = useMemo(() => {
    if (filter === "all") return pastries;

    return pastries.filter((pastry) => pastry.category === filter);
  }, [filter]);

  const selectedData = selectedPastry
    ? selectedPastry[language]
    : null;

  const handleSelect = (pastry) => {
    setSelectedPastry(pastry);

    setTimeout(() => {
      document
        .getElementById("pastry-detail")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }, 50);
  };

  const scrollToGallery = () => {
    document
      .getElementById("pastry-gallery")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  };

  return (
    <main className="pastries-page">

      {/* HERO */}
      <section className="pastry-hero">
        <div className="pastry-hero-number">05</div>

        <div className="pastry-hero-content">
          <p className="pastry-eyebrow">
            {language === "fr"
              ? "L'art de la pâtisserie"
              : "The art of French pastry"}
          </p>

          <h1>
            {language === "fr" ? (
              <>
                Douceurs,
                <br />
                <em>traditions.</em>
              </>
            ) : (
              <>
                Sweetness,
                <br />
                <em>tradition.</em>
              </>
            )}
          </h1>

          <p className="pastry-hero-description">
            {language === "fr"
              ? "Découvrez dix créations qui racontent une autre histoire de la cuisine française."
              : "Discover ten creations that tell another story of French cuisine."}
          </p>
        </div>

        <div className="pastry-hero-stamp">
          <span>FR</span>
          <span>•</span>
          <span>10</span>
        </div>
      </section>

      {/* INTRO */}
      <section className="pastry-intro">
        <div className="pastry-intro-label">
          <span>01</span>
          <span>
            {language === "fr" ? "Collection" : "Collection"}
          </span>
        </div>

        <div className="pastry-intro-text">
          <h2>
            {language === "fr"
              ? "Une pâtisserie, une histoire."
              : "Every pastry tells a story."}
          </h2>

          <p>
            {language === "fr"
              ? "Des boulangeries parisiennes aux spécialités régionales, la pâtisserie française transforme des ingrédients simples en véritables traditions."
              : "From Parisian bakeries to regional specialties, French pastry transforms simple ingredients into enduring culinary traditions."}
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section className="pastry-filter-section">
        <div className="pastry-filter-label">
          {language === "fr" ? "Explorer" : "Explore"}
        </div>

        <div className="pastry-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            {language === "fr" ? "Toutes" : "All"}
          </button>

          <button
            className={filter === "sweet" ? "active" : ""}
            onClick={() => setFilter("sweet")}
          >
            {language === "fr" ? "Sucrées" : "Sweet"}
          </button>

          <button
            className={filter === "savoury" ? "active" : ""}
            onClick={() => setFilter("savoury")}
          >
            {language === "fr" ? "Salées" : "Savoury"}
          </button>
        </div>

        <div className="pastry-filter-count">
          {String(visiblePastries.length).padStart(2, "0")}
        </div>
      </section>

      {/* GALLERY */}
      <section
        className="pastry-gallery"
        id="pastry-gallery"
      >
        <div className="pastry-gallery-heading">
          <span>
            {language === "fr"
              ? "La collection"
              : "The collection"}
          </span>

          <span>
            {language === "fr"
              ? "Cliquez pour découvrir"
              : "Click to discover"}
          </span>
        </div>

        <div className="pastry-grid">
          {visiblePastries.map((pastry) => {
            const data = pastry[language];

            return (
              <article
                key={pastry.id}
                className={`pastry-card ${
                  hoveredPastry === pastry.id
                    ? "is-hovered"
                    : ""
                } ${
                  selectedPastry?.id === pastry.id
                    ? "is-selected"
                    : ""
                }`}
                onMouseEnter={() =>
                  setHoveredPastry(pastry.id)
                }
                onMouseLeave={() =>
                  setHoveredPastry(null)
                }
                onClick={() => handleSelect(pastry)}
              >
                <div className="pastry-card-image">
                  <img
                    src={pastry.image}
                    alt={data.name}
                  />

                  <div className="pastry-card-overlay" />

                  <div className="pastry-card-top">
                    <span>
                      {String(pastry.id).padStart(2, "0")}
                    </span>

                    <span>
                      {pastry.category === "sweet"
                        ? "SWEET"
                        : "SAVOURY"}
                    </span>
                  </div>

                  <div className="pastry-card-arrow">
                    ↗
                  </div>

                  <div className="pastry-card-title">
                    <span>{pastry.location}</span>
                    <h3>{data.name}</h3>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* DETAIL */}
      {selectedPastry && selectedData && (
        <section
          className="pastry-detail"
          id="pastry-detail"
        >
          <div className="pastry-detail-number">
            {String(selectedPastry.id).padStart(2, "0")}
          </div>

          <div className="pastry-detail-image">
            <img
              src={selectedPastry.image}
              alt={selectedData.name}
            />
          </div>

          <div className="pastry-detail-content">
            <div className="pastry-detail-meta">
              <span>
                {selectedPastry.location}
              </span>

              <span>
                ★ {selectedPastry.rating}
              </span>
            </div>

            <h2>{selectedData.name}</h2>

            <div className="pastry-detail-line" />

            <p>{selectedData.description}</p>

            <div className="pastry-detail-category">
              <span>
                {language === "fr"
                  ? "Catégorie"
                  : "Category"}
              </span>

              <strong>
                {selectedPastry.category === "sweet"
                  ? language === "fr"
                    ? "Sucrée"
                    : "Sweet"
                  : language === "fr"
                    ? "Salée"
                    : "Savoury"}
              </strong>
            </div>

            <button
              className="pastry-back-button"
              onClick={scrollToGallery}
            >
              <span>←</span>

              {language === "fr"
                ? "Retour à la collection"
                : "Back to collection"}
            </button>
          </div>
        </section>
      )}

      {/* FOOTER STATEMENT */}
      <section className="pastry-end">
        <div className="pastry-end-number">10</div>

        <h2>
          {language === "fr" ? (
            <>
              À table.
              <br />
              <em>Bon appétit.</em>
            </>
          ) : (
            <>
              À table.
              <br />
              <em>Bon appétit.</em>
            </>
          )}
        </h2>

        <p>
          {language === "fr"
            ? "La cuisine française se découvre une bouchée à la fois."
            : "French cuisine is discovered one bite at a time."}
        </p>
      </section>

    </main>
  );
}