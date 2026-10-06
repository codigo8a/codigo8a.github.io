# Recycle Bin: la papelera de Drive de la app

## Objective

Que la app `RecycleBin` del escritorio sea una ventana independiente que liste los archivos que **la propia app de Google Drive** movió a la papelera, y permita restaurarlos de vuelta a la carpeta `desktop-web`.

## Problem

Hoy `RecycleBin` está muerta: 35 líneas que muestran un emoji y el texto hardcodeado *"Your Recycle Bin is empty"*. Registrada en `apps.ts:101-109` pero **sin ningún launcher**: no está en `DESKTOP_ICONS`, ni en `ICON_GRID`, ni en `handleOpenApp`, ni en el `StartMenu`. Nadie llama `openApp('recycleBin')`. Tampoco llama `registerOsWindow`, así que no tendría botón en la taskbar.

Mientras tanto, la ventana de My Drive manda archivos a la papelera de Drive y le dice al usuario que los recupere desde `drive.google.com`. Esa papelera existe y es real — solo que la app no la ve.

## Why

- Cierra el loop del ciclo de vida de un archivo: crear → editar → borrar → **restaurar**, todo dentro del escritorio.
- `drive.file` ya alcanza. Verificado en la documentación de la API: `files.list` retorna archivos en la papelera por defecto, y `drive.file` es scope válido para `files.list`. **No hace falta cambiar el scope ni pedir permisos nuevos.**
- `files.update` acepta `addParents`/`removeParents`, así que restaurar devuelve el archivo a `desktop-web` en lugar de tirarlo a la raíz de Drive.

## Scope

- [x] **R1 — Cliente: listar la papelera.** `src/services/googleDrive/client.ts`: agregar `listTrashedFiles(token)` que consulta `listAllFiles(token, 'trashed = true')`. **No puede usar `in parents`**: un archivo en la papelera ya no es hijo de la carpeta. Agregar `trashedTime` y `capabilities.canUntrash` a `DRIVE_FILE_FIELDS` y a `toDriveFile`.
- [x] **R2 — Cliente: restaurar a la carpeta.** `restoreFile(token, fileId, folderId)`: `PATCH /files/{id}?addParents={folderId}&removeParents={previousParentId}` con body `{trashed: false}`. Reusa `requireDriveId` y `driveJson`. El `previousParentId` hay que leerlo: un archivo papelera puede no tener `parents`, y `removeParents` con un id equivocado falla.
- [x] **R3 — Token compartido.** Extraer el token de la closure de `launchDrive()` a un módulo con lecturas y escrituras controladas. Esto **invierte** el contrato de `client.ts:5-8` y `types.ts:14-19`; actualizar esos comentarios con el porqué. Debe seguir siendo memory-only: nunca `localStorage` ni `sessionStorage`. API mínima: `getDriveToken()`, `setDriveToken()`, `clearDriveToken()`, `subscribeDriveToken(listener)`.
- [x] **R4 — Drive consume el token compartido.** `src/apps/DriveApp/index.tsx`: `token` deja de ser closure local; lee y escribe el módulo. `onClosed`, `disconnect`, `requireToken`, `auth-expired` pasan por el módulo. Actualizar el comentario de `:410-413` que hoy dice que el token es window-scoped a propósito — ya no es verdad.
- [x] **R5 — La ventana de la Papelera.** `src/apps/RecycleBin/index.tsx`: reescribir como app os-gui real. Esqueleto de `MarkdownViewerApp/index.tsx` (585 líneas) — placeholder React, tabla `TRANSLATIONS` local ES/EN, `getLang()` leyendo `localStorage`, `launchRecycleBin(appData?)`, `registerOsWindow`, menú, toolbar, lista de archivos, barra de estado con cantidad. Reusar `explorerChrome.ts` (DOM-only, sin dependencia de Drive) y `showMessageBox` + `getCascadeOffset`. **Cero `innerHTML`** — el placeholder actual lo viola.
- [x] **R6 — Estados.** Desconectado (pide conectar desde My Drive), cargando, con archivos, vacía, y error. Los estados sin selección muestran panel centrado, como en My Drive.
- [x] **R7 — Restaurar.** Botón + `File > Restaurar`. Llama `restoreFile` con el folder id del token compartido. Refresca la lista al terminar. Si `canUntrash === false`, el botón va deshabilitado con tooltip explicativo.
- [x] **R8 — Lanzadores.** Ícono en el escritorio (`DesktopIcons`: `DESKTOP_ICONS` + `ICON_GRID` + rama en `handleOpenApp`) y en el `StartMenu`. Verificar que no colisione con la grilla de 2 columnas existente.
- [x] **R9 — Copy coherente.** `trashMessage` (`DriveApp:138-141`) hoy promete *"recuperarlo desde drive.google.com"*. Reescribir para que apunte a la Papelera de la app. Agregar `trashedTime` al listado para que el usuario sepa qué es más viejo.
- [x] **R10 — Estilos y docs.** `src/apps/RecycleBin/index.css` (hoy solo tiene un comentario). Sección nueva en `README.md`. Corregir `README.md:64` si lista RecycleBin como feature viva.

## Constraints

- El token **sigue siendo memory-only**. El módulo compartido no lo persiste en ningún storage. Esto es un cambio de *alcance* (qué ventana lo ve), no de *almacenamiento*.
- **Nunca borrado definitivo.** No se implementa `deletePermanently` ni "Vaciar papelera": contradice `client.ts:16-17` y la regla escrita en `odd/tasks/google-drive-app.md:44,50`. Si se quiere vaciar, es una task aparte con su propia decisión.
- **No cambiar el scope.** Sigue `drive.file`.
- Cero `innerHTML`. Todo por `textContent` / `.value`.
- TypeScript strict, sin `any`.
- `AppData` no crece: el token viaja por el módulo, no por el payload.
- No tocar `src/i18n/translations.ts` — Drive y RecycleBin usan tablas locales.

## Acceptance criteria

- [ ] `npm run lint` en verde.
- [ ] `npm run typecheck` en verde.
- [ ] `npm run build` en verde.
- [ ] Cero `innerHTML` en `RecycleBin`.
- [ ] El token nunca aparece en `localStorage` ni `sessionStorage` (verificable por grep).
- [ ] `restoreFile` manda `addParents` con el folder id correcto.
- [ ] `listTrashedFiles` NO usa `in parents`.
- [ ] Restaurar devuelve el archivo a `desktop-web`, no a la raíz de Drive.
- [ ] La app sigue funcionando si la ventana de My Drive nunca se abrió.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
grep -rn "innerHTML" src/apps/RecycleBin/ && echo "FALLA: innerHTML" || echo "OK"
grep -rn "localStorage\|sessionStorage" src/services/googleDrive/token*.ts && echo "REVISAR" || echo "OK: token nunca persistido"
grep -n "in parents" src/services/googleDrive/client.ts
```

## Extensiones posteriores (fuera del scope original)

Cerrado R1-R10. Estas cuatro vinieron después, del mismo usuario, y amplían la feature:

- [x] **X1 — Refresco inverso.** My unidad llama `notifyDriveWorkspaceChanged()` al mandar un archivo a la papelera, para que la Papelera muestre la fila sin F5. La Papelera ignora su **propia** notificación con un flag de cierre: `loadInFlight` no alcanza porque se libera en el `finally` de `loadTrash()`, que corre antes del publish.
- [x] **X2 — Botón de Vistas y los 4 modos.** `createCompoundButton` + `cycleViewMode` (3 entradas, Detalles fuera del ciclo, igual que My unidad), `setCurrentView`, `viewModeGroup`, `openViewsDropdown`. Detalles agrega una columna **Restorable** con `canUntrash` en tres estados; la columna **Eliminado** se mantiene en Lista y Detalles.
- [x] **X3 — Flujo de conexión compartido.** `src/services/googleDrive/driveConnect.ts` (291 líneas) sin DOM, sin os-gui y sin i18n: recibe texto y callbacks. Guarda single-flight por `consumePendingCode`, que borra el código compartido al leerlo sin compare-and-delete, y porque las claves PKCE viven en `sessionStorage`, que comparten todas las ventanas de la pestaña.
- [x] **X4 — Conectar desde la Papelera.** Botón + `Archivo > Conectar` + estado `connecting`. `onConnected` solo dispara `loadTrash()`: conectar no crea el workspace, porque `findWorkspaceFolder` no crea y `ensureWorkspaceFolder` sí.

## Sin evidencia en runtime

No hay test runner en el repo (`package.json`: dev, dev:https, build, lint, typecheck, preview, deploy). Las tres cosas que **no** se pueden probar con checks estáticos:

1. Que `trashed = true` realmente liste archivos creados por la app bajo `drive.file`. Es inferencia desde la documentación de la API, no verificado en un token real.
2. Que un archivo restaurado vuelva a `desktop-web` y no a la raíz. Depende de que `removeParents` reciba el id correcto.
3. Que `canUntrash` venga poblado y refleje la realidad.

Las tres requieren el smoke test manual con Google real.

## Decisions

- **Ventana independiente con token compartido.** El usuario lo eligió explícitamente. Costo aceptado: se invierte el contrato de "no module-level mutable state" documentado en `client.ts:5-8`.
- **Sin borrado definitivo.** "Vaciar papelera" queda afuera. Es una decisión de producto con riesgo de pérdida de datos, no un detalle de implementación.
- **Restaurar siempre a `desktop-web`.** Un archivo en la papelera ya no tiene parent útil; restaurarlo a la raíz de Drive sería peor que no restaurarlo.
- **`listTrashedFiles` sin filtro de parent.** La papelera es global a la cuenta, no por carpeta. Se listará lo que la app haya borrado, que con `drive.file` es exactamente lo que la app creó.

## Fuera de scope

- Verificación de OAuth en Google Cloud (la app usa `drive.file`, non-sensitive, no la requiere).
- `deletePermanently` / `emptyTrash`.
- Persistencia de la sesión más allá de la memoria (sigue durando ~1 h).
- Migrar los markdown de `src/data/files/` a Drive — son build-time, sin write path.

## Ruta

Delegated writer: 8+ archivos no triviales con lectura preparatoria extendida. Dispara el writer trigger y el preparation trigger.
