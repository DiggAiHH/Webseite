import { useState } from 'react';
import { validateNumericInput, validateTextInput } from '../../utils/security';

/**
 * LageroptEnhancedFeature Component
 * Enhanced warehouse optimization with expiry tracking (MHD), batch numbers, and location management
 * Compliant with MDR requirements for medical device inventory management
 */
const LageroptEnhancedFeature = () => {
  const [formData, setFormData] = useState({
    productName: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    dailyUsage: '',
    expiryDate: '',
    batchNumber: '',
    location: '',
    responsiblePerson: ''
  });

  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  /**
   * Calculate expiry status based on MHD (Mindesthaltbarkeitsdatum)
   * Red: Expired, Yellow: ≤ 28 days (4 weeks), Green: > 28 days
   */
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', color: 'gray', days: null };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', color: 'red', days: diffDays, label: 'Abgelaufen' };
    } else if (diffDays <= 28) {
      return { status: 'expiring-soon', color: 'yellow', days: diffDays, label: 'Bald ablaufend' };
    } else {
      return { status: 'ok', color: 'green', days: diffDays, label: 'OK' };
    }
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

    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Ablaufdatum ist erforderlich';
    }

    // Validate batch number
    const batchValidation = validateTextInput(formData.batchNumber, 50);
    if (!batchValidation.isValid) {
      newErrors.batchNumber = batchValidation.error;
    }

    // Validate location
    const locationValidation = validateTextInput(formData.location, 100);
    if (!locationValidation.isValid) {
      newErrors.location = locationValidation.error;
    }

    // Validate responsible person
    const personValidation = validateTextInput(formData.responsiblePerson, 100);
    if (!personValidation.isValid) {
      newErrors.responsiblePerson = personValidation.error;
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

    const expiryStatus = getExpiryStatus(formData.expiryDate);

    // Add item to list
    const newItem = {
      id: Date.now(),
      name: nameValidation.sanitized,
      currentStock: current,
      minStock: min,
      maxStock: max,
      dailyUsage: daily,
      expiryDate: formData.expiryDate,
      batchNumber: batchValidation.sanitized,
      location: locationValidation.sanitized,
      responsiblePerson: personValidation.sanitized,
      expiryStatus,
      daysUntilMinStock,
      recommendedOrder,
      optimizationScore,
      stockStatus: current < min ? 'critical' : current > max ? 'excess' : 'optimal'
    };

    setItems(prev => [...prev, newItem]);
    setResult(newItem);

    // Reset form
    setFormData({
      productName: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      dailyUsage: '',
      expiryDate: '',
      batchNumber: '',
      location: '',
      responsiblePerson: ''
    });
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (result && result.id === id) {
      setResult(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Lageroptimierung mit MHD-Tracking
        </h1>
        <p className="text-gray-600">
          Optimieren Sie Ihre Lagerbestände mit automatischer Ablaufdatum-Überwachung (MHD) 
          und KI-gestützten Empfehlungen gemäß MDR-Anforderungen.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Input Form */}
        <div className="lg:col-span-1 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Artikel hinzufügen
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produktname *
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
                Ablaufdatum (MHD) *
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chargennummer *
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="z.B. CH-2024-001"
              />
              {errors.batchNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.batchNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lagerort *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="z.B. Raum A, Regal 3, Fach 2"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verantwortliche Person *
              </label>
              <input
                type="text"
                name="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                placeholder="z.B. Dr. Müller"
              />
              {errors.responsiblePerson && (
                <p className="mt-1 text-sm text-red-600">{errors.responsiblePerson}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aktueller Bestand *
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
                  Min. Bestand *
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
                  Max. Bestand *
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
                Täglicher Verbrauch *
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
              Artikel hinzufügen
            </button>
          </form>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lagerbestand ({items.length} Artikel)
          </h2>
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p>Noch keine Artikel hinzugefügt</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.expiryStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                          item.expiryStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.expiryStatus.label}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.stockStatus === 'optimal' ? 'bg-medical-accent-100 text-medical-accent-800' :
                          item.stockStatus === 'critical' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.stockStatus === 'optimal' ? 'Optimal' :
                           item.stockStatus === 'critical' ? 'Kritisch' : 'Überbestand'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><span className="font-medium">Charge:</span> {item.batchNumber}</div>
                        <div><span className="font-medium">Lagerort:</span> {item.location}</div>
                        <div>
                          <span className="font-medium">MHD:</span> {
                            (() => {
                              try {
                                const date = new Date(item.expiryDate);
                                if (isNaN(date.getTime())) {
                                  return 'Ungültiges Datum';
                                }
                                return `${date.toLocaleDateString('de-DE')} (${item.expiryStatus.days} Tage)`;
                              } catch (e) {
                                return 'Ungültiges Datum';
                              }
                            })()
                          }
                        </div>
                        <div><span className="font-medium">Verantwortlich:</span> {item.responsiblePerson}</div>
                        <div><span className="font-medium">Bestand:</span> {item.currentStock} / {item.minStock}-{item.maxStock}</div>
                        <div><span className="font-medium">Verbrauch:</span> {item.dailyUsage}/Tag</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                      aria-label="Artikel löschen"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Warnings */}
                  {(item.expiryStatus.color === 'red' || item.expiryStatus.color === 'yellow' || item.stockStatus === 'critical') && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Warnungen:</h4>
                      <ul className="space-y-1 text-sm">
                        {item.expiryStatus.color === 'red' && (
                          <li className="flex items-start gap-2 text-red-600">
                            <span>⚠️</span>
                            <span>Produkt ist abgelaufen! Sofort entsorgen gemäß MDR-Vorgaben.</span>
                          </li>
                        )}
                        {item.expiryStatus.color === 'yellow' && (
                          <li className="flex items-start gap-2 text-yellow-600">
                            <span>⚠️</span>
                            <span>Produkt läuft in {item.expiryStatus.days} Tagen ab. Bald verbrauchen oder aussondern.</span>
                          </li>
                        )}
                        {item.stockStatus === 'critical' && (
                          <li className="flex items-start gap-2 text-red-600">
                            <span>⚠️</span>
                            <span>Bestand unter Minimum! Empfohlene Nachbestellung: {item.recommendedOrder} Einheiten.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MDR Compliance Notice */}
      <div className="card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-medical-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          MDR-Konformität & Regulatorische Hinweise
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Medizinprodukte-Verordnung (EU) 2017/745:</strong> Diese Software unterstützt bei der Dokumentation 
            und Nachverfolgbarkeit von Medizinprodukten. Die korrekte Anwendung liegt in der Verantwortung des Anwenders.
          </p>
          <p>
            <strong>Chargenverfolgung:</strong> Alle Chargen müssen gemäß MDR Anhang VII dokumentiert werden. 
            Bei Rückrufen oder Nebenwirkungen müssen betroffene Produkte eindeutig identifizierbar sein.
          </p>
          <p>
            <strong>Ablaufdatum (MHD):</strong> Produkte nach Ablauf des MHD dürfen nicht mehr verwendet werden. 
            Die Entsorgung muss dokumentiert und gemäß lokaler Vorschriften erfolgen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LageroptEnhancedFeature;
