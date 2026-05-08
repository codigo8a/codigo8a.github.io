# react-desktop

Entorno de escritorio estilo Windows 98 construido con React. Desplegado en [https://juandavid.site](https://juandavid.site).

## Overview

Simulación completa de un sistema operativo con ventanas arrastrables, barra de tareas, menú Start, explorador de archivos con doble vista, buscador de contenido y visor de markdown. Construido con React 19, TypeScript y Vite.

## Despliegue y Dominio

- **Plataforma**: GitHub Pages
- **Dominio Personalizado**: `https://juandavid.site`
- **CI/CD**: Despliegue automático mediante GitHub Actions al hacer push a `main`
- **SPA Support**: Archivo `404.html` generado automáticamente para enrutamiento

## Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | ^19.2.4 | Framework principal |
| TypeScript | ^5.9.3 | Tipado estático |
| Vite | ^8.0.0 | Build tool y dev server |
| 98.css | ^0.1.21 | Estilos auténticos Windows 98 |
| react-markdown | ^10.1.0 | Renderizado de markdown |
| rehype-raw | ^7.0.0 | Soporte HTML en markdown |
| ESLint | ^9.39.4 | Linting con plugins React |

## Estructura del Proyecto

```
src/
├── apps/                          # Aplicaciones del sistema
│   ├── WelcomeApp/               # Pantalla de bienvenida
│   ├── NotepadApp/              # Bloc de notas
│   ├── FileExplorerApp/         # Explorador de archivos
│   ├── FileViewerApp/           # Visor de markdown
│   ├── SearchApp/               # Buscador de archivos
│   ├── SettingsApp/             # Configuración del sistema
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
├── data/files/                  # Archivos markdown (~70 archivos)
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
npm install    # Instalar dependencias
npm run dev    # Servidor de desarrollo
npm run build  # Build de producción
npm run lint   # Linting con ESLint
npm run preview # Preview del build
npm run deploy # Despliegue a GitHub Pages
```

## Aplicaciones del Sistema

| App | Descripción | Tamaño | Instancia Única |
|-----|-------------|--------|-----------------|
| **Welcome** | Pantalla de bienvenida con tips, selector de idioma y enlaces sociales | 700x420 | ✅ Sí |
| **Notepad** | Bloc de notas con barra de estado | 450x350 | ✅ Sí |
| **FileExplorer** | Explorador con vista Tabla (ordenada por fecha) y vista Árbol | 600x350 | ✅ Sí |
| **FileViewer** | Visor markdown con tabs Preview/Source | 1000x800 | ❌ No (por archivo) |
| **Search** | Buscador por nombre y contenido de archivos | 500x350 | ✅ Sí |
| **Settings** | Configuración con tabs: General (idioma, Clippy) y Desktop (wallpapers) | 450x480 | ✅ Sí |
| **Browser** | Navegador web estilo retro | 900x650 | ✅ Sí |

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
- **Vista Tabla**: Lista todos los archivos ordenados por fecha
  - Columnas: Nombre, Ubicación, Fecha
  - Ordenados por fecha descendente
- **Vista Árbol**: Estructura de carpetas expandible
  - Carpetas inician contraídas
  - Click para expandir/colapsar

### Barra de Tareas
- Botón Start con menú funcional
- Lista de ventanas abiertas
- Reloj en tiempo real (actualiza cada segundo)
- Indicador de ventana activa

### Settings con Tabs
- **Tab General**: Idioma (ES/EN) + Clippy (activar/desactivar)
- **Tab Desktop**: Selector de wallpapers con previsualización
- Interfaz tipo Windows 98 con tabs

### Wallpapers
- 6 fondos de escritorio estilo Windows 98
- Selector visual en Settings con previsualización
- Persistencia en localStorage
- Opciones: Teal, Brick, Green Marble, Ocean, Gray Grid, Purple Stone

### Clippy - Asistente Virtual
- Aparece después de 2 segundos con animación flotante
- 10 tips sobre el portfolio (arrastrar ventanas, cambiar wallpaper, etc.)
- Burbuja de diálogo estilo Windows 98 (amarilla)
- Botones "Siguiente Tip" y "Cerrar"
- Parpadeo de ojos cada 4 segundos
- Se puede desactivar en Settings
- **Icono en la TaskBar** cuando está cerrado - clic para reabrir
- Oculto en móviles (< 768px)
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

## Sistema de Archivos Markdown

### Estructura
```
src/data/files/
├── content/              # Contenido principal (CV, features)
├── youtube/             # ~50 tutoriales en video
├── system/              # Sistemas desarrollados
├── internet/            # Recursos de internet
└── web/                 # Proyectos web realizados
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

- **Aplicaciones**: 7
- **Componentes**: 12 principales
- **Hooks**: 6 personalizados
- **Contextos**: 3
- **Archivos markdown**: ~70
- **Wallpapers**: 6
- **Asistente virtual**: Clippy con 10 tips
- **Idiomas**: 2 (ES/EN)
- **Dependencias**: 4 runtime + 9 dev
- **Animaciones**: 4 tipos (abrir, cerrar, minimizar, restaurar)
- **Persistencia**: Posición y tamaño de ventanas guardados en localStorage

## Estado Actual

- ✅ Sistema de ventanas completo
- ✅ Enrutamiento por URL
- ✅ Soporte multilenguaje
- ✅ Explorador de archivos (tabla/árbol)
- ✅ Visor de markdown con tabs
- ✅ Buscador de archivos
- ✅ Barra de tareas con reloj
- ✅ Menú Start funcional
- ✅ Iconos de escritorio
- ✅ Wallpapers cambiables (6 opciones)
- ✅ Animaciones de ventanas (abrir, cerrar, minimizar, restaurar)
- ✅ Persistencia de posición y tamaño de ventanas
- ✅ Clippy - Asistente virtual con tips interactivos
- ✅ Browser - Navegador web estilo retro con soporte para sitios web
- ✅ Responsive
- ✅ ErrorBoundary
- ✅ CI/CD automático
- ✅ Estilo Windows 98 auténtico
