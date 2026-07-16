import { Category, MenuItem, RestaurantConfig } from '../types/menu';

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: "L'Ambroisie",
  tagline: 'Haute Gastronomie & Sensory Poetry',
  description:
    'A sanctuary of culinary excellence, where centuries-old French tradition meets modern mastercraft in an atmosphere of ultimate elegance.',
  address: '9 Place des Vosges, 75004 Paris',
  phone: '+33 1 42 78 51 45',
  hours: 'Tuesday – Saturday: 12:00 PM – 2:30 PM, 8:00 PM – 10:30 PM',
  currency: {
    code: 'USD',
    symbol: '$',
  },
  fees: {
    taxRate: 0.08, // 8% State Tax
    serviceChargeRate: 0.12, // 12% Discretionary Service Charge
  },
};

export const CATEGORIES: Category[] = [
  {
    id: 'chef-specials',
    name: "Chef's Specials",
    icon: '✨',
    description: 'Exquisite culinary creations curated by our Executive Chef.',
  },
  {
    id: 'appetizers',
    name: 'Appetizers',
    icon: '🍽️',
    description: 'Delicate starters to awaken your palate.',
  },
  {
    id: 'mains',
    name: 'Mains',
    icon: '🥩',
    description: 'Symphony of premium proteins and seasonal harvests.',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    icon: '🍰',
    description: 'Decadent pastry masterpieces crafted with precision.',
  },
  {
    id: 'drinks',
    name: 'Wine & Spirits',
    icon: '🍷',
    description: 'World-class vintages and artisanal cocktail elixirs.',
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // CHEF'S SPECIALS
  {
    id: 'special-lobster',
    name: 'Truffle Butter Lobster Tail',
    description:
      'Slow butter-poached Maine lobster tail, winter black truffle emulsion, sunchoke puree, micro chervil.',
    price: 68,
    image: '/images/special-lobster.webp',
    dietary: ['chef-special', 'gluten-free'],
    allergens: ['Shellfish', 'Dairy'],
    customizations: [
      {
        id: 'lobster-size',
        name: 'Portion Size',
        required: true,
        maxChoices: 1,
        choices: [
          { id: 'size-std', name: 'Standard (6oz)' },
          { id: 'size-lg', name: 'Grand (9oz)', priceAdjustment: 22 },
        ],
      },
    ],
  },
  {
    id: 'special-wagyu',
    name: 'A5 Miyazaki Wagyu Filet',
    description:
      'Pan-seared A5 Miyazaki Wagyu, roasted bone marrow reduction, wild chanterelles, smoked garlic confit, gold leaf.',
    price: 95,
    image: '/images/special-wagyu.webp',
    dietary: ['chef-special'],
    allergens: ['Dairy'],
    customizations: [
      {
        id: 'wagyu-doneness',
        name: 'Doneness',
        required: true,
        maxChoices: 1,
        choices: [
          { id: 'done-rare', name: 'Rare' },
          { id: 'done-medrare', name: 'Medium Rare' },
          { id: 'done-med', name: 'Medium' },
        ],
      },
      {
        id: 'wagyu-addons',
        name: 'Luxurious Add-ons',
        required: false,
        maxChoices: 2,
        choices: [
          { id: 'add-truffle', name: 'Shaved White Truffle (5g)', priceAdjustment: 25 },
          { id: 'add-foie', name: 'Foie Gras Rossini', priceAdjustment: 30 },
        ],
      },
    ],
  },

  // APPETIZERS
  {
    id: 'app-beet-tartare',
    name: 'Heirloom Beet Tartare',
    description:
      'Roasted organic beets, whipped local goat cheese, pistachio crumble, aged balsamic pearls, sourdough crisps.',
    price: 22,
    image: '/images/app-beet.webp',
    dietary: ['vegetarian', 'gluten-free'],
    allergens: ['Nuts', 'Dairy'],
    customizations: [
      {
        id: 'beet-dairy',
        name: 'Dietary Adjustment',
        required: false,
        maxChoices: 1,
        choices: [{ id: 'beet-vegan', name: 'Substitute with Cashew Cheese (Vegan)' }],
      },
    ],
  },
  {
    id: 'app-hamachi',
    name: 'Yuzu Hamachi Crudo',
    description:
      'Sliced yellowtail sashimi, yuzu-kosho vinaigrette, avocado mousse, pickled finger lime, sea grapes.',
    price: 28,
    image: '/images/app-hamachi.webp',
    dietary: ['gluten-free', 'dairy-free'],
    allergens: ['Fish'],
  },

  // MAINS
  {
    id: 'main-seabass',
    name: 'Line-Caught Chilean Seabass',
    description:
      'Pan-seared Chilean seabass, artichoke barigoule, saffron-infused shellfish broth, baby fennel, sea herbs.',
    price: 48,
    image: '/images/main-seabass.webp',
    dietary: ['gluten-free'],
    allergens: ['Fish', 'Shellfish'],
  },
  {
    id: 'main-risotto',
    name: 'Wild Forest Mushroom Risotto',
    description:
      'Aged Carnaroli rice, wild porcini and chanterelle ragout, 36-month Parmigiano Reggiano, truffle froth.',
    price: 38,
    image: '/images/main-risotto.webp',
    dietary: ['vegetarian', 'gluten-free'],
    allergens: ['Dairy'],
    customizations: [
      {
        id: 'risotto-style',
        name: 'Preparation Style',
        required: false,
        maxChoices: 1,
        choices: [{ id: 'style-vegan', name: 'Make Vegan (Dairy-Free Cheese & Butter)' }],
      },
    ],
  },

  // DESSERTS
  {
    id: 'dessert-souffle',
    name: '70% Valrhona Chocolate Soufflé',
    description:
      'Warm Guanaja chocolate soufflé, Madagascar vanilla bean gelato, fleur de sel caramel pour-over.',
    price: 18,
    image: '/images/dessert-souffle.webp',
    dietary: ['vegetarian'],
    allergens: ['Dairy', 'Eggs'],
    customizations: [
      {
        id: 'souffle-gelato',
        name: 'Gelato Selection',
        required: true,
        maxChoices: 1,
        choices: [
          { id: 'gelato-vanilla', name: 'Madagascar Vanilla Bean' },
          { id: 'gelato-pistachio', name: 'Pistachio Praliné', priceAdjustment: 2 },
          { id: 'gelato-caramel', name: 'Salted Butter Caramel' },
        ],
      },
    ],
  },
  {
    id: 'dessert-lemon-tart',
    name: 'Meyer Lemon Verbena Tart',
    description:
      'Crisp Sablé Breton, Meyer lemon curd, verbena meringue, candied lemon zest, wild raspberry coulis.',
    price: 16,
    image: '/images/dessert-lemon.webp',
    dietary: ['vegetarian'],
    allergens: ['Dairy', 'Eggs', 'Gluten'],
  },

  // DRINKS
  {
    id: 'drink-elixir',
    name: 'The Golden Elixir Cocktail',
    description:
      'Clase Azul Reposado tequila, saffron-infused orange honey, fresh key lime juice, Grand Marnier, 24k gold leaf.',
    price: 24,
    image: '/images/drink-elixir.webp',
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    allergens: [],
  },
  {
    id: 'drink-barolo',
    name: "Barolo DOCG 'Bricco Rocche' 2018",
    description:
      'Elegant Piedmontese Nebbiolo, complex notes of dried roses, black truffle, and dark cherries. Rich, lingering finish.',
    price: 32,
    image: '/images/drink-barolo.webp',
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    allergens: ['Sulphites'],
    customizations: [
      {
        id: 'barolo-pour',
        name: 'Serving Size',
        required: true,
        maxChoices: 1,
        choices: [
          { id: 'pour-glass', name: 'Glass (5oz)' },
          { id: 'pour-carafe', name: 'Carafe (375ml)', priceAdjustment: 58 },
          { id: 'pour-bottle', name: 'Full Bottle (750ml)', priceAdjustment: 228 },
        ],
      },
    ],
  },
];
