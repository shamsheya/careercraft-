import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { api, setToken } from '../utils/api';
import { validatePassword, validateEmail } from '../utils/hash';

const AVATARS = ['🧑‍🎓', '👩‍🎓', '👨‍🎓', '🧑‍💻', '👩‍💻', '👨‍💻', '🌟', '🚀'];

export default function Login() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [year, setYear] = useState(1);
  const [college, setCollege] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  function handleLogin() {
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!validateEmail(email)) { setError('Invalid email format'); return; }

    setLoading(true);
    api.login({ email, password })
      .then(data => {
        setToken(data.token);
        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          year: data.user.year,
          college: data.user.college,
          avatar: data.user.avatar,
          streak: data.user.streak || 0,
          badges: data.user.badges || [],
          totalScore: data.user.totalScore || 0,
          joinedAt: data.user.joinedAt || new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: user });
        navigate('/');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  function handleRegister() {
    setError('');
    if (!name || !email || !password || !confirmPassword) { setError('Please fill in all fields'); return; }
    if (!validateEmail(email)) { setError('Invalid email format'); return; }
    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) { setError(pwdErrors.join('\n')); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    api.register({ name, email, password, year, college, avatar: selectedAvatar })
      .then(data => {
        setToken(data.token);
        const user = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          year: data.user.year,
          college: data.user.college,
          avatar: data.user.avatar,
          streak: data.user.streak || 0,
          badges: data.user.badges || [],
          totalScore: data.user.totalScore || 0,
          joinedAt: new Date().toISOString(),
        };
        dispatch({ type: 'SET_USER', payload: user });
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  function handleForgotPassword() {
    setError('');
    setSuccess('');
    if (!email) { setError('Please enter your email'); return; }

    setLoading(true);
    api.forgotPassword({ email })
      .then(data => {
        setTempPassword(data.tempPassword || '');
        setSuccess(`Password reset successful! Your temporary password is shown below.`);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-neon-pink/30 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-neon-pink/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-6xl mb-4 animate-float">🚀</div>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Baloo 2', cursive" }}>
            CareerCraft
          </h1>
          <p className="text-indigo-200 mt-2 text-sm font-body">Your AI-Powered Interview Coach</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-slide-up">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm whitespace-pre-line flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-xl text-green-200 text-sm">
              <div className="flex items-start gap-2">
                <span>✅</span>
                <div>
                  <p>{success}</p>
                  {tempPassword && (
                    <div className="mt-2 p-2 bg-green-500/20 rounded-lg font-mono text-lg text-center tracking-wider">
                      {tempPassword}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="mb-4 flex items-center justify-center gap-3 p-3 bg-indigo-500/20 rounded-xl">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-white text-sm font-medium">Processing...</span>
            </div>
          )}

          {mode === 'login' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome Back! 👋</h2>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">📧</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">🔒</span>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 text-sm hover:text-white transition-colors">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-neon-pink/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Logging in...</> : '🚀 Login'}
              </button>
              <div className="flex justify-between text-sm">
                <button onClick={() => { setMode('register'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-indigo-300 hover:text-white transition-colors">
                  Create Account
                </button>
                <button onClick={() => { setMode('forgot'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-indigo-300 hover:text-white transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center"><span className="px-3 bg-[#1a1040] text-indigo-400 text-xs">or</span></div>
              </div>
              <button onClick={() => {
                const demoUser = {
                  id: 'guest-' + Date.now(), name: 'Guest Explorer', email: 'guest@demo.com',
                  year: 3, college: 'Demo College', avatar: '🚀',
                  streak: 0, badges: [], totalScore: 0, joinedAt: new Date().toISOString(),
                };
                dispatch({ type: 'SET_USER', payload: demoUser });
                navigate('/');
              }} className="w-full py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                🚀 Continue as Guest
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Join CareerCraft 🎉</h2>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">👤</span>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">📧</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">🔒</span>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 chars, 1 uppercase, 1 number" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">🔐</span>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">Year of Study</label>
                  <select value={year} onChange={e => setYear(Number(e.target.value))} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-neon-pink outline-none transition-all">
                    <option value={1} className="bg-gray-900">1st Year</option>
                    <option value={2} className="bg-gray-900">2nd Year</option>
                    <option value={3} className="bg-gray-900">3rd Year</option>
                    <option value={4} className="bg-gray-900">Final Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">College</label>
                  <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="Your college" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">Choose Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map(a => (
                    <button key={a} type="button" onClick={() => setSelectedAvatar(a)} className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedAvatar === a ? 'bg-neon-pink/30 ring-2 ring-neon-pink scale-110' : 'bg-white/10 hover:bg-white/20'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleRegister} disabled={loading} className="w-full py-3 bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-neon-pink/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating account...</> : '🎉 Create Account'}
              </button>
              <p className="text-center text-sm text-indigo-300">
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-white hover:underline font-semibold">
                  Login
                </button>
              </p>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Reset Password 🔐</h2>
              <p className="text-indigo-200 text-sm text-center">Enter your email to receive a temporary password</p>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">📧</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <button onClick={handleForgotPassword} disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Sending...</> : '📧 Send Reset Password'}
              </button>
              <div className="text-center">
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-indigo-300 hover:text-white text-sm transition-colors">
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-indigo-300/50 text-xs mt-6">
          Your personal data is hashed (bcrypt, 12 rounds) and stored securely in SQLite. We never share your information.
        </p>
      </div>
    </div>
  );
}
