import { describe, expect, it } from 'vitest';
import {
  assessPairing,
  DATASET_SUMMARY,
  getIngredientByPairingLabel,
  INGREDIENTS,
  ingredientListsPairing,
  PREPARATION_METHODS,
} from '../../src/app/data';

function ingredient(id: string) {
  const match = INGREDIENTS.find((item) => item.id === id);
  if (!match) throw new Error(`Missing test ingredient: ${id}`);
  return match;
}

describe('Field Kitchen dataset invariants', () => {
  it('contains eight ingredients', () => {
    expect(DATASET_SUMMARY.ingredientCount).toBe(8);
    expect(INGREDIENTS).toHaveLength(8);
  });

  it('contains eight preparation methods', () => {
    expect(DATASET_SUMMARY.preparationMethodCount).toBe(8);
    expect(PREPARATION_METHODS).toHaveLength(8);
  });

  it('contains 24 preparation assignments', () => {
    expect(DATASET_SUMMARY.preparationAssignmentCount).toBe(24);
  });

  it('contains 24 directed pairing entries', () => {
    expect(DATASET_SUMMARY.directedPairingCount).toBe(24);
  });

  it('contains 14 unique undirected pairings', () => {
    expect(DATASET_SUMMARY.uniqueUndirectedPairingCount).toBe(14);
  });

  it('classifies a bidirectional relationship with preparation overlap as strong', () => {
    expect(assessPairing(ingredient('huckleberry'), ingredient('rhubarb'))).toEqual({
      strength: 'strong',
      basis: 'bidirectional',
      sharedPreparationCount: 2,
    });
  });

  it('classifies a one-directional stored relationship as medium', () => {
    expect(assessPairing(ingredient('fiddlehead'), ingredient('chanterelle'))).toMatchObject({
      strength: 'medium',
      basis: 'unidirectional',
    });
  });

  it('classifies preparation-overlap-only relationships as experimental', () => {
    expect(assessPairing(ingredient('chanterelle'), ingredient('rhubarb'))).toEqual({
      strength: 'experimental',
      basis: 'preparation-overlap',
      sharedPreparationCount: 2,
    });
  });

  it('returns no relationship for unrelated ingredients', () => {
    expect(assessPairing(ingredient('huckleberry'), ingredient('walla-walla'))).toEqual({
      strength: null,
      basis: null,
      sharedPreparationCount: 1,
    });
  });

  it('preserves asymmetric stored pairings without adding a reverse entry', () => {
    const fiddlehead = ingredient('fiddlehead');
    const chanterelle = ingredient('chanterelle');

    expect(getIngredientByPairingLabel('Chanterelle')).toBe(chanterelle);
    expect(ingredientListsPairing(fiddlehead, chanterelle)).toBe(true);
    expect(ingredientListsPairing(chanterelle, fiddlehead)).toBe(false);
  });
});
