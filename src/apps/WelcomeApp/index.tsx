import React from 'react';
import { extractRawContent, extractDate, extractContentWithoutDate } from '../../utils/fileUtils';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

/**
 * All markdown files loaded eagerly via Vite's import.meta.glob.
 * Used for "What's New" (features.md) and "Resume" (hoja-de-vida.md) content.
 */
const mdFiles: Record<string, string> = import.meta.glob('../../data/files/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Placeholder React component — the Welcome app uses os-gui natively.
 * This component is never rendered via the React window system.
 */
export const WelcomeApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

/**
 * Dispatches a custom event to open the FileViewer app from os-gui native windows.
 * DesktopProvider must listen for 'desktop-open-app' and route to openApp().
 */
function openFileInViewer(
  fileName: string,
  folder: string,
  displayTitle: string,
): void {
  const rawPath = `../../data/files/${folder}/${fileName}.md`;
  const rawMd = mdFiles[rawPath];
  if (!rawMd) {
    console.warn(`WelcomeApp: file not found — ${rawPath}`);
    return;
  }

  const content = extractContentWithoutDate(rawMd);
  const rawContent = extractRawContent(rawMd);
  const date = extractDate(rawMd);

  window.dispatchEvent(
    new CustomEvent('desktop-open-app', {
      detail: {
        appId: 'markdownViewer',
        appData: {
          file: {
            name: fileName,
            content,
            rawContent,
            folder,
            date,
          },
          windowKey: `${folder}/${fileName}.md`,
          title: displayTitle,
        },
      },
    }),
  );
}

// ─── Translations ────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<string, Record<'en' | 'es', string>> = {
  welcome: {
    en: 'Welcome to juandavid.site',
    es: 'Bienvenido a juandavid.site',
  },
  didYouKnow: {
    en: 'Did you know this about me?',
    es: '¿Sabías esto de mí?',
  },
  nextTip: {
    en: 'Next Tip',
    es: 'Siguiente Tip',
  },
  whatsNew: {
    en: "What's New",
    es: 'Qué hay de nuevo',
  },
  onlineRegistration: {
    en: 'Online Registration',
    es: 'Registro en línea',
  },
  close: {
    en: 'Close',
    es: 'Cerrar',
  },
  showWelcomeScreen: {
    en: 'Show this Welcome Screen next time you start the system',
    es: 'Mostrar esta pantalla de bienvenida al iniciar el sistema',
  },
  language: {
    en: 'Language',
    es: 'Idioma',
  },
  moreInfo: {
    en: 'More info',
    es: 'Más info',
  },
  contactInfo: {
    en: 'Contact Info',
    es: 'Datos de contacto',
  },
  resume: {
    en: 'Resume',
    es: 'Hoja de vida',
  },
  aboutMessage: {
    en:
      'Welcome to juandavid.site\n\n' +
      'A Windows 98-style desktop experience.\n\n' +
      'Full Stack Developer — Cloud Process Automation',
    es:
      'Bienvenido a juandavid.site\n\n' +
      'Una experiencia de escritorio estilo Windows 98.\n\n' +
      'Desarrollador Full Stack — Automatización en la Nube',
  },
};

function tr(key: string, lang: 'en' | 'es'): string {
  return TRANSLATIONS[key]?.[lang] ?? key;
}

// ─── Tip content builders ────────────────────────────────────────────────────

interface TipEntry {
  type: 'text' | 'html';
  content: string;
}

function getTips(lang: 'en' | 'es'): TipEntry[] {
  const en = lang === 'en';
  return [
    {
      type: 'text',
      content: en
        ? 'Full Stack Developer expert in Cloud Process Automation, PaintBall, Softcombat and Roller derby Player, Robotics, Electronics and Technology Lover.'
        : 'Desarrollador Full Stack experto en Automatización de Procesos en la Nube, jugador de PaintBall, Softcombat y Roller derby, Gomoso de la Robótica, Electrónica y Tecnología.',
    },
    {
      type: 'html',
      content: buildLinksHtml(lang),
    },
    {
      type: 'html',
      content: buildContactHtml(lang),
    },
    {
      type: 'text',
      content: en
        ? "Available for consulting, mentoring, or hourly freelance work. Let's build something great together!"
        : 'Disponible para asesorías, mentorías o trabajos por horas. ¡Impulsemos tu proyecto juntos!',
    },
  ];
}

function buildLinksHtml(lang: 'en' | 'es'): string {
  const isEn = lang === 'en';
  return [
    `<p style="margin:0 0 8px 0;font-style:italic">${isEn ? 'More info' : 'Más info'}</p>`,
    '<div style="display:flex;flex-direction:column;gap:6px">',
    '<a href="#" data-action="open-resume" style="color:#0000ff;text-decoration:none;display:flex;align-items:center;gap:8px;cursor:pointer">📄 ' +
      (isEn ? 'Resume' : 'Hoja de vida') +
      '</a>',
    '<a href="https://www.linkedin.com/in/juandavid8a" target="_blank" rel="noopener noreferrer" style="color:#0000ff;text-decoration:none;display:flex;align-items:center;gap:8px">💼 LinkedIn</a>',
    '<a href="https://www.youtube.com/@JuanDavidOchoa" target="_blank" rel="noopener noreferrer" style="color:#0000ff;text-decoration:none;display:flex;align-items:center;gap:8px">▶️ YouTube</a>',
    '<a href="https://www.instagram.com/zarkito8a" target="_blank" rel="noopener noreferrer" style="color:#0000ff;text-decoration:none;display:flex;align-items:center;gap:8px">📷 Instagram</a>',
    '</div>',
  ].join('\n');
}

function buildContactHtml(lang: 'en' | 'es'): string {
  const isEn = lang === 'en';
  return [
    `<p style="margin:0 0 8px 0;font-style:italic">${isEn ? 'Contact Info' : 'Datos de contacto'}</p>`,
    '<div style="display:flex;flex-direction:column;gap:6px">',
    '<a href="mailto:juandavid8a@gmail.com" style="color:#0000ff;text-decoration:none;display:flex;align-items:center;gap:8px">📧 juandavid8a@gmail.com</a>',
    '<a href="https://wa.me/573052370311" target="_blank" rel="noopener noreferrer" style="color:#0000ff;text-decoration:none;display:flex;align-items:center;gap:8px">💬 WhatsApp (+57) 3052370311</a>',
    '<div style="display:flex;align-items:center;gap:8px">📍 Medellín - Colombia</div>',
    '</div>',
  ].join('\n');
}

/**
 * Build a tip content DOM element for the given index and language.
 * Uses innerHTML for html-type tips and attaches event delegation
 * to handle internal actions like opening the Resume file.
 */
function createTipContent(
  tipIndex: number,
  lang: 'en' | 'es',
  onOpenResume: () => void,
): HTMLDivElement {
  const div = document.createElement('div');
  div.style.cssText = 'margin:0;line-height:1.5;font-size:12px';

  const tip = getTips(lang)[tipIndex];
  if (!tip) {
    div.textContent = '';
    return div;
  }

  if (tip.type === 'text') {
    div.textContent = tip.content;
  } else {
    div.innerHTML = tip.content;
    // Event delegation for internal actions (Resume link)
    div.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const actionEl = target.closest('[data-action]') as HTMLElement | null;
      if (actionEl) {
        const action = actionEl.getAttribute('data-action');
        if (action === 'open-resume') {
          e.preventDefault();
          onOpenResume();
        }
      }
    });
  }

  return div;
}

// ─── Singleton instance tracker ──────────────────────────────────────────────
// Ensures clicking Start Menu or startup auto-launch reuses the same window.

let welcomeWindowInstance: any = null;

// ─── os-gui launch function ──────────────────────────────────────────────────

export function launchWelcome(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // Reuse existing window if still open
  if (welcomeWindowInstance && !welcomeWindowInstance.closed) {
    welcomeWindowInstance.show();   // un-minimize if hidden
    welcomeWindowInstance.focus();  // bring to front
    return;
  }

  // ── Helpers ──

  const getLang = (): 'en' | 'es' => {
    const lang = localStorage.getItem('language');
    return lang === 'es' ? 'es' : 'en';
  };

  const readShowWelcome = (): boolean => {
    return localStorage.getItem('show_welcome') !== 'false';
  };

  // ── Mutable state ──

  let currentTipIndex = 0;
  let currentLang: 'en' | 'es' = getLang();

  // ── Create os-gui window ──

  const $win = $Window({
    title: 'Welcome',
    icons: {
      16: '/app/icons/welcome.svg',
      any: '/app/icons/welcome.svg',
    },
    minWidth: 500,
    minHeight: 350,
  });

  $win.css({ width: '700px', height: '420px' });
  $win.center();

  // Register with taskbar
  registerOsWindow($win, 'welcome', 'Welcome', '/app/icons/welcome.svg');

  // Track instance for singleton reuse; clear reference when window closes
  welcomeWindowInstance = $win;
  $win.onClosed(() => {
    welcomeWindowInstance = null;
  });

  // ── Menu bar (inserted after titlebar, like NetscapeApp) ──

  const menu = new MenuBar({
    '&File': [
      {
        label: 'E&xit',
        action: () => $win.close(),
      },
    ],
    '&Help': [
      {
        label: '&About',
        action: () => {
          showMessageBox({ title: 'About', message: tr('aboutMessage', currentLang), icon: 'info' });
        },
      },
    ],
  });
  $win.$titlebar.after(menu.element);

  // ── Main content area (fills remaining space) ──

  const isMobile = window.innerWidth < 768;

  const mainContent = document.createElement('div');
  mainContent.style.cssText = [
    'height:100%',
    'display:flex',
    'flex-direction:column',
    isMobile ? 'padding:10px' : 'padding:20px',
    'overflow:hidden',
    'box-sizing:border-box',
    'background:var(--ButtonFace)',
    "font-family:'MS Sans Serif','Segoe UI',sans-serif",
    'font-size:11px',
  ].join(';');

  // ── Title ──
  const titleEl = document.createElement('h2');
  titleEl.style.cssText = 'font-size:18px;margin:0 0 15px 0;font-weight:normal;color:var(--WindowText)';
  titleEl.textContent = tr('welcome', currentLang);
  mainContent.appendChild(titleEl);

  // ── Two-column row ──
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;flex:1;flex-direction:row;gap:20px;overflow:hidden';
  mainContent.appendChild(row);

  // ── Left column: tips area (sunken-panel) ──
  const leftCol = document.createElement('div');
  leftCol.className = 'sunken-panel';
  leftCol.style.cssText = [
    'flex:1',
    'background:#fff',
    isMobile ? 'padding:12px' : 'padding:20px',
    'display:flex',
    'flex-direction:column',
    isMobile ? 'gap:10px' : 'gap:20px',
    'overflow-y:auto',
    'min-height:0',
  ].join(';');

  const tipFlexRow = document.createElement('div');
  tipFlexRow.style.cssText = 'display:flex;gap:20px;align-items:flex-start';

  if (!isMobile) {
    const lightbulb = document.createElement('span');
    lightbulb.style.cssText = 'font-size:32px;line-height:1';
    lightbulb.textContent = '💡';
    tipFlexRow.appendChild(lightbulb);
  }

  const tipTextArea = document.createElement('div');
  tipTextArea.style.cssText = 'flex:1';

  const headingEl = document.createElement('p');
  headingEl.style.cssText = 'margin:0 0 12px 0;font-weight:bold;font-size:13px;color:var(--WindowText)';
  headingEl.textContent = tr('didYouKnow', currentLang);
  tipTextArea.appendChild(headingEl);

  const tipContentContainer = document.createElement('div');

  let lastTipContent: HTMLDivElement | null = null;

  function renderTipContent(): void {
    const newContent = createTipContent(currentTipIndex, currentLang, () => {
      openFileInViewer('hoja-de-vida', 'content', tr('resume', currentLang));
    });
    if (lastTipContent) {
      tipContentContainer.replaceChild(newContent, lastTipContent);
    } else {
      tipContentContainer.appendChild(newContent);
    }
    lastTipContent = newContent;
  }
  renderTipContent();

  tipTextArea.appendChild(tipContentContainer);
  tipFlexRow.appendChild(tipTextArea);
  leftCol.appendChild(tipFlexRow);
  row.appendChild(leftCol);

  // ── Right column: buttons panel ──
  const rightCol = document.createElement('div');
  rightCol.style.cssText = isMobile
    ? 'width:min-content;min-width:110px;display:flex;flex-direction:column;gap:4px'
    : 'width:200px;display:flex;flex-direction:column;gap:6px';

  function createWinButton(
    text: string,
    onClick: () => void,
    disabled = false,
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = disabled;
    btn.style.cssText = [
      'padding:4px 8px',
      'text-align:left',
      'width:100%',
      'font-size:11px',
      "font-family:'MS Sans Serif','Segoe UI',sans-serif",
    ].join(';');
    if (!disabled) {
      btn.addEventListener('click', onClick);
    }
    return btn;
  }

  const nextTipBtn = createWinButton(tr('nextTip', currentLang), () => {
    const tips = getTips(currentLang);
    currentTipIndex = (currentTipIndex + 1) % tips.length;
    renderTipContent();
  });

  const whatsNewBtn = createWinButton(tr('whatsNew', currentLang), () => {
    openFileInViewer('features', 'content', tr('whatsNew', currentLang));
  });

  const onlineRegBtn = createWinButton(
    tr('onlineRegistration', currentLang),
    () => {},
    true,
  );

  const closeBtn = createWinButton(tr('close', currentLang), () => {
    $win.close();
  });

  rightCol.appendChild(nextTipBtn);
  rightCol.appendChild(whatsNewBtn);
  rightCol.appendChild(onlineRegBtn);
  rightCol.appendChild(closeBtn);

  // ── Language fieldset ──
  const fieldset = document.createElement('fieldset');
  fieldset.style.cssText = 'margin-top:auto;padding:10px;width:100%';

  const legend = document.createElement('legend');
  legend.textContent = tr('language', currentLang);
  fieldset.appendChild(legend);

  const fieldRow = document.createElement('div');
  fieldRow.className = 'field-row';
  fieldRow.style.cssText = 'display:flex;gap:16px';

  function createLangRadio(
    value: 'en' | 'es',
    label: string,
  ): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;gap:4px';

    const input = document.createElement('input');
    input.id = 'lang-' + value;
    input.type = 'radio';
    input.name = 'language-select';
    input.value = value;
    input.checked = currentLang === value;

    input.addEventListener('change', () => {
      if (input.checked) {
        currentLang = value;
        localStorage.setItem('language', currentLang);

        // Notify React context so the rest of the app responds
        window.dispatchEvent(
          new CustomEvent('language-changed', {
            detail: { language: currentLang },
          }),
        );

        // Update all UI elements
        updateUILanguage(currentLang);
      }
    });

    const lbl = document.createElement('label');
    lbl.htmlFor = 'lang-' + value;
    lbl.textContent = label;

    wrapper.appendChild(input);
    wrapper.appendChild(lbl);
    return wrapper;
  }

  fieldRow.appendChild(createLangRadio('en', 'English'));
  fieldRow.appendChild(createLangRadio('es', 'Español'));
  fieldset.appendChild(fieldRow);
  rightCol.appendChild(fieldset);

  row.appendChild(rightCol);

  // ── Footer: show-on-startup checkbox ──
  const footer = document.createElement('div');
  footer.style.cssText = [
    'margin-top:20px',
    'display:flex',
    'align-items:center',
    'gap:8px',
    'justify-content:flex-start',
    'flex-shrink:0',
  ].join(';');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'startup-check';
  checkbox.checked = readShowWelcome();
  checkbox.style.cssText = 'cursor:pointer';

  checkbox.addEventListener('change', () => {
    const checked = checkbox.checked;
    localStorage.setItem('show_welcome', String(checked));
    if (!checked) {
      localStorage.setItem('welcome_hidden_at', String(Date.now()));
    } else {
      localStorage.removeItem('welcome_hidden_at');
    }
  });

  const footerLabel = document.createElement('label');
  footerLabel.htmlFor = 'startup-check';
  footerLabel.style.cssText = 'cursor:pointer';
  footerLabel.textContent = tr('showWelcomeScreen', currentLang);

  footer.appendChild(checkbox);
  footer.appendChild(footerLabel);
  mainContent.appendChild(footer);

  // ── Language update function ──
  function updateUILanguage(lang: 'en' | 'es'): void {
    titleEl.textContent = tr('welcome', lang);
    headingEl.textContent = tr('didYouKnow', lang);
    nextTipBtn.textContent = tr('nextTip', lang);
    whatsNewBtn.textContent = tr('whatsNew', lang);
    onlineRegBtn.textContent = tr('onlineRegistration', lang);
    closeBtn.textContent = tr('close', lang);
    footerLabel.textContent = tr('showWelcomeScreen', lang);
    legend.textContent = tr('language', lang);
    renderTipContent();
  }

  // ── Append to window ──
  $win.$content.append(mainContent);
}
