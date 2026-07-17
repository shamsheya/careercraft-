import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HRRound from './pages/HRRound';
import TechnicalRound from './pages/TechnicalRound';
import GDRound from './pages/GDRound';
import AptitudeRound from './pages/AptitudeRound';
import DailyChallenges from './pages/DailyChallenges';
import Leaderboard from './pages/Leaderboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewTips from './pages/InterviewTips';
import Login from './pages/Login';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { state, isAuthLoading } = useApp();
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-neon-pink/30">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🚀</div>
          <div className="flex items-center justify-center gap-3 text-white">
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-lg font-semibold">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hr" element={<HRRound />} />
              <Route path="/technical" element={<TechnicalRound />} />
              <Route path="/gd" element={<GDRound />} />
              <Route path="/aptitude" element={<AptitudeRound />} />
              <Route path="/challenges" element={<DailyChallenges />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/resume" element={<ResumeAnalyzer />} />
              <Route path="/tips" element={<InterviewTips />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
