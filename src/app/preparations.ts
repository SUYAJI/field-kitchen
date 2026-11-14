import type { IngredientId, SourceId } from './data';

export const PREPARATION_CATEGORIES = ['Dish', 'Side', 'Dessert', 'Drink', 'Preserve', 'Component'] as const;
export type PreparationCategory = (typeof PREPARATION_CATEGORIES)[number];

/**
 * A slot in a preparation. Any one of `options` satisfies it, which is how
 * substitutions (carrots or beets, any berry) are expressed.
 */
export interface PreparationComponent {
  label: string;
  options: readonly IngredientId[];
  optional?: boolean;
}

export interface PreparationBasis {
  /**
   * established: an existing dish or technique described by the cited sources.
   * curated: a combination designed for Field Kitchen; sources, if any, only
   * support specific handling statements.
   */
  kind: 'established' | 'curated';
  note: string;
  sourceIds: readonly SourceId[];
}

export interface Preparation {
  id: string;
  name: string;
  category: PreparationCategory;
  technique: string;
  summary: string;
  components: readonly PreparationComponent[];
  /** Staples a small kitchen is assumed to hold. Always listed explicitly. */
  pantry: readonly string[];
  method: readonly string[];
  why: string;
  basis: PreparationBasis;
  safetyNote?: string;
}

/**
 * Field Kitchen offers preparation concepts, not tested recipes. Methods are
 * concise outlines without invented quantities; the only ratio shown comes
 * directly from a cited recipe.
 */
export const PREPARATIONS: readonly Preparation[] = [
  {
    id: 'colcannon',
    name: 'Colcannon',
    category: 'Side',
    technique: 'Boil & mash',
    summary: 'Irish mashed potatoes folded with buttered cabbage. A hearty side made from two storage staples.',
    components: [
      { label: 'Potatoes', options: ['potato'] },
      { label: 'Cabbage', options: ['cabbage'] },
      { label: 'Leeks or onion', options: ['leek', 'onion'], optional: true },
    ],
    pantry: ['Butter', 'Milk', 'Salt', 'Black pepper'],
    method: [
      'Boil peeled potatoes in salted water until tender, then drain and let them steam dry.',
      'Shred the cabbage and cook it in butter until tender, with sliced leek or onion if using.',
      'Warm milk with butter and mash it into the potatoes.',
      'Fold in the cabbage and season with salt and pepper.',
    ],
    why: 'Colcannon is traditionally just potatoes, butter, milk and cabbage, so it suits a kitchen holding storage produce. Leeks or onions are a recognised addition.',
    basis: { kind: 'established', note: 'Established Irish dish.', sourceIds: ['wiki-colcannon'] },
  },
  {
    id: 'leek-potato-soup',
    name: 'Leek & potato soup',
    category: 'Dish',
    technique: 'Simmer & purée',
    summary: 'A smooth, inexpensive soup. Serve it hot, or chilled as a vichyssoise-style special.',
    components: [
      { label: 'Leeks', options: ['leek'] },
      { label: 'Potatoes', options: ['potato'] },
      { label: 'Onion', options: ['onion'], optional: true },
      { label: 'Thyme', options: ['thyme'], optional: true },
    ],
    pantry: ['Butter', 'Stock or water', 'Salt', 'Cream (optional)'],
    method: [
      'Clean the leeks thoroughly and slice the white and pale green parts.',
      'Soften the leeks, and onion if using, in butter without browning.',
      'Add diced potatoes, stock or water and thyme; simmer until the potatoes are soft.',
      'Blend smooth or leave chunky, enrich with cream if you like, and season.',
      'For a cold special, chill the purée and finish with cream, as in vichyssoise.',
    ],
    why: 'Leeks simmered with potatoes is a long-established soup found in many cuisines. The potatoes give body, so cream is optional.',
    basis: { kind: 'established', note: 'Established soup; vichyssoise is its chilled form.', sourceIds: ['wiki-leek-soup', 'wiki-vichyssoise'] },
  },
  {
    id: 'duxelles',
    name: 'Mushroom duxelles',
    category: 'Component',
    technique: 'Sauté & reduce',
    summary: 'Mushrooms, onion and herbs cooked down to a savoury paste for toast, sandwiches, omelettes or pastry.',
    components: [
      { label: 'Mushrooms', options: ['mushroom', 'chanterelle'] },
      { label: 'Onion', options: ['onion'] },
      { label: 'Thyme or parsley', options: ['thyme', 'parsley'], optional: true },
    ],
    pantry: ['Butter', 'Salt', 'Black pepper'],
    method: [
      'Finely chop the mushrooms and onion by hand, or pulse them in a food processor.',
      'Cook in butter over medium heat, stirring, until the liquid evaporates and the mixture becomes a paste.',
      'Stir in chopped thyme or parsley and season with salt and pepper.',
      'Cool quickly and refrigerate until needed.',
    ],
    why: 'A classic French way to concentrate mushrooms into a paste. One batch can supply several menu items.',
    basis: { kind: 'established', note: 'Established French preparation.', sourceIds: ['wiki-duxelles'] },
  },
  {
    id: 'braised-red-cabbage',
    name: 'Braised red cabbage with apple',
    category: 'Side',
    technique: 'Braise',
    summary: 'Sweet-and-sour red cabbage, slowly braised with apples and a splash of vinegar.',
    components: [
      { label: 'Red cabbage', options: ['cabbage'] },
      { label: 'Apples', options: ['apple'] },
      { label: 'Onion', options: ['onion'], optional: true },
    ],
    pantry: ['Vinegar', 'Sugar', 'Butter', 'Salt'],
    method: [
      'Shred red cabbage, slice the onion, and peel and slice the apples.',
      'Soften the onion in butter, then add the cabbage, apples, a splash of vinegar and a little sugar.',
      'Cover and braise gently, stirring occasionally, until very tender.',
      'Adjust the sweet–sour balance with vinegar and sugar, and season.',
    ],
    why: 'Apples and a little vinegar are a traditional addition that gives red cabbage a sweet-and-sour taste. The acid also helps the cabbage keep its red colour.',
    basis: { kind: 'established', note: 'Established preparation of red cabbage.', sourceIds: ['wiki-red-cabbage'] },
  },
  {
    id: 'fruit-crisp',
    name: 'Fruit crisp with hazelnut topping',
    category: 'Dessert',
    technique: 'Bake',
    summary: 'Whatever fruit is on hand, baked under a crumbly oat topping with chopped hazelnuts.',
    components: [
      { label: 'Fruit', options: ['apple', 'pear', 'rhubarb', 'blueberry', 'strawberry', 'huckleberry'] },
      { label: 'Hazelnuts for the topping', options: ['hazelnut'], optional: true },
    ],
    pantry: ['Flour', 'Rolled oats', 'Butter', 'Sugar'],
    method: [
      'Cut the fruit into even pieces (leave berries whole), toss with a little sugar and spread in a baking dish.',
      'Rub flour, oats, sugar and cold butter together into a crumbly topping; stir in chopped hazelnuts if using.',
      'Scatter the topping over the fruit and bake until golden on top and bubbling underneath.',
    ],
    why: 'A crisp turns whatever fruit is on hand into a dessert. Apple and rhubarb are popular fillings, and oats or nuts are common additions to the topping.',
    basis: { kind: 'established', note: 'Established dessert. Hazelnuts are this edition’s choice of nut.', sourceIds: ['wiki-crumble'] },
  },
  {
    id: 'berry-shrub',
    name: 'Berry shrub',
    category: 'Drink',
    technique: 'Macerate',
    summary: 'A vinegared berry syrup. Top it with sparkling water for a house soda, or use it in cocktails.',
    components: [
      { label: 'Berries', options: ['blueberry', 'strawberry', 'huckleberry'] },
      { label: 'Thyme', options: ['thyme'], optional: true },
    ],
    pantry: ['Vinegar', 'Sugar', 'Sparkling water'],
    method: [
      'Crush the berries with sugar, add thyme if using, and leave until juicy.',
      'Stir in vinegar until the sugar dissolves, then strain.',
      'Refrigerate the syrup. Mix with sparkling water or spirits to serve.',
    ],
    why: 'A shrub is a vinegared fruit syrup used for soft drinks and cocktails, and is often infused with herbs. It is a good use for very ripe berries.',
    basis: { kind: 'established', note: 'Established drink base (drinking vinegar).', sourceIds: ['wiki-shrub'] },
  },
  {
    id: 'pickled-roots',
    name: 'Refrigerator pickled carrots with dill',
    category: 'Preserve',
    technique: 'Quick pickle',
    summary: 'Crisp, tangy carrot or beet pickles for plates, boards and sandwiches.',
    components: [
      { label: 'Carrots or beets', options: ['carrot', 'beet'] },
      { label: 'Dill', options: ['dill'], optional: true },
      { label: 'Garlic', options: ['garlic'], optional: true },
    ],
    pantry: ['Vinegar', 'Water', 'Salt', 'Sugar'],
    method: [
      'Cut carrots or beets into sticks or coins and pack into clean jars with dill and garlic.',
      'Bring vinegar, water, salt and sugar to a boil and pour over the vegetables.',
      'Cool, cover and refrigerate before serving.',
    ],
    why: 'Quick pickles add acidity and crunch to a plate and use up surplus roots. Dill and garlic are this edition’s suggested aromatics.',
    basis: { kind: 'curated', note: 'Curated combination. Storage guidance is sourced.', sourceIds: ['umn-pickling'] },
    safetyNote: 'Refrigerator pickles are not shelf-stable: keep them refrigerated. For canned pickles, follow a tested recipe.',
  },
  {
    id: 'gremolata',
    name: 'Gremolata',
    category: 'Component',
    technique: 'Chop',
    summary: 'Parsley, garlic and lemon zest. A fresh finish for braises, soups and roasted vegetables.',
    components: [
      { label: 'Parsley', options: ['parsley'] },
      { label: 'Garlic', options: ['garlic'] },
    ],
    pantry: ['Lemon'],
    method: [
      'Finely chop flat-leaf parsley and garlic.',
      'Mix with finely grated lemon zest.',
      'Scatter over braises, soups or roasted vegetables just before serving.',
    ],
    why: 'Gremolata is the traditional finish for ossobuco. Its raw herbs and zest contrast with rich, slow-cooked food.',
    basis: { kind: 'established', note: 'Established Italian garnish.', sourceIds: ['wiki-gremolata'] },
  },
  {
    id: 'kale-apple-salad',
    name: 'Kale, apple & hazelnut salad',
    category: 'Side',
    technique: 'Raw',
    summary: 'Thinly sliced kale with crisp fruit and toasted hazelnuts.',
    components: [
      { label: 'Kale', options: ['kale'] },
      { label: 'Apples or pears', options: ['apple', 'pear'] },
      { label: 'Hazelnuts', options: ['hazelnut'], optional: true },
    ],
    pantry: ['Olive oil', 'Cider vinegar or lemon', 'Salt'],
    method: [
      'Strip the kale from its stems, slice thinly and massage briefly with oil and a pinch of salt.',
      'Add thinly sliced apple or pear.',
      'Dress with vinegar or lemon and oil, then top with toasted, chopped hazelnuts.',
    ],
    why: 'Crisp fruit and toasted nuts balance kale’s firm leaves, and every part can be prepped ahead.',
    basis: { kind: 'curated', note: 'Curated combination. Not based on a cited recipe.', sourceIds: [] },
  },
  {
    id: 'roasted-roots',
    name: 'Roasted roots with thyme',
    category: 'Side',
    technique: 'Roast',
    summary: 'Potatoes, carrots or beets roasted with garlic and thyme. A dependable side that scales easily.',
    components: [
      { label: 'Potatoes, carrots or beets', options: ['potato', 'carrot', 'beet'] },
      { label: 'Onion', options: ['onion'], optional: true },
      { label: 'Garlic', options: ['garlic'], optional: true },
      { label: 'Thyme', options: ['thyme'], optional: true },
    ],
    pantry: ['Oil', 'Salt', 'Black pepper'],
    method: [
      'Cut the vegetables into even pieces. Roast beets on a separate tray so their colour does not bleed.',
      'Toss with oil, salt, thyme and whole garlic cloves.',
      'Roast in a hot oven, turning once, until browned and tender.',
      'Finish with gremolata or a splash of vinegar.',
    ],
    why: 'Roasting turns any mix of roots into a dependable side, and the method scales from one tray to a full service.',
    basis: { kind: 'curated', note: 'Curated basic technique. Not based on a cited recipe.', sourceIds: [] },
  },
  {
    id: 'nettle-soup',
    name: 'Nettle soup',
    category: 'Dish',
    technique: 'Simmer & purée',
    summary: 'A traditional spring soup of young nettles, thickened with potato.',
    components: [
      { label: 'Stinging nettle', options: ['nettle'] },
      { label: 'Potatoes', options: ['potato'], optional: true },
      { label: 'Onion or leeks', options: ['onion', 'leek'], optional: true },
    ],
    pantry: ['Butter', 'Stock', 'Salt'],
    method: [
      'Wearing gloves, pick over young nettle tops and wash them.',
      'Soften the onion or leek in butter, add diced potato and stock, and simmer until tender.',
      'Add the nettles and simmer briefly until wilted, then blend and season.',
    ],
    why: 'Nettle soup is eaten mainly in spring and early summer. Soaking or cooking removes the sting. Potato as a thickener is this edition’s suggestion.',
    basis: { kind: 'established', note: 'Established soup. Handling statement is sourced.', sourceIds: ['wiki-nettle-soup', 'wiki-urtica'] },
    safetyNote: 'Handle raw nettles with gloves and cook before eating. Buy from a reputable supplier; Field Kitchen does not identify wild plants.',
  },
  {
    id: 'fir-tip-syrup',
    name: 'Douglas fir tip syrup',
    category: 'Drink',
    technique: 'Infuse',
    summary: 'A resinous spring syrup for sodas, lemonades and cocktails.',
    components: [{ label: 'Douglas fir tips', options: ['douglas-fir'] }],
    pantry: ['Sugar', 'Water', 'Lemon juice (optional)'],
    method: [
      'Use equal volumes of water, sugar and fresh tips. The cited recipe uses 2 cups of each.',
      'Bring the water and sugar to a boil, turn off the heat, stir in the tips (and lemon juice, if using), cover and cool.',
      'Steep longer for a stronger flavour, then strain and bottle. Keep refrigerated.',
      'Mix into sodas, lemonades or cocktails.',
    ],
    why: 'A simple syrup turns a short-season spring ingredient into a drink base a bar or café can work with.',
    basis: { kind: 'established', note: 'Ratio and method from the cited recipe.', sourceIds: ['splendid-fir-syrup'] },
    safetyNote: 'Only use tips a reputable supplier has identified as Douglas-fir. Field Kitchen does not identify wild plants.',
  },
];
