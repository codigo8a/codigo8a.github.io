# Feature: lint-typescript

## Objective
Hacer que `npm run lint` cubra y pase sobre el código fuente real del proyecto (TypeScript), sin falsos positivos del código vendored.

## Problem
El eslint.config.js solo cubría `**/*.{js,jsx}`:
- Todo el source `src/**` (TS/TSX) nunca se linteaba → el lint era decorativo.
- Los 67 errores "pre-existentes" eran 100% falsos positivos de la librería vendored `public/os-gui/` (globales de jQuery/`$Window`/`$Icon`).

## Why
El usuario pidió revisar los errores pre-existentes y eligió la opción B: alinear el lint de verdad al TypeScript.

## Scope
- [x] Ignorar `public/` (vendored) y `dist` en eslint.config.js.
- [x] Agregar cobertura TS/TSX con `typescript-eslint` (recommended) + react-hooks + react-refresh al config.
- [x] Instalar dep `typescript-eslint@^8.70.1`.
- [ ] T1: Fix mecánico — 30 `prefer-const` (let→const sin reasignación).
- [ ] T2: Fix mecánico — 24 `@typescript-eslint/no-unused-vars` (imports/vars/params sin uso).
- [ ] T3: Reducir 54 `no-explicit-any` — tipar los globales os-gui (`$Window`, `MenuBar`, `$Icon`, `jQuery`) vía `declare global`; `unknown` + narrowing donde aplique; disables justificados donde el interop con lib sin tipos lo requiera.
- [ ] T4: Decidir 17 `react-refresh/only-export-components` en módulos mixtos (IExplorerApp exporta componente + helpers imperativos) — split de archivo o disable con razón.
- [ ] T5: Corregir 9 reglas de hooks (refs en render, exhaustive-deps, set-state-in-effect) + 2 misc (`no-non-null-asserted-optional-chain`, `no-unused-expressions`).
- [ ] Verificación: `npm run lint` = 0 problemas, `npm run build` OK.

## Constraints
- NO tocar `public/os-gui/*` (librería vendored).
- Preservar comportamiento: build pasa, sin cambios funcionales.
- No deshabilitar reglas en masa para "pasar" el lint; disables puntuales con razón.

## Progress
| Task | Estado | Evidencia |
|---|---|---|
| Config + deps | ✅ | eslint.config.js, package.json |
| T1 | ✅ | 30 prefer-const corregidos (writer general, batch 1) |
| T2 | ✅ | 24 no-unused-vars corregidos (writer general, batch 1) |
| T3 | ✅ | 54 any resueltos: os-gui.d.ts (globales $Window/MenuBar/$), i18n keys, AppData/MenuDefinition, webamp tipos nativos (writer general, batch 2) |
| T4 | ✅ | 17 refresh resueltos vía allowExportNames (17 launchers/hooks reales) |
| T5 | ✅ | 10 hooks/misc corregidos: Clippy (refs→state, efecto derivado), DesktopIcons (ref en effect), Window (deps estables), useMediaQuery (lazy init), IExplorerApp/MarkdownViewer misc |

## Verificación final
- `npx eslint .` → **0 problems** ✅
- `npm run build` → pasa (solo warning pre-existente de chunk size) ✅
- `npx tsc --noEmit` → limpio tras fix de TS5097 ✅ (main.tsx importaba './App.tsx' con extensión explícita; único caso del repo — arreglado quitando la extensión para seguir la convención del proyecto)
- Código muerto eliminado en FileExplorerApp (bloque `(menu as any).menuItems` — menuItems nunca existió en MenuBar).

## Next step
Commit + push del cleanup a main (pendiente confirmación del usuario).