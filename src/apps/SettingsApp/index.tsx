import React from 'react';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

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
  { id: 'purple', name: 'Purple Stone', path: '/wallpapers/purple.svg' },
];

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
 *   - Desktop: Wallpaper preview grid with selection
 *
 * Data is persisted directly to localStorage and custom events are dispatched
 * so the React context providers pick up the changes.
 */
export function launchSettings(): void {
  const $Window = (window as any).$Window;
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

  // ── Create the os-gui window ──
  const $win = $Window({
    title: t('settings'),
    icons: {
      16: '/images/icons/settings.svg',
      any: '/images/icons/settings.svg',
    },
    minWidth: 380,
    minHeight: 360,
  });

  $win.css({
    width: '450px',
    height: '480px',
  });
  $win.center();
  registerOsWindow($win, 'settings', t('settings'), '/images/icons/settings.svg');

  // ── Build Settings layout ──
  const container = document.createElement('div');
  container.className = 'os-explorer settings-container';

  // ══════ Toolbars (98-style, matching MyComputer / FileExplorerApp) ══════
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  // ── Menu bar toolbar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';

  const dragHandle = document.createElement('div');
  dragHandle.className = 'toolbar-drag-handle';
  menuToolbar.appendChild(dragHandle);

  const MenuBar = (window as any).MenuBar;
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
      if (selectedWpItem) {
        selectedWpItem.classList.remove('selected');
      }
      item.classList.add('selected');
      selectedWpItem = item;
      selectedWallpaper = wp.id;
    });

    wpGrid.appendChild(item);
  }

  wpSection.appendChild(wpGrid);
  wpFieldset.appendChild(wpSection);
  desktopPanel.appendChild(wpFieldset);

  // Wallpaper info text
  const wpInfoText = document.createElement('div');
  wpInfoText.className = 'settings-info';
  wpInfoText.textContent = t('wallpaperInfo');
  desktopPanel.appendChild(wpInfoText);

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
