import medievalImage from "../assets/history/medieval.png";
import renaissanceImage from "../assets/history/renaissance.png";
import modernImage from "../assets/history/modern.png";
import escoffierImage from "../assets/history/escoffier.jpg";
import nouvelleCuisineImage from "../assets/history/nouvelle-cuisine.png";
import todayImage from "../assets/history/today.png";

export const historyData = [
  {
    id: "medieval",
    number: "01",
    years: "500 — 1500",
    image: medievalImage,

    labelFr: "MOYEN ÂGE",
    labelEn: "MIDDLE AGES",

    titleFr: "La cuisine médiévale",
    titleEn: "Medieval Cuisine",

    introFr:
      "Au Moyen Âge, la cuisine française est profondément liée aux saisons, aux récoltes et au statut social.",

    introEn:
      "During the Middle Ages, French cuisine was deeply connected to seasons, harvests and social status.",

    textFr:
      "Les tables riches étaient marquées par les viandes rôties, les sauces complexes et les épices venues de loin. Les livres de cuisine médiévaux témoignent déjà d'une cuisine structurée, tandis que les foyers plus modestes reposaient davantage sur les céréales, les légumes et les soupes.",

    textEn:
      "Wealthy tables featured roasted meats, elaborate sauces and spices brought from distant lands. Medieval cookbooks already reveal a structured culinary tradition, while ordinary households relied more heavily on grains, vegetables and soups.",

    factFr: "Le Viandier de Taillevent devient l'un des grands textes culinaires du Moyen Âge.",
    factEn: "Le Viandier by Taillevent became one of the major culinary texts of the Middle Ages.",

    keywordsFr: ["Épices", "Rôtis", "Sauces", "Festins"],
    keywordsEn: ["Spices", "Roasts", "Sauces", "Feasts"],

    accent: "#b88a5a",
  },

  {
    id: "renaissance",
    number: "02",
    years: "1500 — 1650",
    image: renaissanceImage,

    labelFr: "RENAISSANCE",
    labelEn: "RENAISSANCE",

    titleFr: "La naissance de la haute cuisine",
    titleEn: "The Birth of Haute Cuisine",

    introFr:
      "La Renaissance transforme les goûts de la cour française et apporte de nouvelles influences européennes.",

    introEn:
      "The Renaissance transformed the tastes of the French court and introduced new European influences.",

    textFr:
      "Les échanges avec l'Italie contribuent à faire évoluer les techniques, les présentations et les habitudes de table. Les repas deviennent progressivement plus raffinés, avec une attention croissante portée à l'équilibre des saveurs et à l'apparence des plats.",

    textEn:
      "Cultural exchanges with Italy helped transform techniques, presentation and dining habits. Meals gradually became more refined, with increasing attention given to balance, flavor and visual presentation.",

    factFr:
      "Les influences italiennes participent à l'évolution des techniques et des goûts de la cuisine française.",

    factEn:
      "Italian influences contributed to the evolution of French culinary techniques and tastes.",

    keywordsFr: ["Cour", "Élégance", "Influence italienne", "Techniques"],
    keywordsEn: ["Court", "Elegance", "Italian influence", "Techniques"],

    accent: "#a67c52",
  },

  {
    id: "modern",
    number: "03",
    years: "1650 — 1789",
    image: modernImage,

    labelFr: "L'ANCIEN RÉGIME",
    labelEn: "THE ANCIEN RÉGIME",

    titleFr: "La cuisine devient un art",
    titleEn: "Cuisine Becomes an Art",

    introFr:
      "À la cour et dans les grandes maisons, la cuisine française se codifie et gagne une nouvelle sophistication.",

    introEn:
      "At court and in wealthy households, French cuisine became increasingly codified and sophisticated.",

    textFr:
      "Les chefs développent des méthodes plus précises et les sauces prennent une place centrale. Les ouvrages culinaires commencent à formaliser les recettes et les techniques. Cette période pose les fondations de la cuisine classique française.",

    textEn:
      "Chefs developed increasingly precise methods, while sauces became central to French cooking. Culinary books began formalizing recipes and techniques, laying foundations for classical French cuisine.",

    factFr:
      "Le Cuisinier François de La Varenne, publié en 1651, marque une étape importante dans la codification de la cuisine française.",

    factEn:
      "La Varenne's Le Cuisinier François, published in 1651, was an important milestone in the codification of French cuisine.",

    keywordsFr: ["Sauces", "Codification", "Cour", "Cuisine classique"],
    keywordsEn: ["Sauces", "Codification", "Court", "Classical cuisine"],

    accent: "#9d6b4f",
  },

  {
    id: "escoffier",
    number: "04",
    years: "1880 — 1930",
    image: escoffierImage,

    labelFr: "ESCOFFIER",
    labelEn: "ESCOFFIER",

    titleFr: "La cuisine moderne",
    titleEn: "Modern French Cuisine",

    introFr:
      "Auguste Escoffier réorganise la cuisine professionnelle et contribue à créer le modèle du restaurant moderne.",

    introEn:
      "Auguste Escoffier reorganized professional kitchens and helped shape the modern restaurant model.",

    textFr:
      "Escoffier simplifie et structure les méthodes de travail. Il popularise le système de brigade, organise les postes en cuisine et contribue à rendre les techniques françaises plus cohérentes et transmissibles. Son influence dépasse largement la France.",

    textEn:
      "Escoffier simplified and structured professional kitchen work. He popularized the brigade system, organized kitchen stations and helped make French techniques more systematic and teachable. His influence extended far beyond France.",

    factFr:
      "Le Guide Culinaire, publié en 1903, devient une référence majeure pour les professionnels.",

    factEn:
      "Le Guide Culinaire, published in 1903, became a major reference for professional chefs.",

    keywordsFr: ["Escoffier", "Brigade", "Restaurants", "Organisation"],
    keywordsEn: ["Escoffier", "Brigade", "Restaurants", "Organization"],

    accent: "#c49a6c",
  },

  {
    id: "nouvelle",
    number: "05",
    years: "1960 — 1980",
    image: nouvelleCuisineImage,

    labelFr: "NOUVELLE CUISINE",
    labelEn: "NOUVELLE CUISINE",

    titleFr: "Une nouvelle philosophie",
    titleEn: "A New Philosophy",

    introFr:
      "Une nouvelle génération de chefs remet en question les règles de la cuisine classique.",

    introEn:
      "A new generation of chefs challenged the rules of classical French cuisine.",

    textFr:
      "Les produits frais, les cuissons plus courtes, les sauces plus légères et les présentations plus libres deviennent essentiels. La cuisine commence à mettre davantage en valeur le produit lui-même plutôt que la complexité technique.",

    textEn:
      "Fresh ingredients, shorter cooking times, lighter sauces and freer presentation became increasingly important. Cuisine began placing greater emphasis on the ingredient itself rather than technical complexity.",

    factFr:
      "Paul Bocuse devient l'une des figures emblématiques de cette transformation culinaire.",

    factEn:
      "Paul Bocuse became one of the emblematic figures of this culinary transformation.",

    keywordsFr: ["Fraîcheur", "Légèreté", "Créativité", "Produit"],
    keywordsEn: ["Freshness", "Lightness", "Creativity", "Ingredients"],

    accent: "#c37a62",
  },

  {
    id: "today",
    number: "06",
    years: "1980 — Aujourd'hui",
    image: todayImage,

    labelFr: "AUJOURD'HUI",
    labelEn: "TODAY",

    titleFr: "La gastronomie française aujourd'hui",
    titleEn: "French Gastronomy Today",

    introFr:
      "Aujourd'hui, la cuisine française continue d'évoluer tout en conservant un lien fort avec son patrimoine.",

    introEn:
      "Today, French cuisine continues to evolve while maintaining a strong connection to its heritage.",

    textFr:
      "Les chefs contemporains mélangent traditions régionales, techniques modernes et influences internationales. Le terroir, les producteurs locaux, la saisonnalité et la durabilité occupent une place de plus en plus importante dans la gastronomie française.",

    textEn:
      "Contemporary chefs combine regional traditions, modern techniques and international influences. Terroir, local producers, seasonality and sustainability play an increasingly important role in French gastronomy.",

    factFr:
      "En 2010, le repas gastronomique des Français est inscrit au patrimoine culturel immatériel de l'UNESCO.",

    factEn:
      "In 2010, the gastronomic meal of the French was inscribed on UNESCO's Intangible Cultural Heritage list.",

    keywordsFr: ["Terroir", "Durabilité", "Tradition", "Innovation"],
    keywordsEn: ["Terroir", "Sustainability", "Tradition", "Innovation"],

    accent: "#d19a70",
  },
];