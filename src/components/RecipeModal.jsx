import { useEffect } from "react";
import {
  Clock3,
  Users,
  ChefHat,
  X,
  ArrowUpRight,
} from "lucide-react";
import "./RecipeModal.css";

const labels = {
  fr: {
    ingredients: "INGRÉDIENTS",
    preparation: "PRÉPARATION",
    prep: "PRÉPARATION",
    cooking: "CUISSON",
    servings: "PORTIONS",
    difficulty: "DIFFICULTÉ",
    note: "À PROPOS DU PLAT",
    close: "FERMER",
    easy: "FACILE",
    medium: "MOYEN",
    hard: "DIFFICILE",
  },
  en: {
    ingredients: "INGREDIENTS",
    preparation: "PREPARATION",
    prep: "PREP",
    cooking: "COOKING",
    servings: "SERVINGS",
    difficulty: "DIFFICULTY",
    note: "ABOUT THE DISH",
    close: "CLOSE",
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
  },
};

function getDifficulty(level, lang) {
  if (level <= 1) return labels[lang].easy;
  if (level <= 2) return labels[lang].medium;
  return labels[lang].hard;
}

export default function RecipeModal({
  recipe,
  image,
  lang = "fr",
  onClose,
}) {
  useEffect(() => {
    if (!recipe) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [recipe, onClose]);

  if (!recipe) return null;

  const l = lang === "fr" ? "fr" : "en";

  return (
    <div
      className="recipe-modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="recipe-modal__panel">
        <button
          className="recipe-modal__close"
          onClick={onClose}
          aria-label={labels[l].close}
        >
          <X size={20} strokeWidth={1.4} />
        </button>

        <div className="recipe-modal__hero">
          {image && (
            <img
              src={image}
              alt={recipe.name[l]}
              className="recipe-modal__image"
            />
          )}

          <div className="recipe-modal__hero-overlay" />

          <div className="recipe-modal__hero-content">
            <span>{recipe.region[l]}</span>

            <h2>{recipe.name[l]}</h2>

            {l === "fr" ? (
              <p>Recette traditionnelle française</p>
            ) : (
              <p>Traditional French recipe</p>
            )}
          </div>
        </div>

        <div className="recipe-modal__body">
          <div className="recipe-modal__stats">
            <div className="recipe-stat">
              <Clock3 size={18} strokeWidth={1.3} />
              <div>
                <small>{labels[l].prep}</small>
                <strong>{recipe.prepTime} min</strong>
              </div>
            </div>

            <div className="recipe-stat">
              <ChefHat size={18} strokeWidth={1.3} />
              <div>
                <small>{labels[l].cooking}</small>
                <strong>
                  {recipe.cookTime ? `${recipe.cookTime} min` : "—"}
                </strong>
              </div>
            </div>

            <div className="recipe-stat">
              <Users size={18} strokeWidth={1.3} />
              <div>
                <small>{labels[l].servings}</small>
                <strong>{recipe.servings}</strong>
              </div>
            </div>

            <div className="recipe-stat">
              <ArrowUpRight size={18} strokeWidth={1.3} />
              <div>
                <small>{labels[l].difficulty}</small>
                <strong>
                  {getDifficulty(recipe.difficulty, l)}
                </strong>
              </div>
            </div>
          </div>

          <div className="recipe-modal__grid">
            <section className="recipe-section recipe-section--ingredients">
              <p className="recipe-section__eyebrow">
                01 — {labels[l].ingredients}
              </p>

              <ul className="recipe-ingredients">
                {recipe.ingredients[l].map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            <section className="recipe-section">
              <p className="recipe-section__eyebrow">
                02 — {labels[l].preparation}
              </p>

              <div className="recipe-steps">
                {recipe.steps[l].map((step, index) => (
                  <div
                    className="recipe-step"
                    key={`${step}-${index}`}
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {recipe.note[l] && (
            <section className="recipe-note">
              <p className="recipe-section__eyebrow">
                03 — {labels[l].note}
              </p>

              <p>{recipe.note[l]}</p>
            </section>
          )}

          <button className="recipe-modal__bottom-close" onClick={onClose}>
            <span>{labels[l].close}</span>
            <X size={17} strokeWidth={1.3} />
          </button>
        </div>
      </div>
    </div>
  );
}