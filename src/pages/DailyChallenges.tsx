import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import type { DailyChallenge, Badge } from '../types';

const challengeTemplates = [
  {
    type: 'aptitude' as const,
    title: 'Aptitude Warm-up',
    description: 'Solve 5 aptitude questions to sharpen your quantitative skills',
    tasks: [
      { id: 'apt-1', description: 'Solve 5 quantitative questions', completed: false },
      { id: 'apt-2', description: 'Score at least 60% accuracy', completed: false },
      { id: 'apt-3', description: 'Complete within 10 minutes', completed: false },
    ],
    reward: { badge: 'Number Ninja', xp: 50 },
  },
  {
    type: 'hr' as const,
    title: 'HR Interview Practice',
    description: 'Answer 3 HR questions with AI feedback',
    tasks: [
      { id: 'hr-1', description: 'Answer 3 HR questions', completed: false },
      { id: 'hr-2', description: 'Record your answers', completed: false },
      { id: 'hr-3', description: 'Review AI feedback', completed: false },
    ],
    reward: { badge: 'Interview Ace', xp: 75 },
  },
  {
    type: 'gd' as const,
    title: 'Group Discussion Simulation',
    description: 'Complete a GD simulation on a current affairs topic',
    tasks: [
      { id: 'gd-1', description: 'Speak for at least 1 minute', completed: false },
      { id: 'gd-2', description: 'Use at least 3 structured arguments', completed: false },
      { id: 'gd-3', description: 'Provide a conclusion', completed: false },
    ],
    reward: { badge: 'Debate Champion', xp: 100 },
  },
  {
    type: 'technical' as const,
    title: 'Technical MCQ Practice',
    description: 'Practice technical MCQs from DSA, DBMS, OS, and CN',
    tasks: [
      { id: 'tech-1', description: 'Solve 10 technical MCQs', completed: false },
      { id: 'tech-2', description: 'Score at least 70% accuracy', completed: false },
      { id: 'tech-3', description: 'Review incorrect answers', completed: false },
    ],
    reward: { badge: 'Tech Guru', xp: 80 },
  },
];

function generateDailyChallenge(): DailyChallenge {
  const template = challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)];
  return {
    id: `challenge-${Date.now()}`,
    title: template.title,
    description: template.description,
    type: template.type,
    tasks: template.tasks.map(t => ({ ...t })),
    reward: { badge: template.reward.badge, xp: template.reward.xp },
    completed: false,
    date: new Date().toISOString().split('T')[0],
  };
}

const challengeIcons: Record<string, string> = {
  aptitude: '\u{1F9EE}',
  hr: '\u{1F5E3}\uFE0F',
  gd: '\u{1F465}',
  technical: '\u{1F4BB}',
};

const challengeColors: Record<string, string> = {
  aptitude: 'from-orange-400 to-orange-500',
  hr: 'from-purple-400 to-purple-500',
  gd: 'from-teal-400 to-teal-500',
  technical: 'from-blue-400 to-blue-500',
};

export default function DailyChallenges() {
  const { state, dispatch } = useApp();
  const { user, dailyChallenges } = state;

  const todayStr = new Date().toISOString().split('T')[0];
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    const existing = dailyChallenges.find(c => c.date === todayStr);
    if (existing) {
      setTodayChallenge(existing);
    } else {
      const newChallenge = generateDailyChallenge();
      setTodayChallenge(newChallenge);
    }
  }, [dailyChallenges, todayStr]);

  const handleToggleTask = (taskId: string) => {
    if (!todayChallenge) return;
    const updatedTasks = todayChallenge.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const allDone = updatedTasks.every(t => t.completed);
    const updated = { ...todayChallenge, tasks: updatedTasks, completed: allDone };
    setTodayChallenge(updated);
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: todayChallenge.id });

    if (allDone) {
      const newBadge: Badge = {
        id: `badge-streak-${Date.now()}`,
        name: 'Daily Streak Maintainer',
        description: 'Completed all tasks for today\'s challenge',
        icon: '\u{1F525}',
        earnedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_BADGE', payload: newBadge });
      if (user) {
        dispatch({ type: 'UPDATE_STREAK', payload: (user.streak || 0) + 1 });
      }
    }
  };

  const completedCount = todayChallenge?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = todayChallenge?.tasks.length || 1;
  const progressPct = Math.round((completedCount / totalTasks) * 100);
  const streak = user?.streak || 0;
  const badges = user?.badges || [];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header with Streak */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 lg:p-8 text-white mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Daily Challenges</h1>
              <p className="mt-1 text-orange-100">Complete challenges to earn badges and maintain your streak!</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-5 py-2.5">
              <span className="text-2xl">{'\u{1F525}'}</span>
              <span className="text-xl font-bold">{streak}</span>
              <span className="text-sm text-orange-100">day streak</span>
            </div>
          </div>
        </div>

        {/* Today's Challenge */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {todayChallenge?.completed ? '\u2705 Today\'s Challenge Complete!' : '\u{1F4CC} Today\'s Challenge'}
          </h2>
          {todayChallenge ? (
            <div>
              <div className="flex items-start gap-4 mb-4">
                <span className={`text-3xl w-14 h-14 rounded-xl bg-gradient-to-br ${challengeColors[todayChallenge.type]} flex items-center justify-center`}>
                  {challengeIcons[todayChallenge.type]}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{todayChallenge.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{todayChallenge.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-semibold text-indigo-600">+{todayChallenge.reward.xp} XP</span>
                    {todayChallenge.reward.badge && (
                      <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                        {'\u{1F3C6}'} {todayChallenge.reward.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500 font-medium">Progress</span>
                  <span className="font-bold text-gray-800">{completedCount}/{totalTasks}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {todayChallenge.tasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      task.completed
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300'
                    }`}>
                      {task.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${task.completed ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>
                      {task.description}
                    </span>
                  </button>
                ))}
              </div>

              {todayChallenge.completed && (
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl text-center">
                  <div className="text-3xl mb-2">{'\u{1F3C6}'}</div>
                  <p className="text-sm font-bold text-amber-800">Challenge Complete!</p>
                  <p className="text-xs text-amber-600 mt-0.5">Badge "Daily Streak Maintainer" awarded</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Loading challenge...</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar / Streak View */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Streak Calendar</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{'\u{1F525}'}</span>
              <span className="text-3xl font-bold text-gray-900">{streak}</span>
              <span className="text-sm text-gray-500">day streak</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((dateStr) => {
                const dayNum = new Date(dateStr).getDate();
                const dayLabel = dayLabels[new Date(dateStr).getDay()];
                const isToday = dateStr === todayStr;
                const hasChallenge = dailyChallenges.find(c => c.date === dateStr);
                const isCompleted = hasChallenge?.completed;
                return (
                  <div key={dateStr} className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 font-medium mb-1">{dayLabel}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      isToday
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : hasChallenge
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        dayNum
                      )}
                    </div>
                    {isToday && <span className="text-[10px] text-indigo-600 font-semibold mt-1">Today</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badge Showcase */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{'\u{1F3C6}'} Badge Showcase</h2>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border-2 text-center transition-all hover:shadow-md ${
                      badge.name === 'Daily Streak Maintainer'
                        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className="text-3xl block mb-1">{badge.icon}</span>
                    <p className="text-xs font-bold text-gray-800 leading-tight">{badge.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">{'\u{1F3AF}'}</div>
                <p className="text-sm text-gray-500 font-medium">No badges yet</p>
                <p className="text-xs text-gray-400 mt-1">Complete daily challenges to earn badges!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
