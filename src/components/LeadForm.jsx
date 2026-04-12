import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const DEFAULT_ENDPOINT = '/api/lead'

const initialState = {
  email: '',
  organisation: '',
  phone: '',
  message: '',
  consent: false,
  hp: ''
}

/**
 * LeadForm
 * DSGVO-minimiertes Anfrageformular. Sendet Daten same-origin an /api/lead.
 */
export default function LeadForm({ productId = '', endpoint = DEFAULT_ENDPOINT, onSuccess }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const requiredFieldsTotal = 3

  const requiredFieldsFilled = useMemo(() => {
    let count = 0
    if (form.email.trim().length > 3) count += 1
    if (form.organisation.trim().length > 1) count += 1
    if (form.consent === true) count += 1
    return count
  }, [form.email, form.organisation, form.consent])

  const canSubmit = useMemo(() => {
    return (
      form.email.trim().length > 3 &&
      form.organisation.trim().length > 1 &&
      form.consent === true &&
      !isSubmitting
    )
  }, [form, isSubmitting])

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'idle', message: '' })

    if (!canSubmit) {
      setStatus({ type: 'error', message: 'Bitte füllen Sie Pflichtfelder aus und bestätigen Sie die Einwilligung.' })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          organisation: form.organisation,
          phone: form.phone,
          message: form.message,
          productId,
          consent: form.consent,
          hp: form.hp
        })
      })

      if (response.status === 204) {
        setStatus({ type: 'success', message: 'Vielen Dank. Ihre Anfrage wurde übermittelt.' })
        onSuccess?.({ requestId: '' })
        setForm(initialState)
        return
      }

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const requestId = data?.requestId ? ` (ID: ${data.requestId})` : ''
        if (response.status === 503) {
          setStatus({ type: 'error', message: `Service ist aktuell nicht konfiguriert${requestId}. Bitte nutzen Sie den Kontaktweg im Impressum.` })
        } else {
          setStatus({ type: 'error', message: `Anfrage konnte nicht gesendet werden${requestId}. Bitte prüfen Sie Ihre Eingaben.` })
        }
        return
      }

      const requestId = data?.requestId ? ` (ID: ${data.requestId})` : ''
      setStatus({ type: 'success', message: `Vielen Dank. Ihre Anfrage wurde übermittelt${requestId}.` })
      onSuccess?.({ requestId: data?.requestId ?? '' })
      setForm(initialState)
    } catch (_err) {
      setStatus({ type: 'error', message: 'Netzwerkfehler. Bitte versuchen Sie es erneut.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label={t('contact.form.ariaLabel', 'Anfrageformular')}>
      <p className="text-xs text-gray-600" aria-live="polite">
        Pflichtfelder erfuellt: {requiredFieldsFilled} von {requiredFieldsTotal}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-email">
            {t('contact.form.email')} *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            aria-describedby="lead-email-hint"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
            maxLength={254}
            required
          />
          <p id="lead-email-hint" className="mt-1 text-xs text-gray-500">
            Wird nur fuer die Antwort auf Ihre Anfrage verwendet.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-org">
            {t('contact.form.organisation')} *
          </label>
          <input
            id="lead-org"
            name="organisation"
            type="text"
            autoComplete="organization"
            value={form.organisation}
            onChange={update('organisation')}
            aria-describedby="lead-org-hint"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
            maxLength={200}
            required
          />
          <p id="lead-org-hint" className="mt-1 text-xs text-gray-500">
            Hilft uns, die passende Loesung schneller einzuordnen.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-phone">
            {t('contact.form.phone')}
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
            maxLength={50}
          />
        </div>
        <div className="hidden">
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-hp">
            Website
          </label>
          <input
            id="lead-hp"
            name="hp"
            type="text"
            value={form.hp}
            onChange={update('hp')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-message">
          {t('contact.form.message')}
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={update('message')}
          aria-describedby="lead-message-hint"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
          placeholder={t('contact.form.messagePlaceholder', 'Worum geht es konkret?')}
          maxLength={2000}
        />
        <p id="lead-message-hint" className="mt-1 text-xs text-gray-500">
          Keine Gesundheitsdaten eintragen. Fokus auf Ziel, Zeitplan und Integrationen.
        </p>
      </div>

      {isSubmitting && (
        <div className="bg-medical-blue-50 border border-medical-blue-200 text-medical-blue-900 rounded-lg p-3 text-sm" role="status" aria-live="polite">
          Anfrage wird verarbeitet und intern weitergeleitet.
        </div>
      )}

      <div className="flex items-start gap-3">
        <input
          id="lead-consent"
          type="checkbox"
          checked={form.consent}
          onChange={update('consent')}
          className="mt-1 h-4 w-4 text-medical-blue-600 rounded border-gray-300 focus:ring-medical-blue-500"
          required
        />
        <label htmlFor="lead-consent" className="text-sm text-gray-700">
          {t('contact.form.consent')}{' '}
          <Link to="/privacy" className="text-medical-blue-600 hover:underline">{t('footer.privacy')}</Link>.
        </label>
      </div>

      {status.type !== 'idle' && (
        <div
          className={
            status.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 text-sm'
              : 'bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm'
          }
          role={status.type === 'error' ? 'alert' : 'status'}
          aria-live={status.type === 'error' ? 'assertive' : 'polite'}
        >
          <div className="flex items-start gap-2">
            {status.type === 'success' ? (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p>{status.message}</p>
              {status.type === 'error' ? (
                <p className="mt-1">
                  Wenn das Problem bleibt: <a href="mailto:kontakt@diggaihh.de" className="underline">kontakt@diggaihh.de</a>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center justify-center px-6 py-3 bg-medical-accent-600 text-white rounded-lg hover:bg-medical-accent-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
      </button>
    </form>
  )
}
