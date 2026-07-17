import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

export default function Layout({ children }) {
  const { state, dispatch } = useApp();
  const user = state.user;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl border-r border-indigo-100/50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-100/50">
          <span className="text-3xl animate-float">🚀</span>
          <div>
            <span className="text-lg font-bold gradient-text" style={{ fontFamily: "'Baloo 2', cursive" }}>CareerCraft</span>
            <p className="text-[10px] text-gray-400">AI Interview Coach</p>
          </div>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 border border-indigo-200/50'
                    : 'text-gray-600 hover:bg-indigo-50/50 hover:text-gray-800'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
          <p className="text-xs text-indigo-600 font-semibold">🌟 Pro Tip</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Complete daily challenges to earn badges!</p>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-indigo-100/50 px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-indigo-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {user && (
                <>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/50">
                    <span className="animate-streak-glow">🔥</span>
                    <span>{user.streak} day streak</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200/50">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{user.totalScore} XP</span>
                  </div>
                </>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-4 border-l border-indigo-200/50 hover:bg-indigo-50/50 rounded-xl px-3 py-1.5 transition-colors"
                >
                  <span className="text-xl">{user?.avatar ?? '🧑‍🎓'}</span>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name ?? 'Login'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-indigo-100/50 overflow-hidden z-20 animate-slide-up">
                      {user ? (
                        <>
                          <button
                            onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                          >
                            👤 Profile
                          </button>
                          <button
                            onClick={() => { localStorage.removeItem('careercraft_state'); dispatch({ type: 'SET_USER', payload: null }); setShowUserMenu(false); navigate('/login'); }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            🚪 Logout
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { navigate('/login'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          🔑 Login
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
