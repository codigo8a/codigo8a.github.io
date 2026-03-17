# react-desktop

Entorno de escritorio estilo Windows 98 construido con React. Desplegado en [https://juandavid.site](https://juandavid.site).

## Overview

Entorno de escritorio estilo Windows 98 construido con React. Simula un sistema de ventanas con barra de tareas, menú Start, explorador de archivos, buscador y visor de markdown.

## Despliegue y Dominio

Este proyecto está configurado para desplegarse automáticamente en **GitHub Pages** utilizando **GitHub Actions**.

- **Dominio Personalizado**: `https://juandavid.site`
- **Configuración de Redirección**: Utiliza un archivo `404.html` generado automáticamente para soportar el enrutamiento de Single Page Application (SPA) en GitHub Pages.
- **Base URL**: Configurada como `/` en `vite.config.js` para soportar rutas anidadas.

## Tecnologías

- **React 19** - Framework principal
- **Vite** - Build tool
- **98.css** - Librería de estilos para Windows 98
- **react-markdown** - Renderizado de archivos markdown
- **rehype-raw** - Renderizado de HTML en markdown

## Estructura del Proyecto

```
src/
├── apps/                         # Aplicaciones del sistema
│   ├── WelcomeApp/              # Pantalla de bienvenida
│   ├── SettingsApp/             # Configuración
│   ├── NotepadApp/             # Bloc de notas
│   ├── FileExplorerApp/        # Explorador de archivos
│   ├── FileViewerApp/          # Visor de markdown
│   ├── SearchApp/              # Buscador de archivos
│   └── apps.ts                 # Registro de apps
├── components/                  # Componentes (Diseño Atómico)
│   ├── molecules/
│   ├── organisms/
│   └── DesktopIcons/           # Iconos del escritorio
├── context/                     # Contextos de React
│   ├── DesktopContext.tsx
│   ├── WindowContext.tsx
│   └── LanguageContext.tsx
├── hooks/                       # Hooks personalizados
│   ├── useFileSystem.ts
│   ├── useWindow.ts
│   ├── useLanguage.ts
│   └── useUrlRouting.ts        # Manejo de rutas profundas
├── i18n/                        # Traducciones
│   └── translations.ts
├── data/files/                  # Archivos markdown
├── public/
│   ├── CNAME                    # Configuración de dominio personalizado
│   └── images/                  # Imágenes para archivos markdown
├── App.tsx
├── index.css
└── main.tsx
```

## Características Recientes

- **Enrutamiento por URL**: Soporte para abrir archivos específicos directamente desde la URL (ej: `/folder/file`).
- **Sistema de Ventanas Mejorado**: Lógica de posicionamiento inteligente que evita el desplazamiento errático al reabrir ventanas.
- **Escritorio Personalizado**: Iconos de acceso directo a Documentos y Búsqueda.
- **CI/CD**: Despliegue automático mediante GitHub Actions al hacer push a `main`.


## Patrones y Principios

### Diseño Atómico

- **Moléculas**: Composición simple de átomos (TitleBar, WindowControls)
- **Organismos**: Componentes complejos (Window, TaskBar, StartMenu)

### Responsabilidad Única

- Cada componente tiene una única responsabilidad
- La lógica de negocio se extrae a hooks
- El estado global se maneja en Context

### Context (DesktopContext)

Gestiona el estado global de todas las ventanas:

- `windows` - Lista de ventanas abiertas
- `activeWindowId` - Ventana activa
- `openApp(appId, data)` - Abre una aplicación
- `handleWindowFocus(id)` - Enfoca una ventana
- `handleMinimize(id)` - Minimiza ventana
- `handleMaximize(id)` - Maximiza/restaurar ventana
- `handleClose(id)` - Cierra ventana
- `handleWindowMove(id, position)` - Actualiza posición
- `handleResize(id, size)` - Actualiza tamaño

### Context (WindowContext)

Gestiona el estado local de cada ventana individual:

- `id` - ID de la ventana
- `onClose` - Función para cerrar la ventana

### Context (LanguageContext)

Gestiona el idioma de la interfaz:

- `language` - Idioma actual ('es' | 'en')
- `changeLanguage(lang)` - Cambia el idioma
- Persistencia en localStorage

### Hooks Personalizados

- **useFileSystem**: Lee archivos markdown de `data/files/`, extrae fechas del contenido
- **useWindow**: Lógica de manejo de ventanas (integrado en Window)
- **useLanguage**: Acceso al contexto de idioma
- **useTranslation**: Función `t(key)` para traducciones

### Sistema de Traducciones (i18n)

- Todas las apps y componentes usan el hook `useTranslation()`
- Traducciones en `src/i18n/translations.js`
- Idiomas disponibles: Español e Inglés

### Aplicaciones

| App | Descripción | Instancia única |
|-----|-------------|-----------------|
| Welcome | Pantalla de bienvenida con tips de Windows 95 y selector de idioma | Sí |
| Settings | Configuración del sistema (idioma) | Sí |
| Notepad | Bloc de notas | Sí |
| FileExplorer | Explorador de archivos con tabs (Tabla/Arbol) | Sí |
| FileViewer | Visor markdown con tabs (Preview/Source) | No (por archivo) |
| Search | Buscador de archivos | Sí |

### Explorador de Archivos

- **Tab Tabla**: Muestra todos los archivos en formato tabla con columnas Nombre, Ubicación, Fecha
- **Tab Arbol**: Muestra estructura de carpetas expandible estilo Windows 98
- Las fechas se leen directamente del archivo markdown (línea `Fecha: DD/MM/AAAA`)

### Características de las Ventanas

- **Drag**: Arrastrar desde la barra de título
- **Resize**: Arrastrar desde la esquina inferior derecha
- **Minimize**: Minimiza a la barra de tareas
- **Maximize**: Ocupa toda el área de trabajo
- **Close**: Cierra la ventana
- **Enfoque**: Al hacer clic se trae al frente (z-index)
- **Centrado**: Se abren centradas en pantalla

### Barra de Tareas

- Muestra botón Start y lista de ventanas abiertas
- Reloj en tiempo real con hora, minutos y segundos
- Click en ventana minimizada la restaura

### Prevención de Ventanas Duplicadas

- Cada archivo tiene un `windowKey` único (`folder/filename`)
- Al abrir un archivo ya existente, se enfoca esa ventana
- FileViewer permite múltiples instancias (por archivo)

## Comandos

```bash
npm install    # Instalar dependencias
npm run dev    # Iniciar servidor de desarrollo
npm run build  # Build de producción
npm run lint   # Linting
```

## Estado Actual

- Ventanas funcionales con drag, resize, minimize, maximize
- Explorador de archivos con dos vistas: Tabla y Arbol
- Vista Tabla: muestra archivos con columnas Nombre, Ubicación, Fecha
- Vista Tabla: archivos ordenados por fecha (más reciente primero)
- Vista Tabla: fechas en formato legible (ej: "17 mar 2026")
- Vista Arbol: estructura de carpetas expandible
- Vista Arbol: carpetas inicián contraídas
- Visor de markdown con tabs (Preview / Source)
- Visor de markdown renderiza imágenes desde `/images/`
- Visor de markdown muestra contenido original (con línea Fecha:)
- Menú Start y barra de tareas
- Reloj en tiempo real en la barra de tareas
- Prevención de ventanas duplicadas por archivo
- Archivos markdown con fecha de creación en formato `Fecha: DD/MM/AAAA`
- Ventana Welcome con tips interactivos estilo Windows 95
- Buscador de archivos (SearchApp)
- WindowContext para estado local de ventanas
- Iconos de escritorio (My Computer, Recycle Bin, My Documents)
- Sistema de traducciones ES/EN con Settings
- Cambiador de idioma en ventana Welcome
