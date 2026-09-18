import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Search,
  X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import "./Dishes.css";

/*
  Existing recipe database.
  This supports either:
  export default recipes
  OR
  export const recipes = ...
*/
import * as recipeModule from "../data/recipes";

const recipeDatabase =
  recipeModule.default ||
  recipeModule.recipes ||
  {};

const recipeAliases =
  recipeModule.recipeAliases ||
  {};

/* =========================================================
   LOCAL IMAGES
========================================================= */

const regionImages = import.meta.glob(
  "../assets/regions/*.jpg",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const pastryImages = import.meta.glob(
  "../assets/pasteries/*.jpg",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const buildImageMap = (files) =>
  Object.fromEntries(
    Object.entries(files).map(([path, url]) => [
      path
        .split("/")
        .pop()
        .replace(/\.jpg$/i, ""),
      url,
    ])
  );

/*
  Region images are spread last so that if the same filename
  exists in both folders, the regional image wins.
*/
const imageMap = {
  ...buildImageMap(pastryImages),
  ...buildImageMap(regionImages),
};

/* =========================================================
   DISH DEFINITIONS
========================================================= */

const dishDefinitions = [
  {
    image: "croissant",
    name: "Croissant",
    region: "France",
    regionFr: "France",
    categories: ["breakfast", "snacks", "dessert"],
  },

  {
    image: "pain-au-chocolat",
    name: "Pain au chocolat",
    region: "France",
    regionFr: "France",
    categories: ["breakfast", "snacks", "dessert"],
  },

  {
    image: "brioche",
    name: "Brioche",
    region: "France",
    regionFr: "France",
    categories: ["breakfast", "snacks", "dessert"],
  },

  {
    image: "baguette",
    name: "Baguette",
    region: "France",
    regionFr: "France",
    categories: ["breakfast", "snacks"],
  },

  /* AUVERGNE-RHÔNE-ALPES */

  {
    image: "auvergne-tartiflette",
    name: "Tartiflette",
    region: "Auvergne-Rhône-Alpes",
    regionFr: "Auvergne-Rhône-Alpes",
    categories: ["lunch", "dinner"],
  },

  {
    image: "auvergne-raclette",
    name: "Raclette",
    region: "Auvergne-Rhône-Alpes",
    regionFr: "Auvergne-Rhône-Alpes",
    categories: ["dinner", "snacks"],
  },

  {
    image: "auvergne-gratin-dauphinois",
    name: "Gratin Dauphinois",
    region: "Auvergne-Rhône-Alpes",
    regionFr: "Auvergne-Rhône-Alpes",
    categories: ["lunch", "dinner"],
  },

  /* BOURGOGNE-FRANCHE-COMTÉ */

  {
    image: "bourgogne-boeuf-bourguignon",
    name: "Bœuf Bourguignon",
    region: "Burgundy",
    regionFr: "Bourgogne-Franche-Comté",
    categories: ["dinner"],
  },

  {
    image: "bourgogne-comte",
    name: "Comté",
    region: "Burgundy",
    regionFr: "Bourgogne-Franche-Comté",
    categories: ["snacks"],
  },

  {
    image: "bourgogne-coq-au-vin",
    name: "Coq au Vin",
    region: "Burgundy",
    regionFr: "Bourgogne-Franche-Comté",
    categories: ["dinner"],
  },

  /* BRETAGNE */

  {
    image: "bretagne-crepe",
    name: "Crêpe Bretonne",
    region: "Brittany",
    regionFr: "Bretagne",
    categories: [
      "breakfast",
      "snacks",
      "dessert",
    ],
  },

  {
    image: "bretagne-galette-complete",
    name: "Galette Complète",
    region: "Brittany",
    regionFr: "Bretagne",
    categories: ["lunch", "dinner"],
  },

  {
    image: "bretagne-kouign-amann",
    name: "Kouign-Amann",
    region: "Brittany",
    regionFr: "Bretagne",
    categories: ["breakfast", "dessert"],
  },

  /* CENTRE-VAL DE LOIRE */

  {
    image: "centre-crottin-chavignol",
    name: "Crottin de Chavignol",
    region: "Centre-Val de Loire",
    regionFr: "Centre-Val de Loire",
    categories: ["snacks"],
  },

  {
    image: "centre-pithiviers",
    name: "Pithiviers",
    region: "Centre-Val de Loire",
    regionFr: "Centre-Val de Loire",
    categories: ["dessert"],
  },

  {
    image: "centre-rillettes-tours",
    name: "Rillettes de Tours",
    region: "Centre-Val de Loire",
    regionFr: "Centre-Val de Loire",
    categories: ["lunch", "snacks"],
  },

  /* CORSE */

  {
    image: "corse-fiadone",
    name: "Fiadone",
    region: "Corsica",
    regionFr: "Corse",
    categories: ["dessert"],
  },

  {
    image: "corse-brocciu",
    name: "Brocciu",
    region: "Corsica",
    regionFr: "Corse",
    categories: ["breakfast", "snacks"],
  },

  {
    image: "corse-charcuterie",
    name: "Charcuterie Corse",
    region: "Corsica",
    regionFr: "Corse",
    categories: [
      "snacks",
      "lunch",
      "dinner",
    ],
  },

  /* GRAND EST */

  {
    image: "grand-est-choucroute",
    name: "Choucroute",
    region: "Grand Est",
    regionFr: "Grand Est",
    categories: ["lunch", "dinner"],
  },

  {
    image: "choucroute-garnie",
    name: "Choucroute Garnie",
    region: "Grand Est",
    regionFr: "Grand Est",
    categories: ["dinner"],
  },

  {
    image: "grand-est-quiche-lorraine",
    name: "Quiche Lorraine",
    region: "Grand Est",
    regionFr: "Lorraine",
    categories: ["lunch", "dinner"],
  },

  {
    image: "grand-est-bretzel",
    name: "Bretzel",
    region: "Grand Est",
    regionFr: "Grand Est",
    categories: ["breakfast", "snacks"],
  },

  /* HAUTS-DE-FRANCE */

  {
    image: "hauts-welsh",
    name: "Welsh",
    region: "Hauts-de-France",
    regionFr: "Hauts-de-France",
    categories: ["lunch", "dinner"],
  },

  {
    image: "hauts-moules-frites",
    name: "Moules-Frites",
    region: "Hauts-de-France",
    regionFr: "Hauts-de-France",
    categories: ["lunch", "dinner"],
  },

  {
    image: "hauts-tarte-maroilles",
    name: "Tarte au Maroilles",
    region: "Hauts-de-France",
    regionFr: "Hauts-de-France",
    categories: ["lunch", "dinner"],
  },

  /* ÎLE-DE-FRANCE */

  {
    image: "iledefrance-croque-monsieur",
    name: "Croque-Monsieur",
    region: "Île-de-France",
    regionFr: "Île-de-France",
    categories: [
      "breakfast",
      "lunch",
      "snacks",
    ],
  },

  {
    image: "iledefrance-french-onion-soup",
    name: "Soupe à l’Oignon",
    region: "Île-de-France",
    regionFr: "Île-de-France",
    categories: ["lunch", "dinner"],
  },

  {
    image: "iledefrance-paris-brest",
    name: "Paris-Brest",
    region: "Île-de-France",
    regionFr: "Île-de-France",
    categories: ["dessert"],
  },

  /* NORMANDIE */

  {
    image: "normandie-camembert",
    name: "Camembert",
    region: "Normandy",
    regionFr: "Normandie",
    categories: ["snacks"],
  },

  {
    image: "normandie-tarte-normande",
    name: "Tarte Normande",
    region: "Normandy",
    regionFr: "Normandie",
    categories: ["dessert"],
  },

  {
    image: "normandie-moules-creme",
    name: "Moules à la Crème",
    region: "Normandy",
    regionFr: "Normandie",
    categories: ["lunch", "dinner"],
  },

  {
    image: "sole-meuniere",
    name: "Sole Meunière",
    region: "Normandy",
    regionFr: "Normandie",
    categories: ["lunch", "dinner"],
  },

  /* NOUVELLE-AQUITAINE */

  {
    image: "nouvelle-aquitaine-canele",
    name: "Canelé",
    region: "Nouvelle-Aquitaine",
    regionFr: "Nouvelle-Aquitaine",
    categories: [
      "breakfast",
      "snacks",
      "dessert",
    ],
  },

  {
    image: "nouvelle-aquitaine-foie-gras",
    name: "Foie Gras",
    region: "Nouvelle-Aquitaine",
    regionFr: "Nouvelle-Aquitaine",
    categories: [
      "lunch",
      "dinner",
      "snacks",
    ],
  },

  {
    image: "nouvelle-aquitaine-huitres",
    name: "Huîtres du Bassin d’Arcachon",
    region: "Nouvelle-Aquitaine",
    regionFr: "Nouvelle-Aquitaine",
    categories: ["lunch", "dinner"],
  },

  /* OCCITANIE */

  {
    image: "occitanie-brandade",
    name: "Brandade de Morue",
    region: "Occitania",
    regionFr: "Occitanie",
    categories: ["lunch", "dinner"],
  },

  {
    image: "occitanie-cassoulet",
    name: "Cassoulet",
    region: "Occitania",
    regionFr: "Occitanie",
    categories: ["dinner"],
  },

  {
    image: "occitanie-tielle",
    name: "Tielle Sétoise",
    region: "Occitania",
    regionFr: "Occitanie",
    categories: ["lunch", "dinner"],
  },

  /* PROVENCE */

  {
    image: "paca-ratatouille",
    name: "Ratatouille",
    region: "Provence-Alpes-Côte d’Azur",
    regionFr: "Provence-Alpes-Côte d’Azur",
    categories: ["lunch", "dinner"],
  },

  {
    image: "paca-bouillabaisse",
    name: "Bouillabaisse",
    region: "Provence-Alpes-Côte d’Azur",
    regionFr: "Provence-Alpes-Côte d’Azur",
    categories: ["dinner"],
  },

  {
    image: "paca-pissaladiere",
    name: "Pissaladière",
    region: "Provence-Alpes-Côte d’Azur",
    regionFr: "Provence-Alpes-Côte d’Azur",
    categories: ["lunch", "snacks"],
  },

  /* PAYS DE LA LOIRE */

  {
    image: "pays-loire-beurre-blanc",
    name: "Beurre Blanc",
    region: "Pays de la Loire",
    regionFr: "Pays de la Loire",
    categories: ["lunch", "dinner"],
  },

  {
    image: "pays-loire-cure-nantais",
    name: "Curé Nantais",
    region: "Pays de la Loire",
    regionFr: "Pays de la Loire",
    categories: ["snacks"],
  },

  {
    image: "pays-loire-gateau-nantais",
    name: "Gâteau Nantais",
    region: "Pays de la Loire",
    regionFr: "Pays de la Loire",
    categories: ["dessert"],
  },

  /* OTHER */

  {
    image: "nicoise-salad",
    name: "Salade Niçoise",
    region: "Provence-Alpes-Côte d’Azur",
    regionFr: "Provence-Alpes-Côte d’Azur",
    categories: ["lunch"],
  },

  {
    image: "tarte-tatin",
    name: "Tarte Tatin",
    region: "France",
    regionFr: "France",
    categories: ["dessert"],
  },

  {
    image: "creme-brulee",
    name: "Crème brûlée",
    region: "France",
    regionFr: "France",
    categories: ["dessert"],
  },

  {
    image: "gougeres",
    name: "Gougères",
    region: "Bourgogne-Franche-Comté",
    regionFr: "Bourgogne-Franche-Comté",
    categories: ["breakfast", "snacks"],
  },

  {
    image: "chouquette",
    name: "Chouquettes",
    region: "France",
    regionFr: "France",
    categories: [
      "breakfast",
      "snacks",
      "dessert",
    ],
  },

  {
    image: "pain-aux-raisins",
    name: "Pain aux raisins",
    region: "France",
    regionFr: "France",
    categories: ["breakfast", "dessert"],
  },

  {
    image: "chaussons-aux-pommes",
    name: "Chaussons aux pommes",
    region: "France",
    regionFr: "France",
    categories: ["breakfast", "dessert"],
  },

  {
    image: "bouchee-a-la-reine",
    name: "Bouchée à la reine",
    region: "Grand Est",
    regionFr: "Grand Est",
    categories: ["lunch", "dinner"],
  },

  {
    image: "vol-au-vent",
    name: "Vol-au-vent",
    region: "France",
    regionFr: "France",
    categories: ["lunch", "dinner"],
  },

  {
    image: "crepes-salees",
    name: "Crêpes salées",
    region: "France",
    regionFr: "France",
    categories: ["lunch", "dinner"],
  },

  {
    image: "tarte-flambee",
    name: "Tarte flambée",
    region: "Grand Est",
    regionFr: "Grand Est",
    categories: ["lunch", "dinner"],
  },

  {
    image: "Gâteau",
    name: "Gâteau",
    region: "France",
    regionFr: "France",
    categories: ["dessert"],
  },
];

/* =========================================================
   RECIPE CONNECTION
========================================================= */

const getRecipe = (dish) => {
  const keys = [
    recipeAliases[dish.image],
    dish.image,
    dish.name,
  ].filter(Boolean);

  for (const key of keys) {
    if (recipeDatabase[key]) {
      return recipeDatabase[key];
    }
  }

  return null;
};

const dishes = dishDefinitions
  .map((dish) => ({
    ...dish,
    imageUrl: imageMap[dish.image],
    recipe: getRecipe(dish),
  }))
  .filter((dish) => dish.imageUrl);

/* =========================================================
   HELPERS
========================================================= */

const normalize = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const englishNames = {
  "Bœuf Bourguignon": "Beef Bourguignon",
  "Crêpe Bretonne": "Breton Crêpe",
  "Galette Complète": "Complete Galette",
  "Charcuterie Corse": "Corsican Charcuterie",
  "Choucroute Garnie": "Garnished Sauerkraut",
  "Moules-Frites": "Mussels & Fries",
  "Tarte au Maroilles": "Maroilles Tart",
  "Soupe à l’Oignon": "French Onion Soup",
  "Moules à la Crème": "Creamy Mussels",
  "Huîtres du Bassin d’Arcachon":
    "Arcachon Bay Oysters",
  "Brandade de Morue": "Salt Cod Brandade",
  "Tielle Sétoise": "Sète Seafood Pie",
  "Salade Niçoise": "Niçoise Salad",
  "Pain aux raisins": "Raisin Swirl",
  "Chaussons aux pommes": "Apple Turnovers",
  "Bouchée à la reine":
    "Vol-au-Vent Style Pastry",
  "Crêpes salées": "Savoury Crêpes",
  "Tarte flambée": "Flammekueche",
};

const getRecipeName = (recipe, language) =>
  recipe?.name?.[language] ||
  recipe?.name?.en ||
  "";

const getRecipeDescription = (
  recipe,
  language
) =>
  recipe?.description?.[language] ||
  recipe?.description?.en ||
  "";

const getRecipeIngredients = (
  recipe,
  language
) =>
  recipe?.ingredients?.[language] ||
  recipe?.ingredients?.en ||
  [];

const getRecipeSteps = (
  recipe,
  language
) =>
  recipe?.steps?.[language] ||
  recipe?.steps?.en ||
  [];

/* =========================================================
   COMPONENT
========================================================= */

export default function Dishes() {
  const { language } = useLanguage();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedDish, setSelectedDish] =
    useState(null);

  const isFrench = language === "fr";

  const filters = [
    {
      id: "all",
      en: "ALL",
      fr: "TOUT",
    },
    {
      id: "breakfast",
      en: "BREAKFAST",
      fr: "PETIT-DÉJEUNER",
    },
    {
      id: "lunch",
      en: "LUNCH",
      fr: "DÉJEUNER",
    },
    {
      id: "dinner",
      en: "DINNER",
      fr: "DÎNER",
    },
    {
      id: "snacks",
      en: "SNACKS",
      fr: "EN-CAS",
    },
    {
      id: "dessert",
      en: "DESSERTS",
      fr: "DESSERTS",
    },
  ];

  const filteredDishes = useMemo(() => {
    const query = normalize(search);

    return dishes.filter((dish) => {
      const matchesFilter =
        filter === "all" ||
        dish.categories.includes(filter);

      const text = normalize(
        `${dish.name} ${dish.region} ${dish.regionFr}`
      );

      return (
        matchesFilter &&
        (!query || text.includes(query))
      );
    });
  }, [filter, search]);

  /* =====================================================
     LOCK BACKGROUND SCROLL WHEN MODAL IS OPEN
  ===================================================== */

  useEffect(() => {
    if (!selectedDish) return;

    const previousOverflow =
      document.body.style.overflow;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedDish(null);
      }
    };

    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedDish]);

  const getDishName = (dish) =>
    isFrench
      ? dish.name
      : englishNames[dish.name] ||
        dish.name;

  const openRecipe = (dish) => {
    setSelectedDish(dish);
  };

  const closeRecipe = () => {
    setSelectedDish(null);
  };

  const selectedRecipe =
    selectedDish?.recipe || null;

  const selectedLanguage = isFrench
    ? "fr"
    : "en";

  const selectedRecipeName =
    getRecipeName(
      selectedRecipe,
      selectedLanguage
    ) ||
    getDishName(selectedDish || {});

  const selectedDescription =
    getRecipeDescription(
      selectedRecipe,
      selectedLanguage
    ) ||
    (isFrench
      ? "Une spécialité de la cuisine française."
      : "A specialty of French cuisine.");

  const selectedIngredients =
    getRecipeIngredients(
      selectedRecipe,
      selectedLanguage
    );

  const selectedSteps =
    getRecipeSteps(
      selectedRecipe,
      selectedLanguage
    );

  return (
    <main className="dishes-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dishes-hero">
        <div className="dishes-hero__inner">
          <p className="dishes-hero__eyebrow">
            03 —{" "}
            {isFrench ? "LES PLATS" : "THE DISHES"}
          </p>

          <h1>
            {isFrench ? (
              <>
                Une table,
                <br />
                <span>
                  mille histoires.
                </span>
              </>
            ) : (
              <>
                One table,
                <br />
                <span>
                  a thousand stories.
                </span>
              </>
            )}
          </h1>

          <p className="dishes-hero__description">
            {isFrench
              ? "Du premier café du matin au dernier plat du soir, découvrez les saveurs qui rythment la journée française."
              : "From the first coffee of the morning to the final course of the evening, discover the flavours that shape the French day."}
          </p>
        </div>

        <div className="dishes-hero__stamp">
          <span>LA</span>
          <strong>TABLE</strong>
          <span>FRANÇAISE</span>
        </div>
      </section>

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      <section className="dishes-catalogue">
        <div className="dishes-filter-head">
          <div>
            <p className="dishes-section-label">
              {isFrench
                ? "CHOISIR UN MOMENT"
                : "CHOOSE A MOMENT"}
            </p>

            <h2>
              {isFrench
                ? "Que mange-t-on ?"
                : "What are we eating?"}
            </h2>
          </div>

          <span className="dishes-count">
            {String(
              filteredDishes.length
            ).padStart(2, "0")}{" "}
            {isFrench ? "PLATS" : "DISHES"}
          </span>
        </div>

        <div className="dishes-toolbar">
          <nav
            className="dishes-filters"
            aria-label={
              isFrench
                ? "Catégories"
                : "Categories"
            }
          >
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  filter === item.id
                    ? "dishes-filter dishes-filter--active"
                    : "dishes-filter"
                }
                onClick={() =>
                  setFilter(item.id)
                }
              >
                <span>
                  {isFrench
                    ? item.fr
                    : item.en}
                </span>

                {filter === item.id && (
                  <span className="dishes-filter__dot" />
                )}
              </button>
            ))}
          </nav>

          <div className="dishes-search">
            <Search
              size={17}
              strokeWidth={1.4}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={
                isFrench
                  ? "Rechercher un plat..."
                  : "Search a dish..."
              }
            />

            {search && (
              <button
                type="button"
                className="dishes-search__clear"
                onClick={() => setSearch("")}
                aria-label={
                  isFrench
                    ? "Effacer"
                    : "Clear"
                }
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          GRID HEADER
      ===================================================== */}

      <div className="dishes-grid-header">
        <div className="dishes-grid-header__left">
          <span className="dishes-grid-header__count">
            {String(
              filteredDishes.length
            ).padStart(2, "0")}
          </span>

          <span className="dishes-grid-header__label">
            {isFrench
              ? "SPÉCIALITÉS DE LA CUISINE FRANÇAISE"
              : "SPECIALTIES OF FRENCH CUISINE"}
          </span>
        </div>

        {filter !== "all" && (
          <span className="dishes-grid-header__result">
            {isFrench
              ? filters.find(
                  (item) =>
                    item.id === filter
                )?.fr
              : filters.find(
                  (item) =>
                    item.id === filter
                )?.en}
          </span>
        )}
      </div>

      {/* =====================================================
          DISH GRID
      ===================================================== */}

      <section className="dishes-grid">
        {filteredDishes.map(
          (dish, index) => (
            <article
              className="dish-card"
              key={`${dish.image}-${index}`}
              tabIndex={0}
              role="button"
              onClick={() =>
                openRecipe(dish)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  openRecipe(dish);
                }
              }}
            >
              <div className="dish-card__image-wrap">
                <img
                  className="dish-card__image"
                  src={dish.imageUrl}
                  alt={getDishName(dish)}
                  loading={
                    index < 4
                      ? "eager"
                      : "lazy"
                  }
                />

                <div className="dish-card__overlay" />

                <span className="dish-card__number">
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </span>

                <span className="dish-card__open">
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.3}
                  />
                </span>

                <span className="dish-card__discover">
                  {isFrench
                    ? "VOIR LA RECETTE"
                    : "VIEW RECIPE"}
                </span>
              </div>

              <div className="dish-card__info">
                <div>
                  <p className="dish-card__region">
                    {isFrench
                      ? dish.regionFr
                      : dish.region}
                  </p>

                  <h2 className="dish-card__name">
                    {getDishName(dish)}
                  </h2>
                </div>

                <span className="dish-card__type">
                  {dish.recipe
                    ? isFrench
                      ? "RECETTE"
                      : "RECIPE"
                    : isFrench
                      ? "SPÉCIALITÉ"
                      : "SPECIALITY"}
                </span>
              </div>
            </article>
          )
        )}

        {filteredDishes.length === 0 && (
          <div className="dishes-empty">
            <h3>
              {isFrench
                ? "Aucun plat trouvé."
                : "No dishes found."}
            </h3>

            <p>
              {isFrench
                ? "Essayez une autre recherche ou catégorie."
                : "Try another search or category."}
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          CULTURAL SECTION
      ===================================================== */}

      <section className="dishes-culture">
        <div className="dishes-culture__number">
          04
        </div>

        <div className="dishes-culture__content">
          <p className="dishes-section-label">
            {isFrench
              ? "À TABLE"
              : "AT THE TABLE"}
          </p>

          <h2>
            {isFrench ? (
              <>
                En France,
                <br />
                manger est un
                <span> moment.</span>
              </>
            ) : (
              <>
                In France,
                <br />
                eating is a
                <span> moment.</span>
              </>
            )}
          </h2>

          <p>
            {isFrench
              ? "Les repas ne sont pas seulement une question de nourriture. Ils sont aussi un moment pour ralentir, partager et profiter de la table."
              : "Meals are not only about food. They are also a moment to slow down, share and enjoy the table."}
          </p>
        </div>

        <div className="dishes-culture__hours">
          <div>
            <span>08:00</span>
            <strong>
              {isFrench
                ? "PETIT-DÉJEUNER"
                : "BREAKFAST"}
            </strong>
          </div>

          <div>
            <span>12:30</span>
            <strong>
              {isFrench
                ? "DÉJEUNER"
                : "LUNCH"}
            </strong>
          </div>

          <div>
            <span>20:00</span>
            <strong>
              {isFrench
                ? "DÎNER"
                : "DINNER"}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECIPE MODAL
      ===================================================== */}

      {selectedDish && (
        <div
          className="dish-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedRecipeName}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeRecipe();
            }
          }}
        >
          <div className="dish-modal__inner">
            <button
              type="button"
              className="dish-modal__close"
              onClick={closeRecipe}
              aria-label={
                isFrench
                  ? "Fermer"
                  : "Close"
              }
            >
              <X
                size={20}
                strokeWidth={1.4}
              />
            </button>

            {/* IMAGE */}

            <div className="dish-modal__image">
              <img
                src={selectedDish.imageUrl}
                alt={selectedRecipeName}
              />

              <div className="dish-modal__image-overlay" />

              <div className="dish-modal__image-caption">
                <span>
                  {String(
                    dishes.findIndex(
                      (dish) =>
                        dish.image ===
                        selectedDish.image
                    ) + 1
                  ).padStart(2, "0")}
                </span>

                <span>
                  {isFrench
                    ? selectedDish.regionFr
                    : selectedDish.region}
                </span>
              </div>
            </div>

            {/* RECIPE CONTENT */}

            <div className="dish-modal__content">
              <p className="dish-modal__eyebrow">
                {isFrench
                  ? selectedDish.regionFr
                  : selectedDish.region}
              </p>

              <h2 className="dish-modal__title">
                {selectedRecipeName}
              </h2>

              <p className="dish-modal__description">
                {selectedDescription}
              </p>

              {selectedRecipe ? (
                <>
                  <div className="dish-modal__meta">
                    <div>
                      <Clock3
                        size={15}
                        strokeWidth={1.4}
                      />

                      <span>
                        {isFrench
                          ? "PRÉPARATION"
                          : "PREP"}
                      </span>

                      <strong>
                        {
                          selectedRecipe.prepTime
                        }{" "}
                        min
                      </strong>
                    </div>

                    <div>
                      <Clock3
                        size={15}
                        strokeWidth={1.4}
                      />

                      <span>
                        {isFrench
                          ? "CUISSON"
                          : "COOKING"}
                      </span>

                      <strong>
                        {selectedRecipe.cookTime
                          ? `${selectedRecipe.cookTime} min`
                          : "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        {isFrench
                          ? "PORTIONS"
                          : "SERVINGS"}
                      </span>

                      <strong>
                        {
                          selectedRecipe.servings
                        }
                      </strong>
                    </div>
                  </div>

                  {/* INGREDIENTS */}

                  <section className="recipe-section">
                    <p className="recipe-section__eyebrow">
                      01 —{" "}
                      {isFrench
                        ? "INGRÉDIENTS"
                        : "INGREDIENTS"}
                    </p>

                    <ul className="recipe-ingredients">
                      {selectedIngredients.map(
                        (
                          ingredient,
                          index
                        ) => (
                          <li
                            key={`${ingredient}-${index}`}
                          >
                            <span>
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <p>
                              {ingredient}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  </section>

                  {/* METHOD */}

                  <section className="recipe-section">
                    <p className="recipe-section__eyebrow">
                      02 —{" "}
                      {isFrench
                        ? "PRÉPARATION"
                        : "METHOD"}
                    </p>

                    <ol className="recipe-steps">
                      {selectedSteps.map(
                        (step, index) => (
                          <li
                            key={`${step}-${index}`}
                          >
                            <span>
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <p>{step}</p>
                          </li>
                        )
                      )}
                    </ol>
                  </section>
                </>
              ) : (
                <section className="recipe-section recipe-section--empty">
                  <p className="recipe-section__eyebrow">
                    {isFrench
                      ? "RECETTE À VENIR"
                      : "RECIPE COMING SOON"}
                  </p>

                  <p>
                    {isFrench
                      ? "Cette spécialité est déjà dans la collection. La recette détaillée sera ajoutée prochainement."
                      : "This specialty is already in the collection. Its detailed recipe will be added soon."}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}