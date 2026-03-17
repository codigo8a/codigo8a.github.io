import { useLanguage } from '../context/LanguageContext';

type TranslationKeys = 
  | 'welcome' | 'welcomeTip' | 'nextTip' | 'whatsNew' | 'onlineRegistration' 
  | 'close' | 'showWelcomeScreen' | 'settings' | 'language' | 'selectLanguage' 
  | 'spanish' | 'english' | 'apply' | 'cancel' | 'search' | 'searchPlaceholder' 
  | 'typeToSearch' | 'noFilesFound' | 'name' | 'location' | 'date' | 'type' 
  | 'title' | 'content' | 'ready' | 'noSearch' | 'results' | 'tableView' | 'treeView' | 'didYouKnow' | 'preview' | 'source' | 'objects' | 'folders';

const translations: Record<string, Record<'es' | 'en', string>> = {
  welcome: {
    es: "Bienvenido a juandavid.site",
    en: "Welcome to juandavid.site"
  },
  objects: {
    es: "objeto(s)",
    en: "object(s)"
  },
  folders: {
    es: "carpeta(s)",
    en: "folder(s)"
  },
  preview: {
    es: "Vista Previa",
    en: "Preview"
  },
  source: {
    es: "Código Fuente",
    en: "Source"
  },
  welcomeTip: {
    es: "¿Sabías esto de mí?",
    en: "Did you know this about me?"
  },
  didYouKnow: {
    es: "¿Sabías esto de mí?",
    en: "Did you know this about me?"
  },
  nextTip: {
    es: "Siguiente Tip",
    en: "Next Tip"
  },
  whatsNew: {
    es: "Qué hay de nuevo",
    en: "What's New"
  },
  onlineRegistration: {
    es: "Registro en línea",
    en: "Online Registration"
  },
  close: {
    es: "Cerrar",
    en: "Close"
  },
  showWelcomeScreen: {
    es: "Mostrar esta pantalla de bienvenida al iniciar Windows",
    en: "Show this Welcome Screen next time you start Windows"
  },
  settings: {
    es: "Configuración",
    en: "Settings"
  },
  language: {
    es: "Idioma",
    en: "Language"
  },
  selectLanguage: {
    es: "Seleccione el idioma:",
    en: "Select language:"
  },
  spanish: {
    es: "Español",
    en: "Spanish"
  },
  english: {
    es: "Inglés",
    en: "English"
  },
  apply: {
    es: "Aceptar",
    en: "Apply"
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel"
  },
  search: {
    es: "Buscar",
    en: "Search"
  },
  searchPlaceholder: {
    es: "Escribe una palabra...",
    en: "Type a word..."
  },
  typeToSearch: {
    es: "Escribe una palabra para buscar en los archivos",
    en: "Type a word to search in files"
  },
  noFilesFound: {
    es: "No se encontraron archivos con",
    en: "No files found matching"
  },
  name: {
    es: "Nombre",
    en: "Name"
  },
  location: {
    es: "Ubicación",
    en: "Location"
  },
  date: {
    es: "Fecha",
    en: "Date"
  },
  type: {
    es: "Tipo",
    en: "Type"
  },
  title: {
    es: "Título",
    en: "Title"
  },
  content: {
    es: "Contenido",
    en: "Content"
  },
  ready: {
    es: "Listo",
    en: "Ready"
  },
  noSearch: {
    es: "Sin búsqueda",
    en: "No search"
  },
  results: {
    es: "resultados",
    en: "results"
  },
  tableView: {
    es: "Vista de Tabla",
    en: "Table View"
  },
  treeView: {
    es: "Vista de Árbol",
    en: "Tree View"
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  const currentLang = (language === 'es' || language === 'en') ? language : 'en';

  const t = (key: TranslationKeys) => {
    return translations[key]?.[currentLang] || key;
  };

  return { t };
};
