import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { DIFFICULTIES, DIFFICULTY_KEYS, GameEngine } from "../game/GameEngine";
import { FOOD_ICONS } from "../game/foodArt";
import FoodGlyph from "../game/FoodGlyph";
import "./game.css";

const BEST_KEY = "french-cuisine-game-best";
const SOUND_KEY = "french-cuisine-game-sound";
const DEFAULT_DIFFICULTY = "lunch";

function readBest() {
  try {
    const stored = JSON.parse(localStorage.getItem(BEST_KEY));
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function readSound() {
  return localStorage.getItem(SOUND_KEY) !== "off";
}

export default function Game() {
  const { language } = useLanguage();
  const t = (fr, en) => (language === "fr" ? fr : en);

  const [phase, setPhase] = useState("menu");
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [hud, setHud] = useState({
    distance: 0,
    food: 0,
    score: 0,
    hearts: DIFFICULTIES[DEFAULT_DIFFICULTY].hearts,
    multiplier: 1,
    progress: 0,
    length: DIFFICULTIES[DEFAULT_DIFFICULTY].length,
    boss: null,
  });
  const [result, setResult] = useState(null);
  const [best, setBest] = useState(readBest);
  const [sound, setSound] = useState(readSound);
  const [countdown, setCountdown] = useState(3);
  const [isTouch, setIsTouch] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const bestRef = useRef(best);
  const countdownTimer = useRef(0);

  const cfg = DIFFICULTIES[difficulty];

  useEffect(() => {
    const engine = new GameEngine(canvasRef.current, {
      difficulty: DEFAULT_DIFFICULTY,
      sound: readSound(),
      best: bestRef.current[DEFAULT_DIFFICULTY]?.score || 0,
      onEvent: (event) => {
        if (event.type === "stats") {
          setHud(event);
        } else if (event.type === "gameover" || event.type === "complete") {
          const completed = event.type === "complete";
          const stats = { ...event, completed };

          setResult(stats);
          setPhase(completed ? "complete" : "over");

          const record = bestRef.current[stats.difficulty];

          if (!record || record.score < stats.score) {
            const next = {
              ...bestRef.current,
              [stats.difficulty]: {
                score: stats.score,
                food: stats.food,
                distance: stats.distance,
                stars: stats.stars,
              },
            };

            bestRef.current = next;
            setBest(next);

            try {
              localStorage.setItem(BEST_KEY, JSON.stringify(next));
            } catch {
              /* storage can be disabled — the run still works */
            }
          }
        } else if (event.type === "paused") {
          setPhase("paused");
        } else if (event.type === "resumed") {
          setPhase("playing");
        }
      },
    });

    engineRef.current = engine;

    /* development handle so the run loop can be inspected from the console */
    if (import.meta.env.DEV) {
      window.__banquetGame = engine;
    }

    return () => {
      window.clearTimeout(countdownTimer.current);
      engine.destroy();
      engineRef.current = null;

      if (import.meta.env.DEV) {
        delete window.__banquetGame;
      }
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth <= 760);

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    engineRef.current?.setSound(sound);
    localStorage.setItem(SOUND_KEY, sound ? "on" : "off");
  }, [sound]);

  useEffect(() => {
    engineRef.current?.setBest(best[difficulty]?.score || 0);
  }, [best, difficulty]);

  const beginRun = () => {
    window.clearTimeout(countdownTimer.current);
    engineRef.current?.toAttract();
    setResult(null);
    setCountdown(3);
    setPhase("countdown");

    countdownTimer.current = window.setTimeout(() => {
      setCountdown(2);

      countdownTimer.current = window.setTimeout(() => {
        setCountdown(1);

        countdownTimer.current = window.setTimeout(() => {
          setCountdown(0);

          countdownTimer.current = window.setTimeout(() => {
            engineRef.current?.startRun();
            setPhase("playing");
          }, 520);
        }, 720);
      }, 720);
    }, 720);
  };

  const selectDifficulty = (key) => {
    if (phase === "playing" || phase === "countdown") {
      return;
    }

    setDifficulty(key);
    engineRef.current?.setDifficulty(key);
    setResult(null);
    setPhase("menu");
  };

  const backToMenu = () => {
    engineRef.current?.toAttract();
    setResult(null);
    setPhase("menu");
  };

  const togglePause = () => {
    engineRef.current?.togglePause();
  };

  const jump = () => {
    engineRef.current?.pressJump();
  };

  const releaseJump = () => {
    engineRef.current?.releaseJump();
  };

  const move = (direction) => {
    engineRef.current?.setMove(direction);
  };

  const punch = () => {
    engineRef.current?.pressPunch();
  };

  const slide = () => {
    engineRef.current?.pressSlide();
  };

  const bestOverall = Math.max(
    0,
    ...DIFFICULTY_KEYS.map((key) => best[key]?.score || 0)
  );

  return (
    <main className="game-page">
      <section className="game-hero">
        <div className="game-hero__inner">
          <Link to="/" className="game-back">
            <ArrowLeft size={14} strokeWidth={1.6} />
            {t("Retour au site", "Back to the site")}
          </Link>

          <p className="eyebrow eyebrow--rose">
            {t("LE JEU — LA COURSE DU PRÉSIDENT", "THE GAME — THE PRESIDENT'S RUN")}
          </p>

          <h1>
            {t("Le Grand", "The Grand")}
            <span>{t("Banquet", "Banquet")}</span>
          </h1>

          <div className="game-hero__row">
            <p>
              {t(
                "Macron court, saute, glisse sous les enseignes, attrape les bonus, et tous les cent mètres un Français furieux monte sur le ring. Sautez sur sa tête, frappez au corps, puis reprenez la course.",
                "Macron runs, jumps, slides under the shop signs, grabs the bonuses — and every hundred metres an angry Frenchman steps into the ring. Stomp his head, punch the body, then get back to the run."
              )}
            </p>

            <div className="game-hero__badges">
              <span>
                <Trophy size={14} strokeWidth={1.5} />
                {t("Record", "Best")} {bestOverall || "—"}
              </span>

              <span>{t("3 SERVICES", "3 SERVICES")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="game-stage">
        <div className={`game-frame game-frame--${phase}`}>
          <canvas
            ref={canvasRef}
            className="game-canvas"
            role="img"
            aria-label={t(
              "Le Grand Banquet : course d'arcade dans la cuisine française",
              "Le Grand Banquet: an arcade run through French cuisine"
            )}
          />

          {phase === "menu" && (
            <div className="game-overlay game-overlay--start">
              <div className="game-start-card">
                <span className="game-kicker">
                  {t("SERVICE CHOISI", "SELECTED SERVICE")}
                </span>

                <strong>{t(cfg.nameFr, cfg.nameEn)}</strong>

                <p>
                  {t(
                    "Des plats à attraper, trois ou quatre rounds au ring, et une arrivée à table.",
                    "Dishes to catch, three or four ring fights, one table to reach."
                  )}
                </p>

                <button type="button" className="game-play" onClick={beginRun}>
                  <Play size={15} fill="currentColor" />
                  {t("Jouer", "Play")}
                </button>

                <span className="game-start-card__hint">
                  {isTouch
                    ? t("Touchez pour sauter", "Tap to jump")
                    : t("Espace ou ↑ pour sauter", "Space or ↑ to jump")}
                  <em>
                    {t(
                      "↓ glisser sous les enseignes · Ring : A / D se déplacer, J frapper",
                      "↓ slide under the signs · Ring: A / D move, J punch"
                    )}
                  </em>
                </span>
              </div>
            </div>
          )}

          {phase === "countdown" && (
            <div className="game-overlay game-overlay--countdown">
              <div className="game-countdown-wrap">
                <span className="game-kicker">
                  {t("SERVICE EN COURS", "SERVICE UNDERWAY")}
                </span>

                <div className="game-countdown" key={countdown}>
                  {countdown === 0 ? t("ALLEZ", "GO") : countdown}
                </div>
              </div>
            </div>
          )}

          {(isTouch || isCompact) &&
            (phase === "playing" || phase === "countdown") && (
            <button
              type="button"
              className="game-jump"
              aria-label={t("Sauter", "Jump")}
              onPointerDown={(event) => {
                event.preventDefault();
                jump();
              }}
              onPointerUp={releaseJump}
              onPointerCancel={releaseJump}
              onPointerLeave={releaseJump}
              onContextMenu={(event) => event.preventDefault()}
            >
              <span>{t("SAUTER", "JUMP")}</span>
            </button>
          )}

          {(isTouch || isCompact) &&
            (phase === "playing" || phase === "countdown") &&
            !hud.boss?.fighting && (
              <button
                type="button"
                className="game-slide"
                aria-label={t("Glisser", "Slide")}
                onPointerDown={(event) => {
                  event.preventDefault();
                  slide();
                }}
                onContextMenu={(event) => event.preventDefault()}
              >
                <span>{t("GLISSER", "SLIDE")}</span>
              </button>
            )}

          {(isTouch || isCompact) &&
            phase === "playing" &&
            hud.boss?.fighting && (
              <div className="game-fight">
                <div className="game-fight__moves">
                  <button
                    type="button"
                    className="game-fight__move"
                    aria-label={t("Reculer", "Move back")}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      move(-1);
                    }}
                    onPointerUp={() => move(0)}
                    onPointerCancel={() => move(0)}
                    onPointerLeave={() => move(0)}
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    className="game-fight__move"
                    aria-label={t("Avancer", "Move forward")}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      move(1);
                    }}
                    onPointerUp={() => move(0)}
                    onPointerCancel={() => move(0)}
                    onPointerLeave={() => move(0)}
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    →
                  </button>
                </div>

                <button
                  type="button"
                  className={`game-fight__punch${
                    hud.rageReady ? " is-charged" : ""
                  }`}
                  aria-label={
                    hud.rageReady
                      ? t("Coup de colère", "Rage punch")
                      : t("Frapper", "Punch")
                  }
                  onPointerDown={(event) => {
                    event.preventDefault();
                    punch();
                  }}
                  onContextMenu={(event) => event.preventDefault()}
                >
                  <span>
                    {hud.rageReady
                      ? t("SUPER", "SUPER")
                      : t("COUP", "PUNCH")}
                  </span>
                </button>
              </div>
            )}

          {phase === "paused" && (
            <div className="game-overlay game-overlay--pause">
              <div className="game-panel">
                <span className="game-kicker">{t("PAUSE", "PAUSED")}</span>

                <h2 className="game-panel__title">
                  {t("On reprend ?", "Back to service?")}
                </h2>

                <p className="game-panel__copy">
                  {t(
                    `Vous êtes à ${hud.distance} m, avec ${hud.food} plats en poche.`,
                    `You are ${hud.distance} m in with ${hud.food} dishes collected.`
                  )}
                </p>

                <div className="game-panel__actions">
                  <button type="button" className="game-play" onClick={togglePause}>
                    <Play size={14} fill="currentColor" />
                    {t("Reprendre", "Resume")}
                  </button>

                  <button type="button" className="game-ghost" onClick={backToMenu}>
                    {t("Quitter", "Quit")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {(phase === "over" || phase === "complete") && result && (
            <div
              className={`game-overlay game-overlay--result ${
                result.completed ? "is-win" : ""
              }`}
            >
              <div className="game-panel game-panel--result">
                <span className="game-kicker">
                  {result.completed
                    ? t("SERVICE TERMINÉ", "SERVICE COMPLETE")
                    : t("SERVICE INTERROMPU", "SERVICE INTERRUPTED")}
                </span>

                <h2 className="game-panel__title">
                  {result.completed
                    ? t("À table !", "To the table!")
                    : t("La course s'arrête ici.", "The run stops here.")}
                </h2>

                {result.completed ? (
                  <div className="game-stars" aria-label={`${result.stars} / 3`}>
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={star <= result.stars ? "is-on" : ""}
                      >
                        ✦
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="game-panel__copy">
                    {t(
                      "Une casserole de trop. Le service peut recommencer.",
                      "One pot too many. Service can begin again."
                    )}
                  </p>
                )}

                <dl className="game-stats">
                  <div>
                    <dt>{t("Distance", "Distance")}</dt>
                    <dd>{result.distance} m</dd>
                  </div>

                  <div>
                    <dt>{t("Plats", "Dishes")}</dt>
                    <dd>{result.food}</dd>
                  </div>

                  <div>
                    <dt>{t("Score", "Score")}</dt>
                    <dd>{result.score}</dd>
                  </div>
                </dl>

                <p className="game-panel__record">
                  {best[result.difficulty]?.score === result.score
                    ? t("Nouveau record personnel.", "New personal best.")
                    : `${t("Record", "Best")} : ${
                        best[result.difficulty]?.score ?? "—"
                      }`}
                </p>

                <div className="game-panel__actions">
                  <button type="button" className="game-play" onClick={beginRun}>
                    <RotateCcw size={14} />
                    {t("Rejouer", "Run again")}
                  </button>

                  <button type="button" className="game-ghost" onClick={backToMenu}>
                    {t("Changer de service", "Change service")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="game-cabinet">
          <div className="game-cabinet__service">
            <span>{t(cfg.nameFr, cfg.nameEn)}</span>
            <span className="game-cabinet__divider">/</span>
            <span>{cfg.length} m</span>
          </div>

          <div className="game-cabinet__hint">
            {isTouch
              ? t(
                  "Touchez pour sauter, GLISSER pour passer sous les enseignes. Au ring : ← → pour bouger, sautez sur sa tête, remplissez la COLÈRE pour un super coup.",
                  "Tap to jump, SLIDE to pass under the shop signs. At the ring: ← → to move, jump on his head, fill RAGE for a super punch."
                )
              : t(
                  "Espace / ↑ : sauter · ↓ : glisser · A / D : se déplacer au ring · J : frapper · P : pause",
                  "Space / ↑: jump · ↓: slide · A / D: move in the ring · J: punch · P: pause"
                )}
          </div>

          <div className="game-cabinet__actions">
            <button
              type="button"
              className="game-icon-button"
              onClick={() => setSound((current) => !current)}
              aria-label={
                sound ? t("Couper le son", "Mute sound") : t("Activer le son", "Unmute sound")
              }
              aria-pressed={!sound}
            >
              {sound ? (
                <Volume2 size={16} strokeWidth={1.6} />
              ) : (
                <VolumeX size={16} strokeWidth={1.6} />
              )}
            </button>

            <button
              type="button"
              className="game-icon-button"
              onClick={togglePause}
              disabled={phase !== "playing" && phase !== "paused"}
              aria-label={
                phase === "paused" ? t("Reprendre", "Resume") : t("Pause", "Pause")
              }
            >
              {phase === "paused" ? (
                <Play size={16} strokeWidth={1.6} />
              ) : (
                <Pause size={16} strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="game-services" id="services">
        <div className="game-section-head">
          <p className="eyebrow eyebrow--gold">
            {t("TROIS SERVICES", "THREE SERVICES")}
          </p>

          <h2>{t("Choisissez votre rythme.", "Choose your pace.")}</h2>

          <p>
            {t(
              "Même geste, trois vitesses. Le petit-déjeuner laisse le temps de viser, le dîner ne pardonne rien.",
              "One gesture, three speeds. Breakfast lets you aim; dinner forgives nothing."
            )}
          </p>
        </div>

        <div className="game-service-grid">
          {DIFFICULTY_KEYS.map((key, index) => {
            const service = DIFFICULTIES[key];
            const record = best[key];
            const selected = difficulty === key;

            return (
              <button
                type="button"
                key={key}
                className={`game-service ${selected ? "is-selected" : ""}`}
                onClick={() => selectDifficulty(key)}
                aria-pressed={selected}
              >
                <span className="game-service__top">
                  <span className="game-service__number">0{index + 1}</span>

                  <span className="game-service__record">
                    {service.length} m
                    <span>·</span>
                    {t("Record", "Best")} {record?.score ?? "—"}
                  </span>
                </span>

                <span className="game-service__name">
                  {t(service.nameFr, service.nameEn)}
                </span>

                <span className="game-service__tag">
                  {t(service.tagFr, service.tagEn)}
                </span>

                <span className="game-service__copy">
                  {t(service.copyFr, service.copyEn)}
                </span>

                <span className="game-service__foods">
                  {service.foods.slice(0, 5).map((id) => (
                    <FoodGlyph key={id} id={id} size={23} />
                  ))}
                </span>

                <span className="game-service__foot">
                  <span
                    className="game-service__pace"
                    aria-label={t(
                      `Rythme ${service.pace} sur 3`,
                      `Pace ${service.pace} of 3`
                    )}
                  >
                    {[1, 2, 3].map((dot) => (
                      <i key={dot} className={dot <= service.pace ? "is-on" : ""} />
                    ))}
                  </span>

                  <span className="game-service__choose">
                    {selected ? t("Sélectionné", "Selected") : t("Choisir", "Choose")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="game-menu-list">
        <div className="game-section-head game-section-head--compact">
          <p className="eyebrow eyebrow--rose">
            {t("LE MENU DU SERVICE", "THE SERVICE MENU")}
          </p>

          <h2>{t(cfg.nameFr, cfg.nameEn)}</h2>

          <p>
            {t(
              "Les plats du site, à attraper en courant. Chaque assiette compte.",
              "The site's dishes, caught on the run. Every plate counts."
            )}
          </p>
        </div>

        <ul className="game-food-list">
          {cfg.foods.map((id, index) => (
            <li key={id}>
              <span className="game-food-list__index">0{index + 1}</span>

              <FoodGlyph
                id={id}
                size={32}
                title={t(FOOD_ICONS[id].nameFr, FOOD_ICONS[id].nameEn)}
              />

              <span className="game-food-list__name">
                <strong>{t(FOOD_ICONS[id].nameFr, FOOD_ICONS[id].nameEn)}</strong>
                <small>{t("À attraper en courant", "Catch it on the run")}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
