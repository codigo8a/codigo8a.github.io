import React from 'react';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';
import { getCascadeOffset } from '../../utils/cascadePosition';
import { LOCAL_STORAGE_KEYS } from '../../constants';
import {
  MAX_BACKGROUND_IMAGE_BYTES,
  getBackgroundImage,
  setBackgroundImage,
  clearBackgroundImage,
  readImageFileAsDataUrl,
} from '../../utils/desktopBackground';

/**
 * Placeholder React component — Settings uses os-gui natively via launchSettings().
 * This component is never rendered through the React window system.
 */
export const SettingsApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ── Wallpaper definitions (copied from DesktopContext) ──
const WALLPAPERS = [
  { id: 'teal', name: 'Teal', path: '/wallpapers/teal.svg' },
  { id: 'brick', name: 'Brick', path: '/wallpapers/brick.svg' },
  { id: 'marble', name: 'Green Marble', path: '/wallpapers/marble.svg' },
  { id: 'ocean', name: 'Ocean', path: '/wallpapers/ocean.svg' },
  { id: 'grid', name: 'Gray Grid', path: '/wallpapers/grid.svg' },
];

/**
 * Pseudo-wallpaper id for the user's own picture. There is no file behind it:
 * clicking the tile opens the native file dialog and the picked image is read
 * as a Data URL and kept in localStorage (local only, never uploaded).
 */
const CUSTOM_WALLPAPER_ID = 'custom';

// ── Inline translations (no React hook available) ──
const STRINGS: Record<string, Record<string, string>> = {
  en: {
    general: 'General',
    desktop: 'Desktop',
    advanced: 'Advanced',
    language: 'Language',
    english: 'English',
    spanish: 'Español',
    clippy: 'Clippy Assistant',
    enable: 'Enable',
    disable: 'Disable',
    wallpaper: 'Wallpaper',
    customImage: 'Custom image',
    customImageFileLabel: 'Image file:',
    customImageInfo: 'Click "Custom image" and pick a picture from your computer: it is applied immediately as the desktop background. It is stored ONLY in this browser (localStorage) — nothing is uploaded to a server, and it is gone if the browser data is cleared. While a custom image is set it replaces the wallpaper above.',
    bgRemove: 'Remove background',
    bgEmpty: 'No custom image',
    bgApplied: 'Background applied and saved in this browser.',
    bgRemoved: 'Background removed. The wallpaper is used again.',
    bgErrorNotImage: 'That file is not an image. Choose an image file (PNG, JPG, GIF, WEBP...).',
    bgErrorTooLarge: 'The image is too large (max {max}). Choose a smaller image.',
    bgErrorQuota: 'Not enough browser storage for this image (it exceeds the localStorage limit). Try a smaller image.',
    bgErrorRead: 'The image could not be read. Try another file.',
    apply: 'Apply',
    cancel: 'Cancel',
    changesInfo: 'Changes will be applied after clicking Apply.',
    wallpaperInfo: 'Wallpaper will be applied after clicking Apply.',
    settings: 'Settings',
    deleteData: 'Delete Saved Data',
    deleteDataDesc: 'Clear all saved preferences, window positions, and cached data. The page will reload.',
    deleteDataConfirm: 'Are you sure you want to delete all saved data? This action cannot be undone.',
    deleteDataDone: 'All saved data has been cleared. The page will now reload.',
    dataDeleted: 'Data Cleared',
  },
  es: {
    general: 'General',
    desktop: 'Escritorio',
    advanced: 'Avanzado',
    language: 'Idioma',
    english: 'English',
    spanish: 'Español',
    clippy: 'Asistente Clippy',
    enable: 'Habilitar',
    disable: 'Deshabilitar',
    wallpaper: 'Fondo de pantalla',
    customImage: 'Imagen personalizada',
    customImageFileLabel: 'Archivo de imagen:',
    customImageInfo: 'Haz clic en "Imagen personalizada" y elige una imagen de tu equipo: se aplica al instante como fondo del escritorio. Se guarda SOLO en este navegador (localStorage): no se sube a ningún servidor y desaparece al borrar los datos del navegador. Mientras haya una imagen personalizada, sustituye al fondo de pantalla de arriba.',
    bgRemove: 'Quitar fondo',
    bgEmpty: 'Sin imagen personalizada',
    bgApplied: 'Fondo aplicado y guardado en este navegador.',
    bgRemoved: 'Fondo eliminado. Se vuelve a usar el fondo de pantalla.',
    bgErrorNotImage: 'El archivo no es una imagen. Elige un archivo de imagen (PNG, JPG, GIF, WEBP...).',
    bgErrorTooLarge: 'La imagen es demasiado grande (máx. {max}). Elige una imagen más pequeña.',
    bgErrorQuota: 'No hay espacio suficiente en el almacenamiento del navegador (se supera el límite de localStorage). Prueba con una imagen más pequeña.',
    bgErrorRead: 'No se pudo leer la imagen. Prueba con otro archivo.',
    apply: 'Aplicar',
    cancel: 'Cancelar',
    changesInfo: 'Los cambios se aplicarán al hacer clic en Aplicar.',
    wallpaperInfo: 'El fondo se aplicará al hacer clic en Aplicar.',
    settings: 'Configuración',
    deleteData: 'Eliminar datos guardados',
    deleteDataDesc: 'Borra todas las preferencias, posiciones de ventanas y datos guardados. La página se recargará.',
    deleteDataConfirm: '¿Estás seguro de eliminar todos los datos guardados? Esta acción no se puede deshacer.',
    deleteDataDone: 'Todos los datos guardados han sido eliminados. La página se recargará.',
    dataDeleted: 'Datos eliminados',
  },
};

function t(key: string): string {
  const lang = localStorage.getItem('language') || 'en';
  return STRINGS[lang]?.[key] || STRINGS['en']?.[key] || key;
}

/**
 * Custom launch function that creates a Settings window using os-gui $Window.
 * Two tabs:
 *   - General: Language selection (English/Español), Clippy toggle (Enable/Disable)
 *   - Desktop: Wallpaper preview grid with selection, plus a "Custom image"
 *     tile that opens the native file dialog (image kept in localStorage only)
 *
 * Data is persisted directly to localStorage and custom events are dispatched
 * so the React context providers pick up the changes.
 */
export function launchSettings(): void {
  const $Window = window.$Window;
  if (!$Window) {
    console.error('os-gui not loaded.');
    return;
  }

  // ── Read initial state from localStorage ──
  const currentLang = localStorage.getItem('language') || 'en';
  const currentWallpaper = localStorage.getItem('wallpaper') || 'teal';
  const clippyInitiallyEnabled = localStorage.getItem('clippyEnabled') !== 'false'; // default true

  // Mutable state (read from DOM radios on Apply)
  let selectedLanguage = currentLang;
  let selectedWallpaper = currentWallpaper;
  let selectedClippy = clippyInitiallyEnabled;
  // True while the custom image (if any) is the background in use; picking a
  // wallpaper tile turns it off so Apply can drop the stored image.
  let usingCustomBackground = Boolean(getBackgroundImage());

  // ── Create the os-gui window ──
  const $win = $Window({
    title: t('settings'),
    icons: {
      16: '/images/icons/settings-icon.png',
      32: '/images/icons/settings-icon-32x32.png',
      any: '/images/icons/settings-icon.png',
    },
    minWidth: 380,
    minHeight: 360,
  });

  $win.css({
    width: '450px',
    height: '480px',
  });
  $win.center();
  const cascadeOffset = getCascadeOffset();
  $win.css({ left: parseInt($win.css('left')) + cascadeOffset, top: parseInt($win.css('top')) + cascadeOffset });
  registerOsWindow($win, 'settings', t('settings'), '/images/icons/settings-icon.png');

  // ── Build Settings layout ──
  const container = document.createElement('div');
  container.className = 'os-explorer settings-container';

  // ══════ Toolbars (98-style, matching MyComputer / FileExplorerApp) ══════
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  // ── Menu bar toolbar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';

  const MenuBar = window.MenuBar;
  if (MenuBar) {
    const menu = new MenuBar({
      '&File': [
        { label: '&Close', action: () => $win.close() },
      ],
      '&Help': [
        {
          label: '&About Settings',
          action: () =>
            showMessageBox({ title: 'About Settings', message: 'Settings\n\nDisplay and system preferences.\nBased on Windows 98 Display Properties.', icon: 'info' }),
        },
      ],
    });
    const menusDiv = document.createElement('div');
    menusDiv.className = 'menus';
    menusDiv.appendChild(menu.element);
    menuToolbar.appendChild(menusDiv);
  }

  toolbars.appendChild(menuToolbar);

  // ── Category buttons toolbar ──
  const catToolbar = document.createElement('div');
  catToolbar.className = 'toolbar';

  const catDragHandle = document.createElement('div');
  catDragHandle.className = 'toolbar-drag-handle';
  catToolbar.appendChild(catDragHandle);

  // Sprite indices (0-indexed from left): General=10, Desktop=14, Advanced=62 (rightmost)
  function createCatBtn(id: string, label: string, spriteIndex: number): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'toolbar-button lightweight';
    btn.dataset.tab = id;
    const iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.style.backgroundPosition = `-${spriteIndex * 20}px 0px`;
    btn.appendChild(iconDiv);
    const labelSpan = document.createElement('span');
    labelSpan.className = 'label-text';
    labelSpan.textContent = label;
    btn.appendChild(labelSpan);
    return btn;
  }

  const btnGeneral = createCatBtn('general', t('general'), 10);
  const btnDesktop = createCatBtn('desktop', t('desktop'), 14);
  const btnAdvanced = createCatBtn('advanced', t('advanced'), 62);

  catToolbar.appendChild(btnGeneral);
  catToolbar.appendChild(btnDesktop);
  catToolbar.appendChild(btnAdvanced);
  // General tab is active by default
  btnGeneral.classList.add('active');

  toolbars.appendChild(catToolbar);
  container.appendChild(toolbars);

  // ═══════════════════════════════════════════
  // Tab panels container (styled like window body)
  // ═══════════════════════════════════════════
  const panelContainer = document.createElement('div');
  panelContainer.className = 'window';
  panelContainer.setAttribute('role', 'tabpanel');
  panelContainer.style.cssText =
    'flex:1;display:flex;flex-direction:column;margin:0;border:none;box-shadow:none;overflow:hidden;';

  const body = document.createElement('div');
  body.className = 'window-body settings-tab-content';

  // ── General panel ──
  const generalPanel = document.createElement('div');
  generalPanel.className = 'settings-panel';

  // -- Language fieldset --
  const langFieldset = document.createElement('fieldset');
  langFieldset.className = 'settings-section';

  const langLegend = document.createElement('legend');
  langLegend.textContent = t('language');
  langFieldset.appendChild(langLegend);

  const langRow = document.createElement('div');
  langRow.className = 'settings-language-row';

  // English
  const frEn = document.createElement('div');
  frEn.className = 'field-row';
  const radioEn = document.createElement('input');
  radioEn.type = 'radio';
  radioEn.id = 'lang-en';
  radioEn.name = 'language';
  radioEn.value = 'en';
  radioEn.checked = currentLang === 'en';
  const labelEn = document.createElement('label');
  labelEn.htmlFor = 'lang-en';
  labelEn.textContent = t('english');
  frEn.appendChild(radioEn);
  frEn.appendChild(labelEn);
  langRow.appendChild(frEn);

  // Español
  const frEs = document.createElement('div');
  frEs.className = 'field-row';
  const radioEs = document.createElement('input');
  radioEs.type = 'radio';
  radioEs.id = 'lang-es';
  radioEs.name = 'language';
  radioEs.value = 'es';
  radioEs.checked = currentLang === 'es';
  const labelEs = document.createElement('label');
  labelEs.htmlFor = 'lang-es';
  labelEs.textContent = t('spanish');
  frEs.appendChild(radioEs);
  frEs.appendChild(labelEs);
  langRow.appendChild(frEs);

  langFieldset.appendChild(langRow);
  generalPanel.appendChild(langFieldset);

  // -- Clippy fieldset --
  const clippyFieldset = document.createElement('fieldset');
  clippyFieldset.className = 'settings-section';

  const clippyLegend = document.createElement('legend');
  clippyLegend.textContent = t('clippy');
  clippyFieldset.appendChild(clippyLegend);

  const clippyRow = document.createElement('div');
  clippyRow.className = 'settings-clippy-row';

  // Enable
  const frClippyOn = document.createElement('div');
  frClippyOn.className = 'field-row';
  const radioClippyOn = document.createElement('input');
  radioClippyOn.type = 'radio';
  radioClippyOn.id = 'clippy-on';
  radioClippyOn.name = 'clippy';
  radioClippyOn.checked = clippyInitiallyEnabled;
  const labelClippyOn = document.createElement('label');
  labelClippyOn.htmlFor = 'clippy-on';
  labelClippyOn.textContent = t('enable');
  frClippyOn.appendChild(radioClippyOn);
  frClippyOn.appendChild(labelClippyOn);
  clippyRow.appendChild(frClippyOn);

  // Disable
  const frClippyOff = document.createElement('div');
  frClippyOff.className = 'field-row';
  const radioClippyOff = document.createElement('input');
  radioClippyOff.type = 'radio';
  radioClippyOff.id = 'clippy-off';
  radioClippyOff.name = 'clippy';
  radioClippyOff.checked = !clippyInitiallyEnabled;
  const labelClippyOff = document.createElement('label');
  labelClippyOff.htmlFor = 'clippy-off';
  labelClippyOff.textContent = t('disable');
  frClippyOff.appendChild(radioClippyOff);
  frClippyOff.appendChild(labelClippyOff);
  clippyRow.appendChild(frClippyOff);

  clippyFieldset.appendChild(clippyRow);
  generalPanel.appendChild(clippyFieldset);

  // Info text
  const infoText = document.createElement('div');
  infoText.className = 'settings-info';
  infoText.textContent = t('changesInfo');
  generalPanel.appendChild(infoText);

  // ── Desktop panel ──
  const desktopPanel = document.createElement('div');
  desktopPanel.className = 'settings-panel';
  desktopPanel.style.display = 'none';

  // -- Wallpaper fieldset --
  const wpFieldset = document.createElement('fieldset');
  wpFieldset.className = 'settings-section';

  const wpLegend = document.createElement('legend');
  wpLegend.textContent = t('wallpaper');
  wpFieldset.appendChild(wpLegend);

  const wpSection = document.createElement('div');
  wpSection.className = 'settings-wallpaper-section';

  const wpGrid = document.createElement('div');
  wpGrid.className = 'settings-wallpaper-grid';

  // Track the currently selected wallpaper DOM element
  let selectedWpItem: HTMLElement | null = null;

  /** Move the selection highlight to `item` (null clears it). */
  function markSelected(item: HTMLElement | null): void {
    if (selectedWpItem) {
      selectedWpItem.classList.remove('selected');
    }
    selectedWpItem = item;
    if (item) {
      item.classList.add('selected');
    }
  }

  for (const wp of WALLPAPERS) {
    const item = document.createElement('div');
    item.className = 'settings-wallpaper-item';
    if (wp.id === currentWallpaper) {
      item.classList.add('selected');
      selectedWpItem = item;
    }
    item.dataset.wpId = wp.id;

    const preview = document.createElement('div');
    preview.className = 'settings-wallpaper-preview';
    preview.style.backgroundImage = `url(${wp.path})`;

    const name = document.createElement('span');
    name.className = 'settings-wallpaper-name';
    name.textContent = wp.name;

    item.appendChild(preview);
    item.appendChild(name);

    item.addEventListener('click', () => {
      markSelected(item);
      selectedWallpaper = wp.id;
      // A wallpaper is applied on Apply, so a stored custom image (if any)
      // keeps being shown until then.
      usingCustomBackground = false;
    });

    wpGrid.appendChild(item);
  }

  // ── "Custom image" tile ──
  //
  // LOCAL ONLY: the picked file is read as a Data URL with
  // FileReader.readAsDataURL and saved in localStorage under
  // 'desktop.backgroundImage'. It is never uploaded to a server, never sent to
  // a backend and never attached to any user account; if the browser storage is
  // cleared (or "Delete Saved Data" is used) the desktop goes back to the
  // selected wallpaper.
  const customItem = document.createElement('div');
  customItem.className = 'settings-wallpaper-item';
  customItem.dataset.wpId = CUSTOM_WALLPAPER_ID;
  customItem.tabIndex = 0;
  customItem.setAttribute('role', 'button');
  customItem.setAttribute('aria-label', t('customImage'));

  const customPreview = document.createElement('div');
  customPreview.className = 'settings-wallpaper-preview settings-wallpaper-preview-custom';
  customPreview.title = t('bgEmpty');

  const customName = document.createElement('span');
  customName.className = 'settings-wallpaper-name';
  customName.textContent = t('customImage');

  customItem.appendChild(customPreview);
  customItem.appendChild(customName);

  // Hidden file input: this is what opens the native "choose a file" dialog so
  // the user can point at an image on their computer.
  const bgFileInput = document.createElement('input');
  bgFileInput.type = 'file';
  bgFileInput.id = 'desktop-background-file';
  bgFileInput.accept = 'image/*';
  bgFileInput.className = 'settings-wallpaper-file';
  bgFileInput.setAttribute('aria-label', t('customImageFileLabel'));

  const bgFileLabel = document.createElement('label');
  bgFileLabel.className = 'settings-visually-hidden';
  bgFileLabel.htmlFor = 'desktop-background-file';
  bgFileLabel.textContent = t('customImageFileLabel');

  function openFilePicker(): void {
    bgFileInput.click();
  }

  customItem.addEventListener('click', openFilePicker);
  customItem.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFilePicker();
    }
  });

  wpGrid.appendChild(customItem);

  // Remove button (visible only while a custom image is stored)
  const bgRemoveBtn = document.createElement('button');
  bgRemoveBtn.className = 'settings-button settings-wallpaper-remove';
  bgRemoveBtn.type = 'button';
  bgRemoveBtn.textContent = t('bgRemove');
  bgRemoveBtn.hidden = true;

  // Feedback area (errors are reported here instead of the console)
  const bgMessage = document.createElement('div');
  bgMessage.className = 'settings-wallpaper-message';
  bgMessage.setAttribute('role', 'status');
  bgMessage.setAttribute('aria-live', 'polite');

  const wpInfoText = document.createElement('div');
  wpInfoText.className = 'settings-info';
  wpInfoText.textContent = t('customImageInfo');

  wpSection.appendChild(wpGrid);
  wpSection.appendChild(bgFileLabel);
  wpSection.appendChild(bgFileInput);
  wpSection.appendChild(bgRemoveBtn);
  wpSection.appendChild(bgMessage);
  wpSection.appendChild(wpInfoText);
  wpFieldset.appendChild(wpSection);
  desktopPanel.appendChild(wpFieldset);

  const maxSizeLabel = `${Math.round(MAX_BACKGROUND_IMAGE_BYTES / (1024 * 1024))} MB`;

  function showBackgroundMessage(text: string, isError: boolean): void {
    bgMessage.textContent = text;
    bgMessage.classList.toggle('error', isError);
  }

  /**
   * Sync the "Custom image" tile and the remove button with what is actually
   * stored (missing/corrupt value → no custom image, no error).
   */
  function refreshCustomState(): void {
    const stored = getBackgroundImage();
    if (stored) {
      customPreview.style.backgroundImage = `url(${stored})`;
      customPreview.classList.add('has-image');
      customPreview.title = t('bgApplied');
      bgRemoveBtn.hidden = false;
      markSelected(customItem);
    } else {
      customPreview.style.backgroundImage = '';
      customPreview.classList.remove('has-image');
      customPreview.title = t('bgEmpty');
      bgRemoveBtn.hidden = true;
      if (selectedWpItem === customItem) {
        // Nothing custom to show: fall back to the stored wallpaper.
        markSelected(wpGrid.querySelector<HTMLElement>(`[data-wp-id="${currentWallpaper}"]`));
      }
    }
  }

  function backgroundErrorMessage(error: string): string {
    if (error === 'not-image') return t('bgErrorNotImage');
    if (error === 'too-large') return t('bgErrorTooLarge').replace('{max}', maxSizeLabel);
    return t('bgErrorRead');
  }

  /** Store failures: 'invalid' | 'too-large' | 'quota' | 'unknown'. */
  function backgroundStoreErrorMessage(error: string): string {
    if (error === 'invalid') return t('bgErrorNotImage');
    if (error === 'too-large') return t('bgErrorTooLarge').replace('{max}', maxSizeLabel);
    if (error === 'quota') return t('bgErrorQuota');
    return t('bgErrorRead');
  }

  bgFileInput.addEventListener('change', () => {
    const file = bgFileInput.files?.[0];
    if (!file) return;
    showBackgroundMessage('', false);

    readImageFileAsDataUrl(file)
      .then((dataUrl) => {
        const result = setBackgroundImage(dataUrl);
        if (result.ok) {
          usingCustomBackground = true;
          showBackgroundMessage(t('bgApplied'), false);
        } else {
          showBackgroundMessage(backgroundStoreErrorMessage(result.error), true);
        }
        // On failure the previously stored image (if any) is still in place.
        refreshCustomState();
      })
      .catch((e: unknown) => {
        showBackgroundMessage(
          backgroundErrorMessage(e instanceof Error ? e.message : 'read-failed'),
          true,
        );
        refreshCustomState();
      })
      .finally(() => {
        // Reset so the same file can be picked again
        bgFileInput.value = '';
      });
  });

  bgRemoveBtn.addEventListener('click', () => {
    clearBackgroundImage();
    usingCustomBackground = false;
    selectedWallpaper = currentWallpaper;
    refreshCustomState();
    showBackgroundMessage(t('bgRemoved'), false);
  });

  refreshCustomState();

  // ── Advanced panel ──
  const advancedPanel = document.createElement('div');
  advancedPanel.className = 'settings-panel';
  advancedPanel.style.display = 'none';

  // -- Delete Data fieldset --
  const deleteFieldset = document.createElement('fieldset');
  deleteFieldset.className = 'settings-section';

  const deleteLegend = document.createElement('legend');
  deleteLegend.textContent = t('dataDeleted');
  deleteFieldset.appendChild(deleteLegend);

  const deleteDesc = document.createElement('p');
  deleteDesc.style.cssText = 'margin:8px 0 12px 0;line-height:1.4;';
  deleteDesc.textContent = t('deleteDataDesc');
  deleteFieldset.appendChild(deleteDesc);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'settings-button settings-delete-btn';
  deleteBtn.type = 'button';
  deleteBtn.textContent = t('deleteData');
  deleteBtn.addEventListener('click', () => {
    if (confirm(t('deleteDataConfirm'))) {
      // Clear all app-specific localStorage keys
      const keysToRemove = [
        'language',
        'wallpaper',
        'clippyEnabled',
        'clippy_enabled',
        'window_states',
        'winamp_state',
        'show_welcome',
        'welcome_hidden_at',
        'desktop-icon-positions',
        // Custom desktop background (Data URL) — local-only, see utils/desktopBackground.ts
        LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE,
      ];
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
      // Reload to apply defaults
      location.reload();
    }
  });
  deleteFieldset.appendChild(deleteBtn);

  advancedPanel.appendChild(deleteFieldset);

  // Attach panels to body
  body.appendChild(generalPanel);
  body.appendChild(desktopPanel);
  body.appendChild(advancedPanel);
  panelContainer.appendChild(body);
  container.appendChild(panelContainer);

  // ═══════════════════════════════════════════
  // Tab switching (triggered by toolbar buttons)
  // ═══════════════════════════════════════════
  function switchTab(tab: 'general' | 'desktop' | 'advanced'): void {
    const isGeneral = tab === 'general';
    const isDesktop = tab === 'desktop';
    const isAdvanced = tab === 'advanced';
    generalPanel.style.display = isGeneral ? 'block' : 'none';
    desktopPanel.style.display = isDesktop ? 'block' : 'none';
    advancedPanel.style.display = isAdvanced ? 'block' : 'none';
    // Sync toolbar button active state
    btnGeneral.classList.toggle('active', isGeneral);
    btnDesktop.classList.toggle('active', isDesktop);
    btnAdvanced.classList.toggle('active', isAdvanced);
  }

  // Toolbar button clicks
  btnGeneral.addEventListener('click', () => switchTab('general'));
  btnDesktop.addEventListener('click', () => switchTab('desktop'));
  btnAdvanced.addEventListener('click', () => switchTab('advanced'));

  // ═══════════════════════════════════════════
  // Footer: Apply / Cancel
  // ═══════════════════════════════════════════
  const footer = document.createElement('div');
  footer.className = 'settings-footer';

  const applyBtn = document.createElement('button');
  applyBtn.className = 'settings-button';
  applyBtn.type = 'button';
  applyBtn.textContent = t('apply');
  applyBtn.addEventListener('click', () => {
    // Read language from radio group
    const langRadio = container.querySelector<HTMLInputElement>(
      'input[name="language"]:checked',
    );
    if (langRadio) {
      selectedLanguage = langRadio.value;
    }

    // Read clippy from radio group
    const clippyRadio = container.querySelector<HTMLInputElement>(
      'input[name="clippy"]:checked',
    );
    selectedClippy = clippyRadio ? clippyRadio.id === 'clippy-on' : selectedClippy;

    // Persist language
    localStorage.setItem('language', selectedLanguage);
    window.dispatchEvent(
      new CustomEvent('language-changed', { detail: { language: selectedLanguage } }),
    );

    // Persist wallpaper
    localStorage.setItem('wallpaper', selectedWallpaper);
    window.dispatchEvent(
      new CustomEvent('wallpaper-changed', { detail: { wallpaper: selectedWallpaper } }),
    );

    // A stored custom image wins over the wallpaper, so applying a wallpaper
    // also drops the image; the "Custom image" tile keeps it.
    if (!usingCustomBackground && getBackgroundImage()) {
      clearBackgroundImage();
    }

    // Persist clippy
    localStorage.setItem('clippyEnabled', String(selectedClippy));
    window.dispatchEvent(
      new CustomEvent('clippy-changed', { detail: { enabled: selectedClippy } }),
    );

    $win.close();
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'settings-button';
  cancelBtn.type = 'button';
  cancelBtn.textContent = t('cancel');
  cancelBtn.addEventListener('click', () => {
    $win.close();
  });

  footer.appendChild(applyBtn);
  footer.appendChild(cancelBtn);
  container.appendChild(footer);

  // ── Append everything to the os-gui window ──
  $win.$content.append(container);
}
