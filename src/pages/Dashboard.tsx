import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';

function CircularProgress({ percentage, size = 80, strokeWidth = 6 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 80) return 'text-green-500 stroke-green-500';
    if (pct >= 50) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={getColor(percentage)}
        />
      </svg>
      <span className="absolute text-sm font-bold text-gray-700">{Math.round(percentage)}%</span>
    </div>
  );
}

const progressCards = [
  { key: 'hr', label: 'HR Round', gradient: 'from-purple-500 to-purple-600', link: '/hr' },
  { key: 'technical', label: 'Technical', gradient: 'from-blue-500 to-blue-600', link: '/technical' },
  { key: 'gd', label: 'Group Discussion', gradient: 'from-teal-500 to-teal-600', link: '/gd' },
  { key: 'aptitude', label: 'Aptitude', gradient: 'from-orange-500 to-orange-600', link: '/aptitude' },
];

const quickActions = [
  { label: 'Practice HR', link: '/hr', color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Solve Technical', link: '/technical', color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'GD Simulation', link: '/gd', color: 'bg-teal-500 hover:bg-teal-600' },
  { label: 'Take Aptitude Test', link: '/aptitude', color: 'bg-orange-500 hover:bg-orange-600' },
];

const roundTypeLabels: Record<string, string> = {
  hr: 'HR Round',
  technical: 'Technical Round',
  gd: 'Group Discussion',
  aptitude: 'Aptitude Test',
};

export default function Dashboard() {
  const { state } = useApp();
  const { user, progress, feedbackReports, dailyChallenges } = state;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayChallenge = dailyChallenges.find((c) => c.date === todayStr);

  const recentReports = [...feedbackReports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const entries = [
    { label: 'HR', score: progress.hr.averageScore },
    { label: 'Technical', score: progress.technical.averageScore },
    { label: 'GD', score: progress.gd.averageScore },
    { label: 'Aptitude', score: progress.aptitude.averageScore },
  ];
  const weakest = entries.reduce((min, e) => (e.score < min.score ? e : min), entries[0]);
  const lowestLabel = weakest.label;
  const lowestScore = weakest.score;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Welcome back, {user?.name?.split(' ')[0] ?? 'Student'}!
            </h1>
            <p className="mt-1 text-primary-100">
              {user?.year ? `Year ${user.year}` : ''}{user?.college ? ` \u2022 ${user.college}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <span>\u26A1</span>
              <span>{user?.streak ?? 0} day streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{user?.totalScore ?? 0} Total Score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressCards.map((card) => {
          const data = progress[card.key as keyof typeof progress];
          const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
          const avgScore = Math.round(data.averageScore);
          return (
            <Link
              key={card.key}
              to={card.link}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</span>
                <span className={`bg-gradient-to-br ${card.gradient} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                  {data.completed}/{data.total}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <CircularProgress percentage={avgScore} size={64} strokeWidth={5} />
                <div className="text-right">
                  <p className="text-xs text-gray-400">Avg Score</p>
                  <p className="text-lg font-bold text-gray-800">{avgScore}%</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Challenge</h2>
            {todayChallenge ? (
              <div className="flex items-center gap-4">
                <span className="text-3xl">{todayChallenge.type === 'hr' ? '\u{1F5E3}\uFE0F' : todayChallenge.type === 'technical' ? '\u{1F4BB}' : todayChallenge.type === 'aptitude' ? '\u{1F9EE}' : '\u{1F465}'}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{todayChallenge.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{todayChallenge.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary-600">+{todayChallenge.reward.xp} XP</span>
                  {todayChallenge.completed && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">Completed</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-3xl">📌</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">No Challenge Today</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Check back tomorrow for a new challenge!</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className={`${action.color} text-white text-sm font-semibold text-center rounded-lg px-4 py-3 transition-colors`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {recentReports.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{roundTypeLabels[report.roundType] ?? report.roundType}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{report.overallScore}%</p>
                      </div>
                      <div className="w-1 h-8 rounded-full bg-primary-200" />
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p>C: {report.metrics.communication}%</p>
                        <p>TA: {report.metrics.technicalAccuracy}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-3">AI Recommendation</h2>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Focus on <span className="font-bold text-primary-700">{lowestLabel}</span> &mdash; you scored{' '}
                <span className="font-bold text-primary-700">{Math.round(lowestScore)}%</span>.
              </p>
              <Link
                to={
                  lowestLabel === 'HR' ? '/hr' :
                  lowestLabel === 'Technical' ? '/technical' :
                  lowestLabel === 'GD' ? '/gd' : '/aptitude'
                }
                className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Start practicing &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Your Progress</h2>
            <div className="space-y-3">
              {entries.map((e) => (
                <div key={e.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{e.label}</span>
                    <span className="font-semibold text-gray-800">{Math.round(e.score)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${Math.min(e.score, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
