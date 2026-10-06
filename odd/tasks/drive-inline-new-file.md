# Feature: drive-inline-new-file

## Objective
Reemplazar la pantalla `newFile` de Mi unidad por el flujo clásico de Win98 de las capturas de referencia (`menu-archivo.png`, `nuevo-archivo.png`, borradas al cerrar el corte: eran referencia, no assets): `Archivo ▸ Nuevo ▸` abre un submenú con los tipos de archivo de la imagen —solo **Documento de texto** activo, el resto gris— y el clic **crea el archivo en Drive al instante** con el nombre por defecto, dejando ese nombre **escribible en el lugar**, seleccionado, como en la segunda captura. En el mismo corte se habilita `Archivo ▸ Renombrar` sobre la selección, usando la misma edición en el lugar.

## Problem
Hoy "Nuevo" no crea nada: cambia de pantalla.

- `src/apps/DriveApp/index.tsx:683-687` — `File > Nuevo` ejecuta `startNewFile`.
- `:1892-1904` — `startNewFile()` / `cancelNewFile()`: solo mueven `view` entre `'list'` y `'newFile'`.
- `:1906-1938` — `buildNewFileView()`: `<label>` + `<input>` + hint, centrado, con `Enter` → `createFile()` y `Esc` → `cancelNewFile()`.
- `:1940-1970` — `createFile()`: `normalizeFileName(newFileName)` → `driveClient.createTextFile(...)` → prepende a `files` → `view = 'list'`.
- `:947-948` — el botón `Nuevo` de la toolbar entra al mismo camino.

Resultado: el gesto de la captura (submenú + alta inmediata + nombre editable en la lista) no existe, y **no puede existir** con el cliente actual.

## Why
Pedido explícito del usuario con dos capturas de referencia (2026-10-06): quiere el menú `Archivo ▸ Nuevo` de la ventana de Mi unidad y que al hacer clic **el archivo ya esté creado** y el nombre por defecto quede disponible para escribir, tal como se ve en `nuevo-archivo.png`. Las dos capturas se borraron al cerrar el corte (decisión del usuario), así que este documento es el registro que queda de ellas.

## Decisiones tomadas (usuario, 2026-10-06)

| Dimensión | Decisión |
|---|---|
| Alcance | **Solo `DriveApp` (Mi unidad).** `MyComputer` y `FileExplorerApp` (My Documents) no se tocan. Las otras dos quedan como follow-up |
| Forma del menú | **Submenú fiel a la captura**, con los tipos no soportados **grises**: `Carpeta`, `Acceso directo`, `Sonido`, `Documento de texto` (único activo), `WordPad`, `Imagen`, `Maletín` |
| Rename remoto | **Se autoriza agregar `renameFile` al cliente de Drive** (PATCH de `name`) y **además habilitar `Archivo ▸ Renombrar`** sobre la selección |
| Cancelar | `Esc`/clic afuera **no borran**: el archivo queda con el nombre por defecto. Nada de mandar a la papelera lo recién creado |

### Decisiones derivadas por la implementación (a confirmar en el cierre)
| Decisión | Razón |
|---|---|
| Nombre por defecto localizado: ES `Nuevo documento de texto`, EN `New Text Document`; en Drive se guarda con `.md` (`Nuevo documento de texto.md`) | Es el copy del sistema Win98 y respeta la tabla ES/EN de la app. El `.md` no se muestra porque la lista ya lo recorta (`stripMarkdownExtension`, `index.tsx:366`) |
| `Esc` revierte al nombre por defecto; **clic afuera y `Enter` confirman lo escrito** | Es el comportamiento real de Win98: `Esc` cancela la edición, salir del campo la confirma. La decisión del usuario cubre el caso "no quiero escribir nada". **Confirmado por el usuario el 2026-10-06** (el "clic afuera" de su respuesta original no se interpreta como descarte) |
| La edición en el lugar funciona en los **4 modos de vista** (iconos grandes, pequeños, lista, detalles) | La captura es de iconos grandes, pero el modo es ortogonal al alta: un editor que solo existe en un modo es un bug esperando |
| Nombres duplicados permitidos (`Nuevo documento de texto.md` ×2) | Drive los permite; deduplicar sería inventar una regla que el usuario no pidió |
| Si el rename falla, el archivo **queda con el nombre por defecto** y se avisa con `showMessageBox`; no se va a la pantalla de error | El alta ya ocurrió: mandar la ventana a `error` esconde un archivo que existe. Crear y renombrar son dos operaciones, y solo la segunda falló |

## Hallazgos verificados

| # | Hallazgo | Evidencia |
|---|---|---|
| 1 | **El cliente de Drive no tiene rename.** `DriveClient` expone `findWorkspaceFolder`, `ensureWorkspaceFolder`, `listFiles`, `listTrashedFiles`, `readFileContent`, `createTextFile`, `getHeadRevisionId`, `updateTextFile`, `trashFile`, `restoreFile`, `getAccountEmail` | `src/services/googleDrive/client.ts:82-108` |
| 2 | El patrón de un PATCH JSON ya existe y se copia tal cual: `trashFile` hace `PATCH /files/{id}?fields=...` con `body: JSON.stringify({trashed:true})` y parser defensivo | `client.ts:564-597`; `restoreFile` `:612-653` |
| 3 | `driveJson<T>(token, init, parse)` devuelve `DriveResult<T>`, y `requireDriveId` valida el id antes de interpolar. Ningún método tira excepciones | `client.ts:187-...`, `:354-...` |
| 4 | `DriveFile` lleva `id, name, mimeType, size, trashed, modifiedTime, headRevisionId, webViewLink, trashedTime`; el listing necesita `name`/`modifiedTime`/`size` para repintar | `src/services/googleDrive/types.ts:74-92` |
| 5 | El `.d.ts` de os-gui es más angosto que `MenuBar.js`; `DriveApp` ya lo ensancha localmente con `DriveMenuItem` (que sí admite `submenu` y `enabled: () => boolean`) | `index.tsx:310` y el comentario en `:298-309`; `src/types/os-gui.d.ts` |
| 6 | Un item de menú **con `submenu`** ejecuta `open_submenu` en el `click`; el que no tiene submenu ejecuta `item_action()` → `checkbox.toggle()` si hay checkbox, `item.action()` si no | `public/os-gui/MenuBar.js:872-895` (item_action) y `:920-926` (click) |
| 7 | Un item deshabilitado recibe `aria-disabled="true"` en cada evento `update`, y `update` se dispara al abrir el popup: un `enabled: false` gris es la forma soportada, y `enabled: () => ...` se reevalúa por apertura | `MenuBar.js:676-690`; hallazgo 2 del doc `drive-explorer-chrome.md` |
| 8 | `item.action()` corre **después** de `close_menus()` y de `refocus_outside_menus()` | `MenuBar.js:874-890` |
| 9 | Las filas se reconstruyen enteras en cada render y el builder repinta la selección (`bindItem`), así que un editor en el lugar tiene que ser **estado del closure** (`renamingFileId` + borrador), no un nodo guardado | `index.tsx:1499-1637` (builders), `:1638-1656` (`bindItem`), `:1873-1878` (`repaintListing`) |
| 10 | `renderView()` termina devolviéndole el foco a `selectedRowEl` cuando `view === 'list'`; sin guarda, le roba el foco al input de renombrado | `index.tsx:1127-1170` |
| 11 | El listener de teclado del documento ya ignora eventos originados en un input (`isTextEntry`), así que no hay que tocarlo | `index.tsx:389-391`, `:1040-1090` |
| 12 | El nombre por defecto y el editor en el lugar **no necesitan CSS nuevo de fondo**: `.drive-item-label`/`.drive-cell-text` ya existen; sí hay que borrar `.drive-field-label` / `.drive-field-input` cuando la pantalla `newFile` desaparezca | `src/apps/DriveApp/index.css:79-97`, `:134`, `:255-278` |
| 13 | La pantalla `newFile` está cableada en 6 lugares además del builder: tipo (`:261`), `hasLeftPanel()` (`:802-803`), `syncStatusBar` (`:839`), `syncPanel` (`:851-866`), switch de render (`:1147-1149`), `closeCurrentView` (`:1758-1765`) | `index.tsx` |
| 14 | No hay runner de tests: `package.json` solo expone `lint`, `typecheck`, `build`, `dev` | hallazgo 6 de `drive-explorer-chrome.md`; se confirmó de nuevo en este corte |

## Scope

- [x] **T1 — `src/services/googleDrive/types.ts` + `client.ts`: `renameFile`.**
  - `DriveRenameResult { id, name, modifiedTime }` en `types.ts` (tipo propio, documentado como el de `DriveTrashResult`).
  - `renameFile(token, fileId, name): Promise<DriveResult<DriveRenameResult>>` = `PATCH /files/{id}?fields=id,name,modifiedTime` con `body: JSON.stringify({ name })`, `contentType: 'application/json; charset=UTF-8'`, `requireDriveId` + `driveJson` con parser defensivo.
  - Añadir al interface `DriveClient`.
  - **Evidencia:** `grep -n "renameFile" src/services/googleDrive/client.ts`.
- [x] **T2 — Menú `Archivo ▸ Nuevo ▸`.** El item de `:683-687` pasa a ser un submenú con las 7 filas de la captura; solo `Documento de texto` con `action`, el resto `enabled: false`. Claves nuevas en `TRANSLATIONS` (ES/EN) para cada tipo. El botón `Nuevo` de la toolbar conserva el gesto de un clic: crea el documento directo.
  - **Evidencia:** captura del submenú abierto con la fila activa y las grises.
- [x] **T3 — Alta con nombre por defecto y renombrado en el lugar.**
  - `createFile()` crea con el nombre por defecto (sin diálogo previo), prepende a `files`, selecciona el archivo nuevo y entra en modo edición.
  - El editor es un `<input class="drive-rename-input">` que reemplaza al label de la fila en los 4 modos, con el texto seleccionado y foco.
  - `Enter` y `blur` confirman (`renameFile`); `Esc` revierte al nombre por defecto; nombre vacío/ilegal → mensaje y se sigue editando; rename fallido → `showMessageBox` + el archivo queda con el nombre por defecto.
  - La guarda de foco del hallazgo 10 se respeta: con edición activa, el foco va al input y no a la fila.
  - **Evidencia:** recorrido manual (iconos grandes y detalles como mínimo) + `renameFile` en la red.
- [x] **T4 — Retiro de la pantalla `newFile`.** Se borran `buildNewFileView`, el estado `newFileName`, el miembro `'newFile'` de `DriveView` y sus 6 usos del hallazgo 13; `closeCurrentView()` vuelve a ser un `$win.close()` pelado; se borran las claves de i18n que quedan sin uso y el CSS muerto (`index.css:255-278`, y `.drive-panel-left` si queda sin consumidores).
  - **Evidencia:** `grep -rn "newFile\|drive-field" src/apps/DriveApp` sin resultados salvo el botón de toolbar y `SPRITE.newFile`.
- [x] **T5 — `Archivo ▸ Renombrar` habilitado.** `:700` deja de ser `enabled: false`; ejecuta el mismo editor en el lugar sobre la fila seleccionada, precargado con el nombre actual sin extensión.
  - **Evidencia:** captura del rename desde el menú.
- [x] **T6 — `README.md`** actualizado en la sección de Google Drive (tabla de acciones/menús y descripción del alta).

## Implementación (2026-10-06)

| Archivo | Cambio |
|---|---|
| `src/services/googleDrive/types.ts` | `DriveRenameResult` (tipo propio, documentado) |
| `src/services/googleDrive/client.ts` | `renameFile` en el interface y en `driveClient`: `PATCH /files/{id}?fields=id,name,modifiedTime`, `requireDriveId` + parser defensivo, calcado de `trashFile` |
| `src/apps/DriveApp/index.tsx` | Submenú `Archivo ▸ Nuevo ▸` (7 filas, solo `Documento de texto` activa) · `Archivo ▸ Renombrar` habilitado · estado de edición en el closure (`renamingFileId` + `renameDraft`) · `buildNameNode` usado por los tres builders (4 modos de vista) · `createNewDocument` / `beginRename` / `cancelRename` / `commitRename` · guarda de foco en `renderView` · pantalla `newFile` y sus 6 cableados eliminados · `closeCurrentView()` reducido a `$win.close()` |
| `src/apps/DriveApp/index.css` | Muertas `.drive-field-label` / `.drive-field-input(:focus)` / `.drive-panel-left`; alta `.drive-rename-input` con ancho por modo de vista |
| `README.md` | Sección de Google Drive: modelo de acciones, alta, renombrado, estados y tabla de menú |

### Decisiones que tomó la implementación (además de las derivadas de arriba)
| Decisión | Razón |
|---|---|
| Solo `auth-expired` en el rename va a la pantalla de reconexión; el resto de fallos va a `showMessageBox` y deja el nombre anterior | Una lista respaldada por un token muerto es peor que un aviso; el resto de fallos no justifican esconder un archivo que existe |
| `Nuevo` y `Renombrar` deshabilitados mientras `busy` o con una edición abierta (`canCreateDocument` / `canRename`) | Evita altas y renombrados concurrentes, y obliga a confirmar o cancelar la edición en curso antes de empezar otra |
| Nombre sin cambios no dispara request | `Enter` sin escribir nada cierra el editor sin un `PATCH` inútil |
| `dblclick` sobre el input corta la propagación | Seleccionar una palabra no debe abrir el archivo en el visor |
| `disconnect` limpia el estado de edición | Un borrador viejo no puede resucitar tras reconectar |
| Copy de `emptyFolder` actualizado al nuevo gesto | Apuntaba a la pantalla `newFile` que este corte elimina |
| Contador de claves i18n de DriveApp corregido a 103 (el README decía 92 y ya estaba desactualizado en HEAD) | El número medido es 103 |
- [x] **Verificación:** `npm run typecheck`, `npm run lint` y `npm run build` en verde (2026-10-06), en tres rondas de verificador independiente sobre el árbol de trabajo (implementación, fix de F1, y estado final pre-commit). Recorrido manual contra Drive real **pendiente**: requiere `VITE_GOOGLE_*` y una cuenta de Google, así que el `PATCH` de rename en vivo, el submenú de os-gui en runtime y el aspecto visual no se ejercitaron.

## Hallazgos de la verificación y su destino

| # | Severidad | Hallazgo | Destino |
|---|---|---|---|
| F1 | Baja (real) | `renamingFileId` no se limpiaba en `loadWorkspace`: un refresh (F5 o una restauración desde la Papelera) que se llevara el archivo en edición dejaba el editor sin input en pantalla —`buildNameNode` solo lo emite para archivos que siguen en `files`— con `canCreateDocument`/`canRename` exigiendo `renamingFileId === null`, o sea `Nuevo` y `Renombrar` trabados hasta desconectar | **Corregido en este corte**: `loadWorkspace` limpia editor y borrador cuando el archivo editado ya no está en el listado, con el porqué en el comentario |
| F2 | Informativo | El commit por `blur` al desmontar el input depende del timing del browser: un cambio de vista o un refresh durante la edición puede confirmar el borrador o dejarlo abierto | **Aceptado**: las dos ramas son seguras para el invariante de un solo request y la segunda es coherente con "salir del campo confirma". Queda anotado como decisión, no como accidente |
| F3 | Informativo | El bucle de nombre inválido asume que `showMessageBox` roba el foco; con el fallback síncrono de `alert` (sin `$Window`) podría repetir el aviso | **Sin acción**: en esta app `$Window` siempre existe (la ventana entera se construye con él), así que el camino es inalcanzable |
| F4 | Baja (misma clase que F1, inalcanzable hoy) | `moveFileToTrash` tampoco reseteaba el editor al filtrar el archivo de `files`; llegaba a un estado trabado solo si algo mandaba a la papelera el archivo en edición sin pasar por un `blur` | **Corregido en este corte**: la lógica salió a `dropEditorIfFileIsGone()` y la llaman los dos caminos que pueden sacar un archivo de `files` (refresh y papelera), en vez de duplicar la guarda y confiar en el timing del caller | Recorrido manual contra Drive real queda declarado como pendiente si no hay credenciales.

## Constraints
- La ventana se construye con DOM imperativo en `launchDrive()`; los componentes React de `src/components/` no participan. El `MenuBar` es el de os-gui.
- No se toca `MyComputer` ni `FileExplorerApp`.
- El cliente de Drive **no tira excepciones**: todo por `DriveResult<T>`.
- No se toca el flujo de OAuth, la sesión compartida, el chequeo de conflicto ni el diálogo de papelera.
- Artefactos técnicos en **inglés** (comentarios, `aria-label`, commit); copy de UI en ES/EN vía `TRANSLATIONS`.

## Fuera de alcance (follow-ups)
1. Replicar el gesto en `MyComputer` y `FileExplorerApp` (decisión del usuario: después).
2. Crear carpetas reales en el workspace (el submenú las muestra grises: el cliente no crea carpetas dentro del workspace hoy, solo `createFolder` para el workspace mismo).
3. Deduplicar nombres por defecto al estilo XP (`Nuevo documento de texto (2).md`).

## Riesgos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| El `blur` del input dispara un commit y el re-render que sigue borra el nodo, encadenando otro `blur` | Doble rename o bucle | Guarda de commit en vuelo (`renamingFileId = null` antes del `await`, flag de "ya confirmado") |
| `renderView()` le devuelve el foco a `selectedRowEl` (hallazgo 10) | El input nace sin foco o pierde el caret | Guarda explícita: si hay edición activa, el foco final es el input |
| El rename es un segundo request después del alta | Un fallo deja un archivo con nombre por defecto | Se avisa con `showMessageBox` y **no** se manda la ventana a la pantalla de error; el archivo existe y sigue listado |
| Los tipos grises del submenú son "botones muertos" | Ruido de UX, precedente del proyecto: "botones muertos son peor que botones ausentes" (`drive-explorer-chrome.md`) | Decisión explícita del usuario: paridad visual con la captura. Queda anotado como deuda si molesta |

## Evidencia de commits (rama `feat/drive-inline-new-file`, sin push)

| Commit | Work-unit | Archivos |
|---|---|---|
| `d21d4c2` | `feat(drive): add renameFile to the Drive client` | `src/services/googleDrive/types.ts`, `src/services/googleDrive/client.ts` |
| `91c4035` | `feat(drive): create the file on New and rename it in place` | `src/apps/DriveApp/index.tsx`, `src/apps/DriveApp/index.css` |
| (este commit) | `docs(drive): document the new file and rename flow` | `README.md`, `odd/tasks/drive-inline-new-file.md` |

`main` queda intacta en `9fdb23a`; el merge y el push son decisiones del usuario.
