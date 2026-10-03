# Feature: google-drive-app

## Objective
Agregar una app nueva ("Mi unidad") que permita explorar, ver y editar archivos de Google Drive dentro de una ventana estilo Windows 98, sin tocar el sistema de archivos local existente.

## Problem
El proyecto no tiene ninguna noción de almacenamiento remoto: `src/hooks/useFileSystem.ts` lee markdown empaquetado en build con `import.meta.glob('../data/files/**/*.md')`. No hay backend, no hay `fetch` en todo `src/`, y el FS es de solo lectura (`NotepadApp` tiene el Save literalmente sin implementar: `'Save dialog (not implemented)'`). "Explorar y editar Drive" es superficie nueva completa, no un ajuste.

## Why
El usuario quiere ver y editar contenido de Google Drive con sus propias ventanas. Se acordó planificar antes de escribir: primero se relevaron las restricciones reales de la plataforma (con fuente y con medición) y después se tomaron las decisiones de producto.

## Hallazgos verificados (base de las decisiones)

| # | Hallazgo | Evidencia |
|---|---|---|
| 1 | La UI de Drive **no se puede embeber**: `drive.google.com` responde `x-frame-options: SAMEORIGIN` | Medido con `curl` sobre `/drive/my-drive`; solo `/preview` de archivos ya compartidos es embebible |
| 2 | `drive.file` es scope **no-sensible** → sin CASA ni evaluación de seguridad anual | developers.google.com/drive/api/guides/api-specific-auth: tabla "Non-sensitive scopes" + *"Since `drive.file` is non-sensitive, it allows for a more streamlined verification process"* |
| 3 | `drive.file` da acceso **por archivo, no por árbol**: elegir una carpeta en el Picker no expone sus hijos | Descripción oficial del scope ("files that you open with an app or that the user shares with an app while using the Google Picker API") + 3 reportes independientes: SO 51274573, 79430743 (*"the folders and files query always gives me an empty array"*), 79702574 (*"I don't get access to any of the files in the folder"*). **Reportado, no documentado explícitamente → requiere spike** |
| 4 | Google Docs → markdown por API: soportado. Escribir de vuelta: **no** es round-trip | Tabla oficial de export formats: Documents / Markdown / `text/markdown` / `.md`. La escritura exige `documents.batchUpdate` (estructural) |
| 5 | Sin backend **no hay refresh token** | GIS token model es el camino sancionado para apps *"purely browser based, with no backend"*; los access tokens son de vida corta (~1 h). Authorization code + PKCE *"requires a backend platform"* |
| 6 | Verificación restringida = video demo + justificación de scope + evaluación de seguridad anual | support.google.com/cloud/answer/13464321 |

## Decisiones tomadas

| Dimensión | Decisión |
|---|---|
| Audiencia | Visitantes de juandavid.site (app pública), no solo la cuenta del dueño |
| Scope | `https://www.googleapis.com/auth/drive.file` únicamente |
| Acceso | **Workspace propio de la app** (carpeta creada por la app). Resuelve el conflicto del hallazgo 3: como la app **crea** cada archivo, `drive.file` le da acceso a todos ellos. El Picker en multiselección queda **fuera de alcance** del pedido actual |
| Contenido | Markdown/texto: lectura y escritura. Binarios (imágenes, PDF): solo visualización. **Google Docs, Office y Sheets: fuera de alcance** |
| Modelo | App nueva y separada; FileExplorer, Search y routing por URL quedan intactos |
| Auth | **GIS token model, estático, sin backend** (decidido 2026-10-02). El token vive solo en memoria; sesión corta (~1 h) con reconexión explícita |

**Consecuencia de producto que debe reflejarse en el copy de la UI:** lo que se construye es *una unidad de Drive administrada por la app*, **no** "tu Drive". El usuario final no va a ver sus carpetas existentes. Si el copy no lo dice, va a parecer roto.

## Scope

- [ ] **T0 — Prerrequisitos en Google Cloud** (trabajo del usuario, no código de este repo): proyecto, Drive API habilitada, consent screen **publicado en Production** (los visitantes anónimos no pueden ser *test users*), OAuth client ID (Web) con *authorized JS origins* `http://localhost:5173` y `https://juandavid.site`, API key con restricción por HTTP referrer.
- [ ] **T0b — Verificación de marca (SOLO al publicar, no bloquea el spike)**: homepage en dominio verificado, **política de privacidad publicada y enlazada en `juandavid.site`**, verificación de propiedad en Search Console. *Corrección 2026-10-02: no son días — la revisión automatizada "typically takes a few minutes"; 2-3 días hábiles solo si cae a revisión manual. Y solo aplica si querés mostrar nombre/logo en la consent screen: sin ella la app funciona igual, solo sin marca visible.*
- [ ] **T1 — Fase 0: spike timeboxeado y descartable.** Probe en `public/spike/drive.html` (NO va en `src/`; se borra al terminar). Mediciones instrumentadas: **M1** cuántos archivos ve `files.list`; **M2** si el re-auth silencioso funciona sin click; **M3** si la carpeta de una sesión previa sigue accesible tras re-autenticar (esta decide si el modelo `drive.file` aguanta); **M4** si `headRevisionId` cambia al editar. Si falla acá, se cambia el plan, no el código.
- [ ] **T2 — Fase 1: fundamentos de auth.** `useDriveAuth` (conectar, reconexión silenciosa, `revoke`) con el token **solo en memoria**, nunca `localStorage`. Cliente fetch que inyecta el header, mapea errores y reintenta una vez en 401. Sin operaciones de archivos.
- [ ] **T3 — Decisión pendiente: ubicación del editor de markdown.** Recomendación del arquitecto: editor propio *dentro* de DriveApp (aislado, cero blast radius). Alternativa: generalizar el `Save` de Notepad para aceptar destino remoto — más elegante a futuro, toca Notepad + MarkdownViewer + tipos + registro.
- [ ] **T4 — Fase 2: explorador de solo lectura.** Registro en `apps.ts`, ventana 98.css con barra de estado, listado del workspace y de los elegidos, íconos por mime. Reutiliza `MarkdownViewerApp` **sin tocarlo**: ya acepta un `File` vía `AppData.file` (`src/types/index.ts`). Binarios: `files.get?alt=media` → `Blob` → `URL.createObjectURL`, con `revokeObjectURL` al desmontar y tope de tamaño.
- [ ] **T5 — Fase 3: escritura.** Crear, subir desde disco, editar y borrar → papelera (`trashed: true`, nunca borrado definitivo). Detección de conflicto comparando `headRevisionId`/`modifiedTime` y aviso si el archivo cambió afuera.
- [ ] **T6 — Fase 4: UX e i18n.** Claves ES/EN, estados vacíos, token vencido, offline, cuota excedida, comportamiento móvil, `README.md` actualizado.
- [ ] **Verificación:** `npm run lint`, `npm run typecheck` y `npm run build` en verde, más la evidencia manual del spike registrada en este documento.

## Constraints
- **No escribir el token en `localStorage`** (el token va en memoria).
- **No borrar definitivamente**: solo `trashed: true`.
- **No tocar** `FileExplorerApp`, `SearchApp` ni el routing por URL: la feature es una app nueva.
- **No tocar** los tipos locales de `useFileSystem.ts` (`FileData`, `FileStructureItem`): los tipos de Drive son propios, con una función de mapeo a `File` para el passthrough al visor.
- Los archivos de Drive son **datos del usuario**: mientras la feature esté en spike, no persistir contenido de Drive en el repo ni en `src/data/files/`.
- Client ID y API key son públicos por diseño (van al bundle): lo que importa son las restricciones en Google Cloud, no ocultarlos.

## Archivos previstos
**Nuevos:** `src/apps/DriveApp/{index.tsx,index.css}`, `src/hooks/useDriveAuth.ts`, `src/hooks/useDriveFileSystem.ts`, `src/services/googleDrive/{client.ts,types.ts}`, `src/constants/drive.ts`, `src/utils/driveMime.ts`, `.env.example`
**Modificados:** `src/apps/apps.ts`, `src/i18n/translations.ts`, `src/types/index.ts`, `README.md`

## Riesgos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| El acceso por carpeta con `drive.file` no funcione como se espera (hallazgo 3) | Alto: invalida el modelo elegido | T1 spike antes de escribir código de producción |
| El usuario espere ver *su* Drive completo | Alto: percepción de feature rota | Copy explícito en la UI; documentarlo en README |
| Token de 1 h sin refresh | Medio: sesión cortada para visitantes | Medir en T1; si es inaceptable, backend mínimo (decisión diferida) |
| Sin infra de tests en el repo (no hay runner: solo `lint`, `typecheck`, `build`) | Medio: verificación flaca para lógica de red y mapeo de errores | Sumar vitest es una **decisión aparte**, no se da por hecha |
| PR de más de 400 líneas | Medio: carga de review | Partir en PRs encadenados: Fase 1+2, después Fase 3 |

## Progress
| Task | Estado | Evidencia |
|---|---|---|
| Relevamiento de restricciones | ✅ | Hallazgos 1–6 de este documento, con fuente y medición |
| Decisiones de producto | ✅ | Tabla "Decisiones tomadas"; memoria Engram #156 (restricciones) y #157 (decisiones) |
| Conflicto per-file vs carpeta | ✅ | Resuelto 2026-10-02: modelo de workspace creado por la app, sin Picker |
| Arquitectura de auth | ✅ | Resuelto 2026-10-02: GIS token model estático, sin backend (opción 1) |
| Autorización de implementación | ✅ | 2026-10-02: el usuario pidió la app y confirmó "dale" |
| T0 (Google Cloud) | ✅ | 2026-10-02: proyecto, Drive API, consent External/Testing, scope `drive.file`, test user, Web OAuth client ID. **API key descartada**: con token del usuario no hace falta |
| T1 (spike) | ✅ | 2026-10-03: **todas las mediciones críticas pasaron**. Tabla abajo |
| T2–T6 | ✅ | 2026-10-03: work units 1 y 2 implementados. `lint`/`typecheck`/`build` en verde. **Falta verificación en runtime** (nadie abrió la ventana en un browser real todavía) |

## Verificación final
Pendiente. Criterio: T1 con mediciones registradas; `npm run lint` / `npm run typecheck` / `npm run build` en verde; evidencia de evidencia manual (conexión, lectura y guardado) anotada en este documento.

## Resultado de T1 (spike) — 2026-10-03

**Veredicto: el modelo aguanta. Se escribe código de producción.**

| Medición | Resultado | Significado |
|---|---|---|
| **M1** `files.list` ve lo creado por la app | ✅ `1` | `drive.file` da acceso al contenido que la app crea. **El modelo de workspace pedido funciona.** |
| **M3A** token nuevo lee la carpeta por id guardado | ✅ `true` | La persistencia entre sesiones existe. |
| **M3B** token nuevo **descubre** la carpeta sin id | ✅ `true`, 1 encontrada | **La app no necesita guardar el folder id.** Puede localizar su workspace sola. Diseño robusto ante limpieza de navegador. |
| **M4** `headRevisionId` cambia al editar | ✅ `true` | Sirve para detectar conflicto de escritura: comparar el guardado contra el actual antes de sobreescribir. |
| Papelera | ✅ | `trashed: true` excluye el archivo del listado. Sin borrado definitivo. |
| Read-back de markdown | ✅ | Sube y baja exacto con `uploadType=multipart` + `Content-Type: text/markdown`. |
| Vida del access token | ✅ `3599s` | Confirma empíricamente el supuesto de ~1 h. |
| `drive.file` en el Drive real | ✅ | La app creó una carpeta real y la vio: `desktop-spike-1790987662993`. |

Cuenta de prueba: `juandavid8a@gmail.com`. Carpeta del spike: `1JYlxu4XhzM03XpqCVWLWEwO3m-RPWDyW`.

**M3B es el hallazgo de diseño más importante**: la app localiza su carpeta por `files.list` con `mimeType='application/vnd.google-apps.folder'`, sin depender de estado local.

## Next step
**Auth resuelta — opción B elegida por el usuario 2026-10-03**: authorization code + PKCE + `client_secret` en el bundle. El popup de GIS queda descartado: se colgaba en silencio por cookies de terceros. El secret viaja al JS a propósito, con el riesgo acotado a phishing/impersonación (un atacante solo obtiene tokens de su propia cuenta). Con `drive.file`, el radio de explosión de un token robado es mínimo: solo archivos creados por la app.

**Implementado (work units 1 y 2):** capa de servicios (`src/services/googleDrive/`), ventana os-gui (`src/apps/DriveApp/`), registro en `apps.ts`, ícono de escritorio en `DesktopIcons` (posición `[1,7]`, sin colisiones), i18n ES/EN, `README.md`, y `.env.example`.

**Pendiente antes de publicar:**
1. **Verificación en runtime**: abrir la ventana en un browser real y recorrer el flujo completo (conectar → crear carpeta → crear archivo → abrir en el visor → editar → papelera). Nada de esto se ejecutó todavía; `lint`/`typecheck`/`build` prueban tipos y forma, no comportamiento.
2. Agregar `https://juandavid.site/` a los *Authorized redirect URIs* del client de Google.
3. Publicar la consent screen a *Production* (los visitantes anónimos no pueden estar en el allowlist de test users).
4. Rotar el `client_secret` si se considera expuesto.
5. Borrar `public/spike/callback.html`.

Commits: pendientes de confirmación explícita del usuario (regla de AGENTS.md). Estamos en `main`.
