# Instrucciones para AGENTS

## Reglas Generales

1. **LEER el README.md** al inicio de cada sesión para entender el contexto del proyecto.
2. **Mantener actualizado el README.md** cuando se agreguen nuevas funcionalidades.
3. Seguir las convenciones y patrones establecidos en el proyecto.

## Reglas de Git

1. **NUNCA hacer push** automáticamente, siempre preguntar antes.
2. Solo proceder con commit/push después de que el usuario lo confirme explícitamente.
3. Sí está permitido hacer `git add` para agregar archivos al staging.
4. Sí está permitido hacer análisis de código y búsquedas.

## Flujo de trabajo recomendado

1. Leer el README.md para entender el proyecto
2. Hacer cambios en el código siguiendo las convenciones
3. Si el usuario escribe "push", hacer commit + push una única vez y después preguntar de nuevo

## Estructura del Proyecto

```
src/
├── apps/              # Aplicaciones del sistema (6 apps)
├── components/        # Componentes React (moléculas, organismos)
├── context/           # Contextos (Desktop, Window, Language)
├── hooks/             # Hooks personalizados
├── i18n/              # Traducciones ES/EN
├── data/files/        # Archivos markdown (~70 archivos)
├── types/             # Tipos TypeScript
├── constants/         # Constantes del sistema
└── utils/             # Utilidades
```

## Convenciones de Código

### TypeScript
- Usar tipos explícitos en funciones y props
- Interfaces en `src/types/index.ts`
- Strict mode activado
- No usar `any`

### Nomenclatura
- **Componentes**: PascalCase (ej: `FileExplorerApp.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `useFileSystem.ts`)
- **Utilidades**: camelCase (ej: `fileUtils.ts`)
- **Constantes**: UPPER_SNAKE_CASE
- **Tipos/Interfaces**: PascalCase con prefijo (ej: `WindowConfig`, `AppDefinition`)

### Estilos
- Usar `98.css` para estilos base de Windows 98
- Estilos adicionales en archivos `.css` co-locados
- Colores definidos en `constants/index.ts`
- Valores dinámicos (posición, tamaño) via inline styles

### Imports
```typescript
// 1. React
import React, { useState, useContext } from 'react';

// 2. Librerías externas
import { useTranslation } from '../../i18n/translations';

// 3. Hooks personalizados
import { useFileSystem } from '../../hooks/useFileSystem';

// 4. Contextos
import { useDesktop } from '../../context/DesktopContext';

// 5. Componentes
import { Window } from '../../components/organisms/Window';

// 6. Tipos
import type { FileItem } from '../../types';

// 7. Constantes/Utils
import { COLORS } from '../../constants';
```

## Patrones de Arquitectura

### 1. Diseño Atómico
- **Moléculas**: Componentes simples (TitleBar, WindowControls)
- **Organismos**: Componentes complejos (Window, TaskBar, StartMenu)
- Cada componente en su carpeta con `index.tsx` y `index.css`

### 2. Context Pattern
- Un contexto por dominio de estado
- Providers anidados en `App.tsx`
- Hooks de conveniencia para acceder (ej: `useDesktop()`)

### 3. Custom Hooks
- Extraer lógica de negocio de componentes
- Un hook por responsabilidad
- Reutilizar hooks existentes

### 4. Registry Pattern (Apps)
Todas las apps se registran en `src/apps/apps.ts`:

```typescript
export const APPS = {
  welcome: {
    id: 'welcome',
    title: 'Welcome',
    component: WelcomeApp,
    icon: '/icons/welcome.png',
    width: 700,
    height: 420,
    singleton: true,
  },
  // ... más apps
};
```

## Cómo Agregar una Nueva App

1. **Crear carpeta** en `src/apps/NuevaApp/`
2. **Crear componente** `index.tsx`:
   ```typescript
   import React from 'react';
   import { useWindowContext } from '../../context/WindowContext';
   import { useTranslation } from '../../i18n/translations';
   
   export const NuevaApp: React.FC = () => {
     const { onClose } = useWindowContext();
     const { t } = useTranslation();
     
     return (
       <div className="nueva-app">
         {/* Contenido */}
       </div>
     );
   };
   ```
3. **Crear estilos** `index.css` (opcional)
4. **Registrar en apps.ts**:
   ```typescript
   import { NuevaApp } from './NuevaApp';
   
   nuevaApp: {
     id: 'nuevaApp',
     title: 'Nueva App',
     component: NuevaApp,
     icon: '/icons/app.png',
     width: 500,
     height: 400,
     singleton: true, // o false
   }
   ```
5. **Agregar traducciones** en `src/i18n/translations.ts`
6. **Actualizar README.md** con la nueva app

## Sistema de Traducciones (i18n)

### Agregar nuevas claves

1. **Editar** `src/i18n/translations.ts`:
   ```typescript
   export const translations = {
     es: {
       // ... existentes
       nuevaClave: 'Texto en español',
     },
     en: {
       // ... existentes
       nuevaClave: 'Text in English',
     },
   };
   ```

2. **Usar en componentes**:
   ```typescript
   const { t } = useTranslation();
   return <div>{t('nuevaClave')}</div>;
   ```

### Convenciones para claves
- camelCase
- Descriptivas del contexto (ej: `searchPlaceholder`, `tableView`)
- Agrupar por funcionalidad cuando sea posible

## Hooks Disponibles

| Hook | Uso | Import |
|------|-----|--------|
| `useDesktop()` | Estado global del escritorio | `../../context/DesktopContext` |
| `useWindowContext()` | Estado local de ventana | `../../context/WindowContext` |
| `useLanguage()` | Estado de idioma | `../../context/LanguageContext` |
| `useTranslation()` | Función `t(key)` | `../../i18n/translations` |
| `useFileSystem()` | Sistema de archivos markdown | `../../hooks/useFileSystem` |
| `useMediaQuery()` | Media queries | `../../hooks/useMediaQuery` |

## Sistema de Archivos Markdown

### Formato de archivos
```markdown
Fecha: 31-12-2023
# Título del documento

Contenido en markdown...
```

### Ubicación
- `src/data/files/content/` - Contenido principal
- `src/data/files/youtube/` - Tutoriales
- `src/data/files/system/` - Sistemas
- `src/data/files/internet/` - Recursos
- `src/data/files/web/` - Proyectos web

### Agregar nuevo archivo
1. Crear archivo `.md` en la carpeta apropiada
2. Primera línea: `Fecha: DD-MM-YYYY`
3. Referenciar imágenes desde `/images/`
4. El sistema lo detecta automáticamente

## Constantes Importantes

```typescript
// src/constants/index.ts

// Colores
COLORS.DESKTOP_BG = '#008080'      // Fondo escritorio
COLORS.WINDOW_BG = '#c0c0c0'       // Fondo ventana

// Z-index
Z_INDEX.TASKBAR = 1000
Z_INDEX.START_MENU = 1100
Z_INDEX.WINDOW_BASE = 10

// LocalStorage Keys
LOCAL_STORAGE_KEYS.LANGUAGE = 'language'
LOCAL_STORAGE_KEYS.SHOW_WELCOME = 'show_welcome'

// Window defaults
WINDOW_DEFAULTS.WIDTH = 400
WINDOW_DEFAULTS.HEIGHT = 300
```

## Buenas Prácticas

1. **Responsabilidad Única**: Cada componente/hook hace una sola cosa
2. **Reutilización**: Usar hooks existentes antes de crear nuevos
3. **Tipado**: Siempre tipar props y retornos de funciones
4. **Traducciones**: Todas las strings visibles deben usar `t()`
5. **Estilos**: Usar 98.css primero, luego CSS personalizado
6. **Responsive**: Considerar vista móvil (< 768px)
7. **Accesibilidad**: Incluir ARIA labels donde aplique

## Testing

- Ejecutar `npm run lint` antes de commit
- Verificar que el build pasa: `npm run build`
- Probar en modo desarrollo: `npm run dev`

## Checklist antes de finalizar

- [ ] Código pasa el linting (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Nuevas funcionalidades documentadas en README.md
- [ ] Si agregué una app: registrada en apps.ts, traducciones agregadas
- [ ] Si modifiqué UI: probado en móvil y desktop
- [ ] No hay errores en consola del navegador
