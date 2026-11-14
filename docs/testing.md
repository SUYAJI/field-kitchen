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

1. Confirm the landing page explains the product and **Choose ingredients** opens the Kitchen.
2. Select two or three ingredients and confirm ideas appear, with ready-to-make ideas first.
3. Open an idea and check the method, the ingredients you still need, the pantry staples, the basis and the source links.
4. Remove an ingredient, or add one with a **+ ingredient** button inside an idea, and confirm the ideas update.
5. Use **Copy idea** and paste the result somewhere to check the plain text.
6. Open Ingredients, then an ingredient detail. Check the USDA record, Oregon availability (or "Not shown") and the links.
7. Open Seasons. Confirm the current month is marked "Now" and, on a phone width, that the timeline opens near the current month.
8. Open Sources and confirm every source link opens.
9. Narrow the browser or use mobile emulation, and check the **See ideas** bar on the Kitchen.
10. Use the keyboard to select ingredients (Space or Enter) and to open and close an ingredient detail with Escape.

For future changes, manually inspect the changed feature and directly related interface. The automated suite covers the recommendation logic, the main workflow, copying, keyboard use, dialogs and mobile overflow.

## Before committing future changes

Run:

```sh
npm run check
npm run test:e2e
```

Then manually inspect only the changed feature and any directly related UI.
