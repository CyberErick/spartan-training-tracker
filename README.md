# Spartan Training Tracker

A training log built as an installable Progressive Web App (PWA) for a 6-day hypertrophy/athletic split, structured around an 11-week progression block (accumulation → full recovery week → intensification → taper → race week).

Built with React + Vite, no backend — all data is logged and stored locally in the browser (`localStorage`), so it works offline once installed.

## Features

- **11-week periodized program** — accumulation, a full deload/recovery week, intensification, and taper phases, each with its own RIR (Reps In Reserve) targets and volume guidance
- **6-day split** — Push/Pull/Legs run twice (once hypertrophy-focused, once athletic/isometric-focused), with supersets and week-parity exercise swaps (e.g. Flat Bench Press on odd weeks, Incline DB Press on even weeks)
- **Per-set logging** — load, reps, and RIR (or movement quality for athletic days), with your last logged numbers for that exercise shown inline for quick reference
- **Recovery week protocol** — a dedicated flexibility/stability schedule replaces lifting entirely on the programmed deload week
- **History + CSV export** — every logged session is saved locally and can be exported to CSV
- **Installable PWA** — add it to your home screen / dock and it runs full-screen, offline-capable, with no install from an app store

## Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for the installable app manifest + service worker
- [lucide-react](https://lucide.dev/) for icons
- No backend — `localStorage` only

## Running locally

Requires Node.js.

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173` URL in your browser.

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx        # the entire app: program data + UI
  main.jsx        # React entry point
public/
  icons/          # PWA icons
vite.config.js    # Vite + PWA manifest config
```
