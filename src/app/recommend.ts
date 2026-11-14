import { getIngredient, getSource, type IngredientId } from './data';
import { PREPARATIONS, type Preparation, type PreparationComponent } from './preparations';

export interface ComponentMatch {
  component: PreparationComponent;
  /** Selected ingredients that satisfy this component. */
  matchedIds: IngredientId[];
}

export type RecommendationStatus = 'ready' | 'needs-more';

export interface Recommendation {
  preparation: Preparation;
  status: RecommendationStatus;
  /** Selected ingredients the preparation uses, in component order. */
  usedIds: IngredientId[];
  /** Required components the selection does not cover. */
  missing: PreparationComponent[];
  /** Optional components the selection does not cover. */
  couldAdd: PreparationComponent[];
  components: ComponentMatch[];
}

/**
 * Matches a selection against the curated preparations.
 *
 * A preparation is suggested when at least one selected ingredient fills one
 * of its required components. Optional extras alone (a herb, say) never
 * surface an idea on their own. Results are ordered by:
 * 1. fewest missing required components (ready-to-make first)
 * 2. most selected ingredients used
 * 3. the curated order of PREPARATIONS
 * There is no numeric compatibility score.
 */
export function recommend(
  selectedIds: Iterable<IngredientId>,
  preparations: readonly Preparation[] = PREPARATIONS
): Recommendation[] {
  const selected = new Set(selectedIds);
  if (selected.size === 0) return [];

  const results: { recommendation: Recommendation; order: number }[] = [];

  preparations.forEach((preparation, order) => {
    const components = preparation.components.map((component) => ({
      component,
      matchedIds: component.options.filter((id) => selected.has(id)),
    }));

    const usedIds = [...new Set(components.flatMap((match) => match.matchedIds))];
    const fillsRequired = components.some((match) => !match.component.optional && match.matchedIds.length > 0);
    if (!fillsRequired) return;

    const missing = components
      .filter((match) => !match.component.optional && match.matchedIds.length === 0)
      .map((match) => match.component);
    const couldAdd = components
      .filter((match) => match.component.optional && match.matchedIds.length === 0)
      .map((match) => match.component);

    results.push({
      order,
      recommendation: {
        preparation,
        status: missing.length === 0 ? 'ready' : 'needs-more',
        usedIds,
        missing,
        couldAdd,
        components,
      },
    });
  });

  return results
    .sort(
      (a, b) =>
        a.recommendation.missing.length - b.recommendation.missing.length ||
        b.recommendation.usedIds.length - a.recommendation.usedIds.length ||
        a.order - b.order
    )
    .map((result) => result.recommendation);
}

/** Ingredient ids that appear anywhere in a preparation. */
export function preparationIngredientIds(preparation: Preparation): IngredientId[] {
  return [...new Set(preparation.components.flatMap((component) => component.options))];
}

/** Preparations that can use a given ingredient. */
export function preparationsUsing(ingredientId: IngredientId): Preparation[] {
  return PREPARATIONS.filter((preparation) => preparationIngredientIds(preparation).includes(ingredientId));
}

const names = (ids: readonly IngredientId[]) => ids.map((id) => getIngredient(id).name).join(', ');
const componentNames = (components: readonly PreparationComponent[]) =>
  components.map((component) => component.label).join('; ');

/** Plain-text card a kitchen can paste into notes, a prep list or a message. */
export function formatRecommendationForCopy(recommendation: Recommendation): string {
  const { preparation } = recommendation;
  const lines = [
    `${preparation.name} (${preparation.category.toLowerCase()} · ${preparation.technique.toLowerCase()})`,
    'Preparation concept, not a tested recipe. Check quantities, allergens and food safety before service.',
    '',
    preparation.summary,
    '',
    `Uses what you have: ${names(recommendation.usedIds)}`,
  ];

  if (recommendation.missing.length > 0) {
    lines.push(`Still needed: ${componentNames(recommendation.missing)}`);
  }
  if (recommendation.couldAdd.length > 0) {
    lines.push(`Optional additions: ${componentNames(recommendation.couldAdd)}`);
  }
  lines.push(`Pantry: ${preparation.pantry.join(', ')}`, '', 'Method:');
  preparation.method.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
  lines.push('', `Why it works: ${preparation.why}`);
  if (preparation.safetyNote) lines.push(`Note: ${preparation.safetyNote}`);

  const basisLabel = preparation.basis.kind === 'established' ? 'Established preparation' : 'Curated by Field Kitchen';
  lines.push('', `Basis: ${basisLabel}. ${preparation.basis.note}`);
  preparation.basis.sourceIds.forEach((id) => {
    const source = getSource(id);
    lines.push(`Source: ${source.title}, ${source.publisher}: ${source.url}`);
  });

  return lines.join('\n');
}
