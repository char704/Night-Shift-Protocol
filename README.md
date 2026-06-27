# Night Shift Protocol

A browser-based branching horror game built with HTML, CSS, and vanilla JavaScript.

You work the night shift at an isolated convenience store beside an abandoned highway. From 00:00 to 06:00, a strange protocol, impossible customers, and shifting CCTV feeds decide whether you survive the shift, replace someone else, or break the loop.

## Features

- Text-based branching horror story with 10 timeline events.
- Five reachable endings:
  - The Perfect Employee
  - Replacement
  - False Escape
  - Beneath the Store
  - Break the Protocol
- State tracked through sanity, attention, evidence, rules broken, inventory, and story flags.
- Skippable typewriter effect.
- Keyboard choice support with `1-4` and `A-D`.
- Restart, save/load via `localStorage`, and sound toggle.
- Responsive VHS/CRT-inspired interface.
- Image fallback text for missing secondary media.
- Lightweight story validation script with no external dependencies.

## Controls

- Click a choice button to continue.
- Press `1-4` or `A-D` to select visible choices.
- Click the narrative text or media area while text is typing to skip the typewriter effect.
- Use **Load**, **Sound On/Off**, and **Restart** from the top controls.

Modifier-key shortcuts such as `Ctrl+A`, `Cmd+A`, and `Alt+A` are ignored for choice selection.

## Run Locally

The game can be opened directly from `index.html`.

For the most browser-consistent local run, start a small static server from the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

No framework, backend, database, build step, or package install is required.

## Project Structure

```text
index.html
css/
  style.css
js/
  state.js
  story.js
  game.js
scripts/
  validate-story.js
assets/
  images/
  gifs/
  audio/
```

## Screenshots

Screenshots will be added after the approved asset integration is complete.

## Development Status

Current status: playable prototype with all major story beats and endings implemented.

Recent cleanup focused on:

- replacing broken media paths with tracked assets;
- preventing duplicate choice execution;
- hardening save/load behavior;
- preserving all endings while tightening true-ending requirements;
- improving mobile stat visibility and media presentation.

## Validation

Run syntax checks:

```bash
node --check js/state.js
node --check js/story.js
node --check js/game.js
```

Run story validation:

```bash
node scripts/validate-story.js
```

## Browser Support

The game uses standard browser APIs and should work in current desktop and mobile versions of:

- Chrome
- Edge
- Firefox
- Safari

`localStorage` is used for save/load. Browsers or privacy modes that block local storage may disable save persistence.

## Credits

Game concept, writing, and implementation are maintained in this repository.

## Asset Notes

Approved images live in `assets/images/`. Several secondary scenes intentionally reuse approved assets until more specific artwork is available. Missing image files should not break gameplay; the media area falls back to scene text.

## License

No license has been specified yet.

## Repository Hygiene

Visual Studio workspace files are ignored with `.gitignore`; local `.vs/` state should not be committed.
