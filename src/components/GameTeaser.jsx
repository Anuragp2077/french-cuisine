import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { DIFFICULTIES, DIFFICULTY_KEYS } from "../game/GameEngine";
import FoodGlyph from "../game/FoodGlyph";
import "./GameTeaser.css";

const FLOATING = ["croissant", "quiche", "stew", "brulee", "wine", "camembert"];

export default function GameTeaser() {
  const { language } = useLanguage();
  const t = (fr, en) => (language === "fr" ? fr : en);

  return (
    <section className="home-game" id="game">
      <div className="home-game__inner">
        <div className="home-game__copy reveal">
          <p className="eyebrow eyebrow--gold">{t("LE JEU", "THE GAME")}</p>

          <h2>
            {t("Le Grand", "The Grand")}
            <span>{t("Banquet.", "Banquet.")}</span>
          </h2>

          <p className="home-game__description">
            {t(
              "Trois services, un président, tous les plats du site à attraper au vol — et tous les cent mètres un Français furieux à affronter sur le ring. Une course d'arcade à jouer ici, dans votre navigateur.",
              "Three services, one president, every dish on this site to catch mid-air — and every hundred metres an angry Frenchman waiting in the ring. An arcade run you can play right here in your browser."
            )}
          </p>

          <div className="home-game__actions">
            <Link to="/game" className="home-game__play">
              <Play size={14} fill="currentColor" />
              {t("JOUER", "PLAY")}
            </Link>

            <span className="home-game__note">
              {t("Clavier ou écran tactile", "Keyboard or touchscreen")}
            </span>
          </div>
        </div>

        <Link
          to="/game"
          className="home-game__card reveal reveal--delay"
          aria-label={t("Jouer au Grand Banquet", "Play Le Grand Banquet")}
        >
          <span className="home-game__card-top">
            <span>{t("CARTE DU JOUR", "TODAY'S CARD")}</span>
            <span>03</span>
          </span>

          <span className="home-game__runs">
            {DIFFICULTY_KEYS.map((key, index) => {
              const service = DIFFICULTIES[key];

              return (
                <span className="home-game__run" key={key}>
                  <span className="home-game__run-index">0{index + 1}</span>

                  <span className="home-game__run-name">
                    <strong>{t(service.nameFr, service.nameEn)}</strong>
                    <small>{t(service.tagFr, service.tagEn)}</small>
                  </span>

                  <span
                    className="home-game__run-pace"
                    aria-label={t(
                      `Rythme ${service.pace} sur 3`,
                      `Pace ${service.pace} of 3`
                    )}
                  >
                    {[1, 2, 3].map((dot) => (
                      <i key={dot} className={dot <= service.pace ? "is-on" : ""} />
                    ))}
                  </span>
                </span>
              );
            })}
          </span>

          <span className="home-game__foods">
            {FLOATING.map((id) => (
              <FoodGlyph key={id} id={id} size={26} className="home-game__food" />
            ))}
          </span>

          <span className="home-game__cta">
            {t("Lancer la course", "Start the run")}
            <ArrowRight size={15} strokeWidth={1.5} />
          </span>
        </Link>
      </div>
    </section>
  );
}
