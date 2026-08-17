# Field Kitchen Testing

Field Kitchen uses a small regression suite: fast Vitest checks for data and pairing logic, plus a focused Playwright smoke suite for critical browser behavior.

## First-time setup

Install the exact dependencies recorded in `package-lock.json`:

```sh
npm ci
```

Install the Chromium browser used by Playwright:

```sh
npx playwright install chromium
```

The browser installation is normally required once per computer, and again if a later Playwright update requests a newer browser build.

## Run Field Kitchen locally

```sh
npm run dev
```

Vite normally serves the application at `http://localhost:5173`. Open that address in a browser. Press `Ctrl+C` in the terminal to stop the server.

## Fast automated check

```sh
npm run check
```

This runs strict TypeScript checking, the fast unit tests, and a production build. It does not launch the browser suite.

The individual commands are:

```sh
npm run typecheck
npm run test:unit
npm run build
```

## Browser regression tests

```sh
npm run test:e2e
```

Playwright automatically starts and stops the local Vite server. Successful runs retain no screenshots or traces; failures retain diagnostic artifacts in `test-results/`.

## Manual testing checklist

1. Confirm the Landing screen loads.
2. Open Ingredient Library and select an ingredient.
3. Change the region filter and confirm the visible ingredients and detail state remain consistent.
4. Open Pairing Field, select an ingredient, and apply a preparation filter.
5. Inspect Seasonal Map and its intentional horizontal timeline scrolling.
6. Inspect Source Map details using click or tap rather than hover alone.
7. Inspect Nutrient View details using click or tap.
8. Open Preparation Guide and check both cards and the horizontally scrollable matrix.
9. Narrow the browser or use mobile emulation and check the changed feature.
10. Use keyboard focus to open one ingredient detail, then close it with Escape and confirm focus returns.
11. Optionally enable reduced motion and confirm the Seasonal Map sweep stops.

For future changes, manually inspect the changed feature and directly related interface. The automated suite covers the main application, state, accessibility, motion, and overflow regressions.

## Before committing future changes

Run:

```sh
npm run check
npm run test:e2e
```

Then manually inspect only the changed feature and any directly related UI.
