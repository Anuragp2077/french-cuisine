import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Languages,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Search,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import "./Vocabulary.css";

/* =========================================================
   VOCABULARY DATA
   Source: French Cuisine Vocabulary PDF
   ========================================================= */

const vocabulary = [
  {
    id: 1,
    english: "To cook",
    french: "Cuisiner",
    category: "cooking",
  },
  {
    id: 2,
    english: "To simmer",
    french: "Mijoter",
    category: "cooking",
  },
  {
    id: 3,
    english: "To sauté",
    french: "Sauter",
    category: "cooking",
  },
  {
    id: 4,
    english: "To season",
    french: "Assaisonner",
    category: "cooking",
  },
  {
    id: 5,
    english: "To boil",
    french: "Bouillir",
    category: "cooking",
  },
  {
    id: 6,
    english: "To fry",
    french: "Frire",
    category: "cooking",
  },
  {
    id: 7,
    english: "To grill",
    french: "Griller",
    category: "cooking",
  },
  {
    id: 8,
    english: "To bake",
    french: "Cuire au four",
    category: "cooking",
  },
  {
    id: 9,
    english: "To mix",
    french: "Mélanger",
    category: "cooking",
  },
  {
    id: 10,
    english: "To cut",
    french: "Couper",
    category: "cooking",
  },
  {
    id: 11,
    english: "To add",
    french: "Ajouter",
    category: "cooking",
  },
  {
    id: 12,
    english: "To taste",
    french: "Goûter",
    category: "cooking",
  },

  {
    id: 13,
    english: "To order",
    french: "Commander",
    category: "restaurant",
  },
  {
    id: 14,
    english: "To choose",
    french: "Choisir",
    category: "restaurant",
  },
  {
    id: 15,
    english: "To ask for",
    french: "Demander",
    category: "restaurant",
  },
  {
    id: 16,
    english: "To recommend",
    french: "Recommander",
    category: "restaurant",
  },
  {
    id: 17,
    english: "To want",
    french: "Vouloir",
    category: "restaurant",
  },
  {
    id: 18,
    english: "To have",
    french: "Avoir",
    category: "restaurant",
  },
  {
    id: 19,
    english: "To eat",
    french: "Manger",
    category: "restaurant",
  },
  {
    id: 20,
    english: "To drink",
    french: "Boire",
    category: "restaurant",
  },
  {
    id: 21,
    english: "To serve",
    french: "Servir",
    category: "restaurant",
  },
  {
    id: 22,
    english: "To pay",
    french: "Payer",
    category: "restaurant",
  },
  {
    id: 23,
    english: "To take away",
    french: "Emporter",
    category: "restaurant",
  },

  {
    id: 24,
    english: "Menu",
    french: "Menu",
    category: "food",
  },
  {
    id: 25,
    english: "Dish",
    french: "Plat",
    category: "food",
  },
  {
    id: 26,
    english: "Starter",
    french: "Entrée",
    category: "food",
  },
  {
    id: 27,
    english: "Main course",
    french: "Plat principal",
    category: "food",
  },
  {
    id: 28,
    english: "Dessert",
    french: "Dessert",
    category: "food",
  },
  {
    id: 29,
    english: "Food",
    french: "Nourriture",
    category: "food",
  },
  {
    id: 30,
    english: "Drink",
    french: "Boisson",
    category: "food",
  },
  {
    id: 31,
    english: "Water",
    french: "Eau",
    category: "food",
  },
  {
    id: 32,
    english: "Coffee",
    french: "Café",
    category: "food",
  },
  {
    id: 33,
    english: "Tea",
    french: "Thé",
    category: "food",
  },
  {
    id: 34,
    english: "Bill",
    french: "Addition",
    category: "food",
  },
  {
    id: 35,
    english: "Table",
    french: "Table",
    category: "food",
  },
  {
    id: 36,
    english: "Restaurant",
    french: "Restaurant",
    category: "food",
  },

  {
    id: 37,
    english: "Please",
    french: "S’il vous plaît",
    category: "phrases",
  },
  {
    id: 38,
    english: "Thank you",
    french: "Merci",
    category: "phrases",
  },
  {
    id: 39,
    english: "I would like...",
    french: "Je voudrais...",
    category: "phrases",
  },
  {
    id: 40,
    english: "Can I have...?",
    french: "Est-ce que je peux avoir... ?",
    category: "phrases",
  },

  {
    id: 41,
    english: "With",
    french: "Avec",
    category: "preferences",
  },
  {
    id: 42,
    english: "Without",
    french: "Sans",
    category: "preferences",
  },
  {
    id: 43,
    english: "Spicy",
    french: "Épicé / Épicée",
    category: "preferences",
  },
  {
    id: 44,
    english: "Vegetarian",
    french: "Végétarien / Végétarienne",
    category: "preferences",
  },
  {
    id: 45,
    english: "Delicious",
    french: "Délicieux / Délicieuse",
    category: "preferences",
  },
  {
    id: 46,
    english: "More",
    french: "Plus",
    category: "preferences",
  },
  {
    id: 47,
    english: "Less",
    french: "Moins",
    category: "preferences",
  },
  {
    id: 48,
    english: "Extra",
    french: "Supplémentaire",
    category: "preferences",
  },
  {
    id: 49,
    english: "Takeaway",
    french: "À emporter",
    category: "preferences",
  },
  {
    id: 50,
    english: "For here",
    french: "Sur place",
    category: "preferences",
  },
];

const categories = [
  {
    id: "all",
    label: "ALL",
    french: "TOUT",
  },
  {
    id: "cooking",
    label: "COOKING",
    french: "CUISINE",
  },
  {
    id: "restaurant",
    label: "RESTAURANT",
    french: "RESTAURANT",
  },
  {
    id: "food",
    label: "FOOD",
    french: "ALIMENTS",
  },
  {
    id: "phrases",
    label: "PHRASES",
    french: "PHRASES",
  },
  {
    id: "preferences",
    label: "SERVICE",
    french: "SERVICE",
  },
];

const categoryNames = {
  cooking: "Cooking Actions",
  restaurant: "Restaurant",
  food: "Food & Restaurant",
  phrases: "Useful Phrases",
  preferences: "Service & Preferences",
};

/* =========================================================
   SPEECH HELPERS
   ========================================================= */

const speakFrench = (text, slow = false) => {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "fr-FR";
  utterance.rate = slow ? 0.65 : 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const frenchVoice = voices.find(
    (voice) =>
      voice.lang.toLowerCase().startsWith("fr")
  );

  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  window.speechSynthesis.speak(utterance);
};

/* =========================================================
   COMPONENT
   ========================================================= */

function Vocabulary() {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [search, setSearch] = useState("");

  const [language, setLanguage] = useState("fr");

  const [mode, setMode] = useState("browse");

  const [selectedWord, setSelectedWord] =
    useState(null);

  const [slowSpeech, setSlowSpeech] =
    useState(false);

  const [practiceWords, setPracticeWords] =
    useState(vocabulary);

  const [practiceIndex, setPracticeIndex] =
    useState(0);

  const [practiceScore, setPracticeScore] =
    useState(0);

  const [practiceStreak, setPracticeStreak] =
    useState(0);

  const [practiceAnswered, setPracticeAnswered] =
    useState(false);

  const [practiceCorrect, setPracticeCorrect] =
    useState(null);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [isListening, setIsListening] =
    useState(false);

  const [recognitionResult, setRecognitionResult] =
    useState("");

  const [recognitionSupported, setRecognitionSupported] =
    useState(true);

  const [listeningWord, setListeningWord] =
    useState(null);

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredVocabulary = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vocabulary.filter((item) => {
      const categoryMatch =
        activeCategory === "all" ||
        item.category === activeCategory;

      const searchMatch =
        !query ||
        item.french.toLowerCase().includes(query) ||
        item.english.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  /* =======================================================
     PRACTICE OPTIONS
     ======================================================= */

  const currentPracticeWord =
    practiceWords[practiceIndex];

  const practiceOptions = useMemo(() => {
    if (!currentPracticeWord) return [];

    const others = vocabulary
      .filter(
        (item) =>
          item.id !== currentPracticeWord.id
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return [
      currentPracticeWord,
      ...others,
    ].sort(() => Math.random() - 0.5);
  }, [currentPracticeWord]);

  /* =======================================================
     SPEECH RECOGNITION
     ======================================================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    }
  }, []);

  const startRecognition = (word) => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    window.speechSynthesis.cancel();

    const recognition =
      new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setListeningWord(word);
    setRecognitionResult("");
    setIsListening(true);

    recognition.onresult = (event) => {
      const result =
        event.results[0][0].transcript;

      setRecognitionResult(result);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setRecognitionResult(
        "Could not recognize your voice."
      );
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  /* =======================================================
     PRACTICE
     ======================================================= */

  const startPractice = () => {
    const shuffled = [...filteredVocabulary]
      .sort(() => Math.random() - 0.5);

    setPracticeWords(
      shuffled.length ? shuffled : vocabulary
    );

    setPracticeIndex(0);
    setPracticeScore(0);
    setPracticeStreak(0);
    setPracticeAnswered(false);
    setPracticeCorrect(null);
    setSelectedAnswer(null);
    setMode("practice");
  };

  const answerPractice = (answer) => {
    if (
      practiceAnswered ||
      !currentPracticeWord
    ) {
      return;
    }

    const correct =
      answer.id === currentPracticeWord.id;

    setSelectedAnswer(answer.id);
    setPracticeCorrect(correct);
    setPracticeAnswered(true);

    if (correct) {
      setPracticeScore(
        (score) => score + 1
      );

      setPracticeStreak(
        (streak) => streak + 1
      );
    } else {
      setPracticeStreak(0);
    }
  };

  const nextPracticeQuestion = () => {
    if (
      practiceIndex >=
      practiceWords.length - 1
    ) {
      const reshuffled = [
        ...practiceWords,
      ].sort(() => Math.random() - 0.5);

      setPracticeWords(reshuffled);
      setPracticeIndex(0);
    } else {
      setPracticeIndex(
        (index) => index + 1
      );
    }

    setPracticeAnswered(false);
    setPracticeCorrect(null);
    setSelectedAnswer(null);
  };

  /* =======================================================
     RESET
     ======================================================= */

  const resetEverything = () => {
    window.speechSynthesis?.cancel();

    setActiveCategory("all");
    setSearch("");
    setLanguage("fr");
    setMode("browse");
    setSelectedWord(null);
    setSlowSpeech(false);
    setPracticeWords(vocabulary);
    setPracticeIndex(0);
    setPracticeScore(0);
    setPracticeStreak(0);
    setPracticeAnswered(false);
    setPracticeCorrect(null);
    setSelectedAnswer(null);
    setIsListening(false);
    setRecognitionResult("");
    setListeningWord(null);
  };

  /* =======================================================
     BROWSE MODE
     ======================================================= */

  const renderBrowseMode = () => {
    const sections =
      activeCategory === "all"
        ? categories.filter(
            (category) =>
              category.id !== "all"
          )
        : categories.filter(
            (category) =>
              category.id === activeCategory
          );

    return (
      <section className="vocabulary-content">
        {sections.map((category) => {
          const items =
            filteredVocabulary.filter(
              (item) =>
                item.category ===
                category.id
            );

          if (!items.length) {
            return null;
          }

          return (
            <div
              className="vocabulary-section"
              key={category.id}
            >
              <div className="vocabulary-section__heading">
                <div>
                  <p className="vocabulary-section__eyebrow">
                    {String(
                      categories.findIndex(
                        (item) =>
                          item.id ===
                          category.id
                      ) + 1
                    ).padStart(2, "0")}
                  </p>

                  <h2>
                    {categoryNames[
                      category.id
                    ]}
                  </h2>
                </div>

                <span>
                  {String(
                    items.length
                  ).padStart(2, "0")}{" "}
                  WORDS
                </span>
              </div>

              <div className="vocabulary-grid">
                {items.map((item) => (
                  <button
                    type="button"
                    className="vocabulary-card"
                    key={item.id}
                    onClick={() =>
                      setSelectedWord(item)
                    }
                  >
                    <div className="vocabulary-card__top">
                      <span>
                        {String(
                          item.id
                        ).padStart(2, "0")}
                      </span>

                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.2}
                      />
                    </div>

                    <div className="vocabulary-card__body">
                      <p className="vocabulary-card__primary">
                        {language === "fr"
                          ? item.french
                          : item.english}
                      </p>

                      <p className="vocabulary-card__secondary">
                        {language === "fr"
                          ? item.english
                          : item.french}
                      </p>
                    </div>

                    <div className="vocabulary-card__actions">
                      <span>
                        {language === "fr"
                          ? "FRANÇAIS"
                          : "ENGLISH"}
                      </span>

                      <span
                        className="vocabulary-card__sound"
                        onClick={(event) => {
                          event.stopPropagation();

                          speakFrench(
                            item.french,
                            slowSpeech
                          );
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                            "Enter"
                          ) {
                            event.stopPropagation();

                            speakFrench(
                              item.french,
                              slowSpeech
                            );
                          }
                        }}
                      >
                        <Volume2
                          size={14}
                          strokeWidth={1.4}
                        />
                        LISTEN
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {!filteredVocabulary.length && (
          <div className="vocabulary-empty">
            <p>NO RESULTS</p>

            <h2>
              Aucun mot trouvé.
            </h2>

            <button
              type="button"
              onClick={resetEverything}
            >
              RESET SEARCH
            </button>
          </div>
        )}
      </section>
    );
  };

  /* =======================================================
     LISTENING MODE
     ======================================================= */

  const renderListeningMode = () => {
    const current =
      practiceWords[practiceIndex];

    if (!current) {
      return null;
    }

    return (
      <section className="learning-mode">
        <div className="learning-mode__header">
          <div>
            <p className="learning-mode__eyebrow">
              02 — LISTENING
            </p>

            <h2>
              Listen.
              <br />
              <span>Remember.</span>
            </h2>
          </div>

          <div className="learning-mode__progress">
            {String(
              practiceIndex + 1
            ).padStart(2, "0")}{" "}
            /{" "}
            {String(
              practiceWords.length
            ).padStart(2, "0")}
          </div>
        </div>

        <div className="listening-card">
          <div className="listening-card__number">
            {String(current.id).padStart(
              2,
              "0"
            )}
          </div>

          <div className="listening-card__icon">
            <Volume2
              size={42}
              strokeWidth={1.1}
            />
          </div>

          <p>
            Listen to the French word
            carefully.
          </p>

          <button
            type="button"
            className="big-listen-button"
            onClick={() =>
              speakFrench(
                current.french,
                slowSpeech
              )
            }
          >
            <Play
              size={18}
              fill="currentColor"
            />
            PLAY FRENCH
          </button>

          <button
            type="button"
            className="slow-button"
            onClick={() =>
              setSlowSpeech(
                (value) => !value
              )
            }
          >
            {slowSpeech
              ? "NORMAL SPEED"
              : "🐢 SLOW PRONUNCIATION"}
          </button>

          <div className="listening-card__reveal">
            <p>
              Think you know it?
            </p>

            <button
              type="button"
              onClick={() =>
                setSelectedWord(current)
              }
            >
              REVEAL ANSWER
              <ChevronRight
                size={16}
              />
            </button>
          </div>
        </div>

        <div className="learning-navigation">
          <button
            type="button"
            onClick={() =>
              setPracticeIndex(
                (index) =>
                  index === 0
                    ? practiceWords.length -
                      1
                    : index - 1
              )
            }
          >
            ← PREVIOUS
          </button>

          <button
            type="button"
            onClick={() =>
              setPracticeIndex(
                (index) =>
                  (index + 1) %
                  practiceWords.length
              )
            }
          >
            NEXT →
          </button>
        </div>
      </section>
    );
  };

  /* =======================================================
     PRACTICE MODE
     ======================================================= */

  const renderPracticeMode = () => {
    if (!currentPracticeWord) {
      return null;
    }

    const progress =
      ((practiceIndex + 1) /
        practiceWords.length) *
      100;

    return (
      <section className="learning-mode">
        <div className="practice-topbar">
          <div>
            <p className="learning-mode__eyebrow">
              03 — PRACTICE
            </p>

            <h2>
              Test your
              <br />
              <span>French.</span>
            </h2>
          </div>

          <div className="practice-stats">
            <div>
              <strong>
                {practiceScore}
              </strong>
              <span>SCORE</span>
            </div>

            <div>
              <strong>
                {practiceStreak}
              </strong>
              <span>STREAK</span>
            </div>
          </div>
        </div>

        <div className="practice-progress">
          <div
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="practice-question">
          <p className="practice-question__label">
            WHAT IS THE FRENCH FOR
          </p>

          <h3>
            {currentPracticeWord.english}
          </h3>

          <button
            type="button"
            className="practice-listen"
            onClick={() =>
              speakFrench(
                currentPracticeWord.french,
                slowSpeech
              )
            }
          >
            <Volume2 size={17} />
            HEAR FRENCH
          </button>
        </div>

        <div className="practice-options">
          {practiceOptions.map(
            (option) => {
              const isSelected =
                selectedAnswer ===
                option.id;

              const isCorrect =
                option.id ===
                currentPracticeWord.id;

              let className =
                "practice-option";

              if (
                practiceAnswered &&
                isCorrect
              ) {
                className +=
                  " correct";
              }

              if (
                practiceAnswered &&
                isSelected &&
                !isCorrect
              ) {
                className += " wrong";
              }

              return (
                <button
                  type="button"
                  key={option.id}
                  className={className}
                  onClick={() =>
                    answerPractice(
                      option
                    )
                  }
                  disabled={
                    practiceAnswered
                  }
                >
                  <span>
                    {option.french}
                  </span>

                  {practiceAnswered &&
                    isCorrect && (
                      <Check
                        size={18}
                      />
                    )}
                </button>
              );
            }
          )}
        </div>

        {practiceAnswered && (
          <div
            className={
              practiceCorrect
                ? "practice-feedback correct"
                : "practice-feedback wrong"
            }
          >
            <div>
              {practiceCorrect ? (
                <Check size={24} />
              ) : (
                <X size={24} />
              )}
            </div>

            <div>
              <strong>
                {practiceCorrect
                  ? "Correct!"
                  : "Not quite."}
              </strong>

              <p>
                {currentPracticeWord.french}
              </p>
            </div>

            <button
              type="button"
              onClick={
                nextPracticeQuestion
              }
            >
              NEXT
              <ChevronRight
                size={17}
              />
            </button>
          </div>
        )}
      </section>
    );
  };

  /* =======================================================
     SPEAKING MODE
     ======================================================= */

  const renderSpeakingMode = () => {
    const current =
      listeningWord ||
      vocabulary[
        practiceIndex %
          vocabulary.length
      ];

    return (
      <section className="learning-mode speaking-mode">
        <div className="learning-mode__header">
          <div>
            <p className="learning-mode__eyebrow">
              04 — SPEAKING
            </p>

            <h2>
              Speak
              <br />
              <span>French.</span>
            </h2>
          </div>
        </div>

        {!recognitionSupported ? (
          <div className="unsupported-card">
            <Mic size={34} />

            <h3>
              Voice recognition isn't
              available here.
            </h3>

            <p>
              Try the latest version of
              Chrome or Edge on a device
              with microphone access.
            </p>
          </div>
        ) : (
          <div className="speaking-card">
            <p className="speaking-card__label">
              FIRST, LISTEN
            </p>

            <h3>
              {current.french}
            </h3>

            <button
              type="button"
              className="speaking-listen"
              onClick={() =>
                speakFrench(
                  current.french,
                  slowSpeech
                )
              }
            >
              <Volume2 size={18} />
              LISTEN
            </button>

            <div className="speaking-divider" />

            <p className="speaking-card__label">
              NOW SAY IT
            </p>

            <button
              type="button"
              className={
                isListening
                  ? "microphone-button listening"
                  : "microphone-button"
              }
              onClick={() =>
                startRecognition(current)
              }
            >
              {isListening ? (
                <Pause
                  size={30}
                  fill="currentColor"
                />
              ) : (
                <Mic size={30} />
              )}
            </button>

            <p className="microphone-status">
              {isListening
                ? "Listening..."
                : "Tap the microphone and speak"}
            </p>

            {recognitionResult && (
              <div className="recognition-result">
                <span>
                  I heard:
                </span>

                <strong>
                  {recognitionResult}
                </strong>
              </div>
            )}

            <p className="speaking-disclaimer">
              Speech recognition is used
              for practice and may vary
              by browser and microphone.
            </p>
          </div>
        )}

        <button
          type="button"
          className="next-speaking"
          onClick={() => {
            setListeningWord(null);
            setRecognitionResult("");
            setPracticeIndex(
              (index) =>
                (index + 1) %
                vocabulary.length
            );
          }}
        >
          NEXT WORD
          <ChevronRight size={17} />
        </button>
      </section>
    );
  };

  /* =======================================================
     MAIN
     ======================================================= */

  return (
    <main className="vocabulary-page">
      {/* HERO */}

      <section className="vocabulary-hero">
        <div className="vocabulary-hero__top">
          <p className="vocabulary-eyebrow">
            05 — VOCABULAIRE
          </p>

          <div className="vocabulary-hero__number">
            01 / 05
          </div>
        </div>

        <div className="vocabulary-hero__content">
          <div>
            <p className="vocabulary-kicker">
              Le langage de la table
            </p>

            <h1>
              Parlez
              <br />
              <span>français.</span>
            </h1>
          </div>

          <div className="vocabulary-hero__description">
            <p>
              Learn the essential language
              of French cooking, dining
              and restaurant culture.
            </p>

            <div className="vocabulary-count">
              <strong>50</strong>

              <span>
                WORDS TO DISCOVER
              </span>
            </div>
          </div>
        </div>

        <div className="vocabulary-hero__line" />
      </section>

      {/* MODE SWITCHER */}

      <section className="mode-switcher">
        <div className="mode-switcher__label">
          EXPLORE
        </div>

        <div className="mode-buttons">
          <button
            type="button"
            className={
              mode === "browse"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={() =>
              setMode("browse")
            }
          >
            <Languages size={16} />
            <span>
              VOCABULARY
            </span>
          </button>

          <button
            type="button"
            className={
              mode === "listen"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={() => {
              setMode("listen");
              setPracticeWords(
                [...vocabulary].sort(
                  () =>
                    Math.random() -
                    0.5
                )
              );
              setPracticeIndex(0);
            }}
          >
            <Volume2 size={16} />
            <span>
              LISTEN
            </span>
          </button>

          <button
            type="button"
            className={
              mode === "practice"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={startPractice}
          >
            <Zap size={16} />
            <span>
              PRACTICE
            </span>
          </button>

          <button
            type="button"
            className={
              mode === "speak"
                ? "mode-button active"
                : "mode-button"
            }
            onClick={() =>
              setMode("speak")
            }
          >
            <Mic size={16} />
            <span>
              SPEAK
            </span>
          </button>
        </div>
      </section>

      {/* BROWSE CONTROLS */}

      {mode === "browse" && (
        <section className="vocabulary-controls">
          <div className="vocabulary-filters">
            {categories.map(
              (category) => (
                <button
                  key={category.id}
                  type="button"
                  className={
                    activeCategory ===
                    category.id
                      ? "vocab-filter active"
                      : "vocab-filter"
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.id
                    )
                  }
                >
                  <span className="vocab-filter__desktop">
                    {category.label}
                  </span>

                  <span className="vocab-filter__mobile">
                    {category.french}
                  </span>
                </button>
              )
            )}
          </div>

          <div className="vocabulary-tools">
            <div className="vocabulary-search">
              <Search
                size={16}
                strokeWidth={1.4}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search vocabulary..."
              />
            </div>

            <button
              type="button"
              className={
                slowSpeech
                  ? "vocabulary-tool active"
                  : "vocabulary-tool"
              }
              onClick={() =>
                setSlowSpeech(
                  (value) => !value
                )
              }
            >
              🐢
              <span>
                {slowSpeech
                  ? "SLOW ON"
                  : "SLOW"}
              </span>
            </button>

            <button
              type="button"
              className="vocabulary-tool vocabulary-tool--reset"
              onClick={resetEverything}
            >
              <RotateCcw
                size={15}
                strokeWidth={1.4}
              />
            </button>
          </div>
        </section>
      )}

      {/* MODE CONTENT */}

      {mode === "browse" &&
        renderBrowseMode()}

      {mode === "listen" &&
        renderListeningMode()}

      {mode === "practice" &&
        renderPracticeMode()}

      {mode === "speak" &&
        renderSpeakingMode()}

      {/* FOOTER */}

      <section className="vocabulary-note">
        <div className="vocabulary-note__mark">
          ✦
        </div>

        <div>
          <p className="vocabulary-note__eyebrow">
            À TABLE
          </p>

          <h2>
            Chaque mot ouvre
            <br />
            une nouvelle{" "}
            <span>saveur.</span>
          </h2>
        </div>

        <p className="vocabulary-note__text">
          Learn the words. Hear the
          language. Speak with confidence.
        </p>
      </section>

      {/* WORD MODAL */}

      {selectedWord && (
        <div
          className="vocabulary-modal"
          onClick={() =>
            setSelectedWord(null)
          }
        >
          <div
            className="vocabulary-modal__inner"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="vocabulary-modal__close"
              onClick={() =>
                setSelectedWord(null)
              }
            >
              <X
                size={20}
                strokeWidth={1.3}
              />
            </button>

            <p className="vocabulary-modal__number">
              {String(
                selectedWord.id
              ).padStart(2, "0")}
            </p>

            <p className="vocabulary-modal__label">
              {
                categoryNames[
                  selectedWord.category
                ]
              }
            </p>

            <h2>
              {selectedWord.french}
            </h2>

            <div className="vocabulary-modal__divider" />

            <p>
              {selectedWord.english}
            </p>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() =>
                  speakFrench(
                    selectedWord.french,
                    slowSpeech
                  )
                }
              >
                <Volume2 size={17} />
                LISTEN
              </button>

              <button
                type="button"
                onClick={() =>
                  startRecognition(
                    selectedWord
                  )
                }
              >
                <Mic size={17} />
                SPEAK
              </button>
            </div>

            {recognitionResult && (
              <div className="modal-recognition">
                <span>
                  I heard:
                </span>

                <strong>
                  {recognitionResult}
                </strong>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Vocabulary;