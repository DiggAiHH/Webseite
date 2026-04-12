import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import deTranslation from '../public/locales/de/translation.json';
import enTranslation from '../public/locales/en/translation.json';
import arTranslation from '../public/locales/ar/translation.json';
import { getI18nDebugFlag } from './utils/i18nDebug';

const RTL_LANGUAGES = new Set(['ar']);
const SUPPORTED_LANGUAGES = ['de', 'en', 'ar'];
const LANGUAGE_STORAGE_KEY = 'i18nextLng';

const resources = {
  de: { translation: deTranslation },
  en: { translation: enTranslation },
  ar: { translation: arTranslation },
};

function normalizeLanguage(language) {
  return String(language || 'de').split('-')[0];
}

function getSupportedLanguage(language) {
  const normalizedLanguage = normalizeLanguage(language);
  return SUPPORTED_LANGUAGES.includes(normalizedLanguage) ? normalizedLanguage : null;
}

function detectInitialLanguage() {
  if (typeof window !== 'undefined') {
    const searchLanguage = new URLSearchParams(window.location.search).get('lng');
    const supportedSearchLanguage = getSupportedLanguage(searchLanguage);
    if (supportedSearchLanguage) {
      return supportedSearchLanguage;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const supportedStoredLanguage = getSupportedLanguage(storedLanguage);
    if (supportedStoredLanguage) {
      return supportedStoredLanguage;
    }
  }

  if (typeof navigator !== 'undefined') {
    const browserLanguages = Array.isArray(navigator.languages) ? navigator.languages : [navigator.language];
    for (const browserLanguage of browserLanguages) {
      const supportedBrowserLanguage = getSupportedLanguage(browserLanguage);
      if (supportedBrowserLanguage) {
        return supportedBrowserLanguage;
      }
    }
  }

  if (typeof document !== 'undefined') {
    const supportedDocumentLanguage = getSupportedLanguage(document.documentElement.lang);
    if (supportedDocumentLanguage) {
      return supportedDocumentLanguage;
    }
  }

  return 'de';
}

function applyDocumentLanguage(language) {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedLanguage = normalizeLanguage(language);
  document.documentElement.lang = normalizedLanguage;
  document.documentElement.dir = RTL_LANGUAGES.has(normalizedLanguage) ? 'rtl' : 'ltr';
}

function persistLanguage(language) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: detectInitialLanguage(),
      supportedLngs: SUPPORTED_LANGUAGES,
      fallbackLng: 'de',
      load: 'languageOnly',
      nonExplicitSupportedLngs: true,
      initImmediate: false,
      debug: getI18nDebugFlag(),
      interpolation: {
        escapeValue: false,
      },
    });
}

i18n.off('languageChanged', applyDocumentLanguage);
i18n.off('languageChanged', persistLanguage);
i18n.on('languageChanged', applyDocumentLanguage);
i18n.on('languageChanged', persistLanguage);
applyDocumentLanguage(i18n.resolvedLanguage || i18n.language || 'de');
persistLanguage(i18n.resolvedLanguage || i18n.language || 'de');

export default i18n;
