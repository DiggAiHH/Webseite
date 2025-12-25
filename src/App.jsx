import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LageroptFeature from './features/lageropt/LageroptFeature'
import LageroptEnhancedFeature from './features/lageropt/LageroptEnhancedFeature'
import RoiFeature from './features/roi/RoiFeature'
import RoiEnhancedFeature from './features/roi/RoiEnhancedFeature'
import AvatarFeature from './features/avatar/AvatarFeature'
import PraxisTwinFeature from './features/praxistwin/PraxisTwinFeature'
import AIGodModeFeature from './features/aigodmode/AIGodModeFeature'
import HomePage from './pages/HomePage'
import PrivacyPage from './pages/PrivacyPage'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lageropt" element={<LageroptEnhancedFeature />} />
        <Route path="/lageropt-basic" element={<LageroptFeature />} />
        <Route path="/roi" element={<RoiEnhancedFeature />} />
        <Route path="/roi-basic" element={<RoiFeature />} />
        <Route path="/avatar" element={<AvatarFeature />} />
        <Route path="/praxis-twin" element={<PraxisTwinFeature />} />
        <Route path="/ai-god-mode" element={<AIGodModeFeature />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
