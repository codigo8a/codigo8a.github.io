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
│   ├── RecycleBin/              # Papelera de reciclaje
│   ├── SoundRecorder/           # Grabador de sonido
│   ├── MSDOS/                   # Símbolo del sistema MS-DOS
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
| **Notepad** | Bloc de notas con barra de estado | 450x350 | ✅ Sí |
| **FileExplorer** | Explorador con vista de iconos estilo "My Documents" (cuadrícula) | 780x540 | ✅ Sí |
| **MarkdownViewer** | Visor markdown con vista Preview/Source y galería de imágenes | 1000x800 | ❌ No (por archivo) |
| **Search** | Búsqueda por nombre y contenido de archivos | 640x460 | ✅ Sí |
| **Settings** | Configuración con 3 tabs: General (idioma, Clippy), Desktop (wallpapers + baldosa "Imagen personalizada") y Advanced | 450x480 | ✅ Sí |
| **Internet Explorer** | Navegador web estilo retro — acepta URL inicial vía `openApp('iexplorer', { url })` | 900x650 | ✅ Sí |
| **Portfolio** | Portafolio de proyectos con 4 vistas (Iconos, Lista, Detalles) | 600x450 | ✅ Sí |
| **My Computer** | Explorador del sistema | 780x540 | ✅ Sí |
| **Network** | Entorno de red | 500x350 | ✅ Sí |
| **Recycle Bin** | Papelera de reciclaje | 500x350 | ✅ Sí |
| **Sound Recorder** | Grabador de sonido simple | 270x130 | ✅ Sí |
| **MS-DOS Prompt** | Símbolo del sistema | 640x400 | ✅ Sí |
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
- Hook `useTranslation()` para todas las apps
- Persistencia en localStorage
- ~42 claves de traducción

### Explorador de Archivos
- **Vista Iconos (My Documents)**: Cuadrícula de iconos estilo Windows 98
  - Iconos con nombres de archivos
  - Doble clic para abrir archivos

### Iconos de Escritorio
- Iconos arrastrables con posición persistente en localStorage
- **Radio Código 2**: abre Internet Explorer en `https://kick.com/radio-codigo2`
  - Si ya hay una ventana del navegador abierta, la reutiliza (la enfoca y navega en ella)
- **TankStrike**: icono situado justo debajo de Radio Código 2, abre Internet Explorer en `https://tankstrike-live.onrender.com`
  - Mismo comportamiento que el icono de radio (reutiliza la ventana del navegador si ya está abierta)
- **YouTube Juan David Ochoa**: icono situado justo debajo de TankStrike, abre Internet Explorer en `https://www.youtube.com/@JuanDavidOchoa`
  - Mismo comportamiento que los iconos anteriores (reutiliza la ventana del navegador si ya está abierta)
- Cualquier icono puede abrir una app pasando datos:
  `openApp('iexplorer', { url: 'https://…' })` → `launchIExplorer(url)`

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

- **Aplicaciones**: 14 (incluyendo Winamp)
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

No requiere variables de entorno. La configuración de Vite está en `vite.config.js` (`base: "/"` para dominio personalizado).

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
- ✅ Iconos de escritorio (incluyendo Winamp con Webamp, Radio Código 2 → navegador con la radio, TankStrike → navegador con `https://tankstrike-live.onrender.com` y YouTube Juan David Ochoa → navegador con `https://www.youtube.com/@JuanDavidOchoa`)
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
- ✅ **Network, Recycle Bin, Sound Recorder, MS-DOS Prompt**
- ✅ **Settings con 3 tabs** (General, Desktop, Advanced)
- ✅ Responsive
- ✅ ErrorBoundary
- ✅ CI/CD automático
- ✅ Galería de imágenes con flechas de navegación en el visor markdown
- ✅ Iconos uniformes en submenú del Start Menu
- ✅ Estilo Windows 98 auténtico

## Licencia

Proyecto personal de **codigo8a** · Código disponible en GitHub. Plantilla 98.css bajo licencia MIT.
