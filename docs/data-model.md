# Field Kitchen prototype data model

This note describes the current eight-ingredient prototype model. It documents application behavior; it does not validate the dataset as authoritative agricultural, nutritional, culinary, or foraging information.

## Ingredient shape

Each `Ingredient` currently stores:

- identity and presentation: `id`, `name`, `color`, `image`
- modeled categories: `seasons`, `region`, `sourceLayer`, `localPriority`
- descriptive context: `originTag`
- modeled preparation and relationship inputs: `preparations`, `pairings`
- modeled seasonality: one zero-based `[startMonth, endMonth]` `harvestWindow`
- illustrative indices: `nutrientDensity` and the four `nutrients` values

`harvestWindow` supports ranges that cross the end of the year. Pairings are currently stored as display labels and resolved through an explicit label-to-ingredient mapping.

## Current category types

- Regions: Willamette Valley, Puget Sound, Olympic Peninsula, Cascade Range
- Seasons: Spring, Summer, Autumn, Winter
- Supported source layers: Local, Regional, Imported, Wild Foraged
- Preparation methods: Raw, Roasted, Fermented, Simmered, Steamed, Pickled, Ground, Soaked
- Local priority: High, Medium, Low
- Nutrient axes: protein, mineral, fiber, digestibility

The supported taxonomy is broader than the current data. For example, only Local and Wild Foraged source layers are represented by the current eight ingredients.

## Prototype inputs

The ingredient records directly store names, imagery, colors, regions, seasons, origin tags, preparation assignments, harvest windows, directed pairing labels, source layers, local priority, nutrient density, and nutrient-axis values. These are prototype inputs without field-level citations.

## Derived values

The application derives:

- ingredient, region, preparation-method, nutrient-axis, and seasonal-window counts
- total ingredient-to-preparation assignments
- directed pairing-entry count
- unique undirected pairing count using sorted ingredient IDs
- source layers represented by the complete or currently filtered dataset
- filtered ingredient collections for each view
- nutrient ordering, node size, and radial distance from the active normalized index

One ingredient-to-preparation association counts as one preparation assignment. Reciprocal directed pairing entries count as one unique undirected relationship; a one-way entry also counts as one unique relationship.

## Current pairing heuristic

Pairing labels resolve to stable ingredient IDs through the current explicit mapping. For two different ingredients:

1. An explicit relationship in both directions is strong when the ingredients share at least two preparation methods, otherwise medium.
2. An explicit relationship in only one direction is medium.
3. No explicit relationship plus at least two shared preparation methods is experimental.
4. Otherwise, no pairing is shown.

The model deliberately preserves directed entries. Direction currently affects classification but does not yet have provenance or editorial semantics.

## Illustrative numeric semantics

- `nutrientDensity` is an illustrative prototype index expected on a 1–10 range.
- `nutrients.protein`, `mineral`, `fiber`, and `digestibility` are normalized illustrative indices expected on a 0–100 range.
- `localPriority` is an editorial category, not a numeric measurement.

These values have no physical units and should not be interpreted as grams, milligrams, percentages of daily value, or authoritative nutrition data.

## Provenance limitations

The current records do not store sources, citations, collection dates, regional variants, confidence, methodology, or factual/editorial distinctions. Habitat descriptions, seasonality, sourcing, nutrition indices, priorities, and pairings should all be revisited before the interface presents real-world guidance.

## Future real-data questions

- Which nutrition fields should come from authoritative sources?
- Should nutrition store raw values and derive visualization indices?
- How should region-specific seasonality be represented?
- Should harvest windows vary by region?
- Should pairings use ingredient IDs instead of names?
- Should pairing direction have explicit semantics?
- Should pairing strength be curated, computed, or both?
- What provenance/citation metadata belongs on each field?
- Which fields are factual versus editorial?
- Should data remain local JSON/TS or move to an external data store later?
