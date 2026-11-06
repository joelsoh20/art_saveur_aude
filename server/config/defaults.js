// Données initiales insérées au premier démarrage
export const DEFAULT_QUESTIONS = [
  ["Quel ingrédient est la base d'une pâte à choux ?", ["Eau, beurre, farine, œufs", "Levure et lait", "Chocolat et crème", "Sucre glace et amandes"], 0],
  ["De quel pays vient le gâteau « Opéra » ?", ["Italie", "France", "Autriche", "Belgique"], 1],
  ["Quel gâteau est composé de génoise, de crème et de fraises ?", ["Le Fraisier", "Le Paris-Brest", "Le Mille-feuille", "Le Baba au rhum"], 0],
  ["Quelle épice parfume traditionnellement le pain d'épices ?", ["Le safran", "Le cumin", "La cannelle", "Le curry"], 2],
  ["Comment appelle-t-on le gâteau en couronne garni de crème pralinée ?", ["Saint-Honoré", "Paris-Brest", "Forêt-Noire", "Religieuse"], 1],
  ["Quel est l'ingrédient principal d'un macaron ?", ["Poudre d'amande", "Farine de blé", "Noix de coco", "Semoule"], 0],
];

// [nom, description, prix, emoji]
export const DEFAULT_CAKES = [
  ['Gâteau aux framboises', 'Génoise légère, crème onctueuse et framboises fraîches.', 'sur commande', '🍓'],
  ['Cupcakes vanille', 'Glaçage crémeux et pépites de chocolat.', 'sur commande', '🧁'],
  ['Choux croustillants', 'Pâte à choux dorée, fourrée à la crème.', 'sur commande', '🥐'],
  ["Gâteaux d'anniversaire", 'Personnalisés selon vos envies et votre thème.', 'sur devis', '🎂'],
  ['Brioche sucrée', 'Moelleuse, légère et parfumée.', 'sur commande', '🍞'],
  ["Pain d'épices", "Miel, cannelle et douceur d'antan.", 'sur commande', '🍪'],
];

// Numéro WhatsApp de la pâtissière (format wa.me : indicatif + numéro, sans « + » ni espaces)
export const DEFAULT_WHATSAPP = '33663615524';
