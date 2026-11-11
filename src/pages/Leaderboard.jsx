import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, RefreshCw, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  fetchLeaderboard,
  POLL_MS,
} from "../lib/leaderboard";
import "./Leaderboard.css";

const DIFFICULTY_LABELS = {
  breakfast: { fr: "Petit-déjeuner", en: "Breakfast" },
  lunch: { fr: "Déjeuner", en: "Lunch" },
  dinner: { fr: "Dîner", en: "Dinner" },
};

export default function Leaderboard() {
  const { language } = useLanguage();
  const t = (fr, en) => (language === "fr" ? fr : en);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchLeaderboard();
      setRows(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err?.message || "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const filtered =
    filter === "all" ? rows : rows.filter((r) => r.difficulty === filter);

  return (
    <main className="leaderboard-page">
      <section className="leaderboard-hero">
        <div className="leaderboard-hero__inner">
          <Link to="/" className="game-back">
            <ArrowLeft size={14} strokeWidth={1.6} />
            {t("Retour au site", "Back to the site")}
          </Link>

          <p className="eyebrow eyebrow--rose">
            {t("CLASSEMENT EN DIRECT", "LIVE LEADERBOARD")}
          </p>

          <h1>
            {t("Le Tableau", "The Leaderboard")}
            <span>{t("d'Honneur", "of Honour")}</span>
          </h1>

          <p className="leaderboard-hero__copy">
            {t(
              "Les meilleurs scores de la classe, mis à jour en temps réel. Rejouez pour grimper.",
              "The class's best scores, updated in real time. Play again to climb."
            )}
          </p>

          <div className="leaderboard-status">
            <span className="leaderboard-status__pill is-live">
              <Wifi size={12} /> {t("En ligne", "Live")}
            </span>

            <button
              type="button"
              className="leaderboard-refresh"
              onClick={load}
              aria-label={t("Rafraîchir", "Refresh")}
            >
              <RefreshCw size={14} />
            </button>

            {lastUpdate && (
              <span className="leaderboard-status__time">
                {t("Mis à jour", "Updated")}{" "}
                {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="leaderboard-body">
        <div className="leaderboard-filters">
          {["all", "breakfast", "lunch", "dinner"].map((key) => (
            <button
              key={key}
              type="button"
              className={`leaderboard-filter ${filter === key ? "is-active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {key === "all"
                ? t("Tous", "All")
                : t(
                    DIFFICULTY_LABELS[key].fr,
                    DIFFICULTY_LABELS[key].en
                  )}
            </button>
          ))}
        </div>

        {loading && rows.length === 0 ? (
          <p className="leaderboard-empty">
            {t("Chargement…", "Loading…")}
          </p>
        ) : filtered.length === 0 ? (
          <p className="leaderboard-empty">
            {t("Aucun score pour l'instant. Jouez !", "No scores yet. Play!")}
          </p>
        ) : (
          <ol className="leaderboard-table">
            <li className="leaderboard-row leaderboard-row--head">
              <span>#</span>
              <span>{t("Joueur", "Player")}</span>
              <span>{t("Service", "Service")}</span>
              <span>{t("Score", "Score")}</span>
              <span>{t("Distance", "Distance")}</span>
              <span>{t("Plats", "Dishes")}</span>
            </li>
            {filtered.map((row, i) => (
              <li
                key={`${row.name}-${row.ts}-${i}`}
                className={`leaderboard-row ${i < 3 ? "is-top" : ""}`}
              >
                <span className="leaderboard-rank">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <span className="leaderboard-name">{row.name}</span>
                <span className="leaderboard-diff">
                  {t(
                    DIFFICULTY_LABELS[row.difficulty]?.fr ||
                      row.difficulty,
                    DIFFICULTY_LABELS[row.difficulty]?.en ||
                      row.difficulty
                  )}
                </span>
                <span className="leaderboard-score">{row.score}</span>
                <span>{row.distance} m</span>
                <span>{row.food}</span>
              </li>
            ))}
          </ol>
        )}

        {error && (
          <p className="leaderboard-error">
            {t("Erreur de chargement :", "Load error:")} {error}
          </p>
        )}

      </section>
    </main>
  );
}
