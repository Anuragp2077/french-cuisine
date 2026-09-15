import { useLanguage } from "../context/LanguageContext";

export default function Regions() {
  const { language } = useLanguage();

  return (
    <section className="page-placeholder">
      <span>02</span>

      <h1>
        {language === "fr"
          ? "Les Régions de France"
          : "The Regions of France"}
      </h1>

      <p>
        {language === "fr"
          ? "Une carte interactive de la France et de ses spécialités."
          : "An interactive map of France and its culinary specialties."}
      </p>
    </section>
  );
}