# Feature: drive-explorer-chrome

## Objective
Hacer que la ventana de Google Drive (`src/apps/DriveApp/`) use exactamente la misma chrome que `MyComputer` y `FileExplorerApp` ("My Documents"): menú, barra de botones estándar con iconos, barra de dirección, panel izquierdo descriptivo, contenido y barra de estado. Las acciones que hoy viven en botones por fila pasan a los menús y a la barra.

## Problem
`DriveApp/index.tsx:285-305` arma su propio `drive-root` → `drive-toolbar` (botones de texto plano) + `drive-body` + `drive-status`, con CSS dedicado en `DriveApp/index.css`. Le faltan las cuatro piezas que definen la identidad Explorer: `MenuBar` de os-gui, iconos del sprite `browse-ui-icons`, panel izquierdo `#panel`, y barra de dirección `#address-bar-toolbar`. Resultado: se ve como un diálogo genérico dentro de una ventana 98, no como el Explorer del proyecto. Además el modelo de acciones está en el lugar equivocado: `Abrir` / `Editar` / `Papelera` son botones por fila (`index.tsx:724-728`), que en el Explorer real no existen.

## Why
El usuario lo pidió explícitamente: la ventana de Drive tiene que verse idéntica a My Documents / My Computer, con las barras, la presentación del contenido, los menús y las barras de herramientas, integrando los botones actuales de My Drive en esas barras.

## Decisiones tomadas

| Dimensión | Decisión |
|---|---|
| Modelo de interacción | **Opción A — Explorer auténtico.** Una sola selección, panel izquierdo descriptivo, los botones por fila desaparecen. Elegida por el usuario 2026-10-02 |
| Toolbar estándar | `Back` `Forward` `Up` deshabilitados (paridad visual con My Computer), `New` `Open` `Edit` `Save` `Delete` `Refresh`, y `Views` compuesto. **Sin** `Cut`/`Copy`/`Paste`: Drive no tiene historia de portapapeles, y botones muertos son peor que botones ausentes |
| Acciones | `Nuevo` en `File > New` + botón. `Abrir` / `Editar` / `Papelera` dependen de selección, en `File`, `Edit` y toolbar. `Save` solo en vista editor. `Refresh` en `View > Refresh` (F5) + botón. `Desconectar` en `File > Disconnect` |
| Vistas | Las 4 de My Computer: Large Icons, Small Icons, List, Details. Details con Name / Size / Modified |
| Barra de dirección | Compuesto `inset-deep`, ícono de Drive, valor = nombre de la carpeta del workspace, dropdown deshabilitado |
| Panel izquierdo | Siempre presente en las vistas con contenido. `#panel-info` describe la selección, o el texto "select an item" |
| Estados sin selección posible | `disconnected`, `reconnect`, `connecting`, `error`: panel centralizado, sin panel izquierdo ni toolbar estándar. No hay nada que seleccionar |
| Selección | Click único selecciona y actualiza el panel; doble click abre en el visor. `F5` refresca, `Delete` manda a la papelera |
| Invariante de selección | **Si no hay highlight visible, los iconos no pueden estar activos.** La selección se guarda como identidad (`selectedFileId`) y se repinta en cada render por los builders (`bindItem`), nunca como referencia a un nodo. `buildListView()` anula la referencia vieja antes de reconstruir; el foco se restaura al final de `renderView()`, acotado a `view === 'list'` para no robárselo al textarea del editor |
| i18n | Menús, botones y panel salen de las traducciones ES/EN existentes en `DriveApp` |
| Fuera de alcance | No se toca `MyComputer` ni `FileExplorerApp`. No se arreglan los bugs preexistentes que se listan abajo |

## Hallazgos verificados

| # | Hallazgo | Evidencia |
|---|---|---|
| 1 | **La mayor parte de la chrome vive en clases globales de `src/index.css`**, pero el panel izquierdo **no**: `.content-with-panel`, `#panel`, `.panel-*` están en `src/apps/MyComputer/index.css:3-62` (y duplicados en `FileExplorerApp/index.css:190+`) | `src/index.css:258-500` para `.os-explorer`, `.toolbars`, `.toolbar`, `#standard-buttons`, `#address-bar`, `#status-bar`. Corrección 2026-10-02: el hallazgo original decía que el panel estaba en `src/index.css` y era **falso** |
| 2 | `MenuBar` de os-gui acepta `enabled` (bool **o función**, reevaluado en cada apertura) y `shortcutLabel` | `public/os-gui/MenuBar.js:265-268`, `:664`, `:1050` (dispatch `update` al abrir) |
| 2b | **Un item con `checkbox` nunca ejecuta `action`**: corre solo `checkbox.toggle()` (`else if` en `:882-892`). Los radios reales usan el grupo `radioItems` con `getValue`/`setValue` (`:929-950`) | Por eso `checkbox: { type: 'radio', check }` **sin** `toggle` dibuja el punto pero no hace nada. El desplegable Views de My Documents está exactamente en ese error |
| 2c | El `.d.ts` de os-gui (`src/types/os-gui.d.ts`) declara un contrato **más angosto** que el que implementa `MenuBar.js`: `enabled?: boolean` sin función, sin `checkbox.type`, sin `radioItems` | El caller tiene que ensanchar localmente. Arreglar el `.d.ts` es el fix de fondo |
| 3 | El sprite `browse-ui-icons.png` tiene 63 íconos de 20×20 | Medido: PNG 1260×20. Índices verificados renderizando el sheet: `0` Back, `1` Forward, `3` Refresh, `4` Up, `6` New, `9` Edit, `26` Delete, `28` Open, `29` Save, `39` vistas |
| 4 | **Bug preexistente**: `SPRITE_VIEWS = 38` muestra la impresora | `FileExplorerApp/index.tsx:166`, `MyComputer/index.tsx:126`. El 38 es el ícono de impresora; las vistas están en 39/40/41/58 |
| 5 | **Bug preexistente**: el desplegable Views de My Documents no dispara sus radios | Consecuencia directa de 2b |
| 6 | No hay runner de tests en el repo | `package.json` solo expone `lint`, `typecheck`, `build`, `dev`. La política test-first no aplica; la verificación es `typecheck` + `lint` + `build` + recorrido manual |
| 7 | `.os-explorer .toolbar` es `overflow: hidden` en desktop; solo el query `<768px` pasa a `overflow-x: auto` | `src/index.css:276-281` y `:488`. La barra de Drive mide ~610px (9 botones × 54 + 2 compuestos × 70 + 2 separadores × 6 + drag handle 10), así que `minWidth` quedó en 640 para que nunca se recorten en silencio |

## Scope

- [x] **T1 — `src/utils/explorerChrome.ts` (nuevo).** Extraído los helpers de toolbar duplicados en `MyComputer` y `FileExplorerApp`: `DROPDOWN_ARROW_SVG`, `createSpriteIcon`, `createToolbarButton`, `createCompoundButton`, `createSeparator`, `ensureDisabledFilter`, y `SPRITE` (frozen). Lo consume `DriveApp`. Los otros dos apps quedan sin tocar.
- [x] **T2 — `src/apps/DriveApp/index.tsx`: chrome.** `drive-root`/`drive-toolbar`/`drive-status` reemplazados por `.os-explorer` → `.toolbars` (menú + `#standard-buttons-toolbar` + `#address-bar-toolbar`) → `.content-with-panel.inset-deep` (`#panel` + `#content`) → `#status-bar` (3 celdas `inset-shallow`).
- [x] **T3 — `src/apps/DriveApp/index.tsx`: selección y vistas.** `selectedFileId`, `currentView`, `syncEnabled()`, panel descriptivo, 4 modos de vista, teclado (F5, Delete, Enter, Backspace).
- [x] **T4 — `src/apps/DriveApp/index.tsx`: migración de acciones.** `File` / `Edit` / `View` / `Help` con las acciones reales; botones por fila eliminados.
- [x] **T5 — `src/apps/DriveApp/index.css`.** Muertas `.drive-toolbar*`, `.drive-status*`, `.drive-toolbar-button`, `.drive-action-button`, `.drive-row-actions`, `.drive-list`, `.drive-row*`, `.drive-body`. Quedó lo que la chrome global no cubre.
- [x] **Verificación:** `npm run typecheck`, `npm run lint` y `npm run build` en verde (2026-10-03). Recorrido manual **pendiente**: requiere `VITE_GOOGLE_*` y una cuenta real de Google.
- [x] **T6 — `README.md`** actualizado con la chrome nueva y el modelo de selección.

## Constraints
- La ventana se abre con `launchDrive()` imperativo; los componentes React de `src/components/` no participan. La chrome se construye con DOM, como en los otros dos apps.
- `window.$Window` y `window.MenuBar` tienen que existir; si falta `MenuBar`, loguear y abortar (mismo guard que `FileExplorerApp`).
- No inventar acciones que la API de Drive no soporta: el cliente es `src/services/googleDrive/client.ts` y no se le agregan métodos.
- El chequeo de conflicto de escritura (`headRevisionId`) y el diálogo de papelera se conservan tal cual.
- Artefactos técnicos en **inglés** (comentarios, `aria-label`), copy de UI en ES/EN vía las traducciones.

## Decisiones que tomó la implementación
| Decisión | Razón |
|---|---|
| El desplegable Views usa el grupo `radioItems` de os-gui, no `checkbox: { type: 'radio', check }` | `MenuBar.js:882-892`: un item con `checkbox` ejecuta **solo** `checkbox.toggle()`; `action` está en el `else if` y nunca corre. La forma literal del contrato dibujaba el punto sin hacer nada. Ver hallazgo 2b |
| `syncEnabled()` solo actualiza botones de toolbar, no reconstruye el MenuBar | `MenuBar.js:1050` re-dispatcha `update` en cada apertura y `:673` reevalúa `enabled` y `checkbox.check`. Los menús son reactivos sin reconstruirlos |
| Ensanchamiento local del tipo de item de menú + una sola aserción documentada | `src/types/os-gui.d.ts` es más angosto que el contrato real (hallazgo 2c). Ampliar el `.d.ts` está fuera del scope autorizado |
| `Backspace` solo abandona el editor con el buffer vacío | El textarea tiene el foco ahí; un Backspace incondicional destruiría contenido, o sea lo contrario de lo pedido |
| `LIST` = Name/Size/Modified; `DETAILS` suma Type | Dos tablas idénticas serían un bug. Details es la vista de "todas las columnas" |
| La toolbar de error expone solo `Retry`; `Disconnect` vive en `File > Disconnect` | No existe un sprite verificado para "Disconnect". Un glifo equivocado es peor que una entrada de menú |
| `minWidth` de la ventana: 360 → 640 | La toolbar mide ~610px y `.os-explorer .toolbar` es `overflow: hidden` en desktop (hallazgo 7). Debajo de eso los botones se recortan en silencio |

## Fuera de alcance (follow-ups)
1. Migrar `MyComputer` y `FileExplorerApp` a `explorerChrome` para eliminar la duplicación.
2. Arreglar `SPRITE_VIEWS = 38` → 39 en los dos apps existentes.
3. Arreglar los radios del desplegable Views, que hoy son inertes por el bug 2b (`MyDocuments/index.tsx`).
4. Mover el CSS del panel (`.content-with-panel`, `#panel`, `.panel-*`) de `MyComputer/index.css` a `src/index.css`: hoy las tres ventanas Explorer dependen de que `MyComputer/index.css` esté en el bundle.
5. Borrar `src/apps/FileExplorerApp/index.css`: es un duplicado muerto que ningún módulo importa, y My Documents renderiza solo con el CSS de MyComputer.
6. Corregir `src/types/os-gui.d.ts` para que refleje el contrato real de `MenuBar.js`.

## Riesgos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| Acortar la ventana recorta la toolbar en silencio | Botones invisibles | `minWidth: 640` medido contra los 610px reales de contenido |
| Regresión en la lógica de Drive al reescribir el render | Perder la app | `src/services/googleDrive/` intacto. `saveEditor()` quedó **byte-idéntico** al de HEAD (chequeo de conflicto + warning incluidos); solo cambiaron `moveFileToTrash` y `loadWorkspace`, y solo en el armado de selección |
| Las ventanas Explorer dependen del CSS de MyComputer | Se rompe si alguien mueve el import | Anotado como follow-up 4; hoy las reglas están scopeadas `.os-explorer …` y funcionan |
| Sin verificación en runtime posible | Falsa confianza en `build` en verde | Declarado explícitamente abajo y en el reporte |

## Progress
| Task | Estado | Evidencia |
|---|---|---|
| Decisión de modelo de interacción | ✅ | Opción A elegida por el usuario 2026-10-02 |
| Relevamiento de chrome y contrato de MenuBar | ✅ | Hallazgos 1–7 de este documento, con línea y archivo |
| T1–T6 | ✅ | 2026-10-03. `typecheck` / `lint` / `build` en verde. Sin recorrido en browser |

## Verificación
`npm run typecheck`: exit 0. `npm run lint`: exit 0. `npm run build`: ✓ built, 382 módulos (el warning de chunk >500 kB es preexistente, de Webamp).

**Pendiente, no verificado:** recorrido en browser real. No hay forma de probar acá que los píxeles, el-dropdown de Views, los estados enable/disable de los menús, el panel `#panel`, ni el flujo OAuth/edit/papelera/conflicto se comporten bien. Eso exige `VITE_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_CLIENT_SECRET`, `VITE_GOOGLE_REDIRECT_URI` y una cuenta real.

## Next step
Abrir la ventana en `npm run dev` y recorrer: conectar → ver la lista → seleccionar un archivo (panel describe) → cambiar los 4 modos de vista → abrir en el visor → editar y guardar → mandar a la papelera. Después, commit (AGENTS.md pide confirmación explícita; estamos en `main`).