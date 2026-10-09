import { registerOsWindow } from '../../utils/osWindowRegistry';
import { applyCascadeAndFit } from '../../utils/cascadePosition';

/* ==========================================================================
   Mi Primera Encarta — faithful port of the Encarta 2009 replica.

   The markup lives in a single template string (verbatim from the replica) and
   every rule it relies on is defined in ./index.css. Nothing is styled inline:
   layout belongs to the stylesheet.

   Inline `onclick="..."` attributes resolve against globals, so the handlers
   below are published on `window` when the app boots.
   ========================================================================== */

/* ── Data model ────────────────────────────────────────────────────────── */

interface EncartaItem {
  icon: string;
  label: string;
  desc: string;
  highlight?: boolean;
}

interface EncartaCategory {
  title: string;
  items: EncartaItem[];
}

/** Keys of {@link CATEGORY_DATA}. Inline `onclick` handlers pass plain strings. */
type EncartaCategoryKey =
  | 'juega_aprende'
  | 'paisajes'
  | 'seres_vivos'
  | 'ciencia'
  | 'matematicas'
  | 'deportes'
  | 'historia'
  | 'sociedad'
  | 'lengua'
  | 'artes';

type SoundType = 'click' | 'chime' | 'win';

const DEFAULT_CATEGORY_KEY: EncartaCategoryKey = 'juega_aprende';

/** Sub-category dataset matching Encarta 2009 exactly (verbatim Spanish copy). */
const CATEGORY_DATA: Record<EncartaCategoryKey, EncartaCategory> = {
  juega_aprende: {
    title: 'Juega y aprende',
    items: [
      { icon: '🎨', label: 'Juegos con arte', desc: 'Crea dibujos interactivos y aprende combinaciones de colores.' },
      { icon: '👁️', label: 'Juega con las ciencias', desc: 'Pon a prueba tu curiosidad con acertijos del universo y experimentos.' },
      { icon: '🔀', label: 'Juega con la Geografía', desc: 'Adivina continentes, países y banderas en este mapa interactivo.', highlight: true },
      { icon: '🔤', label: 'Juegos de palabras', desc: 'Sopas de letras, crucigramas y juegos de ortografía para primaria.' },
      { icon: '🎬', label: 'El arte en imágenes', desc: 'Explora la galería multimedia de cine, escultura y grandes pinturas.' },
      { icon: '🏋️', label: 'Deporte en acción', desc: 'Aprende las reglas e historia de tus deportes preferidos.' },
      { icon: '🌐', label: 'Explora el mundo', desc: 'Viaje en 3D virtual por los rincones más impresionantes de la Tierra.' },
      { icon: '🦋', label: 'Naturaleza en acción', desc: 'Descubre ecosistemas, hábitats de animales y fotosíntesis.' },
      { icon: '🔬', label: 'Área de estudio', desc: 'Herramientas de tareas, diccionario escolar y calculadora.' },
    ],
  },
  paisajes: {
    title: 'Paisajes y regiones',
    items: [
      { icon: '🗺️', label: 'Los continentes del planeta', desc: 'Geografía física de América, Europa, África, Asia y Oceanía.' },
      { icon: '🌋', label: 'Volcanes y terremotos', desc: 'Placas tectónicas y formación de cadenas montañosas.' },
      { icon: '🌊', label: 'Océanos y ríos caudalosos', desc: 'El ciclo del agua y los grandes sistemas fluviales.' },
      { icon: '☀️', label: 'Climas y zonas térmicas', desc: 'Climas ecuatoriales, desérticos y polares.' },
    ],
  },
  seres_vivos: {
    title: 'Los seres vivos',
    items: [
      { icon: '🐅', label: 'El reino animal', desc: 'Clasificación de animales vertebrados e invertebrados.' },
      { icon: '🦖', label: 'Mundo de los dinosaurios', desc: 'Los fascinantes gigantes de la era Mesozoica.' },
      { icon: '🌿', label: 'Plantas y fotosíntesis', desc: 'Alimentación, germinación y respiración vegetal.' },
      { icon: '🦅', label: 'Aves y sus migraciones', desc: 'Adaptaciones increíbles para el vuelo y construcción de nidos.' },
    ],
  },
  ciencia: {
    title: 'Ciencia y técnica',
    items: [
      { icon: '🚀', label: 'El sistema solar', desc: 'Planetas, satélites naturales y exploración del espacio.' },
      { icon: '🔬', label: 'La materia y los átomos', desc: 'Estados de la materia: sólidos, líquidos y gases.' },
      { icon: '💡', label: 'Grandes inventos', desc: 'La imprenta, la bombilla eléctrica y las computadoras.' },
      { icon: '🫀', label: 'El cuerpo humano', desc: 'Funcionamiento de los órganos y aparatos del cuerpo.' },
    ],
  },
  matematicas: {
    title: 'Matemáticas',
    items: [
      { icon: '🧮', label: 'Uso del ábaco y conteo', desc: 'Aprende unidades, decenas y centenas jugando.' },
      { icon: '🔷', label: 'Geometría divertida', desc: 'Identifica figuras planas y cuerpos geométricos.' },
      { icon: '➕', label: 'Cálculo mental', desc: 'Desafíos rápidos de suma, resta y multiplicación.' },
    ],
  },
  deportes: {
    title: 'Deportes',
    items: [
      { icon: '⚽', label: 'Historia del fútbol', desc: 'Origen, reglas e historia del deporte más popular.' },
      { icon: '🥇', label: 'Juegos Olímpicos', desc: 'De la antigua Grecia a las Olimpiadas modernas.' },
    ],
  },
  historia: {
    title: 'Historia',
    items: [
      { icon: '🏺', label: 'El Antiguo Egipto', desc: 'Faraones, pirámides, jeroglíficos y mitología.' },
      { icon: '🏰', label: 'La Edad Media', desc: 'Castillos, caballeros, feudos y grandes reinos.' },
    ],
  },
  sociedad: {
    title: 'Nuestra sociedad',
    items: [
      { icon: '🧑‍🤝‍🧑', label: 'Culturas del mundo', desc: 'Tradiciones, trajes típicos y festividades globales.' },
      { icon: '🏙️', label: 'Las ciudades y el campo', desc: 'Organización social y servicios comunitarios.' },
    ],
  },
  lengua: {
    title: 'Lengua y literatura',
    items: [
      { icon: '📖', label: 'Cuentos clásicos', desc: 'Fábulas, mitos y grandiosas obras infantiles.' },
      { icon: '✍️', label: 'Reglas de ortografía', desc: 'Acentuación, puntuación y gramática escolar.' },
    ],
  },
  artes: {
    title: 'Las artes',
    items: [
      { icon: '🎨', label: 'Galería de pintura', desc: 'Conoce las obras maestras de grandes pintores.' },
      { icon: '🎵', label: 'Instrumentos musicales', desc: 'Cuerda, viento y percusión en la orquesta.' },
    ],
  },
};

/* ── Web Audio sound effects ───────────────────────────────────────────── */

/**
 * Created lazily on the first `playSound` call: browsers block an AudioContext
 * built before a user gesture and log a warning about it.
 */
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioContext) return audioContext;

  // Neither `AudioContext` nor the legacy `webkitAudioContext` is declared on
  // the TS `Window` interface — both are ambient globals in lib.dom.d.ts — so
  // both are declared explicitly on the narrowed scope.
  const scope = window as Window & {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  const AudioContextCtor: typeof AudioContext | undefined = scope.AudioContext ?? scope.webkitAudioContext;
  if (!AudioContextCtor) return null;

  try {
    audioContext = new AudioContextCtor();
  } catch (error) {
    console.error('[Encarta] AudioContext could not be created:', error);
    return null;
  }
  return audioContext;
}

function playSound(type: SoundType): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    void ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } else if (type === 'chime') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.22);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } else if (type === 'win') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.42);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  }
}

/* ── Tailwind Play CDN loader ──────────────────────────────────────────── */

const TAILWIND_CDN_URL = 'https://cdn.tailwindcss.com';
const TAILWIND_LOAD_TIMEOUT_MS = 3000;

declare global {
  interface Window {
    /** Namespace published by the Tailwind Play CDN; read for `config`. */
    tailwind?: { config?: { corePlugins?: { preflight?: boolean } } };
  }
}

/** Cached so concurrent or repeated launches await the very same load. */
let tailwindPromise: Promise<void> | null = null;

/**
 * Tailwind's preflight resets margins, box-sizing and form controls globally,
 * which would wreck the Win98 UI of every other app (os-gui/windows-98.css is
 * loaded site-wide). Preflight must stay off.
 */
function applyTailwindConfig(): void {
  window.tailwind = window.tailwind ?? {};
  window.tailwind.config = { corePlugins: { preflight: false } };
}

/**
 * Injects the Tailwind Play CDN once. Never rejects: on failure the app still
 * renders with the custom classes in index.css, so no visitor is left without
 * a window.
 */
function ensureTailwind(): Promise<void> {
  if (tailwindPromise) return tailwindPromise;

  tailwindPromise = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.src = TAILWIND_CDN_URL;
    script.async = true;
    script.dataset.encartaTailwind = 'true';

    script.addEventListener('load', () => {
      applyTailwindConfig();
      resolve();
    });
    script.addEventListener('error', () => {
      console.error('[Encarta] Tailwind CDN failed to load; rendering without Tailwind utilities.');
      script.remove();
      // Allow a later launch to retry the load.
      tailwindPromise = null;
      resolve();
    });

    document.head.appendChild(script);
  });

  return tailwindPromise;
}

/**
 * Caps the Tailwind wait: a stalled CDN must never leave the user staring at an
 * empty window. Resolves early once `promise` settles either way.
 */
function withTimeout(promise: Promise<void>, ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    promise.then(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

/* ── Markup (verbatim from the Encarta 2009 replica) ───────────────────── */

const APP_MARKUP = `
  <!-- Green Toolbar Header -->
  <div class="encarta-header">
    <div class="header-nav-left">
      <div class="btn-home" id="btnHome" onclick="selectCategory('juega_aprende')" title="Inicio Encarta">
        <div class="btn-home-inner">
          <svg class="w-5 h-5 fill-amber-800" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </div>
      </div>

      <div class="nav-circle-btn" onclick="triggerMenu('Atrás')" title="Atrás">
        <svg class="w-5 h-5 fill-emerald-950" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </div>

      <div class="nav-circle-btn" onclick="triggerMenu('Adelante')" title="Adelante">
        <svg class="w-5 h-5 fill-emerald-950" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
      </div>

      <div class="nav-circle-btn" onclick="triggerMenu('Documento')" title="Documento de lectura">
        <span class="text-emerald-950 text-sm font-bold">📄</span>
      </div>

      <div class="nav-circle-btn" onclick="triggerMenu('Imprimir')" title="Imprimir contenido">
        <span class="text-emerald-950 text-sm font-bold">🖨️</span>
      </div>
    </div>

    <div class="header-center">
      <div class="top-menu-links">
        <span onclick="triggerMenu('Archivo')">Archivo</span>
        <span onclick="triggerMenu('Edición')">Edición</span>
        <span onclick="triggerMenu('Ver')">Ver</span>
        <span onclick="triggerMenu('Favoritos')">Favoritos</span>
        <span onclick="triggerMenu('Herramientas')">Herramientas</span>
        <span onclick="triggerMenu('Ayuda')">?</span>
      </div>
      <div class="search-bar-row">
        <span class="search-label">Buscar</span>
        <div class="search-pill">
          <input type="text" id="searchInput" placeholder="">
          <div class="btn-search-go" id="btnSearchGo">
            <svg class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <div class="text-right">
        <div class="text-[10px] font-bold text-emerald-950 leading-tight">Mi primera</div>
        <div class="text-xl font-black text-black tracking-tighter leading-none font-sans">Encarta</div>
      </div>
      <svg class="w-9 h-9" viewBox="0 0 50 50">
        <path d="M25 10 C10 10, 10 25, 25 25 C40 25, 40 10, 25 10 Z" fill="#76ff03"/>
        <path d="M25 20 C15 35, 25 45, 35 35 C45 25, 35 15, 25 20 Z" fill="#00c853"/>
      </svg>
    </div>
  </div>

  <!-- Main Viewport -->
  <div class="main-viewport">
    <!-- Background SVG Curves -->
    <svg class="bg-curves-svg" viewBox="0 0 980 570" preserveAspectRatio="none">
      <rect width="980" height="570" fill="#ff7f00"/>
      <path d="M0,0 L980,0 L980,120 C680,340 320,180 0,300 Z" fill="#ffb700"/>
      <path d="M0,290 C320,170 680,330 980,110 L980,570 L0,570 Z" fill="#ff8c00"/>
      <path d="M0,570 L980,570 L980,240 C550,500 220,380 0,570 Z" fill="#e65c00"/>
    </svg>

    <!-- LEFT COLUMN (5 Buttons) -->
    <div class="column-3d col-left">

      <!-- Paisajes y regiones -->
      <div class="btn-category-container" id="cat-paisajes" onclick="selectCategory('paisajes')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <defs>
            <linearGradient id="yellowGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#fff566"/>
              <stop offset="100%" stop-color="#ffb300"/>
            </linearGradient>
            <linearGradient id="blueGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#00d2ff"/>
              <stop offset="60%" stop-color="#0066ff"/>
              <stop offset="100%" stop-color="#003db3"/>
            </linearGradient>
          </defs>
          <path class="path-normal" d="M 12 3 H 210 C 215 3 218 6 218 12 V 58 C 218 64 215 67 210 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#yellowGradLeft)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 12 3 H 215 L 255 35 L 215 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#blueGradLeft)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🌍</div>
          <div class="btn-text-label">Paisajes y<br>regiones</div>
        </div>
      </div>

      <!-- Los seres vivos -->
      <div class="btn-category-container" id="cat-seres_vivos" onclick="selectCategory('seres_vivos')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 12 3 H 210 C 215 3 218 6 218 12 V 58 C 218 64 215 67 210 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#yellowGradLeft)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 12 3 H 215 L 255 35 L 215 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#blueGradLeft)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🐅</div>
          <div class="btn-text-label">Los seres<br>vivos</div>
        </div>
      </div>

      <!-- Ciencia y técnica -->
      <div class="btn-category-container" id="cat-ciencia" onclick="selectCategory('ciencia')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 12 3 H 210 C 215 3 218 6 218 12 V 58 C 218 64 215 67 210 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#yellowGradLeft)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 12 3 H 215 L 255 35 L 215 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#blueGradLeft)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🔬</div>
          <div class="btn-text-label">Ciencia y<br>técnica</div>
        </div>
      </div>

      <!-- Matemáticas -->
      <div class="btn-category-container" id="cat-matematicas" onclick="selectCategory('matematicas')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 12 3 H 210 C 215 3 218 6 218 12 V 58 C 218 64 215 67 210 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#yellowGradLeft)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 12 3 H 215 L 255 35 L 215 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#blueGradLeft)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🧮</div>
          <div class="btn-text-label">Matemáticas</div>
        </div>
      </div>

      <!-- Deportes -->
      <div class="btn-category-container" id="cat-deportes" onclick="selectCategory('deportes')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 12 3 H 210 C 215 3 218 6 218 12 V 58 C 218 64 215 67 210 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#yellowGradLeft)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 12 3 H 215 L 255 35 L 215 67 H 12 C 7 67 3 64 3 58 V 12 C 3 6 7 3 12 3 Z" fill="url(#blueGradLeft)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">⚽</div>
          <div class="btn-text-label">Deportes</div>
        </div>
      </div>

    </div>

    <!-- CENTER PANEL -->
    <div class="center-panel-wrapper">
      <div class="center-blue-screen" id="centerScreen">
        <!-- Dynamically populated -->
      </div>
    </div>

    <!-- RIGHT COLUMN (5 Buttons) -->
    <div class="column-3d col-right">

      <!-- Historia -->
      <div class="btn-category-container" id="cat-historia" onclick="selectCategory('historia')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <defs>
            <linearGradient id="yellowGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#fff566"/>
              <stop offset="100%" stop-color="#ffb300"/>
            </linearGradient>
            <linearGradient id="blueGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#00d2ff"/>
              <stop offset="60%" stop-color="#0066ff"/>
              <stop offset="100%" stop-color="#003db3"/>
            </linearGradient>
          </defs>
          <path class="path-normal" d="M 50 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 50 C 45 67 42 64 42 58 V 12 C 42 6 45 3 50 3 Z" fill="url(#yellowGradRight)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 45 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 45 L 5 35 L 45 3 Z" fill="url(#blueGradRight)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🏺</div>
          <div class="btn-text-label">Historia</div>
        </div>
      </div>

      <!-- Nuestra sociedad -->
      <div class="btn-category-container" id="cat-sociedad" onclick="selectCategory('sociedad')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 50 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 50 C 45 67 42 64 42 58 V 12 C 42 6 45 3 50 3 Z" fill="url(#yellowGradRight)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 45 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 45 L 5 35 L 45 3 Z" fill="url(#blueGradRight)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🧑‍🤝‍🧑</div>
          <div class="btn-text-label">Nuestra<br>sociedad</div>
        </div>
      </div>

      <!-- Lengua y literatura -->
      <div class="btn-category-container" id="cat-lengua" onclick="selectCategory('lengua')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 50 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 50 C 45 67 42 64 42 58 V 12 C 42 6 45 3 50 3 Z" fill="url(#yellowGradRight)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 45 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 45 L 5 35 L 45 3 Z" fill="url(#blueGradRight)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🖋️</div>
          <div class="btn-text-label">Lengua y<br>literatura</div>
        </div>
      </div>

      <!-- Las artes -->
      <div class="btn-category-container" id="cat-artes" onclick="selectCategory('artes')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal" d="M 50 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 50 C 45 67 42 64 42 58 V 12 C 42 6 45 3 50 3 Z" fill="url(#yellowGradRight)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active hidden" d="M 45 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 45 L 5 35 L 45 3 Z" fill="url(#blueGradRight)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="btn-icon-no-bg">🎨</div>
          <div class="btn-text-label">Las artes</div>
        </div>
      </div>

      <!-- Juega y aprende (DEFAULT ACTIVE BLUE) -->
      <div class="btn-category-container is-active" id="cat-juega_aprende" onclick="selectCategory('juega_aprende')">
        <svg class="btn-svg-bg" viewBox="0 0 260 70" preserveAspectRatio="none">
          <path class="path-normal hidden" d="M 50 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 50 C 45 67 42 64 42 58 V 12 C 42 6 45 3 50 3 Z" fill="url(#yellowGradRight)" stroke="#32cd32" stroke-width="4"/>
          <path class="path-active" d="M 45 3 H 248 C 253 3 257 6 257 12 V 58 C 257 64 253 67 248 67 H 45 L 5 35 L 45 3 Z" fill="url(#blueGradRight)" stroke="#e0f7ff" stroke-width="4"/>
        </svg>
        <div class="btn-content">
          <div class="az-badge-text">A X Z</div>
          <div class="btn-text-label">Juega y<br>aprende</div>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal Overlay -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="retro-modal-card">
      <div class="retro-modal-header">
        <span id="modalTitle">Actividad Encarta</span>
        <button onclick="closeModal()" class="text-white hover:text-yellow-300 font-bold text-xl px-2">✕</button>
      </div>
      <div class="retro-modal-body" id="modalBody">
        <!-- Content -->
      </div>
    </div>
  </div>
`;

/* ── Behavior ──────────────────────────────────────────────────────────── */

function getCategory(catKey: string): EncartaCategory {
  return CATEGORY_DATA[catKey as EncartaCategoryKey] ?? CATEGORY_DATA[DEFAULT_CATEGORY_KEY];
}

function renderCentralScreen(container: HTMLElement, catKey: string): void {
  const data = getCategory(catKey);
  const screen = container.querySelector<HTMLElement>('#centerScreen');
  if (!screen) return;

  let html = `<div class="text-white text-xl font-extrabold mb-3 pb-2 border-b border-blue-300/40 flex items-center gap-2">
      <span>✨</span> ${data.title}
    </div>`;

  data.items.forEach((item) => {
    const isHighlight = item.highlight ? 'item-highlight' : '';
    html += `
        <div class="blue-list-item ${isHighlight}" onclick="openItemModal('${data.title}', '${item.label}', '${item.desc}')">
          <span class="text-2xl">${item.icon}</span>
          <span>${item.label}</span>
        </div>
      `;
  });

  screen.innerHTML = html;
}

/** Swaps a button between its yellow (normal) and blue (active) SVG paths. */
function setButtonPaths(button: Element, active: boolean): void {
  const pNorm = button.querySelector('.path-normal');
  const pAct = button.querySelector('.path-active');
  pNorm?.classList.toggle('hidden', active);
  pAct?.classList.toggle('hidden', !active);
}

function selectCategory(container: HTMLElement, catKey: string): void {
  playSound('chime');

  container.querySelectorAll('.btn-category-container').forEach((button) => {
    button.classList.remove('is-active');
    setButtonPaths(button, false);
  });

  const activeContainer = container.querySelector(`#cat-${catKey}`);
  if (activeContainer) {
    activeContainer.classList.add('is-active');
    setButtonPaths(activeContainer, true);
  }

  renderCentralScreen(container, catKey);
}

function openItemModal(container: HTMLElement, catTitle: string, itemLabel: string, desc: string): void {
  playSound('click');

  const modalTitle = container.querySelector<HTMLElement>('#modalTitle');
  const modalBody = container.querySelector<HTMLElement>('#modalBody');
  const modalOverlay = container.querySelector<HTMLElement>('#modalOverlay');
  if (!modalTitle || !modalBody || !modalOverlay) return;

  modalTitle.innerText = `${catTitle} - ${itemLabel}`;

  if (itemLabel.includes('Geografía')) {
    modalBody.innerHTML = `
      <div class="text-center">
        <p class="mb-4 text-gray-800 font-semibold">${desc}</p>
        <div class="bg-amber-100 p-4 rounded-xl border-2 border-amber-300 mb-4 shadow-sm">
          <p class="font-extrabold text-lg mb-2 text-emerald-900">🌍 Pregunta de Geografía Encarta:</p>
          <p class="mb-3 text-sm">¿En qué continente se encuentra la selva del Amazonas?</p>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="checkAnswer(true)" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs">América del Sur</button>
            <button onclick="checkAnswer(false)" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs">África</button>
            <button onclick="checkAnswer(false)" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Asia</button>
            <button onclick="checkAnswer(false)" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs">Europa</button>
          </div>
        </div>
        <div id="quizResult" class="min-h-[24px] font-bold"></div>
      </div>
    `;
  } else if (itemLabel.includes('arte')) {
    modalBody.innerHTML = `
      <div class="text-center">
        <p class="mb-3 text-sm text-gray-700">${desc}</p>
        <div class="flex justify-center mb-3">
          <canvas id="artCanvas" width="360" height="180" class="bg-white border-2 border-emerald-600 rounded-lg cursor-crosshair shadow-inner"></canvas>
        </div>
        <p class="text-xs text-gray-500">Haz clic y arrastra con el ratón para pintar en la pizarra.</p>
      </div>
    `;
    setTimeout(() => initCanvas(container), 100);
  } else {
    modalBody.innerHTML = `
      <div class="space-y-3">
        <div class="bg-yellow-100 p-3 rounded-lg border border-yellow-300">
          <p class="font-bold text-amber-900 text-sm">📖 Contenido Didáctico:</p>
          <p class="text-sm text-gray-800 mt-1">${desc}</p>
        </div>
        <p class="text-xs text-gray-600">Módulo interactivo adaptado para educación primaria de 'Mi primera Encarta 2009'.</p>
        <div class="flex justify-end pt-2">
          <button onclick="closeModal()" class="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-1.5 rounded-lg text-xs border border-amber-600">Entendido</button>
        </div>
      </div>
    `;
  }

  modalOverlay.classList.add('active');
}

function checkAnswer(container: HTMLElement, isCorrect: boolean): void {
  const res = container.querySelector<HTMLElement>('#quizResult');
  if (!res) return;

  if (isCorrect) {
    playSound('win');
    res.innerHTML = '<span class="text-emerald-700 font-bold">¡Excelente! 🎉 Respuesta Correcta.</span>';
  } else {
    playSound('click');
    res.innerHTML = '<span class="text-rose-600 font-bold">Inténtalo otra vez ❌</span>';
  }
}

function initCanvas(container: HTMLElement): void {
  const canvas = container.querySelector<HTMLCanvasElement>('#artCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let drawing = false;

  canvas.addEventListener('mousedown', () => {
    drawing = true;
  });
  canvas.addEventListener('mouseup', () => {
    drawing = false;
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.fillStyle = '#0066ff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function closeModal(container: HTMLElement): void {
  playSound('click');
  container.querySelector<HTMLElement>('#modalOverlay')?.classList.remove('active');
}

function triggerMenu(container: HTMLElement, name: string): void {
  playSound('click');
  openItemModal(container, 'Barra de Herramientas', name, `Opciones de navegación: ${name}.`);
}

function performSearch(container: HTMLElement): void {
  const input = container.querySelector<HTMLInputElement>('#searchInput');
  const query = input?.value.trim() ?? '';
  if (query) {
    playSound('chime');
    openItemModal(
      container,
      'Búsqueda Encarta 2009',
      `Resultados para "${query}"`,
      `Buscando temas relacionados con <strong>${query}</strong> en el índice de la enciclopedia.`,
    );
  }
}

/** Hover previews the blue path only for buttons that are not already active. */
function bindCategoryHoverPreview(container: HTMLElement): void {
  container.querySelectorAll('.btn-category-container').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      if (!button.classList.contains('is-active')) setButtonPaths(button, true);
    });
    button.addEventListener('mouseleave', () => {
      if (!button.classList.contains('is-active')) setButtonPaths(button, false);
    });
  });
}

function bindSearch(container: HTMLElement): void {
  container.querySelector<HTMLElement>('#btnSearchGo')?.addEventListener('click', () => performSearch(container));
  container
    .querySelector<HTMLInputElement>('#searchInput')
    ?.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') performSearch(container);
    });
}

/**
 * Handlers referenced by the verbatim `onclick` attributes, published as
 * globals for this app instance.
 */
interface EncartaGlobals {
  selectCategory(catKey: string): void;
  openItemModal(catTitle: string, itemLabel: string, desc: string): void;
  checkAnswer(isCorrect: boolean): void;
  closeModal(): void;
  triggerMenu(name: string): void;
}

function publishGlobals(globals: EncartaGlobals): void {
  // Every property is optional here, so the cast needs no `any`.
  const scope = window as Partial<Record<keyof EncartaGlobals, unknown>>;
  Object.assign(scope, globals);
}

function mountEncarta(container: HTMLElement): void {
  container.className = 'app-window';
  container.innerHTML = APP_MARKUP;

  publishGlobals({
    selectCategory: (catKey: string) => selectCategory(container, catKey),
    openItemModal: (catTitle: string, itemLabel: string, desc: string) =>
      openItemModal(container, catTitle, itemLabel, desc),
    checkAnswer: (isCorrect: boolean) => checkAnswer(container, isCorrect),
    closeModal: () => closeModal(container),
    triggerMenu: (name: string) => triggerMenu(container, name),
  });

  bindCategoryHoverPreview(container);
  bindSearch(container);

  // The replica used window.onload, which has long since fired by the time a
  // user opens the app from the Start Menu.
  renderCentralScreen(container, DEFAULT_CATEGORY_KEY);
}

/* ── Entry point ───────────────────────────────────────────────────────── */

/**
 * Custom launch function that recreates the Encarta 2009 main screen
 * ("Mi Primera Encarta") inside an os-gui window.
 */
export function launchEncarta(): void {
  const $Window = window.$Window;

  if (!$Window) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // ── Create the os-gui window ──
  const $win = $Window({
    title: 'Mi Primera Encarta',
    icons: {
      16: '/images/icons/encarta-16x16.svg',
      32: '/images/icons/encarta-32x32.svg',
    },
    minWidth: 800,
    minHeight: 600,
  });

  $win.css({ width: '1000px', height: '700px' });
  $win.center();
  applyCascadeAndFit($win, 1000, 700);
  registerOsWindow($win, 'encarta', 'Mi Primera Encarta', '/images/icons/encarta-32x32.svg');

  // Mount synchronously. Every design-critical class lives in index.css, so the
  // Encarta 2009 screen paints on the same frame as the window opens instead of
  // waiting on a network round-trip.
  const container = document.createElement('div');
  mountEncarta(container);
  $win.$content.append(container);

  // Tailwind is lazy and optional. The utilities it supplies only decorate the
  // modal bodies and a few icon sizes, so the screen above is already correct
  // and simply gains those utilities once the CDN answers — or never, without
  // breaking anything.
  void withTimeout(ensureTailwind(), TAILWIND_LOAD_TIMEOUT_MS);
}
