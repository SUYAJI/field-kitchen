/*
 * Field Kitchen ingredient data.
 *
 * Every displayed fact carries one of three provenance levels:
 * - sourced: supported by a specific reference in SOURCES
 * - curated: an explicitly designed culinary recommendation
 * - assumption: provisional prototype information (avoided wherever possible)
 *
 * Fields that could not be responsibly sourced are left null rather than
 * filled with modeled values. See docs/data-model.md.
 */

export type Provenance = 'sourced' | 'curated' | 'assumption';

export const PROVENANCE_LABELS: Record<Provenance, string> = {
  sourced: 'Sourced fact',
  curated: 'Curated recommendation',
  assumption: 'Prototype assumption',
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export const MONTH_INITIALS = MONTHS.map((month) => month[0]);

export type SourceKind = 'nutrition' | 'availability' | 'culinary' | 'handling';

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: SourceKind;
  /** What this source is used to support, in plain language. */
  supports: string;
  accessed: string;
}

const ACCESSED = '2026-11-14';

export const SOURCES = {
  'usda-fdc': {
    id: 'usda-fdc',
    title: 'FoodData Central (SR Legacy records)',
    publisher: 'U.S. Department of Agriculture, Agricultural Research Service',
    url: 'https://fdc.nal.usda.gov/',
    kind: 'nutrition',
    supports: 'Energy, protein, fiber and vitamin C per 100 g, for the specific food record linked on each ingredient.',
    accessed: ACCESSED,
  },
  'ode-availability': {
    id: 'ode-availability',
    title: 'Oregon Fruit & Vegetable Availability Chart (Oregon Harvest for Schools, updated March 2017)',
    publisher: 'Oregon Department of Education; chart adapted from the Agri-business Council of Oregon',
    url: 'https://www.oregon.gov/ode/students-and-family/childnutrition/F2S/Documents/ohfs_instructions.pdf',
    kind: 'availability',
    supports: 'Months in which Oregon-grown product is marked as available. The chart does not distinguish fresh harvest from storage.',
    accessed: ACCESSED,
  },
  'wiki-colcannon': {
    id: 'wiki-colcannon',
    title: 'Colcannon',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Colcannon',
    kind: 'culinary',
    supports: 'Colcannon is a traditional Irish dish of mashed potatoes with cabbage, butter and milk; leeks or onions are recognised additions.',
    accessed: ACCESSED,
  },
  'wiki-leek-soup': {
    id: 'wiki-leek-soup',
    title: 'Leek soup',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Leek_soup',
    kind: 'culinary',
    supports: 'Leek soup is leeks simmered in water or stock, often with potatoes, and may be enriched with cream or butter.',
    accessed: ACCESSED,
  },
  'wiki-vichyssoise': {
    id: 'wiki-vichyssoise',
    title: 'Vichyssoise',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Vichyssoise',
    kind: 'culinary',
    supports: 'Vichyssoise is a chilled purée of leeks, potatoes, onions and cream.',
    accessed: ACCESSED,
  },
  'wiki-duxelles': {
    id: 'wiki-duxelles',
    title: 'Duxelles',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Duxelles',
    kind: 'culinary',
    supports: 'Duxelles is minced mushrooms, onions and herbs such as thyme or parsley, sautéed in butter and reduced to a paste.',
    accessed: ACCESSED,
  },
  'wiki-red-cabbage': {
    id: 'wiki-red-cabbage',
    title: 'Red cabbage',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Red_cabbage',
    kind: 'culinary',
    supports: 'Apples and a little vinegar are often added to cooked red cabbage for a sweet-and-sour taste; acid helps it keep its red colour.',
    accessed: ACCESSED,
  },
  'wiki-crumble': {
    id: 'wiki-crumble',
    title: 'Crumble',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Crumble',
    kind: 'culinary',
    supports: 'A crumble or crisp is baked fruit under a flour, sugar and fat topping; apple and rhubarb are popular fillings, and oats or nuts are common additions.',
    accessed: ACCESSED,
  },
  'wiki-shrub': {
    id: 'wiki-shrub',
    title: 'Shrub (drink)',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Shrub_(drink)',
    kind: 'culinary',
    supports: 'A shrub is a vinegared fruit syrup (drinking vinegar) mixed with water, carbonated water or spirits, and may be infused with herbs.',
    accessed: ACCESSED,
  },
  'wiki-gremolata': {
    id: 'wiki-gremolata',
    title: 'Gremolata',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Gremolata',
    kind: 'culinary',
    supports: 'Gremolata is chopped parsley, lemon zest and garlic, the standard accompaniment to ossobuco.',
    accessed: ACCESSED,
  },
  'wiki-nettle-soup': {
    id: 'wiki-nettle-soup',
    title: 'Nettle soup',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Nettle_soup',
    kind: 'culinary',
    supports: 'Nettle soup is made from young stinging nettles and is eaten mainly in spring and early summer.',
    accessed: ACCESSED,
  },
  'wiki-urtica': {
    id: 'wiki-urtica',
    title: 'Urtica dioica (stinging nettle)',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Urtica_dioica',
    kind: 'handling',
    supports: 'Soaking stinging nettles in water or cooking them removes the stinging chemicals.',
    accessed: ACCESSED,
  },
  'splendid-fir-syrup': {
    id: 'splendid-fir-syrup',
    title: 'Spruce or Fir Tip Syrup (from Hunter, Angler, Gardener, Cook by Hank Shaw)',
    publisher: 'The Splendid Table',
    url: 'https://www.splendidtable.org/recipes/spruce-or-fir-tip-syrup',
    kind: 'culinary',
    supports: 'Equal volumes of water, sugar and fir or spruce tips; boil sugar and water, steep the tips off the heat, strain and bottle.',
    accessed: ACCESSED,
  },
  'umn-pickling': {
    id: 'umn-pickling',
    title: 'Pickling basics',
    publisher: 'University of Minnesota Extension',
    url: 'https://extension.umn.edu/preserve-your-own-food/pickling-basics',
    kind: 'handling',
    supports: 'Refrigerator pickles are not processed (canned) and are not shelf-stable.',
    accessed: ACCESSED,
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export function getSource(id: SourceId): Source {
  return SOURCES[id];
}

export const INGREDIENT_CATEGORIES = ['Vegetables', 'Fruit', 'Nuts & herbs', 'Specialty & botanicals'] as const;
export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number];

export interface NutritionRecord {
  fdcId: number;
  /** The exact USDA record description, so the food state is visible. */
  description: string;
  energyKcal: number;
  proteinG: number;
  fiberG: number;
  /** null when the USDA record does not report vitamin C. */
  vitaminCMg: number | null;
}

export interface Availability {
  /** Zero-based months (0 = January). */
  months: readonly number[];
  sourceId: SourceId;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  color: string;
  image: string;
  /** Sourced Oregon availability, or null when no source has been verified. */
  availability: Availability | null;
  /** Sourced USDA nutrition record, or null when no matching record exists. */
  nutrition: NutritionRecord | null;
  /** Optional handling or sourcing note shown with the ingredient. */
  note?: string;
}

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=70`;

const ALL_YEAR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
const oregon = (months: readonly number[]): Availability => ({ months, sourceId: 'ode-availability' });

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'potato',
    name: 'Potatoes',
    category: 'Vegetables',
    color: '#c8a165',
    image: unsplash('1518977676601-b53f82aba655'),
    availability: oregon(ALL_YEAR),
    nutrition: { fdcId: 170026, description: 'Potatoes, flesh and skin, raw', energyKcal: 77, proteinG: 2.05, fiberG: 2.1, vitaminCMg: 19.7 },
  },
  {
    id: 'onion',
    name: 'Onions',
    category: 'Vegetables',
    color: '#e0c27a',
    image: unsplash('1741517480859-cc010cff7e6a'),
    availability: oregon([0, 1, 2, 3, 7, 8, 9, 10, 11]),
    nutrition: { fdcId: 170000, description: 'Onions, raw', energyKcal: 40, proteinG: 1.1, fiberG: 1.7, vitaminCMg: 7.4 },
  },
  {
    id: 'leek',
    name: 'Leeks',
    category: 'Vegetables',
    color: '#8fae6b',
    image: unsplash('1753445657216-349e0740f941'),
    availability: null,
    nutrition: { fdcId: 169246, description: 'Leeks, (bulb and lower leaf-portion), raw', energyKcal: 61, proteinG: 1.5, fiberG: 1.8, vitaminCMg: 12 },
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'Vegetables',
    color: '#d9cbb3',
    image: unsplash('1685130064064-b77382b0dbe2'),
    availability: oregon([0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11]),
    nutrition: { fdcId: 169230, description: 'Garlic, raw', energyKcal: 149, proteinG: 6.36, fiberG: 2.1, vitaminCMg: 31.2 },
  },
  {
    id: 'carrot',
    name: 'Carrots',
    category: 'Vegetables',
    color: '#e76f51',
    image: unsplash('1598170845058-32b9d6a5da37'),
    availability: oregon([6, 7, 8, 9, 10, 11]),
    nutrition: { fdcId: 170393, description: 'Carrots, raw', energyKcal: 41, proteinG: 0.93, fiberG: 2.8, vitaminCMg: 5.9 },
  },
  {
    id: 'beet',
    name: 'Beets',
    category: 'Vegetables',
    color: '#8e2c48',
    image: unsplash('1758151748972-6840ed51058a'),
    availability: oregon([6, 7]),
    nutrition: { fdcId: 169145, description: 'Beets, raw', energyKcal: 43, proteinG: 1.61, fiberG: 2.8, vitaminCMg: 4.9 },
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'Vegetables',
    color: '#9cbf7f',
    image: unsplash('1652860213441-6622f9fec77f'),
    availability: oregon([6, 7, 8, 9]),
    nutrition: { fdcId: 169975, description: 'Cabbage, raw', energyKcal: 25, proteinG: 1.28, fiberG: 2.5, vitaminCMg: 36.6 },
    note: 'Green or red. Braised cabbage with apple calls for red cabbage.',
  },
  {
    id: 'kale',
    name: 'Kale',
    category: 'Vegetables',
    color: '#4f7f52',
    image: unsplash('1524179091875-bf99a9a6af57'),
    availability: null,
    nutrition: { fdcId: 168421, description: 'Kale, raw', energyKcal: 35, proteinG: 2.92, fiberG: 4.1, vitaminCMg: 93.4 },
  },
  {
    id: 'mushroom',
    name: 'Mushrooms',
    category: 'Vegetables',
    color: '#a4836a',
    image: unsplash('1504545102780-26774c1bb073'),
    availability: oregon(ALL_YEAR),
    nutrition: { fdcId: 169251, description: 'Mushrooms, white, raw', energyKcal: 22, proteinG: 3.09, fiberG: 1, vitaminCMg: 2.1 },
    note: 'Cultivated button or cremini mushrooms.',
  },
  {
    id: 'apple',
    name: 'Apples',
    category: 'Fruit',
    color: '#c0392b',
    image: unsplash('1560806887-1e4cd0b6cbd6'),
    availability: oregon(ALL_YEAR),
    nutrition: { fdcId: 171688, description: 'Apples, raw, with skin', energyKcal: 52, proteinG: 0.26, fiberG: 2.4, vitaminCMg: 4.6 },
  },
  {
    id: 'pear',
    name: 'Pears',
    category: 'Fruit',
    color: '#b5a642',
    image: unsplash('1788512337872-7390113a5318'),
    availability: oregon(ALL_YEAR),
    nutrition: { fdcId: 169118, description: 'Pears, raw', energyKcal: 57, proteinG: 0.36, fiberG: 3.1, vitaminCMg: 4.3 },
  },
  {
    id: 'blueberry',
    name: 'Blueberries',
    category: 'Fruit',
    color: '#3d4f8f',
    image: unsplash('1498557850523-fd3d118b962e'),
    availability: oregon([6, 7, 8]),
    nutrition: { fdcId: 171711, description: 'Blueberries, raw', energyKcal: 57, proteinG: 0.74, fiberG: 2.4, vitaminCMg: 9.7 },
  },
  {
    id: 'strawberry',
    name: 'Strawberries',
    category: 'Fruit',
    color: '#d62839',
    image: unsplash('1587393855524-087f83d95bc9'),
    availability: oregon([4, 5, 6, 7]),
    nutrition: { fdcId: 167762, description: 'Strawberries, raw', energyKcal: 32, proteinG: 0.67, fiberG: 2, vitaminCMg: 58.8 },
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb',
    category: 'Fruit',
    color: '#c44569',
    image: unsplash('1694402612127-70338cd7e458'),
    availability: oregon([2, 3, 4, 5, 6, 7]),
    nutrition: { fdcId: 167758, description: 'Rhubarb, raw', energyKcal: 21, proteinG: 0.9, fiberG: 1.8, vitaminCMg: 8 },
    note: 'Use the stalks only.',
  },
  {
    id: 'hazelnut',
    name: 'Hazelnuts',
    category: 'Nuts & herbs',
    color: '#bc6c25',
    image: unsplash('1715861696705-67ccf052baf5'),
    availability: oregon([0, 1, 2, 3, 4, 5, 6, 9, 10, 11]),
    nutrition: { fdcId: 170581, description: 'Nuts, hazelnuts or filberts', energyKcal: 628, proteinG: 15, fiberG: 9.7, vitaminCMg: 6.3 },
    note: 'Tree nut.',
  },
  {
    id: 'parsley',
    name: 'Parsley',
    category: 'Nuts & herbs',
    color: '#5a8f3e',
    image: unsplash('1721117090894-029c81cf0758'),
    availability: null,
    nutrition: { fdcId: 170416, description: 'Parsley, fresh', energyKcal: 36, proteinG: 2.97, fiberG: 3.3, vitaminCMg: 133 },
  },
  {
    id: 'thyme',
    name: 'Thyme',
    category: 'Nuts & herbs',
    color: '#7d8f69',
    image: unsplash('1784095877756-1b0eeb423e9b'),
    availability: null,
    nutrition: { fdcId: 173470, description: 'Thyme, fresh', energyKcal: 101, proteinG: 5.56, fiberG: 14, vitaminCMg: 160 },
  },
  {
    id: 'dill',
    name: 'Dill',
    category: 'Nuts & herbs',
    color: '#9aae5b',
    image: unsplash('1696731212424-29250c946ac6'),
    availability: null,
    nutrition: { fdcId: 172233, description: 'Dill weed, fresh', energyKcal: 43, proteinG: 3.46, fiberG: 2.1, vitaminCMg: 85 },
  },
  {
    id: 'nettle',
    name: 'Stinging Nettle',
    category: 'Specialty & botanicals',
    color: '#3f6b3a',
    image: unsplash('1526127410-01ef03017f7b'),
    availability: null,
    nutrition: { fdcId: 169819, description: 'Stinging Nettles, blanched (Northern Plains Indians)', energyKcal: 42, proteinG: 2.71, fiberG: 6.9, vitaminCMg: null },
    note: 'Handle raw nettles with gloves and cook before eating. Buy from a reputable supplier; Field Kitchen does not identify wild plants.',
  },
  {
    id: 'douglas-fir',
    name: 'Douglas Fir Tips',
    category: 'Specialty & botanicals',
    color: '#606c38',
    image: unsplash('1636531370203-a6f3d331be57'),
    availability: null,
    nutrition: null,
    note: 'Culinary use here is limited to infusions such as syrup. Only use tips a reputable supplier has identified as Douglas-fir.',
  },
  {
    id: 'chanterelle',
    name: 'Chanterelles',
    category: 'Specialty & botanicals',
    color: '#e9a23b',
    image: unsplash('1760891961393-e6ab0dc820e8'),
    availability: null,
    nutrition: { fdcId: 168422, description: 'Mushrooms, Chanterelle, raw', energyKcal: 32, proteinG: 1.49, fiberG: 3.8, vitaminCMg: null },
    note: 'Wild mushroom. Buy from a reputable supplier; Field Kitchen does not identify wild mushrooms.',
  },
  {
    id: 'huckleberry',
    name: 'Huckleberries',
    category: 'Specialty & botanicals',
    color: '#6a0572',
    image: unsplash('1575679483854-4a651f4bc7f3'),
    availability: null,
    nutrition: null,
    note: 'Wild berry. Buy from a reputable supplier.',
  },
];

export type IngredientId = string;

const INGREDIENT_INDEX = new Map(INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]));

export function getIngredient(id: IngredientId): Ingredient {
  const ingredient = INGREDIENT_INDEX.get(id);
  if (!ingredient) throw new Error(`Unknown ingredient: ${id}`);
  return ingredient;
}

export function isAvailableInMonth(ingredient: Ingredient, month: number): boolean {
  return Boolean(ingredient.availability?.months.includes(month));
}

export function fdcUrl(fdcId: number): string {
  return `https://fdc.nal.usda.gov/food-details/${fdcId}/nutrients`;
}
