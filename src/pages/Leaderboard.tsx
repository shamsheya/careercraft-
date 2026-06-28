import { useState, useMemo } from 'react';
import { useApp } from '../store/AppContext';

const yearTabs = [
  { key: 'all', label: 'All Years' },
  { key: 1, label: '1st Year' },
  { key: 2, label: '2nd Year' },
  { key: 3, label: '3rd Year' },
  { key: 4, label: 'Final Year' },
];

const badgeColors: Record<string, string> = {
  'Number Ninja': 'bg-cyan-100 text-cyan-700',
  'Interview Ace': 'bg-purple-100 text-purple-700',
  'Debate Champion': 'bg-teal-100 text-teal-700',
  'Tech Guru': 'bg-blue-100 text-blue-700',
  'Daily Streak Maintainer': 'bg-amber-100 text-amber-700',
};

function getBadgeColor(name: string): string {
  return badgeColors[name] || 'bg-gray-100 text-gray-700';
}

export default function Leaderboard() {
  const { state } = useApp();
  const { user, leaderboard, users } = state;

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');

  const sortedEntries = useMemo(() => {
    const entries = leaderboard.length > 0 ? leaderboard : users.map(u => ({
      userId: u.id,
      name: u.name,
      year: u.year,
      avatar: u.avatar,
      hrScore: 0,
      technicalScore: 0,
      gdScore: 0,
      aptitudeScore: 0,
      totalScore: u.totalScore,
      badges: u.badges,
      rank: 0,
    }));

    const filtered = entries.filter(e => {
      const matchYear = yearFilter === 'all' || e.year === yearFilter;
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      return matchYear && matchSearch;
    });

    return filtered
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((e, i) => ({ ...e, rank: i + 1 }));
  }, [leaderboard, users, yearFilter, search]);

  const top3 = sortedEntries.slice(0, 3);
  const rest = sortedEntries.slice(3);

  const podiumEmojis = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];
  const podiumColors = [
    'from-yellow-300 to-yellow-500 border-yellow-400',
    'from-gray-300 to-gray-400 border-gray-400',
    'from-amber-600 to-amber-700 border-amber-600',
  ];
  const podiumHeights = ['h-32', 'h-24', 'h-20'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{'\u{1F3C6}'} Leaderboard</h1>
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none bg-white w-64"
            />
          </div>
        </div>

        {/* Year Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 inline-flex flex-wrap">
          {yearTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setYearFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                yearFilter === tab.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {top3.length > 1 && (
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-1">{podiumEmojis[1]}</div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl border-2 border-gray-300 mb-2">
                  {top3[1].avatar}
                </div>
                <p className="text-sm font-bold text-gray-800 text-center">{top3[1].name}</p>
                <p className="text-xs text-gray-400">{top3[1].year === 1 ? '1st Year' : top3[1].year === 2 ? '2nd Year' : top3[1].year === 3 ? '3rd Year' : 'Final Year'}</p>
                <div className={`w-20 ${podiumHeights[1]} mt-2 rounded-t-lg bg-gradient-to-t ${podiumColors[1]} flex items-center justify-center border-x-2 border-t-2`}>
                  <span className="text-lg font-bold text-white">{top3[1].totalScore}</span>
                </div>
              </div>
            )}
            {top3[0] && (
              <div className="flex flex-col items-center -mt-4">
                <div className="text-3xl mb-1">{podiumEmojis[0]}</div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center text-3xl border-2 border-yellow-400 mb-2 ring-2 ring-yellow-200">
                  {top3[0].avatar}
                </div>
                <p className="text-base font-bold text-gray-900 text-center">{top3[0].name}</p>
                <p className="text-xs text-gray-400">{top3[0].year === 1 ? '1st Year' : top3[0].year === 2 ? '2nd Year' : top3[0].year === 3 ? '3rd Year' : 'Final Year'}</p>
                <div className={`w-24 ${podiumHeights[0]} mt-2 rounded-t-lg bg-gradient-to-t ${podiumColors[0]} flex items-center justify-center border-x-2 border-t-2`}>
                  <span className="text-2xl font-bold text-white">{top3[0].totalScore}</span>
                </div>
              </div>
            )}
            {top3.length > 2 && (
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-1">{podiumEmojis[2]}</div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-xl border-2 border-amber-300 mb-2">
                  {top3[2].avatar}
                </div>
                <p className="text-sm font-bold text-gray-800 text-center">{top3[2].name}</p>
                <p className="text-xs text-gray-400">{top3[2].year === 1 ? '1st Year' : top3[2].year === 2 ? '2nd Year' : top3[2].year === 3 ? '3rd Year' : 'Final Year'}</p>
                <div className={`w-16 ${podiumHeights[2]} mt-2 rounded-t-lg bg-gradient-to-t ${podiumColors[2]} flex items-center justify-center border-x-2 border-t-2`}>
                  <span className="text-base font-bold text-white">{top3[2].totalScore}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">HR</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Tech</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">GD</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aptitude</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top3.map(entry => (
                  <tr
                    key={entry.userId}
                    className={`${
                      entry.userId === user?.id
                        ? 'bg-indigo-50'
                        : 'bg-gradient-to-r from-yellow-50 to-amber-50'
                    } hover:bg-opacity-80 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        entry.rank === 1 ? 'bg-yellow-200 text-yellow-800' :
                        entry.rank === 2 ? 'bg-gray-200 text-gray-700' :
                        'bg-amber-200 text-amber-800'
                      }`}>
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.avatar}</span>
                        <span className={`font-semibold ${entry.userId === user?.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                          {entry.name}
                          {entry.userId === user?.id && <span className="ml-1.5 text-[10px] text-indigo-500 font-medium">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {entry.year === 1 ? '1st' : entry.year === 2 ? '2nd' : entry.year === 3 ? '3rd' : 'Final'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.hrScore}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.technicalScore}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.gdScore}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.aptitudeScore}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-900">{entry.totalScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {entry.badges.length > 0 ? (
                          entry.badges.slice(0, 3).map(badge => (
                            <span
                              key={badge.id}
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${getBadgeColor(badge.name)}`}
                            >
                              {badge.icon} {badge.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400">-</span>
                        )}
                        {entry.badges.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-medium">+{entry.badges.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {rest.map(entry => (
                  <tr
                    key={entry.userId}
                    className={`${
                      entry.userId === user?.id
                        ? 'bg-indigo-50'
                        : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-gray-600 bg-gray-100">
                        {entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.avatar}</span>
                        <span className={`font-semibold ${entry.userId === user?.id ? 'text-indigo-700' : 'text-gray-800'}`}>
                          {entry.name}
                          {entry.userId === user?.id && <span className="ml-1.5 text-[10px] text-indigo-500 font-medium">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {entry.year === 1 ? '1st' : entry.year === 2 ? '2nd' : entry.year === 3 ? '3rd' : 'Final'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.hrScore}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.technicalScore}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.gdScore}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{entry.aptitudeScore}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-900">{entry.totalScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {entry.badges.length > 0 ? (
                          entry.badges.slice(0, 3).map(badge => (
                            <span
                              key={badge.id}
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${getBadgeColor(badge.name)}`}
                            >
                              {badge.icon} {badge.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-gray-400">-</span>
                        )}
                        {entry.badges.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-medium">+{entry.badges.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedEntries.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                      No entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
