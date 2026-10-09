# react-desktop

Entorno de escritorio estilo Windows 98 construido con React. Desplegado en [https://juandavid.site](https://juandavid.site).

## Overview

Simulación completa de un sistema operativo con ventanas arrastrables, barra de tareas, menú Start, explorador de archivos, buscador, visor de markdown, portafolio de proyectos, reproductor Winamp (con playlist persistente) y más. Construido con React 19, TypeScript y Vite.

## Despliegue y Dominio

- **Plataforma**: GitHub Pages
- **Dominio Personalizado**: `https://juandavid.site`
- **CI/CD**: Despliegue automático mediante GitHub Actions al hacer push a `main`
- **SPA Support**: Archivo `404.html` generado automáticamente para enrutamiento

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | `^19.2.4` | Framework principal |
| TypeScript | `^5.9.3` | Tipado estático |
| Vite | `^8.0.0` | Build tool y dev server |
| 98.css | `^0.1.21` | Estilos auténticos Windows 98 |
| react-markdown | `^10.1.0` | Renderizado de markdown |
| rehype-raw | `^7.0.0` | Soporte HTML en markdown |
| Webamp | `^2.2.0` | Reproductor Winamp |
| ESLint | `^9.39.4` | Linting con plugins React |

## Requisitos

| Requisito | Versión |
|---|---|
| Node.js | 20+ (ver `.github/workflows/deploy.yml`) |
| npm | 10+ |

## Quick Start

```bash
git clone https://github.com/codigo8a/codigo8a.github.io.git
cd codigo8a.github.io
npm install
npm run dev      # → http://localhost:5173
npm run build    # build de producción → dist/
npm run preview  # preview del build
```

> El proyecto también funciona con `pnpm` o `yarn` si preferís, pero los scripts oficiales usan `npm`.

## Estructura del Proyecto

```
src/
├── apps/                          # Aplicaciones del sistema
│   ├── WelcomeApp/               # Pantalla de bienvenida
│   ├── NotepadApp/              # Bloc de notas
│   ├── FileExplorerApp/         # Explorador de archivos
│   ├── MarkdownViewerApp/       # Visor de markdown
│   ├── SearchApp/               # Buscador de archivos
│   ├── SettingsApp/             # Configuración del sistema
│   ├── IExplorerApp/            # Navegador web estilo retro
│   ├── Portfolio/               # Portafolio de proyectos
│   ├── MyComputer/              # Mi PC
│   ├── Network/                 # Entorno de red
│   ├── RecycleBin/              # Papelera: los archivos que Mi unidad mandó a la papelera de Google Drive, restaurables de vuelta al workspace
│   ├── SoundRecorder/           # Grabador de sonido
│   ├── MSDOS/                   # Símbolo del sistema MS-DOS
│   ├── DriveApp/                # Unidad de Google Drive (index.tsx = placeholder React + launchDrive() construye la ventana os-gui)
│   └── apps.ts                  # Registro central de apps
├── components/                    # Componentes (Diseño Atómico)
│   ├── molecules/               # Componentes simples
│   │   ├── TitleBar/           # Barra de título
│   │   └── WindowControls/     # Botones min/max/close
│   ├── organisms/              # Componentes complejos
│   │   ├── Window/            # Ventana arrastrable
│   │   ├── TaskBar/           # Barra de tareas
│   │   └── StartMenu/         # Menú Start
│   ├── Desktop.tsx            # Escritorio principal
│   ├── DesktopIcons/          # Iconos del escritorio
│   ├── ErrorBoundary.tsx      # Manejo de errores
│   └── ErrorWindow.tsx        # Ventana de error
├── context/                      # Contextos de React
│   ├── DesktopContext.tsx     # Estado global del escritorio
│   ├── WindowContext.tsx      # Estado local de ventana
│   └── LanguageContext.tsx    # Estado de idioma
├── hooks/                        # Hooks personalizados
│   ├── useFileSystem.ts       # Acceso al sistema de archivos
│   ├── useWindow.ts           # Lógica de ventana y reloj
│   ├── useUrlRouting.ts       # Enrutamiento por URL
│   ├── useMediaQuery.ts       # Media queries responsive
│   └── useTranslation.ts      # Hook de traducciones
├── i18n/                        # Internacionalización
│   └── translations.ts        # Traducciones ES/EN
├── data/files/                  # Archivos markdown (98 archivos)
│   ├── content/                # Contenido principal
│   ├── youtube/                # ~50 tutoriales
│   ├── system/                 # Sistemas desarrollados
│   ├── internet/               # Recursos de internet
│   └── web/                    # Proyectos web
├── types/                       # Tipos TypeScript
├── constants/                   # Constantes del sistema
├── services/                    # Integraciones con APIs externas
│   └── googleDrive/             # OAuth + PKCE, cliente HTTP de Drive v3, sesión en memoria compartida y errores
├── utils/                       # Utilidades
├── App.tsx                     # Componente raíz
└── main.tsx                    # Punto de entrada
```

## Scripts Disponibles

```bash
npm install     # Instalar dependencias
npm run dev     # Servidor de desarrollo (vite --host 0.0.0.0)
npm run build   # Build de producción
npm run lint    # Linting con ESLint
npm run preview # Preview del build
npm run deploy  # Despliegue a GitHub Pages (gh-pages -d dist)
```

## Aplicaciones del Sistema

| App | Descripción | Tamaño | Instancia Única |
|-----|-------------|--------|-----------------|
| **Welcome** | Pantalla de bienvenida con tips, selector de idioma y enlaces sociales | 700x420 | ✅ Sí |
| **Notepad** | Bloc de notas con barra de estado, toolbar markdown y `File > Save` en memoria — o de vuelta a Drive cuando Drive lo abre con `remoteSave` | 450x350 | ✅ Sí |
| **FileExplorer** | Explorador con vista de iconos estilo "My Documents" (cuadrícula) | 780x540 | ✅ Sí |
| **MarkdownViewer** | Visor markdown con vista Preview/Source y galería de imágenes | 1000x800 | ❌ No (por archivo) |
| **Search** | Búsqueda por nombre y contenido de archivos | 640x460 | ✅ Sí |
| **Settings** | Configuración con 3 tabs: General (idioma, Clippy), Desktop (wallpapers + baldosa "Imagen personalizada") y Advanced | 450x480 | ✅ Sí |
| **Internet Explorer** | Navegador web estilo retro — acepta URL inicial vía `openApp('iexplorer', { url })` | 900x650 | ✅ Sí |
| **Portfolio** | Portafolio de proyectos con 4 vistas (Iconos, Lista, Detalles) | 600x450 | ✅ Sí |
| **My Computer** | Explorador del sistema | 780x540 | ✅ Sí |
| **Network** | Entorno de red | 500x350 | ✅ Sí |
| **Recycle Bin** | Papelera: lista los archivos que Mi unidad mandó a la papelera de Google Drive y los restaura al workspace | 620x420 | ✅ Sí |
| **Sound Recorder** | Grabador de sonido simple | 270x130 | ✅ Sí |
| **MS-DOS Prompt** | Símbolo del sistema | 640x400 | ✅ Sí |
| **My Drive** | Unidad de Google Drive administrada por la app (carpeta propia): conectar, listar, crear, editar en Notepad y mandar a la papelera | 820x580 | ✅ Sí |
| **Winamp** | Reproductor de música clásico con Webamp — demo track "Llama Whippin' Intro" en primer inicio, playlist persistente entre sesiones | — | ✅ Sí |

## Características Principales

### Sistema de Ventanas
- **Drag**: Arrastrar desde la barra de título
- **Resize**: Redimensionar desde esquina inferior derecha
- **Minimize/Maximize/Close**: Controles estándar
- **Z-index dinámico**: Ventana activa siempre al frente
- **Prevención de duplicados**: Por archivo con `windowKey`
- **Responsive**: En móviles se maximizan automáticamente
- **Animaciones**: Abrir, cerrar, minimizar y restaurar con transiciones suaves
- **Persistencia de posición**: Las ventanas recuerdan su posición y tamaño al cerrarse y reabrirse

### Enrutamiento por URL
- Soporte para rutas tipo `/folder/file`
- Abre archivos automáticamente desde URL
- Limpia URL cuando no hay ventanas de archivo
- Case-insensitive para carpetas y archivos

### Sistema de Traducciones (i18n)
- Idiomas: Español e Inglés
- Hook `useTranslation()` para las apps React (escritorio, Start menu, Settings)
- Tabla local `TRANSLATIONS` + `tr(key)` para las apps os-gui, que corren fuera de React y no pueden usar hooks (`MarkdownViewerApp`, `DriveApp`)
- Persistencia en localStorage
- 54 claves en `i18n/translations.ts` + 103 en la tabla local de DriveApp

### Explorador de Archivos
- **Vista Iconos (My Documents)**: Cuadrícula de iconos estilo Windows 98
  - Iconos con nombres de archivos
  - Doble clic para abrir archivos
- **Barra de direcciones**: Doble clic selecciona la dirección completa; el gesto lo comparten todas las ventanas que tienen barra de direcciones

### Iconos de Escritorio
- Iconos arrastrables con posición persistente en localStorage
- **Radio Código 2**: abre Internet Explorer en `https://kick.com/radio-codigo2`
  - Si ya hay una ventana del navegador abierta, la reutiliza (la enfoca y navega en ella)
- **TankStrike**: icono situado justo debajo de Radio Código 2, abre la app interna `tankstrike` (juego offline sin dependencias externas)
  - Juego por turnos: 6 movimientos por ronda, último tanque en pie gana
  - Incluye selección de bots (1-4), modal de inicio y rejugar
- **YouTube Juan David Ochoa**: icono situado justo debajo de TankStrike, abre Internet Explorer en `https://www.youtube.com/@JuanDavidOchoa`
  - Mismo comportamiento que los iconos anteriores (reutiliza la ventana del navegador si ya está abierta)
- **Google Drive**: icono situado justo debajo de YouTube, abre la app `driveApp` (Mi unidad)
- **Recycle Bin**: icono en la columna derecha, debajo de TankStrike, abre la app `recycleBin` (papelera de Google Drive)
- Cualquier icono puede abrir una app pasando datos:
  `openApp('iexplorer', { url: 'https://…' })` → `launchIExplorer(url)`

### Google Drive (Mi unidad)

App nueva que explora una **carpeta propia administrada por la app** dentro del Drive del visitante. No es "tu Drive": la app pide el scope `drive.file`, que solo le da acceso a los archivos que ella misma crea, así que la UI lo dice explícitamente para que no parezca una feature rota.

- **Capa de servicios** (`src/services/googleDrive/`): `client.ts` (Drive v3), `auth.ts` (OAuth + PKCE), `driveSession.ts` (dueño del token en memoria), `errors.ts` (códigos de error traducibles), `types.ts`. Ningún método tira excepciones: devuelven `DriveResult<T>` (`{ok:true,data}` | `{ok:false,error}`)
- **UI** (`src/apps/DriveApp/`): `index.tsx` es el placeholder React que exige el registro de apps y, en el mismo archivo, `launchDrive()` construye la ventana os-gui de verdad (patrón idéntico al de `MyComputer`)
- **Chrome Explorer**: la ventana usa la misma estructura que `MyComputer` y `MyDocuments`, sin CSS propio para eso: `.os-explorer` → `.toolbars` (menú + `#standard-buttons-toolbar` + `#address-bar-toolbar`) → `.content-with-panel` (`#panel` + `#content`) → `#status-bar`. Los helpers de toolbar viven en `src/utils/explorerChrome.ts`; los helpers de `MyComputer` y `FileExplorerApp` todavía son copias propias y migrarlos es un follow-up
- **Workspace**: carpeta `desktop-web` que la app **descubre por nombre** en cada sesión (`files.list`) y crea en el primer uso. Nunca se guarda el id de la carpeta
- **Modelo de acciones por selección**: click simple selecciona la fila y llena el panel izquierdo (nombre, tamaño, modificado, tipo); doble click y `Abrir` **abren** en el visor Markdown vía `openApp('markdownViewer', …)`, **Editar** **abre el archivo en Notepad** (que guarda de vuelta a Drive, ver [edición en Notepad](#edición-en-notepad-edit-y-file--save)) y **Papelera** manda el archivo con `trashed: true` (nunca borrado definitivo, recuperable durante 30 días desde la [Papelera](#papelera-recycle-bin) del escritorio). `Archivo ▸ Renombrar` abre el editor de nombre en el lugar sobre la fila seleccionada. No hay botones por fila: todo pasa por la selección y los menús
- **Vistas**: las 4 del Explorer — iconos grandes, iconos pequeños, lista y detalles (Detalles suma la columna Tipo)
- **Nuevo archivo**: `Archivo ▸ Nuevo ▸ Documento de texto` (y el botón `Nuevo` de la toolbar, que crea directo sin submenú) crea el `.md` vacío **al instante** en la carpeta del workspace con el nombre por defecto localizado (`Nuevo documento de texto` / `New Text Document`). El nombre queda **editable en el lugar**, con el texto seleccionado, en los 4 modos de vista: `Enter` y salir del campo confirman el cambio (`PATCH` de `name` vía `renameFile`), `Esc` abandona la edición y deja el nombre por defecto —el archivo **no se borra**—, y un nombre vacío o con caracteres ilegales avisa y sigue editando. Las otras 6 filas del submenú (`Carpeta`, `Acceso directo`, `Sonido`, `WordPad`, `Imagen`, `Maletín`) están grises a propósito, por paridad con la captura de Win98
- **Estados**: desconectado, conectando, lista, token vencido (ofrece reconexión) y error (red, cuota, scope insuficiente). Los que no tienen nada seleccionable (desconectado, reconexión, conectando, error) muestran el panel centrado, sin panel izquierdo
- **Barra de estado** estilo Win98: conteo de archivos, cuenta conectada y listo / trabajando / error

| Superficie | Dónde |
|---|---|
| Menú | `Archivo` (`Nuevo ▸ Documento de texto`, `Abrir` Ctrl+O, `Renombrar`, `Papelera`, `Conectar`, `Desconectar`, `Cerrar`) · `Editar` · `Ver` (`Barras de herramientas`, `Barra de estado`, modo de vista, `Actualizar` F5) · `Ayuda` |
| Botones estándar | `Atrás` `Adelante` `Subir` (deshabilitados: Drive tiene una sola carpeta) · `Nuevo` `Abrir` `Editar` `Papelera` · `Actualizar` · `Vistas` |
| Barra de dirección | Nombre de la carpeta del workspace (el archivo editado vive en su propia ventana) |
| Teclado | `F5` actualiza · `Supr` manda la selección a la papelera · `Enter` abre la selección en el visor |

#### Edición en Notepad (Edit y File > Save)

Drive **no edita**: `Editar` manda el archivo a Notepad (`openApp('notepad', …)`) y la ventana de Drive sigue mostrando la lista. Notepad es el único editor de texto del escritorio, así que hereda su toolbar markdown, `Ln/Col` y marca de dirty en vez de duplicarlos.

El guardado de vuelta a Drive viaja como un **handle**, no como un valor: `AppData.remoteSave.save(content)` es una función que Drive crea por archivo y que Notepad solo llama.

| Pieza | Dónde | Qué hace |
|---|---|---|
| `RemoteSaveHandle` / `RemoteSaveResult` | `src/types/index.ts` | Contrato del guardado remoto. `message` es obligatorio a propósito: el destino redacta el resultado en el idioma del usuario y el editor lo muestra tal cual, porque un editor no sabe qué es una revisión de Drive |
| `openInNotepad(file)` | `src/apps/DriveApp/index.tsx` | Lee el contenido y despacha `desktop-open-app` con `appId: 'notepad'`, `file` y `remoteSave` |
| `createRemoteSaveHandle(file)` + `saveRemoteFile(...)` | `src/apps/DriveApp/index.tsx` | Chequeo de conflicto, aviso Yes/No, escritura y parche de `files[]` |
| `launchNotepad(appData?)` | `src/apps/NotepadApp/index.tsx` | Siembra nombre + contenido, y `File > Save` llama al handle en vez de `documents.set` |

Detalles que sostienen el contrato:

- **El payload no se serializa.** `openApp` viaja como `detail` de un `CustomEvent` y llega a `customLaunch` **por referencia**: no hay `structuredClone`, ni `postMessage`, ni un round trip JSON en `src/`, así que el miembro función sobrevive. Solo funciona en el mismo realm: un handoff entre documentos real pasaría por el structured clone de `postMessage` y lo perdería.
- **El handle no vuelve a leer el token.** Toma el token vivo del módulo de sesión (ver [sesión compartida](#sesión-compartida-drive)), que es memory-only, y la ventana de Drive lo limpia al cerrarse.
- **Si la ventana de Drive se cerró**, el guardado devuelve un error con un mensaje claro y **no toca el DOM de una ventana destruida**. Si se cerró *durante* la escritura, la escritura ya ocurrió: el resultado sigue siendo éxito y solo se pierde el refresco de la lista.
- **`File > New` y `File > Open` despegan el handle**: un documento que reemplazó al abierto ya no puede escribir al archivo que reemplaza. El prompt de nombre solo aparece para documentos locales.
- **Guardado remoto en curso**: la escritura es un round trip de red, así que un segundo disparo del ítem de menú mientras corre se descarta en lugar de disparar dos escrituras. El dirty marker sobrevive hasta que la escritura se reconoce, así que un save fallido deja el buffer sin guardar a propósito.

#### Autenticación (OAuth 2.0 authorization code + PKCE)

1. El botón **Conectar con Google** es un `<a target="_blank" rel="noopener">` real: no usa `window.open`, así que no depende de permisos de popup. El click primero guarda el *verifier* y el *state* de PKCE en `sessionStorage`
2. Google redirige esa pestaña a la app con `?code=…`. El boot (`App.tsx`) detecta el callback, publica el código en `localStorage` bajo una clave transitoria y cierra esa pestaña
3. La ventana principal hace polling de esa clave (`consumePendingCode`), valida el `state` contra el guardado, y recién entonces intercambia el código por un access token
4. **El access token vive solo en memoria** (módulo `driveSession.ts`, no el closure de una ventana). Nunca se escribe en `localStorage` ni `sessionStorage`. Sin backend no hay refresh token, así que la sesión dura ~1 h y termina pidiendo reconectar
5. **Desconectar** borra el token de memoria. No hay revoke remoto

#### Configuración

Requiere un OAuth Client de tipo **Web application** en Google Cloud con la Drive API habilitada y el scope `drive.file`. Variables (`.env`, ver `.env.example`):

| Variable | Para qué |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Client ID del cliente Web |
| `VITE_GOOGLE_CLIENT_SECRET` | Client secret (ver el caveat de abajo) |
| `VITE_GOOGLE_REDIRECT_URI` | Redirect URI registrado; tiene que coincidir con el origen |

Sin las tres, la app abre igual y muestra el aviso de configuración faltante en vez del botón de conectar.

#### Desarrollo local: por qué `dev:https`

```
npm run dev:https   # HTTPS con certificado autofirmado
```

La política OAuth 2.0 de Google exige **esquema HTTPS** en los redirect URIs y en los JavaScript origins, así que la app **no se puede conectar a Google sobre `http://localhost`**. `npm run dev` sigue disponible para trabajar sobre otras cosas; para probar el login hay que usar `dev:https`.

El certificado es autofirmado, así que el browser muestra un warning: se acepta una vez por sesión con *Advanced → Proceed*. El certificado cubre `localhost`; si entrás por una IP de red el navegador además va a marcar un error de hostname, y conviene entrar por `localhost`.

#### Probar el login desde otro equipo de la red

La IP de red **no sirve para autenticarse**: el certificado no la cubre y, sobre todo, `192.168.x.x` no está registrado como JavaScript origin en Google Cloud, así que el consent screen rechaza el origin. La salida es un **túnel SSH** que hace que el otro equipo vea el origin como `localhost`.

En el **otro equipo**, con el dev server ya corriendo acá:

```bash
ssh -L 5173:5173 <usuario>@<ip-de-esta-maquina>
```

Ejemplo: `ssh -L 5173:5173 pepe@192.168.1.40`

Después se abre `https://localhost:5173/` en el otro equipo. El origin, el redirect URI y el nombre del certificado coinciden con lo registrado en Google, así que el login funciona igual que en local.

| Detalle | Por qué importa |
|---|---|
| El puerto local del túnel tiene que ser el mismo que el del dev server | `5173` es el único que Google tiene registrado como redirect URI de desarrollo |
| La terminal queda ocupada mientras el túnel está abierto | `Ctrl+C` lo corta; si se cierra, el otro equipo pierde el acceso |
| El warning de certificado se acepta en el otro equipo, una vez por sesión | El cert es autofirmado y no cambia por usar el túnel |
| El dev server tiene que haber caído en 5173 | Vite sube al siguiente puerto libre si el 5173 está ocupado, y en 5174+ el redirect URI ya no coincide con lo registrado en Google |

Es la forma de probar el OAuth real y el round-trip de escritura contra Drive sin desplegar ni tocar producción.

Para ver en qué puerto quedó:

```
npm run dev:https
# ➜  Local:   https://localhost:5173/
```

Un cliente OAuth por etapa de despliegue, como pide la política de Google: uno de desarrollo con `https://localhost:5173` y otro de producción con `https://juandavid.site`. Así, cambiar scopes o revocar permisos en desarrollo no toca a los usuarios reales.

| Entorno | `VITE_GOOGLE_REDIRECT_URI` |
|---|---|
| Desarrollo | `https://localhost:5173/` |
| Producción | `https://juandavid.site/` |

#### ⚠️ El `client_secret` viaja en el bundle

`VITE_GOOGLE_CLIENT_SECRET` se compila dentro del JS y cualquiera puede leerlo en el devtools. Eso no se puede evitar sin un backend, y el riesgo real **no es la exfiltración de datos**:

- Google exige `client_secret` para clientes "Web application" incluso con PKCE, así que la app no funciona sin él
- Un atacante que extraiga el secret **no puede obtener tokens ajenos**: solo puede abrir su propia sesión de OAuth, exactamente igual que cualquier visitante
- El riesgo real es de **phishing / impersonación**: alguien puede montar una página que pase por la app y engañe a un usuario para que autorice a SU cuenta, y usar el secret como "prueba de que es la app real"

Por eso lo que hay que proteger no es el secret en sí, sino la configuración del proyecto en Google Cloud: consent screen publicada, origenes JS autorizados bien definidos y, sobre todo, **no guardar archivos privados del usuario en el Drive de pruebas**. La rotación del secret es lo que sí mitiga el escenario de phishing.

#### Conflictos de escritura

`files.update` de Drive v3 **no tiene actualización condicional** (ni `If-Match`, ni "expected revision"), así que la app compara `headRevisionId` antes de escribir y avisa si el archivo cambió desde que se abrió. Eso **reduce** la ventana de lost update pero no la cierra: dos pestañas guardando el mismo archivo al mismo tiempo todavía pueden pisarse. El aviso dice "cambió desde que lo abriste", nunca "guardado seguro".

Esa comparación vive en el handle de guardado, no en Notepad, y el **baseline se rebaselinea con cada escritura exitosa**: sin eso, el segundo guardado del propio usuario se reportaría como un cambio ajeno y saltaría el aviso.

#### Sesión compartida (drive)

Dos ventanas os-gui necesitan la misma sesión de Google —Mi unidad y la [Papelera](#papelera-recycle-bin)— y **`osWindowRegistry` no puede pasar datos entre ellas**: su `OsWindowEntry` público solo lleva `{ id, appId, title, icon, isMinimized }`, sin payload ni callbacks, y ninguna de las dos ventanas pasa por React. Por eso el token vive en `src/services/googleDrive/driveSession.ts`, no en el closure de `launchDrive`.

API: `getDriveToken()`, `getUsableDriveToken()` (devuelve `null` si ya venció), `setDriveToken()`, `clearDriveToken()`, `getDriveWorkspaceFolderId()`, `setDriveWorkspaceFolderId()`, `clearDriveWorkspaceFolderId()` y `subscribeDriveToken(listener)`.

Qué cambia y qué no:

| | |
|---|---|
| **Almacenamiento** | Igual que antes: solo memoria. Ni `localStorage`, ni `sessionStorage`, ni cookies, ni la URL |
| **Dueño** | El módulo, no la ventana. `client.ts` sigue siendo puro: recibe el token como parámetro de cada llamada |
| **Alcance** | La sesión es de la cuenta, no de la ventana. Dos ventanas que la consultan no es un leak, es el mismo usuario |
| **Ciclo de vida** | **La sesión sobrevive al cierre de la ventana.** Cerrar Mi unidad ya no desconecta; reabrirla muestra los archivos directo, sin pantalla de conectar |

La sesión termina solo por sus propias salidas: **Desconectar** explícito, **token vencido**, o un **401**. Ninguna es el cierre de una ventana, porque ninguna ventana es dueña de la sesión.

Para que reabrir no vuelva a pedir consentimiento, el arranque de cada ventana consulta la sesión antes de renderizar el panel de conectar: `renderView()` seguido de `if (getUsableDriveToken() !== null) void loadWorkspace();`. `getUsableDriveToken()` ya incluye el chequeo de expiración, así que un solo guard cubre los dos casos — sesión viva carga la lista, sesión muerta cae sola en conectar.

Cada `clearDriveToken()` / `setDriveToken()` notifica a los suscriptores, que es lo que permite que la Papelera se entera de una conexión o de un 401 sin que Mi unidad sepa que existe. Dos detalles que no son opcionales:

- **`clearDriveToken()` no publica si no había token.** Sin ese guarda, la Papelera (suscriptora) puede terminar la sesión → publicar → volver a cargar → terminar la sesión otra vez, en bucle.
- **Toda ventana se desuscribe en `onClosed`.** Un listener que sobrevive a su ventana construiría DOM en un árbol desconectado.

El **id del workspace** tampoco se borra al cerrar: es una caché por cuenta, no estado de ventana. Limpiarlo re-crearía la situación de una ventana que nunca se abrió, costando un `files.list` extra en el próximo restore. Es seguro porque la Papelera valida `requireToken()` **antes** de leer el id, así que nunca se puede leer sin sesión.

#### Flujo de conexión compartido

Conectar ya no vive dentro del closure de `launchDrive`: vive en `src/services/googleDrive/driveConnect.ts` (291 líneas), sin DOM, sin os-gui y sin tabla de traducciones. Recibe texto y callbacks; cada ventana decide cómo se ven "esperando", "falló" y "listo".

| API | Para qué |
|---|---|
| `prepareDriveConnect(config)` | PKCE + state + URL de consentimiento. `null` significa **solo** "no hay WebCrypto" |
| `isDriveConnectInFlight()` | Si hay una conexión en curso |
| `launchDriveConnect(arming, messages, progress)` | Reclama el flujo y corre poll → state → exchange |

El guarda **single-flight** existe por una razón concreta: `consumePendingCode` **borra el código de `localStorage` al leerlo**, sin compare-and-delete. Y las dos claves PKCE viven en `sessionStorage`, que **comparten todas las ventanas de la misma pestaña**. Sin el guarda, dos ventanas conectándose a la vez se roban el código entre ellas y la perdedora termina con `connectStateMismatch`.

Cuando una segunda ventana pide conectar mientras hay una en curso, `launchDriveConnect` devuelve `{ started: false }` **sin tocar storage** —el verifier del ganador sobrevive—, el click hace `preventDefault()` para no abrir una segunda pestaña, y la ventana queda en su panel con un aviso. No muestra un spinner de "esperando el código" porque no está esperando nada.

#### Recarga automática entre ventanas

Un segundo canal, `subscribeDriveWorkspace()` / `notifyDriveWorkspaceChanged()`, publica cambios del contenido del workspace. Está **separado** del canal de token a propósito: la Papelera está suscripta al canal de token y recarga en cada notificación, así que publicar ahí dispararía una carga redundada de su propio listado.

| Acción | Quién notifica | Quién reacciona |
|---|---|---|
| Restaurar desde la Papelera | Papelera | Mi unidad recarga la lista |
| Borrar desde Mi unidad | Mi unidad | La Papelera recarga su listado |

La Papelera no reacciona a su **propia** notificación: un flag de cierre (`try/finally` alrededor del publish) distingue "notifiqué yo" de "notificó otro". `loadInFlight` no alcanza para esto — se libera en el `finally` de `loadTrash()`, que corre **antes** del publish, así que no impediría la segunda carga.

### Papelera (Recycle Bin)

`src/apps/RecycleBin/` era un placeholder muerto: 35 líneas con `innerHTML`, un emoji y el texto hardcodeado *"Your Recycle Bin is empty"*. Registrada en `apps.ts` pero **sin ningún launcher** — nadie llamaba `openApp('recycleBin')` — y sin `registerOsWindow`, así que tampoco tenía botón en la taskbar. Ahora es una ventana os-gui real que cierra el ciclo del archivo: crear → editar → borrar → **restaurar**, todo dentro del escritorio.

| Superficie | Dónde |
|---|---|
| Lanzadores | Ícono del escritorio (columna 1 del grid de 2 columnas, fila 6) y `Inicio > Programas` |
| Menú | `Archivo` (`Conectar`, `Restaurar`, `Actualizar` F5, `Cerrar`) · `Ver` (`Barras de herramientas`, `Barra de estado`, modos de vista) · `Ayuda` |
| Botones estándar | `Subir` (deshabilitado: la papelera es una lista plana, no tiene carpeta padre) · `Restaurar` · `Vistas` · `Actualizar` · `Reintentar` en el estado de error |
| Vistas | Las 4 del Explorer. Iconos grandes, iconos pequeños, lista (Nombre · Tamaño · **Eliminado**) y detalles (agrega **Restaurable**) |
| Listado | Nombre · Tamaño · **Eliminado** (`trashedTime`, para saber cuánto de la ventana de 30 días queda) |
| Barra de estado | Conteo · destino de restauración o resultado de la última acción · listo / trabajando / error |
| Estados | Desconectado, **conectando**, cargando, con archivos, vacía y error |

La columna **Restorable** del modo Detalles renderiza `capabilities.canUntrash` en los mismos tres estados que ya distingue `canRestore()`: sí, no, y `?` cuando el listado no lo preguntó. Las vistas de ícono no la muestran —no hay lugar para una segunda columna de fecha— así que los 4 modos difieren de verdad.

La **conexión es propia**: esta ventana tiene su botón `Conectar` y su entrada de menú, y usa el [flujo compartido](#flujo-de-conexión-compartido). No necesita que Mi unidad esté abierta ni la haya estado.

Tres decisiones que sostienen el comportamiento:

- **`listTrashedFiles` NO lleva filtro `in parents`.** Un archivo en la papelera ya no es hijo de la carpeta que tenía, así que un filtro por padre devolvería vacío exactamente para los archivos que esta ventana existe para mostrar. La consulta es `trashed = true`, que además es el scope justo de `drive.file`.
- **Restaurar filtra el destino fuera de `removeParents`.** Un archivo papelera conserva la carpeta de la que se mandó, así que pasar ese mismo id a `removeParents` mientras también se agrega dejaría el archivo restaurado sin ninguna carpeta — de vuelta en la raíz de Drive, que es peor que no restaurarlo. `restoreFile` lee `parents` primero (`getFileParents`), quita solo los padres que **no** son el destino y manda `addParents={workspace}` con `{trashed: false}` en el body.
- **`capabilities.canUntrash` es salida pura de la API.** Solo un `false` explícito deshabilita `Restaurar`, con tooltip explicativo; `null` significa "el listado no lo preguntó", que no es lo mismo que un no. El botón toma el ícono de edición porque la tira de sprites no tiene un glifo de "restaurar".

Conectarse desde acá **no crea la carpeta del workspace**. `onConnected` solo dispara `loadTrash()`, y el id del workspace se resuelve con `findWorkspaceFolder`, que **no** crea nada — `ensureWorkspaceFolder` pondría una carpeta en el Drive del usuario como efecto secundario de apretar Conectar, que es exactamente lo que esta ventana no debe hacer. Si la carpeta no existe, Restaurar falla con el aviso de carpeta faltante.

Funciona igual si Mi unidad nunca se abrió: el token se lee del [módulo de sesión](#sesión-compartida-drive).

**No hay "Vaciar papelera" ni borrado definitivo**, por decisión: `client.ts` no llama al permanent delete de la API y `emptyTrash` queda afuera. Google conserva los archivos 30 días.

### Barra de Tareas
- Botón Start con menú funcional
- Lista de ventanas abiertas
- Reloj en tiempo real (actualiza cada segundo)
- Indicador de ventana activa

### Settings con Tabs
- **Tab General**: Idioma (ES/EN) + Clippy (activar/desactivar)
- **Tab Desktop**: Selector de wallpapers con previsualización, incluida la baldosa **Imagen personalizada** (abre el diálogo nativo de archivos para elegir una imagen propia)
- **Tab Advanced**: Eliminar datos guardados
- Interfaz tipo Windows 98 con tabs

### Wallpapers
- 5 fondos de escritorio estilo Windows 98 + la baldosa **Imagen personalizada**
- Selector visual en Settings con previsualización
- Persistencia en localStorage
- Opciones: Teal, Brick, Green Marble, Ocean, Gray Grid, Imagen personalizada

### Fondo de escritorio personalizado (imagen propia)
- **Settings → Desktop → baldosa "Imagen personalizada"**: al hacer clic se abre el diálogo nativo de archivos (`accept="image/*"`) + botón **Quitar fondo**
- La imagen se lee con `FileReader.readAsDataURL` y se guarda como Data URL en `localStorage['desktop.backgroundImage']`
- El escritorio la lee al montar (`src/hooks/useDesktopBackground.ts`, expuesta por `DesktopContext`) y la aplica como `background-image` inline (`cover`, `center`, `no-repeat`) con prioridad sobre el wallpaper seleccionado
- **Cambio en vivo**: al elegirla o quitarla el fondo se actualiza al instante, sin recargar (evento `desktop-background-changed`; el evento `storage` sincroniza otras pestañas abiertas)
- Límite de 2 MB por imagen; se valida el tipo MIME y se captura `QuotaExceededError` (los errores se muestran en el propio panel, no en consola)
- **La persistencia es SOLO local** (`src/utils/desktopBackground.ts`): no se sube a ningún servidor, no se sincroniza con backend ni con la cuenta del usuario. Al limpiar los datos del navegador (o usar *Advanced → Eliminar datos guardados*) el fondo desaparece y vuelve el wallpaper
- Valores ausentes o corruptos se ignoran sin romper la UI (el valor corrupto se borra de localStorage)
- No hay ninguna petición de red para mostrar la imagen: el propio Data URL es la imagen

### Clippy - Asistente Virtual
- Aparece después de 2 segundos con animación flotante
- **20 tips** sobre el portfolio (navegador, wallpapers, persistencia, etc.)
- Tips mostrados en **orden aleatorio** (excepto el primero de bienvenida)
- Burbuja de diálogo estilo Windows 98 (amarilla)
- Botones "Siguiente Tip" y "Cerrar"
- Parpadeo de ojos cada 4 segundos
- Se puede desactivar en Settings
- **Icono en la TaskBar** cuando está cerrado - clic para reabrir
- Funciona en móviles con tamaño reducido
- Persistencia en localStorage

## Patrones de Arquitectura

### 1. Diseño Atómico
- **Moléculas**: Composición simple (TitleBar, WindowControls)
- **Organismos**: Componentes complejos (Window, TaskBar, StartMenu)

### 2. Context Pattern
- `DesktopContext`: Estado global del escritorio (ventanas, z-index)
- `WindowContext`: Estado local por ventana
- `LanguageContext`: Estado de internacionalización

### 3. Custom Hooks
- Extracción de lógica reutilizable
- Separación de concerns
- Testing más sencillo

### 4. Registry Pattern
- `apps.ts`: Registro central de aplicaciones
- Metadatos: icono, tamaño, componente
- Fácil extensión

### 5. Factory Pattern
- `addWindow` crea ventanas con configuración por defecto
- Cálculo automático de posición y z-index

## Hooks Personalizados

| Hook | Propósito |
|------|-----------|
| `useFileSystem()` | Lee archivos markdown, extrae fechas, estructura de carpetas |
| `useWindow()` | Estado del menú Start y reloj en tiempo real |
| `useUrlRouting()` | Enrutamiento por URL, abre archivos desde path |
| `useMediaQuery()` | Media queries responsive |
| `useTranslation()` | Función `t(key)` para traducciones |
| `useLanguage()` | Acceso al contexto de idioma |
| `useWindowState()` | Persistencia de posición/tamaño de ventanas |

## Sistema de Archivos Markdown

### Estructura
```
src/data/files/
├── content/              # Contenido principal (CV, features) — 2 archivos
├── youtube/             # 59 tutoriales en video
├── system/              # Sistemas desarrollados — 13 archivos
├── internet/            # Recursos de internet — 3 archivos
└── web/                 # Proyectos web realizados — 21 archivos
```

### Formato
```markdown
Fecha: 31-12-2023
# Título

Contenido markdown...
```

### Características
- Fecha extraída de la primera línea
- Imágenes desde `/images/`
- Soporte HTML embebido (rehype-raw)
- Búsqueda por nombre y contenido

## Contextos

### DesktopContext
```typescript
{
  windows: WindowConfig[],        // Ventanas abiertas
  activeWindowId: string | null,  // Ventana activa
  handleWindowFocus(id),          // Traer al frente
  handleMinimize(id),             // Minimizar
  handleClose(id),                // Cerrar
  openApp(appId, data?),          // Abrir aplicación
  isWindowOpen(appId)             // Verificar si está abierta
}
```

### WindowContext
```typescript
{
  id: string,           // ID único
  onClose: () => void   // Cerrar ventana
}
```

### LanguageContext
```typescript
{
  language: 'es' | 'en',
  changeLanguage(lang)
}
```

## Constantes del Sistema

```typescript
// Colores Windows 98
COLORS.DESKTOP_BG = '#008080'  // Teal
COLORS.WINDOW_BG = '#c0c0c0'   // Gray

// Z-index
Z_INDEX.TASKBAR = 1000
Z_INDEX.START_MENU = 1100
Z_INDEX.WINDOW_BASE = 10

// LocalStorage
LOCAL_STORAGE_KEYS.LANGUAGE = 'language'
LOCAL_STORAGE_KEYS.SHOW_WELCOME = 'show_welcome'
LOCAL_STORAGE_KEYS.WINAMP_PLAYLIST = 'winamp_playlist'
```

## Configuración

### Vite (vite.config.js)
```javascript
{
  base: "/",           // Para dominio personalizado
  css: { devSourcemap: true }
}
```

### TypeScript (tsconfig.json)
- Target: ESNext
- Strict mode: ✅
- JSX: react-jsx

### ESLint (eslint.config.js)
- Configuración flat config
- Plugins: react-hooks, react-refresh
- Regla personalizada: variables en mayúsculas ignoradas

### GitHub Actions (.github/workflows/deploy.yml)
- Trigger: Push a `main`
- Node 20
- Genera `404.html` para SPA routing
- Deploy automático a GitHub Pages

## Responsive

- **Desktop**: Ventanas arrastrables y redimensionables
- **Móvil** (< 768px):
  - Ventanas siempre maximizadas
  - Layout adaptable
  - Touch-friendly

## Estadísticas

- **Aplicaciones**: 15 (incluyendo Winamp y My Drive)
- **Componentes**: 15 principales
- **Hooks**: 8 personalizados
- **Contextos**: 3
- **Archivos markdown**: 98
- **Wallpapers**: 5 (+ imagen de fondo personalizada elegida por el usuario)
- **Asistente virtual**: Clippy con 24 tips
- **Idiomas**: 2 (ES/EN)
- **Dependencias**: 4 runtime + 9 dev
- **Animaciones**: 5 tipos (loading, abrir, cerrar, minimizar, restaurar)
- **Persistencia**: Posición y tamaño de ventanas + playlist de Winamp guardados en localStorage
- **Iconos de apps**: PNG oficiales en `public/images/icons/` extraídos de sprite sheet

## Variables de Entorno

| Variable | Requerida | Para qué |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Solo para Drive | Client ID del OAuth client "Web application" |
| `VITE_GOOGLE_CLIENT_SECRET` | Solo para Drive | Client secret — viaja en el bundle, ver el [caveat](#google-drive-mi-unidad) |
| `VITE_GOOGLE_REDIRECT_URI` | Solo para Drive | Redirect URI registrado en Google Cloud |

El resto de la app funciona sin variables de entorno. Sin las de Drive, esa ventana abre igual y avisa que falta configuración. Definí las tuyas en `.env` (`.env.example` tiene la plantilla) o inline en el comando:

```bash
VITE_GOOGLE_CLIENT_ID=… VITE_GOOGLE_CLIENT_SECRET=… VITE_GOOGLE_REDIRECT_URI=… npm run dev
```

La configuración de Vite está en `vite.config.js` (`base: "/"` para dominio personalizado).

## Deploy

- **URL**: https://juandavid.site (dominio personalizado sobre GitHub Pages)
- **Plataforma**: GitHub Pages + GitHub Actions (`.github/workflows/deploy.yml`)
- **Trigger**: `push` a `main` con Node 20 → `npm run build` → genera `404.html` para SPA routing
- **Manual**: `npm run deploy` (usa `gh-pages -d dist`)

## Estado Actual

- ✅ Sistema de ventanas completo
- ✅ Enrutamiento por URL
- ✅ Soporte multilenguaje (ES/EN, 98 archivos markdown, `i18n/translations.ts`)
- ✅ Explorador de archivos (iconos en cuadrícula estilo My Documents)
- ✅ Visor de markdown (MarkdownViewer) con galería de imágenes
- ✅ Buscador de archivos
- ✅ Barra de tareas con reloj
- ✅ Menú Start funcional con submenú
- ✅ Iconos de escritorio (incluyendo Winamp con Webamp, Radio Código 2 → navegador con la radio, TankStrike → app interna juego offline, YouTube Juan David Ochoa → navegador con `https://www.youtube.com/@JuanDavidOchoa`)
- ✅ Wallpapers cambiables (6 opciones)
- ✅ Fondo de escritorio personalizado: subir una imagen desde Settings → Desktop, guardada solo en localStorage (`desktop.backgroundImage`)
- ✅ Animaciones de ventanas (abrir, cerrar, minimizar, restaurar)
- ✅ **Loading Screen** - Pantalla de carga con reloj de arena animado estilo Windows 98
- ✅ Persistencia de posición y tamaño de ventanas
- ✅ Clippy - Asistente virtual con 24 tips interactivos
- ✅ **Internet Explorer** - Navegador web estilo retro con soporte para sitios web
- ✅ **Winamp** - Reproductor de música clásico usando Webamp con demo track y playlist persistente
- ✅ **Portfolio** - Portafolio de proyectos con 4 vistas (Iconos grandes, pequeños, lista, detalles)
- ✅ **My Computer** - Explorador del sistema
- ✅ **Google Drive (Mi unidad)** - Carpeta propia administrada por la app: conectar con OAuth + PKCE (token solo en memoria), listar, crear, editar en Notepad (con guardado de vuelta a Drive) y mandar a la papelera, con la misma chrome Explorer que My Computer / My Documents
- ✅ **Network, Sound Recorder, MS-DOS Prompt**
- ✅ **Recycle Bin** - Los archivos que Mi unidad mandó a la papelera de Google Drive, restaurables al workspace (nunca borrado definitivo)
- ✅ **Settings con 3 tabs** (General, Desktop, Advanced)
- ✅ Responsive
- ✅ ErrorBoundary
- ✅ CI/CD automático
- ✅ Galería de imágenes con flechas de navegación en el visor markdown
- ✅ Iconos uniformes en submenú del Start Menu
- ✅ Estilo Windows 98 auténtico

## Licencia

Proyecto personal de **codigo8a** · Código disponible en GitHub. Plantilla 98.css bajo licencia MIT.
