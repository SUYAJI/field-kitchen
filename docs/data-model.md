# Field Kitchen data model

Field Kitchen separates three kinds of information. The level is shown in the interface where the information appears.

| Level | Meaning | Where it is used |
| --- | --- | --- |
| Sourced fact | Supported by a specific reference in `SOURCES` (`src/app/data.ts`) | USDA nutrition records, Oregon availability months, established-preparation references, handling statements |
| Curated recommendation | A combination or method designed for Field Kitchen | Preparations with `basis.kind: 'curated'`, aromatics added to established dishes, serving suggestions |
| Prototype assumption | Provisional and unvalidated | Pantry staples (butter, salt, vinegar and so on) are assumed to be on hand. They are always listed on each idea |

Fields that could not be sourced are `null` and are shown as "Not shown", rather than filled with modelled values.

## Ingredients (`src/app/data.ts`)

The 22 ingredients include 18 everyday items and 4 specialty or botanical items (nettle, Douglas fir tips, chanterelles, huckleberries).

- `availability`: zero-based months copied from the *Oregon Fruit & Vegetable Availability Chart* (Oregon Harvest for Schools, Oregon Department of Education, updated March 2017, adapted from the Agri-business Council of Oregon). It is `null` for items the chart does not list: leeks, kale, parsley, thyme, dill and all specialty items. The chart does not distinguish fresh harvest from storage.
- `nutrition`: one USDA FoodData Central SR Legacy record per ingredient, stored with its FDC id and exact description so the food state stays visible. Examples: the nettle record is *blanched*, and the mushroom record is *white*. Vitamin C is `null` when the record does not report it. There is no record for Douglas fir tips or huckleberries. Sage was dropped because only a dried, ground record exists.
- `note`: handling or sourcing notes. Every specialty item has one.

## Preparations (`src/app/preparations.ts`)

There are twelve preparation concepts. Each has:

- `components`: slots that any one of `options` can fill (substitutions), marked `optional` or required
- `pantry`: assumed staples, always displayed
- `method`: a concise outline with no invented quantities. The only ratio shown (fir tip syrup) comes from the cited recipe
- `basis`: `established` (an existing dish, with at least one source) or `curated` (sources, if any, support only specific handling statements)
- `safetyNote`: required for specialty and refrigerator preparations

## Recommendation logic (`src/app/recommend.ts`)

`recommend(selectedIds)` is deterministic and has no numeric score:

1. A preparation appears when at least one selected ingredient fills one of its required components. Optional extras alone do not surface an idea.
2. A preparation is `ready` (shown as "Ready with pantry staples") when every required component is filled. Otherwise it lists the `missing` components.
3. Results are ordered by fewest missing required components, then most selected ingredients used, then curated list order.

`formatRecommendationForCopy` produces the plain-text card used by **Copy idea**. It includes the concept disclaimer, basis and source URLs.

## Removed from the first prototype

The first prototype's modelled fields had no citations and have been removed: nutrient indices, sub-regions, source layers, local priority, harvest windows and pairing labels. The original implementation remains in the Git history at commit `ba11b23`.
