# Set

Card game "Set" built with React + Vite.

- **Menu**: play vs Bot (easy / medium / hard), or 2 / 3 / 4 players on the same board.
- **Vs Bot**: pick any 3 cards — checked automatically. Right = +1, wrong = -1.
- **2-4 players (speed)**: first to press their own "Set" button (or key A / L / Z / M) gets 10 seconds to pick 3 cards. Right = +1, wrong or timeout = -1.
- **Card pictures**: replace the 3 shapes with your own images in-game, or set defaults in `src/game/config.js`.

```
npm install
npm run dev
```

Structure: `src/game/` (rules, state hook, config) · `src/components/` (UI).
