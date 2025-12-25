import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LageroptFeature from './features/lageropt/LageroptFeature'
import RoiFeature from './features/roi/RoiFeature'
import AvatarFeature from './features/avatar/AvatarFeature'
import HomePage from './pages/HomePage'
import PrivacyPage from './pages/PrivacyPage'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lageropt" element={<LageroptFeature />} />
        <Route path="/roi" element={<RoiFeature />} />
        <Route path="/avatar" element={<AvatarFeature />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
