import { describe, expect, it } from 'vitest';
import { getIngredient, INGREDIENTS, SOURCES, type SourceId } from '../../src/app/data';
import { PREPARATIONS } from '../../src/app/preparations';
import {
  formatRecommendationForCopy,
  preparationIngredientIds,
  preparationsUsing,
  recommend,
} from '../../src/app/recommend';

const ids = (selection: string[]) => recommend(selection).map((result) => result.preparation.id);
const find = (selection: string[], preparationId: string) => {
  const match = recommend(selection).find((result) => result.preparation.id === preparationId);
  if (!match) throw new Error(`${preparationId} was not recommended for ${selection.join(', ')}`);
  return match;
};

describe('ingredient dataset', () => {
  it('holds a modest everyday catalogue with specialty items kept separate', () => {
    expect(INGREDIENTS.length).toBeGreaterThanOrEqual(20);
    expect(INGREDIENTS.length).toBeLessThanOrEqual(30);
    const specialty = INGREDIENTS.filter((item) => item.category === 'Specialty & botanicals');
    expect(specialty.map((item) => item.id).sort()).toEqual(['chanterelle', 'douglas-fir', 'huckleberry', 'nettle']);
  });

  it('uses unique ingredient ids', () => {
    expect(new Set(INGREDIENTS.map((item) => item.id)).size).toBe(INGREDIENTS.length);
  });

  it('only shows availability that references a real source and valid months', () => {
    for (const ingredient of INGREDIENTS) {
      if (!ingredient.availability) continue;
      expect(SOURCES[ingredient.availability.sourceId]).toBeDefined();
      const months = ingredient.availability.months;
      expect(new Set(months).size).toBe(months.length);
      months.forEach((month) => expect(month).toBeGreaterThanOrEqual(0));
      months.forEach((month) => expect(month).toBeLessThanOrEqual(11));
    }
  });

  it('records the Oregon availability chart exactly as read for spot-checked items', () => {
    expect(getIngredient('beet').availability?.months).toEqual([6, 7]);
    expect(getIngredient('strawberry').availability?.months).toEqual([4, 5, 6, 7]);
    expect(getIngredient('hazelnut').availability?.months).not.toContain(7);
  });

  it('leaves availability unsourced rather than modelled for items absent from the chart', () => {
    for (const id of ['leek', 'kale', 'parsley', 'thyme', 'dill', 'nettle', 'douglas-fir', 'chanterelle', 'huckleberry']) {
      expect(getIngredient(id).availability).toBeNull();
    }
  });

  it('ties every nutrition record to a USDA FoodData Central id and record description', () => {
    for (const ingredient of INGREDIENTS) {
      if (!ingredient.nutrition) continue;
      expect(Number.isInteger(ingredient.nutrition.fdcId)).toBe(true);
      expect(ingredient.nutrition.description.length).toBeGreaterThan(3);
    }
    expect(getIngredient('nettle').nutrition?.description).toMatch(/blanched/);
  });

  it('flags every specialty ingredient with a handling or sourcing note', () => {
    INGREDIENTS.filter((item) => item.category === 'Specialty & botanicals').forEach((item) => {
      expect(item.note).toBeTruthy();
    });
  });
});

describe('preparation dataset', () => {
  it('contains a focused set of eight to twelve preparations', () => {
    expect(PREPARATIONS.length).toBeGreaterThanOrEqual(8);
    expect(PREPARATIONS.length).toBeLessThanOrEqual(12);
  });

  it('references only existing ingredients and sources', () => {
    for (const preparation of PREPARATIONS) {
      preparationIngredientIds(preparation).forEach((id) => expect(() => getIngredient(id)).not.toThrow());
      preparation.basis.sourceIds.forEach((id: SourceId) => expect(SOURCES[id]).toBeDefined());
      expect(preparation.components.some((component) => !component.optional)).toBe(true);
      expect(preparation.method.length).toBeGreaterThan(0);
    }
  });

  it('requires a source for every established preparation', () => {
    PREPARATIONS.filter((preparation) => preparation.basis.kind === 'established').forEach((preparation) => {
      expect(preparation.basis.sourceIds.length).toBeGreaterThan(0);
    });
  });

  it('gives every ingredient at least one use', () => {
    INGREDIENTS.forEach((ingredient) => expect(preparationsUsing(ingredient.id).length).toBeGreaterThan(0));
  });

  it('attaches safety notes to specialty and refrigerator preparations', () => {
    ['nettle-soup', 'fir-tip-syrup', 'pickled-roots'].forEach((id) => {
      expect(PREPARATIONS.find((preparation) => preparation.id === id)?.safetyNote).toBeTruthy();
    });
  });
});

describe('recommend', () => {
  it('returns nothing for an empty selection', () => {
    expect(recommend([])).toEqual([]);
  });

  it('puts ready-to-make preparations first', () => {
    const results = recommend(['potato', 'cabbage', 'onion']);
    expect(results[0].preparation.id).toBe('colcannon');
    expect(results[0].status).toBe('ready');
    expect(results[0].usedIds).toEqual(['potato', 'cabbage', 'onion']);
    const firstNeedsMore = results.findIndex((result) => result.status === 'needs-more');
    expect(results.slice(0, firstNeedsMore).every((result) => result.status === 'ready')).toBe(true);
  });

  it('reports exactly which required ingredients are still missing', () => {
    const soup = find(['potato'], 'leek-potato-soup');
    expect(soup.status).toBe('needs-more');
    expect(soup.missing.map((component) => component.label)).toEqual(['Leeks']);
    expect(soup.couldAdd.map((component) => component.label)).toEqual(['Onion', 'Thyme']);
  });

  it('treats component options as substitutions', () => {
    expect(find(['beet'], 'pickled-roots').status).toBe('ready');
    expect(find(['chanterelle', 'onion'], 'duxelles').status).toBe('ready');
  });

  it('produces meaningfully different results for different selections', () => {
    const roots = ids(['potato', 'cabbage', 'onion']);
    const orchard = ids(['apple', 'hazelnut', 'kale']);
    expect(roots[0]).toBe('colcannon');
    expect(orchard[0]).toBe('kale-apple-salad');
    expect(orchard).not.toContain('colcannon');
  });

  it('updates when an ingredient is removed', () => {
    expect(find(['parsley', 'garlic'], 'gremolata').status).toBe('ready');
    expect(find(['parsley'], 'gremolata').status).toBe('needs-more');
    expect(ids(['apple'])).not.toContain('gremolata');
  });

  it('does not suggest ideas from optional extras alone', () => {
    expect(recommend(['thyme', 'dill'])).toEqual([]);
    expect(ids(['leek', 'potato', 'garlic', 'thyme'])).not.toContain('berry-shrub');
    expect(ids(['potato', 'onion'])).not.toContain('nettle-soup');
  });

  it('is deterministic', () => {
    expect(ids(['carrot', 'garlic', 'thyme', 'dill'])).toEqual(ids(['dill', 'thyme', 'garlic', 'carrot']));
  });
});

describe('formatRecommendationForCopy', () => {
  it('produces a self-contained card with basis, sources and a concept disclaimer', () => {
    const text = formatRecommendationForCopy(find(['potato'], 'leek-potato-soup'));
    expect(text).toContain('Leek & potato soup');
    expect(text).toContain('Preparation concept, not a tested recipe');
    expect(text).toContain('Uses what you have: Potatoes');
    expect(text).toContain('Still needed: Leeks');
    expect(text).toContain('1. Clean the leeks');
    expect(text).toContain('https://en.wikipedia.org/wiki/Leek_soup');
  });

  it('labels curated combinations and includes safety notes', () => {
    const salad = formatRecommendationForCopy(find(['kale', 'apple'], 'kale-apple-salad'));
    expect(salad).toContain('Basis: Curated by Field Kitchen');
    const pickles = formatRecommendationForCopy(find(['carrot'], 'pickled-roots'));
    expect(pickles).toContain('not shelf-stable');
  });
});
