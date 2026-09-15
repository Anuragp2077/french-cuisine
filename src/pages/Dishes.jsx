import { useLanguage } from "../context/LanguageContext";

export default function Dishes() {
  const { language } = useLanguage();

  return (
    <section className="page-placeholder">
      <span>03</span>

      <h1>
        {language === "fr"
          ? "Les Grands Plats"
          : "The Great French Dishes"}
      </h1>

      <p>
        {language === "fr"
          ? "Un catalogue interactif des grands classiques français."
          : "An interactive catalogue of French culinary classics."}
      </p>
    </section>
  );
}