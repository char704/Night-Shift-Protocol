# Night Shift Protocol

A browser-based branching horror game built with HTML, CSS, and vanilla JavaScript.

You work the night shift at an isolated convenience store beside an abandoned highway. From 00:00 to 06:00, a strange protocol, impossible customers, and shifting CCTV feeds decide whether you survive the shift, replace someone else, or break the loop.

## Play

Open `index.html` directly in a browser.

No build step, server, framework, backend, or database is required.

## Features

- Text-based branching horror story with 10 timeline events.
- Five reachable endings:
  - The Perfect Employee
  - Replacement
  - False Escape
  - Beneath the Store
  - Break the Protocol
- Game state tracked through sanity, attention, evidence, rules broken, inventory, and story flags.
- Skippable typewriter effect.
- Keyboard choice support with `1-4` and `A-D`.
- Restart, save/load via `localStorage`, and sound toggle.
- Responsive VHS/CRT-inspired interface.
- Placeholder media fallback so missing assets do not show broken image icons.

## Project Structure

```text
index.html
css/
  style.css
js/
  state.js
  story.js
  game.js
assets/
  images/
  gifs/
  audio/
```

## Development

The project intentionally uses only browser-native technologies.

Useful checks:

```bash
node --check js/state.js
node --check js/story.js
node --check js/game.js
```

## Notes

Visual Studio workspace files are ignored with `.gitignore`; local `.vs/` state should not be committed.
