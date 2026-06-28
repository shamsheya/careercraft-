import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
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

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
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
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
