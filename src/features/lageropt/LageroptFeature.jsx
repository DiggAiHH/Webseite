import { useState } from 'react';
import { validateNumericInput, validateTextInput } from '../../utils/security';

/**
 * LageroptFeature Component
 * Warehouse optimization feature with inventory management
 */
const LageroptFeature = () => {
  const [formData, setFormData] = useState({
    productName: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    dailyUsage: ''
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate product name
    const nameValidation = validateTextInput(formData.productName, 100);
    if (!nameValidation.isValid) {
      newErrors.productName = nameValidation.error;
    }

    // Validate numeric inputs
    const currentStockValidation = validateNumericInput(formData.currentStock, 0, 1000000);
    if (!currentStockValidation.isValid) {
      newErrors.currentStock = currentStockValidation.error;
    }

    const minStockValidation = validateNumericInput(formData.minStock, 0, 1000000);
    if (!minStockValidation.isValid) {
      newErrors.minStock = minStockValidation.error;
    }

    const maxStockValidation = validateNumericInput(formData.maxStock, 0, 1000000);
    if (!maxStockValidation.isValid) {
      newErrors.maxStock = maxStockValidation.error;
    }

    const dailyUsageValidation = validateNumericInput(formData.dailyUsage, 0, 100000);
    if (!dailyUsageValidation.isValid) {
      newErrors.dailyUsage = dailyUsageValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculate optimization
    const current = currentStockValidation.value;
    const min = minStockValidation.value;
    const max = maxStockValidation.value;
    const daily = dailyUsageValidation.value;

    const daysUntilMinStock = daily > 0 ? Math.floor((current - min) / daily) : Infinity;
    const recommendedOrder = Math.max(0, max - current);
    const optimizationScore = current >= min && current <= max ? 100 : 
      current < min ? 40 : 70;

    setResult({
      daysUntilMinStock,
      recommendedOrder,
      optimizationScore,
      status: current < min ? 'critical' : current > max ? 'excess' : 'optimal'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lageroptimierung
        </h1>
        <p className="text-gray-600">
          Optimieren Sie Ihre Lagerbestände mit KI-gestützten Vorhersagen und Empfehlungen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bestandsdaten eingeben
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produktname
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="z.B. Medizinische Handschuhe"
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aktueller Bestand
              </label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="0"
              />
              {errors.currentStock && (
                <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mindestbestand
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                  placeholder="0"
                />
                {errors.minStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximalbestand
                </label>
                <input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                  placeholder="0"
                />
                {errors.maxStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxStock}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Täglicher Verbrauch
              </label>
              <input
                type="number"
                name="dailyUsage"
                value={formData.dailyUsage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="0"
              />
              {errors.dailyUsage && (
                <p className="mt-1 text-sm text-red-600">{errors.dailyUsage}</p>
              )}
            </div>

            <button type="submit" className="w-full btn-primary">
              Optimierung berechnen
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Optimierungsergebnisse
          </h2>
          {result ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                result.status === 'optimal' ? 'bg-medical-accent-50 border border-medical-accent-200' :
                result.status === 'critical' ? 'bg-red-50 border border-red-200' :
                'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    result.status === 'optimal' ? 'bg-medical-accent-600' :
                    result.status === 'critical' ? 'bg-red-600' :
                    'bg-yellow-600'
                  }`}></div>
                  <span className="font-semibold">
                    {result.status === 'optimal' ? 'Optimal' :
                     result.status === 'critical' ? 'Kritisch' : 'Überbestand'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Optimierungsscore: {result.optimizationScore}%
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tage bis Mindestbestand:</span>
                  <span className="font-semibold text-gray-900">
                    {result.daysUntilMinStock === Infinity ? '∞' : result.daysUntilMinStock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Empfohlene Bestellung:</span>
                  <span className="font-semibold text-gray-900">
                    {result.recommendedOrder} Einheiten
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Empfehlungen:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {result.status === 'critical' && (
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">⚠️</span>
                      <span>Dringend nachbestellen! Bestand unter Minimum.</span>
                    </li>
                  )}
                  {result.status === 'excess' && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span>Überbestand vorhanden. Verbrauch erhöhen oder Bestand reduzieren.</span>
                    </li>
                  )}
                  {result.status === 'optimal' && (
                    <li className="flex items-start gap-2">
                      <span className="text-medical-accent-600">✓</span>
                      <span>Bestand im optimalen Bereich. Weiter so!</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Geben Sie Bestandsdaten ein, um eine Optimierung zu berechnen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LageroptFeature;
