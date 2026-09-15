import { useLanguage } from "../context/LanguageContext";

export default function Vocabulary() {
  const { language } = useLanguage();

  return (
    <section className="page-placeholder">
      <span>06</span>

      <h1>
        {language === "fr"
          ? "Le Vocabulaire"
          : "French Food Vocabulary"}
      </h1>

      <p>
        {language === "fr"
          ? "Apprenez le français à travers la cuisine."
          : "Learn French through food."}
      </p>
    </section>
  );
}