const regionImage = (filename) =>
  new URL(`../assets/regions/${filename}`, import.meta.url).href;
import { useState } from "react";
import france from "@svg-maps/france.regions";
import "./Regions.css";

const regionContent = {
  "auvergne-rhone-alpes": {
    fr: {
      name: "Auvergne-Rhône-Alpes",
      description:
        "Entre les Alpes et le Massif central, cette région possède une cuisine généreuse et montagnarde. Les fromages, les pommes de terre et les produits locaux occupent une place importante dans ses traditions culinaires.",
      dishes: [
        {
          name: "Tartiflette",
          type: "Plat traditionnel",
          description:
            "Un plat réconfortant à base de pommes de terre, de reblochon, d'oignons et de lardons.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Raclette",
          type: "Spécialité montagnarde",
          description:
            "Du fromage fondu servi avec des pommes de terre, de la charcuterie et des accompagnements simples.",
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Gratin Dauphinois",
          type: "Spécialité régionale",
          description:
            "Des pommes de terre coupées finement et cuites lentement avec de la crème et du lait.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Auvergne-Rhône-Alpes",
      description:
        "Between the Alps and the Massif Central, this region is known for generous mountain cuisine. Cheese, potatoes and local produce play an important role in its culinary traditions.",
      dishes: [
        {
          name: "Tartiflette",
          type: "Traditional dish",
          description:
            "A comforting dish made with potatoes, Reblochon cheese, onions and bacon.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Raclette",
          type: "Mountain specialty",
          description:
            "Melted cheese served with potatoes, cured meats and simple accompaniments.",
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Gratin Dauphinois",
          type: "Regional specialty",
          description:
            "Thinly sliced potatoes slowly baked with cream and milk.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "bourgogne-franche-comte": {
    fr: {
      name: "Bourgogne-Franche-Comté",
      description:
        "Cette région de l'est de la France est célèbre pour ses vins, ses fromages et ses plats mijotés. Sa cuisine associe produits du terroir et traditions gastronomiques anciennes.",
      dishes: [
        {
          name: "Bœuf Bourguignon",
          type: "Plat traditionnel",
          description:
            "Du bœuf mijoté lentement dans du vin rouge avec des champignons, des oignons et des aromates.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Comté",
          type: "Fromage",
          description:
            "Un fromage à pâte pressée cuite, produit dans le massif du Jura et affiné pendant plusieurs mois.",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Coq au Vin",
          type: "Plat traditionnel",
          description:
            "Un plat de volaille longuement mijoté dans une sauce au vin avec des légumes et des aromates.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Bourgogne-Franche-Comté",
      description:
        "This eastern French region is famous for its wines, cheeses and slow-cooked dishes. Its cuisine combines local ingredients with centuries-old culinary traditions.",
      dishes: [
        {
          name: "Boeuf Bourguignon",
          type: "Traditional dish",
          description:
            "Beef slowly cooked in red wine with mushrooms, onions and aromatic herbs.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Comté",
          type: "Cheese",
          description:
            "A firm, cooked cheese produced in the Jura mountains and aged for several months.",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Coq au Vin",
          type: "Traditional dish",
          description:
            "Chicken slowly braised in a wine-based sauce with vegetables and herbs.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  bretagne: {
    fr: {
      name: "Bretagne",
      description:
        "Située à l'ouest de la France, la Bretagne possède une forte identité maritime. Sa cuisine est célèbre pour ses crêpes, ses galettes, ses fruits de mer et son utilisation généreuse du beurre.",
      dishes: [
        {
          name: "Crêpe Bretonne",
          type: "Spécialité",
          description:
            "Une fine crêpe traditionnellement servie avec des garnitures sucrées comme le caramel au beurre salé.",
          image:
            "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Galette Complète",
          type: "Plat traditionnel",
          description:
            "Une galette de sarrasin garnie de jambon, de fromage et d'un œuf.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Kouign-Amann",
          type: "Pâtisserie bretonne",
          description:
            "Une pâtisserie feuilletée et caramélisée préparée avec du beurre et du sucre.",
          image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Brittany",
      description:
        "Located in western France, Brittany has a strong maritime identity. Its cuisine is famous for crêpes, buckwheat galettes, seafood and generous use of butter.",
      dishes: [
        {
          name: "Breton Crêpe",
          type: "Specialty",
          description:
            "A thin pancake traditionally served with sweet fillings such as salted butter caramel.",
          image:
            "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Galette Complète",
          type: "Traditional dish",
          description:
            "A buckwheat galette filled with ham, cheese and an egg.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Kouign-Amann",
          type: "Breton pastry",
          description:
            "A flaky, caramelized pastry made with generous amounts of butter and sugar.",
          image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "centre-val-de-loire": {
    fr: {
      name: "Centre-Val de Loire",
      description:
        "Au cœur de la France, cette région est connue pour ses châteaux, ses produits agricoles et ses fromages de chèvre. Sa cuisine reflète la richesse du terroir de la vallée de la Loire.",
      dishes: [
        {
          name: "Pithiviers",
          type: "Spécialité",
          description:
            "Une pâtisserie traditionnelle originaire de Pithiviers, généralement préparée avec une crème d'amandes.",
          image:
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Crottin de Chavignol",
          type: "Fromage",
          description:
            "Un petit fromage de chèvre emblématique de la région de Sancerre.",
          image:
            "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Rillettes de Tours",
          type: "Spécialité",
          description:
            "De la viande de porc cuite lentement puis effilochée jusqu'à obtenir une texture fondante.",
          image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Centre-Val de Loire",
      description:
        "At the heart of France, this region is known for its castles, agricultural products and goat cheeses. Its cuisine reflects the rich produce of the Loire Valley.",
      dishes: [
        {
          name: "Pithiviers",
          type: "Specialty",
          description:
            "A traditional pastry from Pithiviers, commonly prepared with an almond cream filling.",
          image:
            "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Crottin de Chavignol",
          type: "Cheese",
          description:
            "A small goat cheese closely associated with the Sancerre area.",
          image:
            "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Rillettes de Tours",
          type: "Specialty",
          description:
            "Pork slowly cooked and shredded until it develops a rich and spreadable texture.",
          image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  corse: {
    fr: {
      name: "Corse",
      description:
        "La Corse possède une cuisine unique influencée par la Méditerranée et ses traditions montagnardes. Les produits locaux, les châtaignes, les fromages et la charcuterie y occupent une place importante.",
      dishes: [
        {
          name: "Fiadone",
          type: "Dessert corse",
          description:
            "Un gâteau traditionnel à base de brocciu, de citron et d'œufs.",
          image:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Brocciu",
          type: "Fromage frais",
          description:
            "Un produit laitier corse traditionnel fabriqué à partir de lait de brebis ou de chèvre.",
          image:
            "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Charcuterie Corse",
          type: "Spécialité",
          description:
            "Une sélection de charcuteries traditionnelles issues principalement du porc corse.",
          image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Corsica",
      description:
        "Corsican cuisine combines Mediterranean influences with mountain traditions. Local produce, chestnuts, cheeses and cured meats play an important role.",
      dishes: [
        {
          name: "Fiadone",
          type: "Corsican dessert",
          description:
            "A traditional cake made with brocciu cheese, lemon and eggs.",
          image:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Brocciu",
          type: "Fresh cheese",
          description:
            "A traditional Corsican dairy product made from sheep's or goat's milk.",
          image:
            "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Corsican Charcuterie",
          type: "Specialty",
          description:
            "A selection of traditional cured meats, particularly associated with Corsican pork.",
          image:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "grand-est": {
    fr: {
      name: "Grand Est",
      description:
        "Le Grand Est rassemble des traditions alsaciennes, lorraines et champenoises. Sa gastronomie est particulièrement connue pour ses plats généreux, ses pâtisseries et ses vins.",
      dishes: [
        {
          name: "Choucroute",
          type: "Plat traditionnel",
          description:
            "Du chou fermenté servi avec différentes viandes, des saucisses et souvent des pommes de terre.",
          image:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Quiche Lorraine",
          type: "Spécialité lorraine",
          description:
            "Une tarte salée garnie d'un appareil aux œufs, à la crème et traditionnellement aux lardons.",
          image:
            "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Bretzel",
          type: "Spécialité alsacienne",
          description:
            "Une pâte levée en forme de nœud, légèrement salée et souvent dégustée à l'apéritif.",
          image:
            "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Grand Est",
      description:
        "Grand Est brings together Alsatian, Lorraine and Champagne traditions. Its gastronomy is known for hearty dishes, pastries and regional wines.",
      dishes: [
        {
          name: "Choucroute",
          type: "Traditional dish",
          description:
            "Fermented cabbage served with various meats, sausages and often potatoes.",
          image:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Quiche Lorraine",
          type: "Lorraine specialty",
          description:
            "A savoury tart filled with eggs, cream and traditionally bacon.",
          image:
            "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Bretzel",
          type: "Alsatian specialty",
          description:
            "A twisted piece of baked dough topped with salt and commonly enjoyed as a snack.",
          image:
            "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "hauts-de-france": {
    fr: {
      name: "Hauts-de-France",
      description:
        "Dans le nord de la France, la cuisine des Hauts-de-France est chaleureuse et généreuse. Elle s'inspire des produits de la mer, des pommes de terre et des traditions flamandes.",
      dishes: [
        {
          name: "Welsh",
          type: "Spécialité du Nord",
          description:
            "Une tranche de pain recouverte de fromage fondu, souvent accompagnée de moutarde et de bière.",
          image:
            "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Moules-Frites",
          type: "Plat traditionnel",
          description:
            "Des moules cuisinées simplement et servies avec des frites croustillantes.",
          image:
            "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Tarte au Maroilles",
          type: "Spécialité",
          description:
            "Une tarte salée généreuse préparée avec le célèbre fromage Maroilles.",
          image:
            "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Hauts-de-France",
      description:
        "In northern France, Hauts-de-France cuisine is warm and generous. It draws on seafood, potatoes and Flemish culinary traditions.",
      dishes: [
        {
          name: "Welsh",
          type: "Northern specialty",
          description:
            "Bread covered with melted cheese, often combined with mustard and beer.",
          image:
            "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Moules-Frites",
          type: "Traditional dish",
          description:
            "Mussels prepared simply and served with crispy French fries.",
          image:
            "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Maroilles Tart",
          type: "Specialty",
          description:
            "A rich savoury tart made with the famous Maroilles cheese.",
          image:
            "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "ile-de-france": {
    fr: {
      name: "Île-de-France",
      description:
        "Autour de Paris, la cuisine d'Île-de-France est marquée par la diversité et l'influence internationale de la capitale. Plusieurs grands classiques de la gastronomie française y sont nés.",
      dishes: [
        {
          name: "Croque-Monsieur",
          type: "Classique parisien",
          description:
            "Un sandwich chaud composé de pain, de jambon et de fromage gratiné.",
          image:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Paris-Brest",
          type: "Pâtisserie",
          description:
            "Une pâtisserie en forme de couronne garnie d'une crème pralinée onctueuse.",
          image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Soupe à l'Oignon",
          type: "Classique français",
          description:
            "Une soupe chaude à base d'oignons caramélisés, généralement servie avec du pain et du fromage gratiné.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Île-de-France",
      description:
        "Around Paris, Île-de-France cuisine reflects the diversity and international influence of the capital. Several famous French classics are strongly associated with the region.",
      dishes: [
        {
          name: "Croque-Monsieur",
          type: "Parisian classic",
          description:
            "A hot sandwich made with bread, ham and melted cheese.",
          image:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Paris-Brest",
          type: "Pastry",
          description:
            "A ring-shaped pastry filled with a rich praline cream.",
          image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "French Onion Soup",
          type: "French classic",
          description:
            "A rich onion soup usually served with bread and melted cheese.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  normandie: {
    fr: {
      name: "Normandie",
      description:
        "La Normandie est célèbre pour ses vergers, ses produits laitiers et ses spécialités de la mer. Le beurre, la crème, les pommes et le cidre sont des éléments essentiels de sa cuisine.",
      dishes: [
        {
          name: "Camembert",
          type: "Fromage",
          description:
            "Un fromage à pâte molle et à croûte fleurie devenu l'un des symboles de la Normandie.",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Tarte Normande",
          type: "Dessert",
          description:
            "Une tarte aux pommes généralement préparée avec une garniture crémeuse.",
          image:
            "https://images.unsplash.com/photo-1562007908-17c67e878c88?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Moules à la Crème",
          type: "Spécialité maritime",
          description:
            "Des moules cuisinées avec une sauce crémeuse inspirée des produits laitiers normands.",
          image:
            "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Normandy",
      description:
        "Normandy is famous for its orchards, dairy products and seafood. Butter, cream, apples and cider are essential elements of its cuisine.",
      dishes: [
        {
          name: "Camembert",
          type: "Cheese",
          description:
            "A soft cheese with a bloomy rind that has become one of Normandy's culinary symbols.",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Norman Apple Tart",
          type: "Dessert",
          description:
            "An apple tart usually prepared with a rich and creamy filling.",
          image:
            "https://images.unsplash.com/photo-1562007908-17c67e878c88?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Creamy Mussels",
          type: "Seafood specialty",
          description:
            "Mussels prepared with a creamy sauce inspired by Normandy's dairy traditions.",
          image:
            "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "nouvelle-aquitaine": {
    fr: {
      name: "Nouvelle-Aquitaine",
      description:
        "La plus grande région de France métropolitaine offre une grande diversité gastronomique. Elle est particulièrement connue pour ses vins, ses produits de la mer, ses spécialités du Sud-Ouest et ses pâtisseries.",
      dishes: [
        {
          name: "Canelé",
          type: "Pâtisserie bordelaise",
          description:
            "Un petit gâteau caramélisé à l'extérieur et moelleux à l'intérieur, parfumé à la vanille et au rhum.",
          image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Foie Gras",
          type: "Spécialité du Sud-Ouest",
          description:
            "Une spécialité raffinée préparée à partir de foie gras de canard ou d'oie.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Huîtres du Bassin d'Arcachon",
          type: "Produit de la mer",
          description:
            "Des huîtres réputées provenant du bassin d'Arcachon et traditionnellement dégustées fraîches.",
          image:
            "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Nouvelle-Aquitaine",
      description:
        "The largest region of metropolitan France offers enormous culinary diversity. It is particularly known for wine, seafood, Southwestern specialties and pastries.",
      dishes: [
        {
          name: "Canelé",
          type: "Bordeaux pastry",
          description:
            "A small pastry caramelized on the outside and soft inside, flavored with vanilla and rum.",
          image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Foie Gras",
          type: "Southwestern specialty",
          description:
            "A refined specialty made from duck or goose liver.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Arcachon Bay Oysters",
          type: "Seafood",
          description:
            "Oysters from the Arcachon Bay, traditionally enjoyed fresh.",
          image:
            "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  occitanie: {
    fr: {
      name: "Occitanie",
      description:
        "Du littoral méditerranéen aux Pyrénées, l'Occitanie possède une cuisine riche et variée. Les légumineuses, les viandes, les poissons, l'huile d'olive et les herbes méditerranéennes y sont très présents.",
      dishes: [
        {
          name: "Cassoulet",
          type: "Plat traditionnel",
          description:
            "Un plat mijoté à base de haricots blancs et de différentes viandes, emblématique du Sud-Ouest.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Tielle",
          type: "Spécialité méditerranéenne",
          description:
            "Une tourte originaire de Sète, traditionnellement garnie de poulpe et d'une sauce tomate épicée.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Brandade de Morue",
          type: "Spécialité",
          description:
            "Une préparation crémeuse à base de morue, d'huile d'olive et de pommes de terre.",
          image:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Occitanie",
      description:
        "From the Mediterranean coast to the Pyrenees, Occitanie has a rich and varied cuisine. Legumes, meats, fish, olive oil and Mediterranean herbs are widely used.",
      dishes: [
        {
          name: "Cassoulet",
          type: "Traditional dish",
          description:
            "A slow-cooked dish made with white beans and several types of meat, famous throughout southwestern France.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Tielle",
          type: "Mediterranean specialty",
          description:
            "A pie from Sète traditionally filled with octopus and a spicy tomato sauce.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Brandade de Morue",
          type: "Specialty",
          description:
            "A creamy preparation made with salted cod, olive oil and potatoes.",
          image:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "pays-de-la-loire": {
    fr: {
      name: "Pays de la Loire",
      description:
        "Située sur la façade atlantique, cette région combine produits de la mer, traditions de la vallée de la Loire et spécialités sucrées. Nantes et les villes côtières jouent un rôle important dans son identité culinaire.",
      dishes: [
        {
          name: "Gâteau Nantais",
          type: "Dessert",
          description:
            "Un gâteau moelleux aux amandes, traditionnellement parfumé au rhum et recouvert d'un glaçage.",
          image:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Beurre Blanc",
          type: "Sauce traditionnelle",
          description:
            "Une sauce riche et crémeuse préparée avec du beurre et une réduction d'échalotes et de vin blanc.",
          image:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Curé Nantais",
          type: "Fromage",
          description:
            "Un fromage au lait de vache traditionnellement produit dans la région nantaise.",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Pays de la Loire",
      description:
        "Located along the Atlantic coast, this region combines seafood, Loire Valley traditions and sweet specialties. Nantes and the coastal towns strongly influence its culinary identity.",
      dishes: [
        {
          name: "Gâteau Nantais",
          type: "Dessert",
          description:
            "A moist almond cake traditionally flavored with rum and covered with icing.",
          image:
            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Beurre Blanc",
          type: "Traditional sauce",
          description:
            "A rich and creamy sauce made with butter and a reduction of shallots and white wine.",
          image:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Curé Nantais",
          type: "Cheese",
          description:
            "A traditional cow's milk cheese produced around the Nantes area.",
          image:
            "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },

  "provence-alpes-cote-d-azur": {
    fr: {
      name: "Provence-Alpes-Côte d'Azur",
      description:
        "Dans le sud-est de la France, la cuisine est profondément méditerranéenne. L'huile d'olive, les tomates, les herbes aromatiques, les légumes et les poissons sont au cœur de nombreuses recettes.",
      dishes: [
        {
          name: "Ratatouille",
          type: "Plat provençal",
          description:
            "Un mélange mijoté de légumes méditerranéens comme l'aubergine, la courgette, la tomate et le poivron.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Bouillabaisse",
          type: "Spécialité de Marseille",
          description:
            "Une soupe et un plat de poissons traditionnellement associés à la ville de Marseille.",
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Pissaladière",
          type: "Spécialité niçoise",
          description:
            "Une tarte salée garnie d'oignons fondants, d'anchois et d'olives noires.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },

    en: {
      name: "Provence-Alpes-Côte d'Azur",
      description:
        "In southeastern France, cuisine is deeply Mediterranean. Olive oil, tomatoes, aromatic herbs, vegetables and fish are central to many traditional recipes.",
      dishes: [
        {
          name: "Ratatouille",
          type: "Provençal dish",
          description:
            "A slow-cooked mixture of Mediterranean vegetables such as eggplant, zucchini, tomatoes and peppers.",
          image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Bouillabaisse",
          type: "Marseille specialty",
          description:
            "A traditional fish soup and dish strongly associated with the city of Marseille.",
          image:
            "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80",
        },
        {
          name: "Pissaladière",
          type: "Niçoise specialty",
          description:
            "A savoury tart topped with slow-cooked onions, anchovies and black olives.",
          image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
        },
      ],
    },
  },
};
const localDishImages = {
  "Tartiflette": "auvergne-tartiflette.jpg",
  "Raclette": "auvergne-raclette.jpg",
  "Gratin Dauphinois": "auvergne-gratin-dauphinois.jpg",

  "Bœuf Bourguignon": "bourgogne-boeuf-bourguignon.jpg",
  "Boeuf Bourguignon": "bourgogne-boeuf-bourguignon.jpg",
  "Comté": "bourgogne-comte.jpg",
  "Coq au Vin": "bourgogne-coq-au-vin.jpg",

  "Crêpe Bretonne": "bretagne-crepe.jpg",
  "Breton Crêpe": "bretagne-crepe.jpg",
  "Galette Complète": "bretagne-galette-complete.jpg",
  "Kouign-Amann": "bretagne-kouign-amann.jpg",

  "Pithiviers": "centre-pithiviers.jpg",
  "Crottin de Chavignol": "centre-crottin-chavignol.jpg",
  "Rillettes de Tours": "centre-rillettes-tours.jpg",

  "Fiadone": "corse-fiadone.jpg",
  "Brocciu": "corse-brocciu.jpg",
  "Charcuterie Corse": "corse-charcuterie.jpg",
  "Corsican Charcuterie": "corse-charcuterie.jpg",

  "Choucroute": "grand-est-choucroute.jpg",
  "Quiche Lorraine": "grand-est-quiche-lorraine.jpg",
  "Bretzel": "grand-est-bretzel.jpg",

  "Welsh": "hauts-welsh.jpg",
  "Moules-Frites": "hauts-moules-frites.jpg",
  "Tarte au Maroilles": "hauts-tarte-maroilles.jpg",
  "Maroilles Tart": "hauts-tarte-maroilles.jpg",

  "Croque-Monsieur": "iledefrance-croque-monsieur.jpg",
  "Paris-Brest": "iledefrance-paris-brest.jpg",
  "Soupe à l'Oignon": "iledefrance-french-onion-soup.jpg",
  "French Onion Soup": "iledefrance-french-onion-soup.jpg",

  "Camembert": "normandie-camembert.jpg",
  "Tarte Normande": "normandie-tarte-normande.jpg",
  "Norman Apple Tart": "normandie-tarte-normande.jpg",
  "Moules à la Crème": "normandie-moules-creme.jpg",
  "Creamy Mussels": "normandie-moules-creme.jpg",

  "Canelé": "nouvelle-aquitaine-canele.jpg",
  "Foie Gras": "nouvelle-aquitaine-foie-gras.jpg",
  "Huîtres du Bassin d'Arcachon": "nouvelle-aquitaine-huitres.jpg",
  "Arcachon Bay Oysters": "nouvelle-aquitaine-huitres.jpg",

  "Cassoulet": "occitanie-cassoulet.jpg",
  "Tielle": "occitanie-tielle.jpg",
  "Brandade de Morue": "occitanie-brandade.jpg",

  "Gâteau Nantais": "pays-loire-gateau-nantais.jpg",
  "Beurre Blanc": "pays-loire-beurre-blanc.jpg",
  "Curé Nantais": "pays-loire-cure-nantais.jpg",

  "Ratatouille": "paca-ratatouille.jpg",
  "Bouillabaisse": "paca-bouillabaisse.jpg",
  "Pissaladière": "paca-pissaladiere.jpg",
};

function Regions() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const language =
    document.documentElement.lang === "fr" ? "fr" : "en";

  const handleRegionClick = (region) => {
    setSelectedRegion(region);

    setTimeout(() => {
      document
        .getElementById("region-details")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const scrollToMap = () => {
    document
      .getElementById("regions-map")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const slugifyRegion = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const currentRegion = selectedRegion
  ? regionContent[slugifyRegion(selectedRegion.name)]
  : null;

  const regionText = currentRegion
    ? currentRegion[language]
    : null;

  return (
    <main className="regions-page">
      {/* HERO */}
      <section className="regions-hero">
        <span className="regions-eyebrow">
          {language === "fr"
            ? "LA FRANCE À TABLE"
            : "FRANCE AT THE TABLE"}
        </span>

        <h1>
          {language === "fr"
            ? "Une cuisine, treize régions."
            : "One cuisine, thirteen regions."}
        </h1>

        <p>
          {language === "fr"
            ? "La cuisine française ne se résume pas à une seule tradition. Chaque région possède ses produits, ses recettes et son identité. Explorez la carte et découvrez ce qui rend chaque terroir unique."
            : "French cuisine is not defined by a single tradition. Every region has its own ingredients, recipes and identity. Explore the map and discover what makes each region unique."}
        </p>
      </section>

      {/* MAP */}
      <section
        className="regions-map-section"
        id="regions-map"
      >
        <div className="regions-section-heading">
          <div>
            <span>
              {language === "fr"
                ? "CARTE INTERACTIVE"
                : "INTERACTIVE MAP"}
            </span>

            <h2>
              {language === "fr"
                ? "Choisissez une région"
                : "Choose a region"}
            </h2>
          </div>

          <p>
            {language === "fr"
              ? "Survolez une région pour la mettre en évidence. Cliquez pour découvrir ses spécialités culinaires."
              : "Hover over a region to highlight it. Click to discover its culinary specialties."}
          </p>
        </div>

        <div className="france-map-wrapper">
          <svg
            className="france-map"
            viewBox={france.viewBox}
            role="img"
            aria-label={
              language === "fr"
                ? "Carte interactive des régions françaises"
                : "Interactive map of French regions"
            }
          >
            {france.locations.map((region) => {
              const isHovered =
                hoveredRegion === region.id;

              const isSelected =
                selectedRegion?.id === region.id;

              return (
                <path
                  key={region.id}
                  d={region.path}
                  className={`region-path ${
                    isHovered || isSelected ? "active" : ""
                  }`}
                  onMouseEnter={() =>
                    setHoveredRegion(region.id)
                  }
                  onMouseLeave={() =>
                    setHoveredRegion(null)
                  }
                  onClick={() =>
                    handleRegionClick(region)
                  }
                  role="button"
                  tabIndex="0"
                  aria-label={region.name}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      handleRegionClick(region);
                    }
                  }}
                />
              );
            })}
          </svg>

          <div className="map-hint">
            <span className="map-hint-dot" />

            {hoveredRegion
              ? france.locations.find(
                  (region) =>
                    region.id === hoveredRegion
                )?.name
              : language === "fr"
                ? "Survolez une région"
                : "Hover over a region"}
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section
        className="region-details"
        id="region-details"
      >
        {!regionText ? (
          <div className="region-empty">
            <span className="region-empty-number">
              01
            </span>

            <h2>
              {language === "fr"
                ? "Chaque région raconte une histoire."
                : "Every region tells a story."}
            </h2>

            <p>
              {language === "fr"
                ? "Des montagnes des Alpes aux côtes méditerranéennes, les produits et les traditions changent avec le paysage. Choisissez une région sur la carte pour découvrir les saveurs qui la représentent."
                : "From the Alps to the Mediterranean coast, ingredients and traditions change with the landscape. Choose a region on the map to discover the flavours that represent it."}
            </p>
          </div>
        ) : (
          <>
            <div className="selected-region-header">
              <span>
                {language === "fr"
                  ? "RÉGION SÉLECTIONNÉE"
                  : "SELECTED REGION"}
              </span>

              <h2>{regionText.name}</h2>

              <p>{regionText.description}</p>
            </div>

            <div className="region-dishes">
              {regionText.dishes.map((dish) => (
                <article
                  className="region-dish-card"
                  key={dish.name}
                >
                  <img
  src={
    localDishImages[dish.name]
      ? new URL(
          `../assets/regions/${localDishImages[dish.name]}`,
          import.meta.url
        ).href
      : dish.image
  }
  alt={dish.name}
/>

                  <div className="dish-overlay" />

                  <div className="dish-content">
                    <span>{dish.type}</span>

                    <h3>{dish.name}</h3>

                    <p>{dish.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="back-to-map-wrapper">
              <button
                className="back-to-map"
                onClick={scrollToMap}
              >
                ↑{" "}
                {language === "fr"
                  ? "Retour à la carte"
                  : "Back to the map"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Regions;