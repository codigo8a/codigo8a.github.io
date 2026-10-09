# Encarta 2009 — Replace app content with the green-toolbar replica

## Objective
Replace the current "Mi Primera Encarta" (Encarta 95 chrome) app content with the
user-supplied **Encarta 2009 replica**: green toolbar, orange curved background,
3D SVG category buttons, blue center panel, retro modal, Web Audio SFX, quiz,
paint canvas and search.

## Problem
The current app renders an older Encarta 95-style screen with stubbed buttons
(`showMessageBox ... Funcionalidad no implementada`). The user wants the 2009
design and behavior instead.

## Why
Visual and behavioral fidelity to the real "Mi Primera Encarta 2009" for a
portfolio site. User explicitly chose delivery strategy **B: use the
`cdn.tailwindcss.com` Play CDN** and keep the supplied markup/utilities literal,
rather than hand-porting ~50 Tailwind utilities to plain CSS.

## Scope

### In scope
- `src/apps/EncartaApp/launchEncarta.ts` — full rewrite of the imperative build
- `src/apps/EncartaApp/index.css` — full rewrite of the stylesheet
- `src/apps/EncartaApp/index.tsx` — keep the placeholder (component never renders)

### Out of scope
- `apps.ts` registry, i18n strings, Start Menu entry, window sizing
- Any other app, the Win98 shell, `public/os-gui/*`
- `index.html` (deliberately NOT touched — see Constraints)

## Constraints

1. **Tailwind preflight must stay disabled.** `index.html:14` loads
   `os-gui/windows-98.css` globally. Tailwind's preflight resets margins,
   box-sizing and form controls globally and would wreck the Win98 UI.
   Configure `corePlugins: { preflight: false }` after the CDN script loads.
2. **CDN is loaded lazily on Encarta launch, not in `index.html`.** This is a
   public portfolio site; a blocking global `<script>` would add a network
   dependency and dead weight for every visitor who never opens Encarta.
3. **No inline `style.cssText` for layout.** The old code set inline styles that
   overrode the stylesheet, making `index.css` effectively dead. New code must
   express layout through the stylesheet.
4. **`*` resets must be scoped.** The supplied CSS does `* { box-sizing; margin;
   padding; font-family; user-select: none }`. `user-select: none` and the font
   override must be scoped under the Encarta root, never global.
5. No Tailwind dependency in `package.json`; no build-time Tailwind.
6. Artifacts stay in English/brand-neutral per project conventions; the Spanish
   encyclopedia content is user-supplied copy and is preserved verbatim.

## Tasks

- [ ] **T1 — Tailwind CDN loader** (route: inline decision, inside `launchEncarta.ts`)
      Inject `https://cdn.tailwindcss.com` on launch, await load, then set
      `tailwind.config = { corePlugins: { preflight: false } }`. Idempotent across
      relaunches.
- [ ] **T2 — Rewrite `launchEncarta.ts`** (route: delegated writer)
      Keep the os-gui window lifecycle: `window.$Window` → `applyCascadeAndFit` →
      `registerOsWindow` → append container into `$win.$content`.
      Port the markup literally into a template string, set via `container.innerHTML`.
      Port: `categoryData`, `renderCentralScreen`, `selectCategory`,
      `openItemModal`, `checkAnswer`, `initCanvas`, `closeModal`, `triggerMenu`,
      `performSearch`, `playSound` (Web Audio).
- [ ] **T3 — Rewrite `index.css`** (route: delegated writer, same pass as T2)
      Port the supplied `<style>` block, prefixed `encarta-` where the class is
      project-owned, keeping `.col-left`/`.col-right` compound selectors and the
      custom scrollbar + responsive rules.
- [ ] **T4 — Verification** (route: delegated verify / inline bounded)
      `npm run typecheck`, `npm run lint`, `npm run build`.

## Authorized edit surface
```
src/apps/EncartaApp/launchEncarta.ts
src/apps/EncartaApp/index.css
```

## Acceptance criteria
- [ ] Encarta window opens via Start Menu → "Mi Primera Encarta" and renders the
      Encarta 2009 layout (green toolbar, orange background, blue center panel).
- [ ] "Juega y aprende" is the default active category on open.
- [ ] Clicking a category switches the active 3D button (blue SVG path) and
      re-renders the center list.
- [ ] Hover previews the active blue path on non-active buttons only.
- [ ] Clicking a list item opens the retro modal; the Geografía item renders the
      4-option quiz; the "arte" item renders the paint canvas.
- [ ] Search + Enter and the green go button open a result modal.
- [ ] Web Audio SFX play on click/chime/win without throwing when autoplay-blocked.
- [ ] No Tailwind preflight leakage onto the Win98 shell or other apps.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` all pass.

## Applicable checks
- Test-first: **not applicable** — this repo has no test runner
  (no vitest/jest config, no `test` script). Structural + build verification instead.
- `npm run typecheck` (tsc --noEmit)
- `npm run lint` (eslint .)
- `npm run build` (vite build)

## Delivery strategy
- Forecast authored changed lines: ~1100 (2 files, full replacement)
- Strategy: **single-pr** — one cohesive visual rewrite, no chain needed yet
- RDD: native review candidate is the work-unit commit, not this checkbox

## Progress
- **T1 done** — `ensureTailwind()` + `applyTailwindConfig()` in `launchEncarta.ts`:
  cached promise, idempotent, never rejects, preflight forced off.
- **T2 done** — `launchEncarta.ts` rewritten to 788 lines. Markup verbatim in
  `APP_MARKUP`, typed data model, lazy `AudioContext`, no inline `cssText`.
  `showMessageBox` + dead `MenuBar` reference removed. os-gui lifecycle intact.
- **T3 done** — `index.css` rewritten to 505 lines. Rule names match the markup
  verbatim (no `encarta-` renaming). `body{}` dropped; global `*` reset scoped
  under `:where(.app-window *)` at zero specificity so the CDN cannot win it.
- **Parent fix applied** — mount no longer awaits the CDN. `mountEncarta` +
  `$win.$content.append` are synchronous; the Tailwind await is fire-and-forget.
  Previously an empty window was shown for up to 3s on first launch.
- **T4 BLOCKED** — see below.

### T4 verification evidence — COMPLETE
`npm install` was authorized and unblocked the toolchain (427 packages added;
`node_modules` had been left with only scoped namespaces and no unscoped
packages).

- `npm run lint` → **PASSES CLEAN**, zero output.
- `npm run build` → **PASSES**: 388 modules transformed, built in 1.43s.
- `npm run typecheck` → **FAILS with 18 errors, ALL pre-existing baseline.**
  - 17 are the project-wide `applyCascadeAndFit($win, ...)` mismatch:
    `OsGuiWindow` lacks `outerWidth`/`outerHeight`. Identical error in
    DriveApp, FileExplorerApp, IExplorerApp, MarkdownViewerApp, MSDOS,
    MyComputer, Network, NotepadApp, Portfolio, RecycleBin, SearchApp,
    SettingsApp, SoundRecorder, TankStrikeApp, WelcomeApp — and in
    EncartaApp's own `applyCascadeAndFit` call, which is unchanged from the
    previous implementation.
  - 1 is `cascadePosition.ts(112,12)`, a `string` argument mismatch.
  - `TankStrikeApp` `bringToFront` is missing from `OsGuiWindow`.
  - **My contribution: 0.** One error WAS mine and is now fixed —
    `window.AudioContext` does not exist on the TS `Window` interface (it is an
    ambient global in lib.dom.d.ts). Both `AudioContext` and the legacy
    `webkitAudioContext` are now declared on the narrowed scope type.
    Total went 19 → 18.

Additional checks:
- Class cross-reference: every custom class in `APP_MARKUP` has an `index.css`
  rule. Unmatched names are only Tailwind utilities and the four JS-toggled
  classes (`path-normal`, `path-active`, `hidden`, `is-active`).
- Core behavior rules confirmed: `rotateY(±12deg/±6deg)` + `translateZ`,
  `.is-active` compound rules for both columns, `.modal-overlay.active`,
  `@keyframes modalPop`, custom scrollbar, `@container` responsive blocks.
- Dev server: `http://localhost:5173/` returns HTTP 200, and
  `launchEncarta.ts` transforms with HTTP 200 and no transform error.
- Bundle markers confirmed in `dist/assets/index-*.js`: `cdn.tailwindcss.com`,
  `preflight`, `Atrás`, `Juega y aprende`, `artCanvas`, `Juegos con arte`.

## Next step
Open `http://localhost:5173/` → Start → "Mi Primera Encarta" and eyeball the
Encarta 2009 screen. Then decide on the leftover PNG assets from the old design.

## Known environmental failures
- `npm run typecheck` has an 18-error pre-existing baseline (see above). Do not
  attribute it to this change. Fixing `applyCascadeAndFit`'s signature is a
  separate, repo-wide task.
- `npm audit` reports 22 vulnerabilities (1 low, 3 moderate, 18 high). Untouched
  by this change; not in scope.

## Open risks to revisit after T4
- `performSearch` interpolates raw input into modal `innerHTML` (faithful to the
  replica). Local-only XSS surface; escape it if the app ever accepts remote data.
- Inline `onclick` globals bind to the most recently launched instance, so two
  concurrent Encarta windows would cross-talk. The desktop reuses one window per
  appId in practice.
- `@container` needs a 2023+ browser; older ones clip the center panel.