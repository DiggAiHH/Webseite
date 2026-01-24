import '@testing-library/jest-dom/vitest'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Initialize i18n for tests with German translations (synchronous)
i18n.use(initReactI18next).init({
  lng: 'de',
  fallbackLng: 'de',
  ns: ['translation'],
  defaultNS: 'translation',
  initImmediate: false,  // Important: sync initialization for tests
  resources: {
    de: {
      translation: {
        nav: {
          home: 'Startseite',
          products: 'Produkte',
          contact: 'Kontakt',
          privacy: 'Datenschutz',
          impressum: 'Impressum',
          security: 'Sicherheit'
        },
        contact: {
          title: 'Kontakt',
          subtitle: 'Wir freuen uns auf Ihre Nachricht',
          form: {
            email: 'E-Mail',
            organisation: 'Praxis / Einrichtung',
            phone: 'Telefon',
            message: 'Nachricht',
            consent: 'Ich willige ein, dass meine Daten zur Bearbeitung meiner Anfrage verarbeitet werden.',
            submit: 'Anfrage senden',
            sending: 'Wird gesendet...',
            success: 'Ihre Anfrage wurde erfolgreich übermittelt.',
            error: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
            errorNotConfigured: 'Der Server ist noch nicht konfiguriert. Bitte versuchen Sie es später.',
            ariaLabel: 'Anfrageformular'
          }
        },
        privacy: {
          banner: {
            title: 'Datenschutzhinweis',
            text: 'Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten.',
            accept: 'Alle akzeptieren',
            reject: 'Nur notwendige',
            settings: 'Einstellungen'
          }
        },
        products: {
          title: 'Unsere Produkte',
          loading: 'Produkte werden geladen...',
          error: 'Fehler beim Laden der Produkte'
        },
        impressum: {
          title: 'Impressum'
        },
        privacyPage: {
          title: 'Datenschutzerklärung'
        },
        footer: {
          copyright: '© 2026 DiggAiHH | Inhaber: Laith Alshdaifat',
          skipToMain: 'Zum Hauptinhalt springen',
          privacy: 'Datenschutz'
        },
        common: {
          loading: 'Laden...',
          error: 'Fehler',
          close: 'Schließen'
        }
      }
    }
  },
  interpolation: {
    escapeValue: false
  }
})

export { i18n }
