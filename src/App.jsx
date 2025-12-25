import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LageroptFeature from './features/lageropt/LageroptFeature'
import LageroptEnhancedFeature from './features/lageropt/LageroptEnhancedFeature'
import RoiFeature from './features/roi/RoiFeature'
import RoiEnhancedFeature from './features/roi/RoiEnhancedFeature'
import AvatarFeature from './features/avatar/AvatarFeature'
import PraxisTwinFeature from './features/praxistwin/PraxisTwinFeature'
import AIGodModeFeature from './features/aigodmode/AIGodModeFeature'
import PraxisManagerFeature from './features/praxismanager/PraxisManagerFeature'
import AIDataCheckFeature from './features/aidatacheck/AIDataCheckFeature'
import KioskFeature from './features/kiosk/KioskFeature'
import AnamneseFeature from './features/anamnese/AnamneseFeature'
import PraxisITFeature from './features/praxisit/PraxisITFeature'
import HomePage from './pages/HomePage'
import PrivacyPage from './pages/PrivacyPage'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/lageropt" element={<LageroptEnhancedFeature />} />
        <Route path="/lageropt-basic" element={<LageroptFeature />} />
        <Route path="/roi" element={<RoiEnhancedFeature />} />
        <Route path="/roi-basic" element={<RoiFeature />} />
        <Route path="/avatar" element={<AvatarFeature />} />
        <Route path="/praxis-twin" element={<PraxisTwinFeature />} />
        <Route path="/ai-god-mode" element={<AIGodModeFeature />} />
        <Route path="/praxis-manager" element={<PraxisManagerFeature />} />
        <Route path="/ai-daten-check" element={<AIDataCheckFeature />} />
        <Route path="/kiosk" element={<KioskFeature />} />
        <Route path="/anamnese" element={<AnamneseFeature />} />
        <Route path="/praxis-it" element={<PraxisITFeature />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
