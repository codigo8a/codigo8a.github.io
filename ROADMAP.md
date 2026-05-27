# 🚀 Roadmap de Mejoras - react-desktop

> Lista completa de posibles mejoras organizadas por categoría y prioridad.
> Última actualización: Mayo 2026
> 
> **F-00 Completado:** Cooldown de Welcome Screen - La ventana de bienvenida ahora tiene un cooldown de 6 horas cuando se desmarca el checkbox.

---

## 📋 Índice

1. [Funcionalidad](#-funcionalidad)
2. [UX/UI](#-uxui)
3. [Performance](#-performance)
4. [Accesibilidad](#-accesibilidad)
5. [Técnico](#-técnico)
6. [Contenido](#-contenido)
7. [Easter Eggs](#-easter-eggs)
8. [Checklist de Implementación](#-checklist-de-implementación)

---

## 🎯 Funcionalidad

### 🔴 Alta Prioridad

| # | Mejora | Descripción | Complejidad | Estado |
|---|--------|-------------|-------------|--------|
| F-00 | **Cooldown de Welcome Screen** | Al desmarcar "mostrar al inicio", la ventana no aparece automáticamente por 6 horas. Solo se abre manualmente desde el menú. | Baja | ✅ Completado |
| F-01 | **Calculadora** | Calculadora básica estilo Windows 98 con operaciones aritméticas simples | Baja | ⬜ Pendiente |
| F-02 | **Paint** | App de dibujo con canvas - líneas, formas básicas, selección de colores, borrador | Media | ⬜ Pendiente |
| F-03 | **Papelera de Reciclaje** | Sistema de archivos "eliminados" con opción de restaurar o vaciar permanentemente | Media | ⬜ Pendiente |
| F-04 | **Drag & Drop** | Arrastrar y soltar archivos entre carpetas, reordenar iconos del escritorio | Media | ⬜ Pendiente |
| F-05 | **Crear Archivos/Carpetas** | Botón "Nuevo" en FileExplorer para crear archivos markdown vacíos y carpetas | Media | ⬜ Pendiente |

### 🟡 Media Prioridad

| # | Mejora | Descripción | Complejidad | Estado |
|---|--------|-------------|-------------|--------|
| F-06 | **Terminal/Consola** | Simulación de línea de comandos con comandos útiles (`help`, `ls`, `cat`, `clear`) | Media | ⬜ Pendiente |
| F-07 | **Reproductor de Música** | Reproducir archivos de audio con controles (play, pause, volumen, playlist) | Media-Alta | ✅ Completado (Winamp con Webamp) |
| F-08 | **Solitario** | Juego de cartas clásico estilo Windows 98 | Alta | ⬜ Pendiente |
| F-09 | **Buscaminas** | Juego Minesweeper con diferentes niveles de dificultad | Media | ⬜ Pendiente |
| F-10 | **Reloj/Alarma** | Reloj mundial, cronómetro, temporizador con alarmas | Baja-Media | ⬜ Pendiente |

### 🟢 Baja Prioridad

| # | Mejora | Descripción | Complejidad | Estado |
|---|--------|-------------|-------------|--------|
| F-11 | **Calendario** | Vista mensual/anual con posibilidad de agregar eventos | Media | ⬜ Pendiente |
| F-12 | **Contactos** | Lista de contactos profesionales con información básica | Baja | ⬜ Pendiente |
| F-13 | **Visor de Imágenes** | Abrir imágenes en ventana modal con zoom y navegación | Baja | ⬜ Pendiente |
| F-14 | **Internet Explorer (Simulado)** | Navegador simulado con "página no disponible" o iframe limitado | Alta | ⬜ Pendiente |
| F-15 | **Cliente de Email** | Formulario de contacto estilo cliente de email | Baja | ⬜ Pendiente |

---

## 🎨 UX/UI

| # | Mejora | Impacto | Esfuerzo | Estado |
|---|--------|---------|----------|--------|
| UI-01 | **Wallpapers cambiables** | Selector de fondo de pantalla con varios colores/patrones | Alto | Bajo | ⬜ Pendiente |
| UI-02 | **Screensaver** | Activar después de inactividad (pipes, matrix, estrella) | Medio | Medio | ⬜ Pendiente |
| UI-03 | **Efectos de sonido** | Sonidos al abrir/cerrar ventanas, clicks (opcional) | Medio | Bajo | ⬜ Pendiente |
| UI-04 | **Animaciones de ventanas** | Minimizar con animación a la taskbar | Medio | Medio | ⬜ Pendiente |
| UI-05 | **Tooltips en iconos** | Mostrar nombre al hacer hover en iconos del escritorio | Alto | Bajo | ⬜ Pendiente |
| UI-06 | **Menú contextual (right-click)** | Click derecho en escritorio con opciones | Alto | Medio | ⬜ Pendiente |
| UI-07 | **Resolución adaptable mejorada** | Mejor soporte para tablets y pantallas grandes | Alto | Medio | ⬜ Pendiente |
| UI-08 | **Tema oscuro** | Opción de cambiar a tema oscuro tipo Windows 95/98 | Medio | Medio | ⬜ Pendiente |
| UI-09 | **Cursor personalizado** | Cursor estilo Windows 98 | Bajo | Bajo | ⬜ Pendiente |
| UI-10 | **Scrollbars personalizadas** | Scrollbars estilo Windows 98 en todas las apps | Medio | Bajo | ⬜ Pendiente |

---

## ⚡ Performance

| # | Mejora | Beneficio | Esfuerzo | Estado |
|---|--------|-----------|----------|--------|
| PERF-01 | **Lazy loading de apps** | Cargar componentes solo cuando se abren | Alto | Medio | ⬜ Pendiente |
| PERF-02 | **Virtualización de listas** | Para listas largas de archivos (react-window) | Alto | Medio | ⬜ Pendiente |
| PERF-03 | **Memoización de componentes** | React.memo para ventanas y componentes pesados | Medio | Bajo | ⬜ Pendiente |
| PERF-04 | **Debounced search** | Búsqueda con delay para no bloquear UI | Medio | Bajo | ⬜ Pendiente |
| PERF-05 | **Code splitting por ruta** | Separar bundles por funcionalidad | Alto | Medio | ⬜ Pendiente |
| PERF-06 | **Service Worker** | Soporte offline básico (PWA) | Alto | Medio | ⬜ Pendiente |
| PERF-07 | **Prefetch de archivos** | Precargar archivos markdown frecuentes | Medio | Bajo | ⬜ Pendiente |

---

## ♿ Accesibilidad

| # | Mejora | Importancia | Esfuerzo | Estado |
|---|--------|-------------|----------|--------|
| A11Y-01 | **Navegación por teclado completa** | Tab order, atajos (Alt+F4, Ctrl+W, etc.) | Crítico | Medio | ⬜ Pendiente |
| A11Y-02 | **ARIA labels completos** | Mejor soporte para screen readers | Crítico | Medio | ⬜ Pendiente |
| A11Y-03 | **Alto contraste** | Modo accesible con contraste alto | Alto | Bajo | ⬜ Pendiente |
| A11Y-04 | **Focus indicators visibles** | Bordes de foco claros en todos los elementos | Alto | Bajo | ⬜ Pendiente |
| A11Y-05 | **Atajos de teclado** | Ctrl+S guardar, Ctrl+F buscar, Ctrl+O abrir, etc. | Medio | Bajo-Medio | ⬜ Pendiente |

---

## 🔧 Técnico

| # | Mejora | Descripción | Impacto | Estado |
|---|--------|-------------|---------|--------|
| TECH-01 | **Tests unitarios** | Jest + React Testing Library | Crítico | ⬜ Pendiente |
| TECH-02 | **E2E tests** | Playwright o Cypress para flujos críticos | Crítico | ⬜ Pendiente |
| TECH-03 | **Storybook** | Documentación de componentes | Medio | ⬜ Pendiente |
| TECH-04 | **ESLint más estricto** | Reglas adicionales de calidad | Bajo | ⬜ Pendiente |
| TECH-05 | **Prettier** | Formato automático consistente | Bajo | ⬜ Pendiente |
| TECH-06 | **Husky + lint-staged** | Pre-commit hooks para calidad | Medio | ⬜ Pendiente |
| TECH-07 | **TypeScript más estricto** | Activar más reglas strict | Medio | ⬜ Pendiente |
| TECH-08 | **Error tracking** | Sentry o similar para errores en producción | Alto | ⬜ Pendiente |
| TECH-09 | **Analytics** | Métricas de uso (sin cookies invasivas) | Bajo | ⬜ Pendiente |

---

## 📚 Contenido

| # | Mejora | Descripción | Esfuerzo | Estado |
|---|--------|-------------|----------|--------|
| CONT-01 | **Más archivos markdown** | Expandir biblioteca de tutoriales | Bajo | ⬜ Pendiente |
| CONT-02 | **Categorías dinámicas** | Sistema de tags/categorías para archivos | Medio | ⬜ Pendiente |
| CONT-03 | **Favoritos/Bookmarks** | Marcar archivos como favoritos | Bajo | ⬜ Pendiente |
| CONT-04 | **Historial de archivos recientes** | Sección "Recientes" en el menú Start | Bajo | ⬜ Pendiente |
| CONT-05 | **RSS feed** | Suscripción a nuevos contenidos | Medio | ⬜ Pendiente |
| CONT-06 | **Modo presentación** | Slideshow de los proyectos/portfolio | Medio | ⬜ Pendiente |

---

## 🎮 Easter Eggs

| # | Mejora | Descripción | Diversión | Estado |
|---|--------|-------------|-----------|--------|
| EGG-01 | **BSOD (Blue Screen)** | Pantalla azul de la muerte al presionar combinación secreta (Ctrl+Shift+Alt+Delete x3) | ⭐⭐⭐⭐⭐ | ⬜ Pendiente |
| EGG-02 | **Clippy** | Asistente de ayuda tipo Office 97 que aparece ocasionalmente con frases divertidas | ⭐⭐⭐⭐⭐ | ✅ Completado |
| EGG-03 | **Ventanas de error falsas** | Diálogos de error humorísticos aleatorios | ⭐⭐⭐⭐ | ⬜ Pendiente |
| EGG-04 | **MODO DOS** | Pantalla negra con comandos estilo DOS accesible con `cmd` | ⭐⭐⭐⭐ | ⬜ Pendiente |
| EGG-05 | **Referencias Windows 95** | Easter eggs ocultos tipo "Start me up" | ⭐⭐⭐ | ⬜ Pendiente |

---

## ✅ Checklist de Implementación

### 🎯 Fase 1: Fundamentos (Inmediato)
- [ ] **F-01** Calculadora básica
- [ ] **F-05** Crear archivos/carpetas
- [ ] **UI-05** Tooltips en iconos
- [ ] **A11Y-05** Atajos de teclado básicos
- [ ] **CONT-03** Favoritos/Bookmarks
- [ ] **TECH-01** Setup de tests unitarios

### 🎯 Fase 2: Core (1-2 meses)
- [ ] **F-03** Papelera de Reciclaje
- [ ] **F-04** Drag & Drop
- [ ] **F-06** Terminal/Consola
- [ ] **F-10** Reloj/Alarma
- [ ] **UI-01** Wallpapers cambiables
- [ ] **UI-06** Menú contextual
- [ ] **PERF-01** Lazy loading de apps
- [ ] **A11Y-01** Navegación por teclado completa

### 🎯 Fase 3: Enriquecimiento (3-4 meses)
- [ ] **F-02** App de Paint
- [ ] **F-07** Reproductor de música
- [ ] **F-09** Buscaminas
- [ ] **UI-02** Screensaver
- [ ] **UI-04** Animaciones de ventanas
- [ ] **PERF-02** Virtualización de listas
- [ ] **TECH-02** E2E tests
- [ ] **CONT-04** Historial de archivos recientes

### 🎯 Fase 4: Premium (6+ meses)
- [ ] **F-08** Solitario
- [ ] **F-14** Internet Explorer simulado
- [ ] **UI-07** Soporte tablet/pantallas grandes
- [ ] **UI-08** Tema oscuro
- [ ] **PERF-06** Service Worker / PWA
- [ ] **TECH-03** Storybook
- [ ] **EGG-01** BSOD
- [ ] **EGG-02** Clippy

---

## 📊 Métricas de Progreso

```
Total de mejoras: 58

Por categoría:
- Funcionalidad: 16
- UX/UI: 10
- Performance: 7
- Accesibilidad: 5
- Técnico: 9
- Contenido: 6
- Easter Eggs: 5

Por prioridad:
- 🔴 Alta: 6
- 🟡 Media: 9
- 🟢 Baja: 42

Estado actual:
⬜ Pendiente: 56
🟡 En progreso: 0
✅ Completado: 2
```

---

## 📝 Notas

- Las mejoras marcadas como **pendientes** están abiertas para implementación
- El número de referencia (ej: F-01, UI-05) permite trackear en issues/PRs
- Las complejidades son estimativas y pueden variar según implementación
- Las fases son sugerencias y pueden reordenarse según prioridades

---

## 🤝 Contribuir

Si querés trabajar en alguna mejora:

1. Crear un issue con el número de referencia (ej: "Implementar F-01: Calculadora")
2. Discutir approach antes de implementar
3. Seguir las convenciones del proyecto (ver AGENTS.md)
4. Actualizar este archivo al completar

---

*Generado automáticamente - Mantener actualizado*
