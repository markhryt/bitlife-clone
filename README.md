# 🌟 LifeSim — A Life Simulation Game

A BitLife-inspired life simulation MVP built with **Vite + React + TypeScript**.

## Quick Start

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- 🎭 **Character creation** with name and optional seed for deterministic runs
- 📊 **5 stat bars** — Health, Happiness, Smarts, Looks, Karma
- 💰 **Cash system** with passive income and event-based changes
- ⏩ **Age Up** advances one year, triggers 1-2 life events
- 🎲 **24 events** across childhood → teen → adult → elder life stages
- 🎯 **8 actions** — Study, Exercise, Socialize, Work, Rest, Risky Choice, Meditate, Self-care
- 💀 **Death conditions** — health hits 0 or random elder-year death
- 💾 **Save/Load** — 3 localStorage save slots
- ⌨️ **Keyboard shortcuts** — `A` to Age Up, `1-3` to make choices, `ESC` to close modals
- 🎰 **Seedable RNG** — same seed always produces the same event sequence

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **Vite** — Dev server and bundler
- **React 18** — UI framework
- **TypeScript** — Type safety
- **localStorage** — Persistence (no backend)
