# Google Drive: edición desde Notepad

## Objective

Que los archivos markdown del workspace de Google Drive se abran en **Notepad** para editar y guardar de vuelta a Drive, en lugar de editarse en un textarea interno de la ventana de Drive.

## Problem

Hoy la ventana de Drive tiene su propio editor (`buildEditorView` + `saveEditor` en `src/apps/DriveApp/index.tsx`). Es un textarea pelado: sin toolbar markdown, sin contador de línea/columna, sin marca de dirty. Peor, `leaveEditor` (`:1691-1698`) descarta el buffer sin comparar contra el baseline y sin preguntar — alcanzable desde Back, Backspace y File→Close.

Notepad ya tiene todo lo que falta: toolbar markdown (8 acciones con manejo de caret), `Ln/Col`, `isDirty` + `confirmDiscard`. El editor interno le está robando un rol que Notepad cumple mejor.

## Why

- Una sola app de edición de texto, no dos. Hoy Notepad es "el editor local" y Drive es "el editor remoto": el mismo concepto en dos lugares.
- El editor interno pierde el guardado en silencio; Notepad no.
- Notepad gana destino remoto sin redesign.

## Scope

- [ ] **N1 — Contrato de guardado remoto.** `src/types/index.ts`: agregar `RemoteSaveResult` y `RemoteSaveHandle`, y el miembro opcional `remoteSave` en `AppData`. El payload de `openApp` viaja por `CustomEvent` detail sin serialización (verificado: no hay `structuredClone`/`postMessage`/JSON-serialize en `src/`), así que un miembro función sobrevive en el mismo realm.
- [ ] **N2 — Notepad acepta payload y destino remoto.** `src/apps/NotepadApp/index.tsx`: `launchNotepad(appData?: AppData)`. Con `appData.file` siembra nombre + contenido. Con `appData.remoteSave`, `File > Save` llama al handle en vez de `documents.set`. `File > New` y `File > Open` despegan el handle (el documento pasa a ser local). El prompt de nombre solo aparece para documentos locales. Guardado remoto en curso: no permite doble submit.
- [ ] **N3 — Drive abre en Notepad y el editor interno desaparece.** `src/apps/DriveApp/index.tsx`: `openInNotepad(file)` lee el contenido y despacha `desktop-open-app` con `appId: 'notepad'`, `file` y `remoteSave` cerrando sobre el token del closure. `Edit` de toolbar, `File > Edit` y doble click siguen funcionando y ahora abren Notepad. Se elimina el view `editor`, su estado (`editorFile`, `editorContent`, `editorBaselineRevision`, `editorTextareaEl`), `buildEditorView`, `saveEditor`, `leaveEditor`, `selectEditorText`, el botón Save de la toolbar y sus ramas en `renderView`, `syncEnabled`, barra de dirección, panel, menús y teclado.
- [ ] **N4 — Lógica de conflicto mudada al handle.** El chequeo de `headRevisionId` + aviso Yes/No + patch de `files[]` viaja al closure de guardado. El baseline se rebaselinea con cada escritura exitosa para que un segundo Ctrl+S no se confunda con un cambio externo. Si la ventana de Drive se cerró, el guardado devuelve un error y NO toca el DOM de una ventana muerta.
- [ ] **N5 — Estilos y docs.** Borrar `.drive-editor` / `.drive-textarea` / `.drive-textarea::selection` de `src/apps/DriveApp/index.css`. Actualizar la sección Drive de `README.md`.
- [ ] **N6 — i18n.** Las strings que produce el handle son de Drive y van en su tabla ES/EN. Las strings nuevas de Notepad van en inglés, que es la convención vigente del archivo (Notepad no está i18neado).

## Constraints

- El token sigue siendo memory-only y window-scoped. El handle lo captura del closure; nunca lo relee de storage.
- Si la ventana de Drive se cerró, el handle falla con un mensaje claro en vez de escribir a una ventana destruida.
- Nada de `innerHTML`: todo por `textContent` / `.value` (regla ya verificada en Drive).
- Papelera nunca borrado definitivo — no cambia.
- La migración no cambia el modelo de workspace: la carpeta se sigue descubriendo por nombre.

## Acceptance criteria

- [ ] `npm run lint` en verde.
- [ ] `npm run typecheck` en verde (strict, sin `any`).
- [ ] `npm run build` en verde.
- [ ] Cero referencias residuales a `buildEditorView`, `saveEditor`, `editorTextareaEl`, `drive-editor`, `drive-textarea`.
- [ ] `File > Save` en un Notepad local sigue funcionando igual (sin regresión).
- [ ] El payload de `remoteSave` cruza el `CustomEvent` sin serialización.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
grep -rn "buildEditorView\|saveEditor\|editorTextareaEl\|drive-editor\|drive-textarea" src/ || echo "OK: cero referencias"
```

Sin evidencia en runtime: el handoff `desktop-open-app` con un miembro función en el payload y el guardado remoto no se pueden ejercitar con `lint`/`typecheck`/`build`. Requieren el smoke test manual en browser.

## Decisions

- **Reemplazar, no coexistir.** El botón `Edit` abre Notepad y el editor interno se borra. Dos editores para el mismo concepto es peor que uno.
- **El botón Save sale de la toolbar de Drive.** Sin editor inline no tiene acción; un botón siempre deshabilitado es ruido.
- **El handle es quien decide el conflicto**, no Notepad. Notepad no sabe qué es `headRevisionId` y no debe saberlo.
- **`appData.file` se sigue usando** para nombre y contenido: el tipo ya existe y `MarkdownViewerApp` ya lo consume con la misma forma.

## Out of scope

- Persistencia de Notepad a disco (sigue siendo memory-only).
- Refresh token / sesión larga.
- Anyadir Notepad como editor de los markdown de `src/data/files/` — son build-time, sin write path.
- Refactor del `windowKey` dedup de apps os-gui (`DesktopContext.tsx:358-378`): hoy nunca matchea para ventanas nativas. Es follow-up separado.
- Guarda de dirty en el botón de cierre del titlebar de Notepad (ya registrado como gap en `odd/tasks/notepad-markdown-toolbar.md:98-99`).

## Route

Delegated writer: 5 archivos no triviales, con lectura preparatoria. Delega por el writer trigger (2+ archivos no triviales) y el preparation trigger.
