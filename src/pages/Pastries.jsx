import { useLanguage } from "../context/LanguageContext";

export default function Pastries() {
  const { language } = useLanguage();

  return (
    <section className="page-placeholder">
      <span>05</span>

      <h1>
        {language === "fr"
          ? "La Pâtisserie"
          : "French Pâtisserie"}
      </h1>

      <p>
        {language === "fr"
          ? "L'univers des croissants, macarons et autres douceurs françaises."
          : "The world of croissants, macarons and other French delicacies."}
      </p>
    </section>
  );
}