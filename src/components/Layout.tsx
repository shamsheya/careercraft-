import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '\u{1F4CA}' },
  { path: '/hr', label: 'HR Round', icon: '\u{1F5E3}\uFE0F' },
  { path: '/technical', label: 'Technical Round', icon: '\u{1F4BB}' },
  { path: '/gd', label: 'Group Discussion', icon: '\u{1F465}' },
  { path: '/aptitude', label: 'Aptitude', icon: '\u{1F9EE}' },
  { path: '/challenges', label: 'Daily Challenges', icon: '\u26A1' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '\u{1F3C6}' },
  { path: '/resume', label: 'Resume Analyzer', icon: '\u{1F4C4}' },
  { path: '/tips', label: 'Interview Tips', icon: '\u{1F4A1}' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const user = state.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <span className="text-2xl">🚀</span>
          <span className="text-lg font-bold text-gray-800">CareerCraft</span>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                <span>\u26A1</span>
                <span>{user?.streak ?? 0} day streak</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{user?.totalScore ?? 0} XP</span>
              </div>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <span className="text-xl">{user?.avatar ?? '🧑‍🎓'}</span>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name ?? 'Student'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
