# Feature: views-dropdown-radio-state

## Objective
Que el desplegable del botón compuesto **Views** se vea y se comporte igual en **todas** las ventanas que lo usan: las filas de modo de vista con su **punto de radio** en el modo activo y su estado (`aria-checked`) reales, como en la captura de referencia del usuario, y con toda la superficie visible del "casi-botón" del triángulo aceptando el clic. Una sola implementación compartida, no siete copias.

## Problem
Cuatro ventanas declaran las filas del desplegable con una forma que `public/os-gui/MenuBar.js` **no lee**: `type: 'radio'` + `checked` a nivel item (y `type: 'checkbox'` en la fila "as Web Page"). `MenuBar` solo lee `item.checkbox` (`MenuBar.js:705-708` para el punto, `:680-683` para `aria-checked`) o un grupo `radioItems` (`:929-950`). Consecuencia medida en la app real:

- Las filas salen con `role="menuitem"` y **`ariaChecked: null`** → **sin punto de radio y sin estado**: el desplegable nunca dice en qué modo estás.
- El `checked` declarado es código muerto: nada lo lee.

Solo `DriveApp` y `RecycleBin` usan el grupo `radioItems` soportado, así que son las únicas que hoy dibujan el punto. Por eso la captura de referencia (con punto) no se corresponde con lo que hacen las otras cuatro.

## Why
Pedido del usuario (2026-10-06) con captura de referencia en la raíz (`menu-lista.png`, borrada al cerrar el corte): el desplegable de Views dejó de mostrar el estado, y hay que arreglarlo **en todas las ventanas que usan ese botón en la barra de herramientas**.

## Hallazgos verificados

| # | Hallazgo | Evidencia |
|---|---|---|
| 1 | `MenuBar` lee **solo** `item.checkbox` o el grupo `radioItems`; `type` y `checked` a nivel item se ignoran | `public/os-gui/MenuBar.js:705-708` (clase `radio`/`checkbox` del área), `:680-683` (`aria-checked`), `:929-950` (expansión de `radioItems` en `checkbox` + `check`/`toggle`) |
| 2 | Un item **sin** `checkbox` ejecuta `item.action()`; con `checkbox` ejecuta solo `toggle()` | `MenuBar.js:881-892`. Por eso hoy el modo **sí cambia** al elegir una fila, pero el punto no aparece |
| 3 | Cuatro ventanas usan la forma ignorada | `MyComputer/index.tsx:311-333`, `FileExplorerApp/index.tsx:346-393`, `Portfolio/index.tsx:407-430`, `MarkdownViewerApp/index.tsx:537-...` |
| 4 | Dos ventanas ya usan el grupo soportado | `DriveApp/index.tsx:1051-1068` (`viewModeGroup` + `DriveRadioGroup`), `RecycleBin/index.tsx:784-800` |
| 5 | **Medición en la app real** (sonda inyectada sobre `dist` servido por http, Firefox headless): el popup de My Documents, Portfolio y Markdown Viewer sale con `role="menuitem"` y `ariaChecked: null` en todas las filas | ver "Mediciones" abajo |
| 6 | **Medición**: el botón del triángulo es **16×40** en las tres ventanas y el hit test da el botón (o su `svg` hijo) en toda la superficie; **el popup abre clicando el borde superior, lejos del triángulo** | ver "Mediciones" abajo |
| 7 | El `svg` del triángulo (14×16, centrado) es el elemento bajo el cursor en la franja central; el botón en los bordes superior/inferior | medición, ver abajo |
| 8 | `SPRITE_VIEWS = 38` **está bien**: el índice 38 es la grilla de vistas y el 39 es el ícono de lista | renderizado del sheet `browse-ui-icons.png` (63 íconos de 20px, 1260×20) a 3×: 38 = grilla azul, 39 = lista. **La afirmación "38 muestra la impresora" del doc `drive-explorer-chrome.md` (hallazgo 4) es falsa**, y por eso su follow-up 2 nunca correspondió |
| 9 | La fila **Details** de My Documents está `enabled: false` aunque `DETAILS` sí está soportado por el render | `FileExplorerApp/index.tsx:384-392` (`enabled: false`) y `:488` (`case 'DETAILS'`) |

### Mediciones (app real, `dist` + sonda, Firefox headless)

| Ventana | wrapper | dropBtn | hitmap | popup desde el borde superior | filas |
|---|---|---|---|---|---|
| My Documents | 70×40 | 16×40 | botón en top/¾/¾/bottom/right, `svg` en middle/left | **sí** | 6 (as Web Page, sep, Large, Small, List, **Details disabled**) — todas `ariaChecked: null` |
| Portfolio | 70×40 | 16×40 | ídem | **sí** | 6 — todas `ariaChecked: null` |
| Markdown Viewer | 70×40 | 16×40 | ídem | **sí** | 2 (Preview, Source) — `ariaChecked: null` |
| My Computer | 70×40 | 16×40 | botón en top3/bottom3, `svg` en el centro | **sí** | 5 (as Web Page, sep, Large, Small, List) |

## Decisiones tomadas

| Dimensión | Decisión |
|---|---|
| Alcance | **Todas** las ventanas con desplegable de Views: `MyComputer`, `FileExplorerApp`, `Portfolio`, `MarkdownViewerApp`, `DriveApp`, `RecycleBin` |
| Implementación | **Un helper compartido** en `src/utils/explorerChrome.ts`; las seis ventanas lo consumen. Siete copias del mismo desplegable son la causa de que cuatro se hayan quedado atrás |
| Punto de radio | Grupo `radioItems` real (el camino soportado por `MenuBar`), con `getValue`/`setValue` por ventana |
| Fila "as Web Page" | Se conserva como fila inicial deshabilitada en las ventanas Explorer que ya la tienen (paridad con la captura), implementada como item con `enabled: false` |
| Detalles | La fila **Details** de My Documents pasa a estar habilitada: su acción ya existe y `DETAILS` ya se renderiza; hoy es la única vía para llegar a ese modo y está cerrada. **Judgment call, veto del usuario si prefiere dejarla gris** |
| Área de clic | Se endurece: el `svg` deja de ser target propio (`pointer-events: none`), el botón no puede encogerse (`flex: none`) y se estira a la altura de la fila. Aunque la medición no reprodujo "solo el triángulo", el pedido del usuario es explícito y el endurecimiento no tiene contra |
| Sprite | **No se toca**: el índice 38 ya es la grilla de vistas (hallazgo 8). El follow-up 2 del doc anterior queda anulado con la evidencia |
| i18n | Las etiquetas siguen saliendo de donde ya salían en cada ventana; `MarkdownViewerApp` y `DriveApp` usan su tabla local |

## Scope

- [x] **T1 — `src/utils/explorerChrome.ts`: helper compartido.** `openViewsDropdown({ event, ariaLabel, rows, getValue, setValue, leadingRow? })` + el tipo de fila. Cuerpo: el probado en `DriveApp/index.tsx:1069-1104` (MenuBar temporal aparcado en el rect del wrapper, `pointerdown` sintético, limpieza en `release` y en `pointerup` global) construyendo el menú con el grupo `radioItems`.
- [x] **T2 — `MyComputer`, `FileExplorerApp`, `Portfolio`, `MarkdownViewerApp`:** borrar las formas muertas (`type: 'radio'`/`type: 'checkbox'`/`checked`) y usar el helper. En My Documents, habilitar la fila Details.
- [x] **T3 — `DriveApp` y `RecycleBin`:** migrar su `openViewsDropdown` y sus tipos locales (`DriveRadioGroup`/`RecycleRadioGroup`) al helper, conservando sus filas y etiquetas traducidas.
- [x] **T4 — `src/index.css`:** endurecer el área de clic del `.toolbar-dropdown-button` (svg sin pointer-events, `flex: none`, altura de fila, `cursor: default`).
- [x] **Verificación:** `npm run typecheck`, `npm run lint`, `npm run build` + re-medición con la sonda sobre la app real: filas con `aria-checked` real y punto, y popup abriendo desde el borde del strip en las cuatro ventanas.

## Constraints
- No se toca `public/os-gui/MenuBar.js`: es la librería vendoreada y su contrato es el que manda.
- No se cambian los índices del sprite.
- Cada ventana conserva su conjunto de modos, sus etiquetas y su acción de ciclo del botón principal.
- Artefactos técnicos en **inglés** (código, comentarios, commit); copy de UI por las tablas de traducción existentes.

## Riesgos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| Migrar seis ventanas de una vez | Diff grande, revisión pesada | El helper reemplaza bloques idénticos; el cambio por ventana es mecánico y se verifica con la sonda, no a ojo |
| El helper cambia el comportamiento del botón principal | El ciclo de vistas se rompe | El helper solo construye el desplegable; el `mainAction` de cada ventana queda intacto |
| Habilitar Details en My Documents | Cambio de comportamiento no pedido explícitamente | Se anota como judgment call explícito en el cierre, con el porqué |

## Implementación y verificación (2026-10-06)

| Archivo | Cambio |
|---|---|
| `src/utils/explorerChrome.ts` | `openViewsDropdown<T>` + `ViewModeRow<T>` / `ViewsRadioGroup<T>` / `ViewsDropdownOptions<T>`: grupo `radioItems` real, barra aparcada y prensada, limpieza en `release` y en `pointerup` global, y cierre del popup al elegir |
| `src/types/os-gui.d.ts` | `closeMenus?: () => void` en `OsGuiMenuBar` (la API que `MenuBar.js:1187` expone y el `.d.ts` no declaraba) |
| `MyComputer` · `FileExplorerApp` · `Portfolio` · `MarkdownViewerApp` | Adoptan el helper; borradas las formas muertas; en My Documents la fila Details queda **habilitada** |
| `DriveApp` · `RecycleBin` | Migrados al helper; tipos locales (`DriveRadioGroup`/`RecycleRadioGroup`) eliminados |
| `src/index.css` | `.toolbar-dropdown-button`: `flex: 0 0 auto`, `align-self: stretch`, `cursor: default`, y `svg { pointer-events: none }` |

### Re-medición sobre la app real (misma sonda, después del cambio)

| Ventana | dropBtn | hit test | popup desde el borde del strip | filas | popup cierra al elegir |
|---|---|---|---|---|---|
| My Documents | 16×40 | **botón en los 5 puntos** | **sí** | 6: as Web Page (gris), sep, Large Icons, Small Icons (`aria-checked=true`), List, **Details habilitada** — todas `menuitemradio` + `.radio` | **sí** |
| My Computer | 16×40 | **botón en los 5 puntos** | **sí** | 5: as Web Page (gris), sep, Large/Small/List — `menuitemradio` + `.radio` | **sí** |
| Portfolio | 16×40 | **botón en los 5 puntos** | **sí** | 6, Details sigue gris — `menuitemradio` + `.radio` | **sí** |
| Markdown Viewer | 16×40 | **botón en los 5 puntos** | **sí** | 2: Preview (`true`), Source (`false`) | **sí** |

Estado persistente confirmado: tras elegir Large Icons, al reabrir el popup sale `Large Icons=true`. Antes del cambio las mismas filas salían `role="menuitem"` con `ariaChecked: null` (sin punto) y el `svg` era el target en la franja central.

### Hallazgos de la verificación y su destino

| # | Severidad | Hallazgo | Destino |
|---|---|---|---|
| F1 | Baja | `dropBtn?.closest(...)` devolvía `undefined` con `currentTarget` nulo y el guard `=== null` no lo atrapaba | **Corregido**: `dropBtn ? ... : null` + `if (!wrapper) return` |
| F2 | **Media** | Al pasar a `radioItems`, el popup **dejaba de cerrarse al elegir**: MenuBar corre solo `toggle()` para un item con `checkbox` y nunca `close_menus()` (`MenuBar.js:879-892`). Las cuatro ventanas antes cerraban | **Corregido**: el helper envuelve el `setValue` del caller y llama `closePopup()` → `menuBar.closeMenus()` |
| F3 | Baja | Cada apertura crea un `MenuBar` que registra listeners globales en `window` y nunca se desmonta; además el `.menu-popup` queda huérfano en `document.body` | **Aceptado y documentado** (preexistente, idéntico antes del corte): requiere reutilizar una barra por ventana o soporte de la librería para destruirla |
| F4 | Baja | La fila "as Web Page" deshabilitada ya no ejecuta un `action` vacío, así que clicarla no cierra el menú | **Sin acción**: es una fila deshabilitada; que no haga nada es lo esperado |
| F5 | Info | `as unknown as OsGuiMenuDefinition` sigue siendo necesario: el `.d.ts` no tiene la forma de grupo `radioItems` | **Follow-up**: agregar la forma del grupo a la declaración compartida y borrar el doble cast |
| F6 | Info | `align-self: stretch` es inerte con `height: 40px` explícito | **Sin acción**: expresa la intención y no molesta |

### Judgment calls de la implementación
| Decisión | Razón |
|---|---|
| My Documents: la fila Details queda habilitada | Su acción ya existía y `case 'DETAILS'` ya se renderiza; estaba gris, así que el único camino a ese modo estaba cerrado. La captura de referencia muestra Details seleccionable |
| Portfolio: la fila Details queda **gris**, como estaba | Preservar el comportamiento medido en una ventana que el usuario no mencionó. Queda como decisión a veto explícito: si quiere paridad, es la misma línea |
| El título del menú es el `ariaLabel` del grupo | El helper no recibe una etiqueta de menú aparte; la barra aparcada está oculta, así que ese texto solo nombra el popup |
| `closeMenus` declarado opcional en el `.d.ts` | El build vendoreado lo expone siempre, pero un caller no debe depender de eso |

### Fuera de alcance detectado (follow-ups)
1. Otras menus de estas ventanas siguen usando `type:'radio'`/`type:'checkbox'` + `checked` a nivel item (`MyComputer:421-424`, `FileExplorerApp:520-578`, `Portfolio:304-319`, `MarkdownViewerApp:223-229`, `DriveApp:745-769`, `RecycleBin:540-564`, `SearchApp`, `IExplorerApp`): funcionan por `action` pero tampoco dibujan el indicador. Mismo arreglo, distinto menú.
2. Reutilizar una sola barra aparcada por ventana (o pedirle a os-gui un `destroy()`) para cerrar F3.
3. Agregar la forma de grupo `radioItems` a `src/types/os-gui.d.ts` y borrar el doble cast (F5).
