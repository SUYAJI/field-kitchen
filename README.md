# Field Kitchen

Field Kitchen is an experimental ingredient-intelligence interface for exploring relationships between ingredients, preparation techniques, seasonality, sourcing, and nutritional characteristics.

## Demo

[LIVE DEMO](https://field-kitchen-chi.vercel.app/)

## What it explores

- **Ingredient Library:** Browse the prototype ingredients and inspect their modeled seasonal, regional, preparation, pairing, and nutrient attributes.
- **Pairing Field:** Explore technique-aware strong, medium, and experimental relationships between ingredients.
- **Seasonal Map:** Compare modeled harvest windows across a shared annual timeline.
- **Source Map:** View ingredients through local and wild-foraged sourcing layers and regional habitat context.
- **Nutrient View:** Compare four illustrative nutrient indices through a metric-driven radial visualization.
- **Preparation Guide:** Review preparation techniques as cards or as an ingredient-to-technique matrix.

## Current data status

This release uses a small modeled prototype dataset. Nutritional values are illustrative normalized indices, seasonality reflects the prototype model, and pairing relationships are curated or modeled prototype relationships. The data should not be treated as authoritative nutrition, foraging, agricultural, food-safety, or culinary guidance.

## Development history

The interface was initially prototyped in Figma Make and exported as a React application. The export was then extracted and developed as a standalone codebase: generated scaffold and dependencies were audited and reduced, obsolete Make infrastructure was removed, strict TypeScript tooling was established, prototype model and state inconsistencies were reconciled, responsive and accessibility defects were repaired, and regression coverage was added with Vitest and Playwright.

## Stack

- React
- TypeScript
- Vite
- Motion
- Tailwind CSS
- Vitest
- Playwright

## Running locally

```sh
npm ci
npm run dev
```

Vite normally serves Field Kitchen at `http://localhost:5173`.

## Verification

```sh
npm run check
npm run test:e2e
```

`npm run check` performs strict TypeScript checking, runs the unit suite, and creates a production build. `npm run test:e2e` runs the focused Chromium regression suite and manages its own local Vite server.

## Documentation

- [Prototype data model](docs/data-model.md)
- [Testing workflow](docs/testing.md)
- [Third-party attributions](ATTRIBUTIONS.md)

## Future development

Possible future work includes authoritative and sourced nutrition data, region-specific seasonality, a larger ingredient dataset, ingredient-availability or pantry concepts, explicit pairing provenance, and visualizations driven by real data.
