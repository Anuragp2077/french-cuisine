import { useLanguage } from "../context/LanguageContext";

export default function Cooking() {
  const { language } = useLanguage();

  return (
    <section className="page-placeholder">
      <span>04</span>

      <h1>
        {language === "fr"
          ? "Cuisinons Ensemble"
          : "Let's Cook Together"}
      </h1>

      <p>
        {language === "fr"
          ? "Une expérience de cuisine interactive arrivera ici."
          : "An interactive cooking experience will live here."}
      </p>
    </section>
  );
}