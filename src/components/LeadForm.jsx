import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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
  const [form, setForm] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

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
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Anfrageformular">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-email">
            E-Mail *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
            maxLength={254}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-org">
            Praxis / Einrichtung *
          </label>
          <input
            id="lead-org"
            name="organisation"
            type="text"
            autoComplete="organization"
            value={form.organisation}
            onChange={update('organisation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
            maxLength={200}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="lead-phone">
            Telefon (optional)
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
          Nachricht (optional)
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={update('message')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue-500"
          placeholder="Worum geht es konkret (z.B. Anzahl Standorte, Fachrichtung, gewünschter Starttermin)?"
          maxLength={2000}
        />
      </div>

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
          Ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden. Details in der{' '}
          <Link to="/privacy" className="text-medical-blue-600 hover:underline">Datenschutzerklärung</Link>.
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
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center justify-center px-6 py-3 bg-medical-accent-600 text-white rounded-lg hover:bg-medical-accent-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sende…' : 'Anfrage senden'}
      </button>
    </form>
  )
}
