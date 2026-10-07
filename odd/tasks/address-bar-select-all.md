# Feature: address-bar-select-all

Rama: `feat/address-bar-select-all` (a crear antes del primer write de código; `main` está en `8e1c352`).

## Objective
Que el doble click sobre el input de la barra de dirección (`#address`) seleccione **todo** el contenido, en **todas** las ventanas que tienen barra de dirección, y que cualquier ventana nueva lo herede sin wiring propio.

## Problem
El gesto no está implementado en ninguna ventana. Hoy solo ocurre el comportamiento nativo del navegador, que con doble click selecciona **una palabra**, no el valor completo:

- `My Documents` → selecciona `My` **o** `Documents`.
- `My Computer \ <folder>`, `Papelera de reciclaje`, una URL → selecciona un token.
- `Portfolio` (valor de una sola palabra) → el resultado nativo **coincide** con "seleccionar todo". Ese es el motivo por el que el gesto *parece* funcionar en algunas ventanas y en otras no.

## Why
Pedido del usuario (validación primero, autorización de fix después): "valida que en la barra de direccion address de todas las ventanas funcione el doble click para seleccionar todo el contenido del input".

## Hallazgos verificados (por lectura)

| # | Hallazgo | Evidencia |
|---|---|---|
| 1 | Ocho apps construyen su propia barra de dirección y su propio input con `id = 'address'` | `SearchApp/index.tsx:262`, `IExplorerApp/index.tsx:631`, `RecycleBin/index.tsx:460`, `FileExplorerApp/index.tsx:703`, `MyComputer/index.tsx:514`, `MarkdownViewerApp/index.tsx:321`, `DriveApp/index.tsx:596`, `Portfolio/index.tsx:477` |
| 2 | **Ninguna** cuelga un handler de `dblclick` ni llama a `select()` / `setSelectionRange()` sobre ese input | barrido de `dblclick`, `onDoubleClick`, `selectAll`, `setSelectionRange`, `.select()` en `src/` y `public/`: los únicos usos son `DriveApp:1651` (input de renombrado), `DriveApp:1680` (abrir archivo), `NotepadApp`, `IExplorerApp:343` (foco+select al navegar) y `Window.js` (doble click en titlebar para maximizar) |
| 3 | Las ocho usan el mismo contrato estructural: `#address` dentro de `#address-compound-input`, dentro de `#address-bar` | grep de `address-compound-input`: las ocho lo asignan; `src/index.css:308-338` define las tres reglas |
| 4 | **Varias ventanas coexisten en el mismo documento con el mismo `id`** | `src/components/Desktop.tsx` monta todos los `.window` en un solo documento (`App.tsx:82-84`) |
| 5 | Hay un solo shell de escritorio: `App.tsx` → `DesktopProvider` → `Desktop` → `Window[]` | `src/App.tsx:82-84`, `src/components/Desktop.tsx:2,10` |
| 6 | El doble click nativo selecciona una palabra, no el valor | comportamiento de navegador; **pendiente de evidencia runtime** (ver Mediciones) |
| 7 | El repo **no tiene test runner** | `package.json` scripts: `dev`, `dev:https`, `build`, `lint`, `typecheck`, `preview`, `deploy` |

## Decisiones tomadas

| Dimensión | Decisión |
|---|---|
| Alcance | Las ocho ventanas con barra de dirección, más cualquier ventana futura |
| Implementación | **Un solo listener delegado en `document`**, instalado por el shell del escritorio. No ocho copias del gesto |
| Por qué delegado y no un helper por ventana | El problema de fondo es que ocho copias ya divergieron (no hay factory de barra de dirección). Un helper que cada ventana tiene que recordar llamar reproduce la misma clase de bug; el listener delegado cubre presente y futuro con cero wiring por app |
| Por qué `event.target` y no `getElementById` | Hallazgo 4: hay varios `#address` simultáneos. `getElementById` resuelve siempre la primera ventana y dejaría siete rotas. El `target` del evento no tiene ese problema |
| Dónde vive el contrato | El predicado y el handler en `src/utils/explorerChrome.ts`, que ya es el módulo que documenta el contrato del chrome Explorer (`#address-bar`, `#address-compound-input`); la instalación en `src/components/Desktop.tsx` |
| Guarda | `instanceof HTMLInputElement` + `id === 'address'` + `closest('#address-compound-input')`. Acota a la barra de dirección y no toca ninguna otra superficie (titlebar, listados, Notepad) |
| `preventDefault` | No. El `select()` corre después de la acción por defecto del `dblclick`, así que gana sobre la selección de palabra sin pelear con el evento |
| Inputs `readOnly` | Se cubren igual (`MyComputer`, `RecycleBin`, `DriveApp`, `MarkdownViewerApp` son readOnly): `select()` funciona sobre inputs readonly y con foco |
| i18n / CSS / DOM de las apps | No se tocan. Cero cambios en las ocho apps |

## Scope

- [x] **T1 — `src/utils/explorerChrome.ts`:** `isAddressBarInput(target)` (guarda estructural, exportada) + `selectAllOnDoubleClick(event)` (handler, no instala nada). Comentarios en inglés, como el resto del módulo.
- [x] **T2 — `src/components/Desktop.tsx`:** instalarlo una vez con `useEffect` (`document.addEventListener('dblclick', …)`) y limpiarlo en el cleanup.
- [x] **T3 — `README.md`:** una línea en `### Explorador de Archivos` (línea 164) con el gesto.
- [x] **T4 — Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` + re-medición con el rig CDP (Chromium cacheado de Playwright) en las ocho ventanas: doble click real → `selectionStart === 0 && selectionEnd === value.length`.
- [ ] **T5 — Commit** de unidad de trabajo en `feat/address-bar-select-all` con el mensaje convencional, y la identidad del commit registrada acá.

## Mediciones

### Antes (estado sin fix) — medido

Verificación runtime delegada a `gentle-ai-verify` sobre el working tree sin arreglar: Vite en `localhost:5173` + Chromium cacheado de Playwright (`chromium-1243`) manejado por CDP con `Input.dispatchMouseEvent` (clicks reales, no eventos sintéticos de JS). Cada ventana se abrió clickeando su ícono del escritorio y el doble click se disparó sobre el `#address` de la ventana nueva. `activeElementMatches: true` en todos los casos y `consoleErrors: []`.

| Ventana | `value` medido | readOnly | doble click `start..end` | Veredicto |
|---|---|---|---|---|
| My Documents #1 | `My Documents` | no | `3..12` | WORD_ONLY |
| My Documents #2 (segunda instancia) | `My Documents` | no | `3..12` | WORD_ONLY |
| Markdown Viewer #1 | `content/features` | sí | `8..16` | WORD_ONLY |
| Markdown Viewer #2 | `content/features` | sí | `8..16` | WORD_ONLY |
| My Computer | `My Computer` | sí | `3..11` | WORD_ONLY |
| Search Files | *(vacío)* | no | `0..0` | NOTHING_SELECTED |
| Portfolio | `Portfolio` | no | `0..9` | SELECT_ALL **por coincidencia** (un solo token) |
| My Drive | `desktop-web` | sí | `8..11` | WORD_ONLY |
| Recycle Bin | `Google Drive trash` | sí | `13..18` | WORD_ONLY |
| Internet Explorer | `https://masinfo.online/` | no | `22..23` | WORD_ONLY |

Barrido por número de clicks en la misma ventana (My Documents #1): 1 click → `12..12` (caret al final), 2 clicks → `3..12` (una palabra), 3 clicks → `0..12` (**todo**). El barrido de 3 clicks es idéntico en todas las ventanas no vacías: la selección completa hoy existe **solo** por triple click nativo.

**Consistencia:** comportamiento uniforme en las ocho ventanas, sin diferencia por app. Coincide con la lectura del código: ningún `#address` tiene `dblclick` ni `select()`. El único `dblclick` del código es `DriveApp/index.tsx:1651` sobre `.drive-rename-input`, y el `urlInput.select()` de `IExplorerApp/index.tsx:343` sale solo del menú Editar, nunca de un doble click.

**Correcciones a supuestos previos:** el hallazgo 6 queda confirmado con medición (palabra, no valor completo). `DriveApp` **sí** tiene barra de dirección con `readOnly` aun desconectada (no dependía del login). `MarkdownViewerApp` se abre con **un solo click** sobre un `.md` del listado (`FileExplorerApp/index.tsx:846` ata `'click'`, no `'dblclick'`).

Datos crudos: `/tmp/ab-verify/results2.json` (10 pasos medidos, 11 `#address` en el DOM, 12 `.window`). Scripts: `/tmp/ab-verify/{cdp,smoke,probe,run,run2,inspect}.mjs`. Verificador: servidor y Chromium detenidos al terminar, sin listeners en 5173/9222.

### Después (con fix) — medido, en verde

Mismo rig y **mismos flags** que la medición anterior (`--window-size=1400,900`, recuperados del log del verificador previo; un primer intento sin ellos dio un viewport de 780×437 donde la primera ventana tapaba todos los íconos del escritorio y se descartó). Verificador independiente distinto del writer, que además re-corrió los tres checks por su cuenta.

| Ventana | readOnly | Antes `start..end` | Después `start..end` | Veredicto |
|---|---|---|---|---|
| My Documents | no | `3..12` WORD_ONLY | **`0..12`** | PASS |
| My Computer | **sí** | `3..11` WORD_ONLY | **`0..11`** | PASS |
| My Drive | **sí** | `8..11` WORD_ONLY | **`0..11`** | PASS |
| Recycle Bin | **sí** | `13..18` WORD_ONLY | **`0..18`** | PASS |
| Internet Explorer | no | `22..23` WORD_ONLY | **`0..23`** | PASS |
| Portfolio | no | `0..9` (coincidencia) | `0..9` | PASS |
| Markdown Viewer | **sí** | `8..16` WORD_ONLY | **`0..16`** | PASS |
| Search Files (vacío) | no | `0..0` no-op | `0..0` no-op | PASS |

`activeElementMatches: true` en los ocho doble clicks.

**Controles que prueban el diseño, no solo el síntoma:**

1. **Trampa del id duplicado** (el control decisivo): con **2** `#address` en el documento, doble click sobre el **no primero** (My Computer) → `0..11` completo, y el primero (My Documents) **sin cambios en `0..0`**. Repetido al revés (doble click sobre el primero) → `0..12` y el segundo intacto. Este control es exactamente el que fallaría un fix con `getElementById('address')`.
2. **Alcance de la guarda**: con la barra de My Documents en `0..0` y también con `0..12` pre-seleccionado, doble click en el textarea de Notepad, en una fila del listado (`content/features.md`) y en el fondo del escritorio → la selección de la barra **no se mueve** en ninguna combinación.
3. **Regresión de os-gui**: doble click en `.window-title-area` → `maximized: false → true`, rect `364,162 780×540 → 0,28 1400×729`. El gesto preexistente sigue funcionando.
4. **Triple click**: sigue seleccionando todo en las ocho (nativo, sin tocar).
5. **Consola**: cero entradas en `Runtime.consoleAPICalled` (error), `Log.entryAdded` (error) y `Runtime.exceptionThrown` en las tres corridas.
6. **Checks independientes**: `typecheck` exit 0, `lint` exit 0, `build` exit 0 (`✓ built in 1.25s`, solo el warning preexistente de chunk >500 kB).
7. **Cero escrituras del verificador**: sha256 de `git status --short` y de `git diff --stat` idénticos antes y después.

**Límites:** no se midió viewport móvil/resize (<768px), ni la etiqueta de Recycle Bin en otro idioma, ni los estados post-login de Drive. El negativo del fondo del escritorio salió de la corrida 3 y no de la 5, porque el intento de restaurar la ventana maximizada del criterio 3 reusó coordenadas viejas y no desmaximizó (no era un criterio de aceptación).

**Evidencia:** rojo `/tmp/ab-verify/results2.json` (sha256 `86676b8c…`); verde `/tmp/ab-verify/results3.json` (`0a7ab412…`), `results4.json` (`94ba0183…`), `results5.json` (`0d9a1e20…`). Scripts: `/tmp/ab-verify/{run3,run4,run5,cdp}.mjs`. Logs de checks: `/tmp/ab-verify/{typecheck,lint,build}.log`. Servidor y Chromium detenidos: sin listeners en 5173/9222.
