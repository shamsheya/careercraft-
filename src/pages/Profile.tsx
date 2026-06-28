import { useState } from 'react';
import { useApp } from '../store/AppContext';
import Confetti from '../components/Confetti';

const badgeColors: Record<string, string> = {
  'Number Ninja': 'from-cyan-400 to-cyan-500',
  'Interview Ace': 'from-purple-400 to-purple-500',
  'Debate Champion': 'from-teal-400 to-teal-500',
  'Tech Guru': 'from-blue-400 to-blue-500',
  'Daily Streak Maintainer': 'from-amber-400 to-orange-500',
};

export default function Profile() {
  const { state } = useApp();
  const { user, progress } = state;
  const [showConfetti, setShowConfetti] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  const entries = [
    { label: 'HR', value: progress.hr.averageScore, color: 'from-purple-500 to-purple-600' },
    { label: 'Technical', value: progress.technical.averageScore, color: 'from-blue-500 to-blue-600' },
    { label: 'GD', value: progress.gd.averageScore, color: 'from-teal-500 to-teal-600' },
    { label: 'Aptitude', value: progress.aptitude.averageScore, color: 'from-orange-500 to-orange-600' },
  ];

  const overall = Math.round(entries.reduce((s, e) => s + e.value, 0) / entries.length);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Confetti active={showConfetti} />

      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-neon-pink rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{user.avatar}</span>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>{user.name}</h1>
              <p className="text-indigo-100">{user.email}</p>
              <p className="text-indigo-200 text-sm mt-1">Year {user.year} • {user.college}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-bold animate-streak-glow">{user.streak}</div>
              <div className="text-xs text-indigo-200">Day Streak</div>
            </div>
            <div className="bg-white/20 rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-bold">{user.totalScore}</div>
              <div className="text-xs text-indigo-200">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Progress Overview
          </h2>
          <div className="space-y-4">
            {entries.map(e => (
              <div key={e.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-600">{e.label}</span>
                  <span className="font-bold">{Math.round(e.value)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${e.color} transition-all duration-700`} style={{ width: `${e.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500">Overall Progress</span>
            <div className="text-3xl font-bold gradient-text animate-pulse-slow">{overall}%</div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            🏆 Badges & Achievements
          </h2>
          {user.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {user.badges.map(badge => (
                <div key={badge.id} className={`p-4 rounded-xl bg-gradient-to-br ${badgeColors[badge.name] || 'from-gray-100 to-gray-200'} text-white text-center animate-slide-up`}>
                  <span className="text-3xl block mb-1">{badge.icon}</span>
                  <p className="text-sm font-bold leading-tight">{badge.name}</p>
                  <p className="text-[10px] mt-1 opacity-80">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-gray-500 font-medium">No badges yet</p>
              <p className="text-xs text-gray-400 mt-1">Complete daily challenges to earn badges!</p>
              <button onClick={() => setShowConfetti(true)} className="mt-3 text-sm text-indigo-500 hover:text-indigo-600 font-semibold">
                🎉 Test Confetti!
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔥 Streak Calendar
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl animate-streak-glow">🔥</span>
          <div>
            <span className="text-3xl font-bold text-gray-900">{user.streak}</span>
            <span className="text-gray-500 ml-2">day streak</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dayNum = d.getDate();
            const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
            const isToday = i === 6;
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-xs text-gray-400 font-medium mb-1">{dayLabel}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  isToday
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-2 ring-indigo-300'
                    : i < 6 - Math.min(user.streak, 6)
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700'
                }`}>
                  {i >= 6 - Math.min(user.streak, 6) ? '✓' : dayNum}
                </div>
                {isToday && <span className="text-[10px] text-indigo-600 font-semibold mt-1">Today</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
