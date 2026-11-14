# Field Kitchen

Field Kitchen is a proof-of-concept planning tool for small kitchens. Choose the ingredients you have, and it suggests dishes, sides, drinks and preserves you could make. Each idea shows a short method, what else it needs, and where it comes from.

## Demo

[LIVE DEMO](https://field-kitchen-chi.vercel.app/)

## How it works

- **Kitchen:** select ingredients from 18 everyday items and a separate Specialty & botanicals group. Ideas update as you choose. Each one shows whether it is ready to make or what it still needs, with a method, pantry staples, the reasoning behind it, its basis and its sources. **Copy idea** produces a plain-text card.
- **Ingredients:** a USDA FoodData Central nutrition record and Oregon availability for each ingredient, where a source exists, plus the ideas it appears in.
- **Seasons:** typical Oregon availability by month, from a 2017 reference chart (not live supplier stock), with the current month marked.
- **Sources:** the provenance levels, the ranking rules, every source and the known limits.

## Data status

Information is labelled as a sourced fact, a curated recommendation or a prototype assumption (pantry staples are assumed to be on hand). Nutrition comes from USDA FoodData Central SR Legacy records. Availability comes from an Oregon Department of Education chart (2017). Established preparations cite a culinary reference. Fields without a verified source are left out. Field Kitchen is not a source of complete nutrition, allergen, food-safety or wild-plant identification information, and its ideas are preparation concepts, not tested recipes. See [docs/data-model.md](docs/data-model.md).

## Development history

Field Kitchen began as a Figma Make prototype and was exported as a React application. It was then developed as a standalone codebase with a smaller dependency set, strict TypeScript tooling, responsive and accessibility fixes, and Vitest and Playwright coverage. The first version had six visualisations over an eight-ingredient modelled dataset. The current version replaces them with an ingredient-to-preparation workflow built on sourced data.

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

Possible next steps: tested recipes with quantities and yields, per-recipe costing, allergen tagging from a verified source, availability for more regions and herbs, and a larger preparation set.
