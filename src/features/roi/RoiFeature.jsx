import { useState } from 'react';
import { validateNumericInput } from '../../utils/security';

/**
 * RoiFeature Component
 * ROI Calculator for digital health solutions
 */
const RoiFeature = () => {
  const [formData, setFormData] = useState({
    initialInvestment: '',
    monthlyCost: '',
    monthlyRevenue: '',
    monthlySavings: '',
    timeframe: '12'
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate all numeric inputs
    const initialValidation = validateNumericInput(formData.initialInvestment, 0, 10000000);
    if (!initialValidation.isValid) {
      newErrors.initialInvestment = initialValidation.error;
    }

    const costValidation = validateNumericInput(formData.monthlyCost, 0, 1000000);
    if (!costValidation.isValid) {
      newErrors.monthlyCost = costValidation.error;
    }

    const revenueValidation = validateNumericInput(formData.monthlyRevenue, 0, 1000000);
    if (!revenueValidation.isValid) {
      newErrors.monthlyRevenue = revenueValidation.error;
    }

    const savingsValidation = validateNumericInput(formData.monthlySavings, 0, 1000000);
    if (!savingsValidation.isValid) {
      newErrors.monthlySavings = savingsValidation.error;
    }

    const timeframeValidation = validateNumericInput(formData.timeframe, 1, 120);
    if (!timeframeValidation.isValid) {
      newErrors.timeframe = timeframeValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculate ROI
    const initial = initialValidation.value;
    const monthlyCost = costValidation.value;
    const monthlyRevenue = revenueValidation.value;
    const monthlySavings = savingsValidation.value;
    const months = timeframeValidation.value;

    const totalCosts = initial + (monthlyCost * months);
    const totalBenefits = (monthlyRevenue + monthlySavings) * months;
    const netProfit = totalBenefits - totalCosts;
    const roi = totalCosts > 0 ? ((netProfit / totalCosts) * 100) : 0;
    const breakEvenMonth = (monthlyRevenue + monthlySavings - monthlyCost) > 0 
      ? Math.ceil(initial / (monthlyRevenue + monthlySavings - monthlyCost))
      : -1;

    setResult({
      totalCosts,
      totalBenefits,
      netProfit,
      roi,
      breakEvenMonth
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ROI-Rechner
        </h1>
        <p className="text-gray-600">
          Berechnen Sie den Return on Investment für Ihre digitalen Gesundheitslösungen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Investitionsdaten
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initiale Investition (€)
              </label>
              <input
                type="number"
                name="initialInvestment"
                value={formData.initialInvestment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="50000"
              />
              {errors.initialInvestment && (
                <p className="mt-1 text-sm text-red-600">{errors.initialInvestment}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monatliche Kosten (€)
              </label>
              <input
                type="number"
                name="monthlyCost"
                value={formData.monthlyCost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="2000"
              />
              {errors.monthlyCost && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyCost}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monatlicher Umsatz (€)
              </label>
              <input
                type="number"
                name="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="5000"
              />
              {errors.monthlyRevenue && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyRevenue}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monatliche Einsparungen (€)
              </label>
              <input
                type="number"
                name="monthlySavings"
                value={formData.monthlySavings}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="1000"
              />
              {errors.monthlySavings && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlySavings}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zeitraum (Monate)
              </label>
              <select
                name="timeframe"
                value={formData.timeframe}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
              >
                <option value="12">12 Monate</option>
                <option value="24">24 Monate</option>
                <option value="36">36 Monate</option>
                <option value="60">60 Monate</option>
              </select>
            </div>

            <button type="submit" className="w-full btn-primary">
              ROI berechnen
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ROI-Analyse
          </h2>
          {result ? (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg text-center ${
                result.roi >= 0 ? 'bg-medical-accent-50 border border-medical-accent-200' :
                'bg-red-50 border border-red-200'
              }`}>
                <div className="text-4xl font-bold mb-2" style={{
                  color: result.roi >= 0 ? '#059669' : '#dc2626'
                }}>
                  {result.roi.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Return on Investment</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Gesamtkosten:</span>
                  <span className="font-semibold text-gray-900">
                    {result.totalCosts.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Gesamtertrag:</span>
                  <span className="font-semibold text-gray-900">
                    {result.totalBenefits.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-700">Nettogewinn:</span>
                  <span className={`font-semibold ${
                    result.netProfit >= 0 ? 'text-medical-accent-600' : 'text-red-600'
                  }`}>
                    {result.netProfit >= 0 ? '+' : ''}{result.netProfit.toLocaleString('de-DE')} €
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Break-Even:</span>
                  <span className="font-semibold text-gray-900">
                    {result.breakEvenMonth > 0 
                      ? `${result.breakEvenMonth} Monate` 
                      : 'Nicht erreichbar'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Bewertung:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {result.roi >= 100 && (
                    <li className="flex items-start gap-2">
                      <span className="text-medical-accent-600">✓</span>
                      <span>Ausgezeichnete Investition! ROI über 100%.</span>
                    </li>
                  )}
                  {result.roi >= 50 && result.roi < 100 && (
                    <li className="flex items-start gap-2">
                      <span className="text-medical-accent-600">✓</span>
                      <span>Gute Investition mit solidem ROI.</span>
                    </li>
                  )}
                  {result.roi >= 0 && result.roi < 50 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span>Positive Rendite, aber Verbesserungspotenzial.</span>
                    </li>
                  )}
                  {result.roi < 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">⚠️</span>
                      <span>Investition nicht rentabel im gewählten Zeitraum.</span>
                    </li>
                  )}
                  {result.breakEvenMonth > 0 && result.breakEvenMonth <= 24 && (
                    <li className="flex items-start gap-2">
                      <span className="text-medical-accent-600">✓</span>
                      <span>Break-Even wird schnell erreicht.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p>Geben Sie Investitionsdaten ein, um den ROI zu berechnen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoiFeature;
