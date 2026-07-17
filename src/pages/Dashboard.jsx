import { useState, useMemo, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import Confetti from '../components/Confetti';

const CircularProgress = memo(function CircularProgress({ percentage, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 70 ? 'stroke-green-500' : percentage >= 40 ? 'stroke-yellow-500' : 'stroke-red-500';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-gray-200" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${color} transition-all duration-700`} />
      </svg>
      <span className="absolute text-sm font-bold text-gray-700">{Math.round(percentage)}%</span>
    </div>
  );
});

const progressCards = [
  { key: 'hr', label: 'HR Round', gradient: 'from-purple-500 to-purple-600', emoji: '\u{1F5E3}\uFE0F', link: '/hr' },
  { key: 'technical', label: 'Technical', gradient: 'from-blue-500 to-blue-600', emoji: '\u{1F4BB}', link: '/technical' },
  { key: 'gd', label: 'GD Round', gradient: 'from-teal-500 to-teal-600', emoji: '\u{1F465}', link: '/gd' },
  { key: 'aptitude', label: 'Aptitude', gradient: 'from-orange-500 to-orange-600', emoji: '\u{1F9EE}', link: '/aptitude' },
];

const quickActions = [
  { label: 'Practice HR', link: '/hr', gradient: 'from-purple-500 to-pink-500', emoji: '\u{1F5E3}\uFE0F' },
  { label: 'Solve Technical', link: '/technical', gradient: 'from-blue-500 to-cyan-500', emoji: '\u{1F4BB}' },
  { label: 'GD Simulation', link: '/gd', gradient: 'from-teal-500 to-emerald-500', emoji: '\u{1F465}' },
  { label: 'Take Aptitude', link: '/aptitude', gradient: 'from-orange-500 to-red-500', emoji: '\u{1F9EE}' },
];

export default function Dashboard() {
  const { state } = useApp();
  const { user, progress, feedbackReports, dailyChallenges } = state;
  const navigate = useNavigate();
  const [chestOpen, setChestOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const streak = user?.streak ?? 0;

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayChallenge = useMemo(() => dailyChallenges.find(c => c.date === todayStr), [dailyChallenges, todayStr]);
  const recentReports = useMemo(
    () => [...feedbackReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3),
    [feedbackReports]
  );

  const entries = useMemo(() => [
    { label: 'HR', score: progress.hr.averageScore },
    { label: 'Technical', score: progress.technical.averageScore },
    { label: 'GD', score: progress.gd.averageScore },
    { label: 'Aptitude', score: progress.aptitude.averageScore },
  ], [progress.hr.averageScore, progress.technical.averageScore, progress.gd.averageScore, progress.aptitude.averageScore]);

  const weakest = useMemo(() => entries.reduce((min, e) => (e.score < min.score ? e : min), entries[0]), [entries]);

  const overallScore = useMemo(() => Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length), [entries]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center card max-w-md">
          <div className="text-6xl mb-4 animate-float">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>Welcome to CareerCraft!</h2>
          <p className="text-gray-500 mb-6">Log in to start your interview preparation journey</p>
          <button onClick={() => navigate('/login')} className="btn-neon text-lg px-8 py-3">
            🚀 Login / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Confetti active={showConfetti} />

      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-neon-pink rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
              Welcome back, {user.name?.split(' ')[0] ?? 'Student'}! 🎯
            </h1>
            <p className="mt-1 text-indigo-100">{user.year ? `Year ${user.year}` : ''}{user.college ? ` • ${user.college}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/10 flex items-center gap-2">
              <span className="text-xl animate-streak-glow">🔥</span>
              <span className="text-lg font-bold">{streak}</span>
              <span className="text-sm text-indigo-200">day streak</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/10 flex items-center gap-1.5">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-lg font-bold">{user.totalScore}</span>
              <span className="text-sm text-indigo-200">XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressCards.map((card) => {
          const data = progress[card.key];
          const avgScore = Math.round(data.averageScore);
          return (
            <Link key={card.key} to={card.link} className="card group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</span>
                <span className={`bg-gradient-to-r ${card.gradient} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                  {data.completed}/{data.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <CircularProgress percentage={avgScore} size={64} strokeWidth={5} />
                <div className="text-right">
                  <span className="text-2xl group-hover:animate-float inline-block">{card.emoji}</span>
                  <p className="text-xs text-gray-400 mt-1">Avg Score</p>
                  <p className="text-lg font-bold text-gray-800">{avgScore}%</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card flex items-center gap-4">
            <div className="relative" onClick={() => { if (!chestOpen) { setChestOpen(true); setTimeout(() => setShowConfetti(true), 500); } }}>
              <div className={`text-5xl cursor-pointer transition-all duration-500 ${chestOpen ? 'animate-treasure-open' : 'hover:scale-110'}`}>
                {chestOpen ? '📦' : '🎁'}
              </div>
              {!chestOpen && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-pink rounded-full animate-ping" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {todayChallenge ? todayChallenge.title : "Today's Challenge"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {todayChallenge ? todayChallenge.description : 'Check back for a new challenge tomorrow!'}
              </p>
              {todayChallenge && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-bold text-indigo-600">+{todayChallenge.reward.xp} XP</span>
                  {todayChallenge.completed && (
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">✅ Completed</span>
                  )}
                </div>
              )}
            </div>
            <Link to="/challenges" className="btn-primary text-sm whitespace-nowrap">
              {todayChallenge?.completed ? 'View' : 'Start'} →
            </Link>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              ⚡ Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className={`bg-gradient-to-r ${action.gradient} text-white text-sm font-semibold text-center rounded-xl px-4 py-4 hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-lg`}
                >
                  <span className="text-2xl block mb-1">{action.emoji}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {recentReports.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Recent Activity</h2>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 capitalize">{report.roundType} Round</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">{report.overallScore}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              🧠 AI Recommendation
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100/50">
              <div className="text-3xl mb-2 animate-float">{weakest.label === 'HR' ? '\u{1F5E3}\uFE0F' : weakest.label === 'Technical' ? '\u{1F4BB}' : weakest.label === 'GD' ? '\u{1F465}' : '\u{1F9EE}'}</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Focus on <span className="font-bold text-indigo-700">{weakest.label}</span> — you scored{' '}
                <span className="font-bold text-indigo-700">{Math.round(weakest.score)}%</span>.
              </p>
              <Link
                to={
                  weakest.label === 'HR' ? '/hr' :
                  weakest.label === 'Technical' ? '/technical' :
                  weakest.label === 'GD' ? '/gd' : '/aptitude'
                }
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Start practicing →
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              📊 Your Progress
            </h2>
            <div className="space-y-3">
              {entries.map((e) => (
                <div key={e.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{e.label}</span>
                    <span className="font-semibold text-gray-800">{Math.round(e.score)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                      style={{ width: `${Math.min(e.score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-100 text-center">
              <span className="text-sm text-gray-500">Overall</span>
              <div className="text-3xl font-bold gradient-text">{overallScore}%</div>
            </div>
          </div>

          <button
            onClick={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg animate-glow"
          >
            🎉 Surprise Bonus!
          </button>
        </div>
      </div>
    </div>
  );
}
