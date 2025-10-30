// Обновленный App.tsx с роутами для теста личности

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PersonalityTest } from './components/personality/PersonalityTest';
import { PersonalityResult } from './components/personality/PersonalityResult';
import { PersonalityHistory } from './components/personality/PersonalityHistory';
import { AstrologyPage } from './components/astrology/AstrologyPage';
import { JobSearchDashboard } from './components/jobs/JobSearchDashboard';
import { JobSearchPreview } from './components/jobs/JobSearchPreview';
import { UIShowcase } from './components/ui/UIShowcase';
import { LandingPage } from './components/home/LandingPage';
import { VibeGenerator } from './components/vibe/VibeGenerator';
import { AudioTest } from './components/audio/AudioTest';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          
          {/* Защищенные роуты */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personality/test"
            element={
              <ProtectedRoute>
                <PersonalityTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personality/result"
            element={
              <ProtectedRoute>
                <PersonalityResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personality/history"
            element={
              <ProtectedRoute>
                <PersonalityHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/astrology"
            element={
              <ProtectedRoute>
                <AstrologyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vibe"
            element={
              <ProtectedRoute>
                <VibeGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobSearchDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/preview"
            element={
              <ProtectedRoute>
                <JobSearchPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ui-showcase"
            element={
              <ProtectedRoute>
                <UIShowcase />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <div style={{ padding: '20px' }}>Страница компаний (скоро появится)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-cv-analysis"
            element={
              <ProtectedRoute>
                <div style={{ padding: '20px' }}>AI анализ резюме (скоро появится)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/mock-interview"
            element={
              <ProtectedRoute>
                <div style={{ padding: '20px' }}>Пробное интервью (скоро появится)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-coach"
            element={
              <ProtectedRoute>
                <div style={{ padding: '20px' }}>Карьерный коуч (скоро появится)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/audio-test"
            element={
              <ProtectedRoute>
                <AudioTest />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
