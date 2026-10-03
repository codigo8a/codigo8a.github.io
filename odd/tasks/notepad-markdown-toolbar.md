# Notepad: Markdown toolbar + in-memory document store

## Objective

Turn Notepad from a decorative textarea into a usable markdown scratchpad: add a
Win98 formatting toolbar that inserts markdown syntax, and make `File > Save` /
`File > Open` actually work against an in-memory document store that survives
window close but is intentionally discarded on page reload.

## Problem

Notepad is the only Win98 app in the site whose core menu actions are stubs, and
a user who types into it loses everything on window close.

- `File > Open` and `File > Save` render `"not implemented"`
  (`src/apps/NotepadApp/index.tsx:73`, `:78`).
- `src/hooks/useFileSystem.ts:8` reads markdown through `import.meta.glob`, which
  Vite resolves at build time. The site has no runtime write path anywhere.
- `import.meta.glob` is duplicated in seven places (FileExplorerApp, SearchApp,
  MyComputer, WelcomeApp, Portfolio, useFileSystem), and `useFileSystem` is
  consumed only by `useUrlRouting`. There is no single writable "system" to save
  into today.

A markdown formatting toolbar on top of that would be theater: the user formats
text that cannot be kept. Persistence has to exist for formatting to mean
anything.

## Scope

Authorized: the in-memory option. A module-level `Map` survives window close and
navigation, consumes zero storage, and is discarded on reload. Explicitly out of
scope: `localStorage`, `sessionStorage`, IndexedDB, any backend, any write to the
real `src/data/files/**/*.md` sources, and making saved documents visible in File
Explorer, Search, My Computer, or Portfolio. Those depend on consolidating the
seven glob sites and belong to a separate feature.

## Tasks

- [ ] T1 — Enable the two missing APIs the feature depends on
- [ ] T2 — In-memory document store + real File menu (New / Open / Save)
- [ ] T3 — Markdown formatting toolbar with correct insertion semantics

## Allowed edit surfaces

- `src/apps/NotepadApp/index.tsx`
- `src/apps/NotepadApp/index.css`
- `src/types/os-gui.d.ts`
- `src/utils/osWindowRegistry.ts`

## Acceptance criteria

- `File > Save` no longer shows "not implemented". It writes the textarea content
  into the in-memory store, clears the dirty flag, and updates the window title
  to `<name>.md - Notepad`, or `<name>.md * - Notepad` while unsaved.
- `File > Open` lists the documents saved in the current page session and loads
  the chosen one into the textarea.
- `File > New` and `File > Exit` warn before discarding unsaved changes. The
  titlebar close button does NOT warn yet; see Open limitations.
- A second Notepad window can open a document saved by the first one.
- The taskbar label tracks the current document title, not the title present at
  window creation.
- The toolbar inserts correct markdown for both the selection and the no-selection
  case, and toggles block prefixes instead of doubling them.
- `npm run lint`, `npm run typecheck`, and `npm run build` all pass.

## Checks

There is no test runner in this project, so the applicable verification is
`npm run lint`, `npm run typecheck`, and `npm run build`, plus a manual
structural readback of the behaviour described in the acceptance criteria.
Test-first does not apply: no runnable deterministic test target exists for this
app.

## Progress

| Task | Route | Trigger | Status | Verification | Commit |
|------|-------|---------|--------|--------------|--------|
| T1 | delegated writer | 2+ non-trivial files | done | `npm run typecheck` clean | pending user approval |
| T2 | delegated writer | same writer | done | 0 remaining "not implemented" strings | pending user approval |
| T3 | delegated writer | same writer | done | structural readback of 8 buttons | pending user approval |

Route note: exploration was already completed inline within the evidence budget
(6 bounded lookups across Notepad, os-gui, the registry, and the file system), so
implementation goes to one bounded writer instead of a separate explorer.

## Verification evidence

Writer-reported and parent-confirmed:

- `npm run lint`: pass, exit 0
- `npm run typecheck`: pass, exit 0 (re-run by the parent as the spot check)
- `npm run build`: pass, 382 modules, exit 0. Only warning is the pre-existing
  >500 kB chunk-size notice, unrelated to this change.
- `git diff --stat`: 4 files, 418 insertions, 9 deletions

## Open limitations

- The titlebar close button does not warn about unsaved changes. `File > Exit`
  does. Hooking the titlebar requires preventing os-gui's close event
  (`public/os-gui/Window.js:1716`), which needs an `on()` overload added to
  `OsGuiWindow`; that was outside the T1 authorization.
- The Link and Image buttons prompt for a URL only when there is no selection.
  With a selection they wrap it and leave a literal `(url)` placeholder.
- The toolbar separator sits before Heading, so Link and Image appear grouped
  with the block marks even though both are inline marks.
- Every new string is hardcoded English. This window is non-React and has no
  access to `useTranslation`, so there is no i18n bridge for it.
- Saved documents are invisible to File Explorer, Search, My Computer and
  Portfolio by design. That needs the seven consolidated glob sites, which is a
  separate feature.

## Next step

Ask the user for commit approval. Receipt-driven development is on globally, so
once the commit exists the candidate is assessed with
`gentle-ai review assess --cwd <repo> --agent opencode --base-ref <branch point> --committed-only --json`
and the returned `review_due` decides whether the native review lifecycle runs.