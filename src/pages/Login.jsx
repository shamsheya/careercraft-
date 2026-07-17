import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { api, setToken } from '../utils/api';
import { validatePassword, validateEmail } from '../utils/hash';

const AVATARS = ['🧑‍🎓', '👩‍🎓', '👨‍🎓', '🧑‍💻', '👩‍💻', '👨‍💻', '🌟', '🚀'];

const FLOATING_ICONS = ['🚀', '✨', '💻', '🌟', '📚', '🎯', '⚡', '💡', '🚀', '🌟', '💻', '✨'];

const TITLE_TEXT = "CareerCraft";

function useTypingAnimation(text, speed = 80) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

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

  const { displayed: typedTitle, done: typingDone } = useTypingAnimation(TITLE_TEXT, 100);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-neon-pink/30 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-neon-pink/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl animate-drift-slow" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl animate-drift" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-neon-pink/10 rounded-full blur-3xl animate-drift" style={{ animationDuration: '7s', animationDelay: '0.5s' }} />

        {FLOATING_ICONS.map((icon, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 13) % 80}%`,
              fontSize: `${14 + (i % 4) * 6}px`,
              opacity: 0.15 + (i % 3) * 0.1,
              animation: `drift ${5 + (i % 4) * 2}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
          <div className="text-6xl mb-4 animate-bounce-slow">🚀</div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>
            <span className="bg-gradient-to-r from-neon-pink via-purple-400 to-neon-blue bg-clip-text text-transparent">
              {typedTitle}
            </span>
            {!typingDone && <span className="animate-pulse text-white">|</span>}
          </h1>
          <p
            className="text-indigo-200 mt-2 text-sm font-body"
            style={{ animation: 'fadeIn 0.6s ease-out forwards', animationDelay: '0.8s', opacity: 0 }}
          >
            {typingDone && 'Your AI-Powered Interview Coach'}
          </p>
        </div>

        <div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden group"
          style={{ animation: 'fadeIn 0.6s ease-out forwards', animationDelay: '1s', opacity: 0 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink via-purple-500 to-neon-blue opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-3xl pointer-events-none" />

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm whitespace-pre-line flex items-start gap-2 animate-slide-up">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-xl text-green-200 text-sm animate-slide-up">
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
            <div className="mb-4 flex items-center justify-center gap-3 p-3 bg-indigo-500/20 rounded-xl animate-slide-up">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-white text-sm font-medium">Processing...</span>
            </div>
          )}

          {mode === 'login' && (
            <div className="space-y-4 animate-fade-in" key="login">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span className="inline-block animate-bounce-slow" style={{ animationDuration: '1s' }}>👋</span> Welcome Back!
              </h2>
              {[
                { type: 'email', val: email, set: setEmail, icon: '📧', placeholder: 'your@email.com', label: 'Email' },
                { type: showPassword ? 'text' : 'password', val: password, set: setPassword, icon: '🔒', placeholder: '••••••••', label: 'Password', extra: (
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 text-sm hover:text-white transition-colors">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                )},
              ].map((field, i) => (
                <div key={field.label} style={{ animation: `fadeIn 0.4s ease-out forwards`, animationDelay: `${1.2 + i * 0.15}s`, opacity: 0 }}>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">{field.label}</label>
                  <div className="relative group/input">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">{field.icon}</span>
                    <input
                      type={field.type}
                      value={field.val}
                      onChange={e => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 outline-none transition-all duration-300 focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,45,149,0.3)]"
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-focus-within/input:w-[90%] h-0.5 bg-gradient-to-r from-neon-pink to-purple-500 transition-all duration-500 rounded-full" />
                    {field.extra}
                  </div>
                </div>
              ))}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="relative w-full py-3.5 bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-neon-pink/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group/btn"
                style={{ animation: `fadeIn 0.4s ease-out forwards`, animationDelay: '1.5s', opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🚀'}
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <div className="flex justify-between text-sm" style={{ animation: `fadeIn 0.4s ease-out forwards`, animationDelay: '1.6s', opacity: 0 }}>
                <button onClick={() => { setMode('register'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-indigo-300 hover:text-white transition-colors">
                  Create Account
                </button>
                <button onClick={() => { setMode('forgot'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-indigo-300 hover:text-white transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative my-4" style={{ animation: `fadeIn 0.4s ease-out forwards`, animationDelay: '1.7s', opacity: 0 }}>
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center"><span className="px-3 bg-[#1a1040] text-indigo-400 text-xs">or</span></div>
              </div>
              <button
                onClick={() => {
                  const demoUser = {
                    id: 'guest-' + Date.now(), name: 'Guest Explorer', email: 'guest@demo.com',
                    year: 3, college: 'Demo College', avatar: '🚀',
                    streak: 0, badges: [], totalScore: 0, joinedAt: new Date().toISOString(),
                  };
                  dispatch({ type: 'SET_USER', payload: demoUser });
                  navigate('/');
                }}
                className="relative w-full py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 overflow-hidden group/guest"
                style={{ animation: `fadeIn 0.4s ease-out forwards`, animationDelay: '1.8s', opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover/guest:translate-x-[200%] transition-transform duration-1000" />
                🚀 Continue as Guest
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-4" key="register">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Join CareerCraft <span className="inline-block animate-bounce-slow">🎉</span>
              </h2>
              {[
                { type: 'text', val: name, set: setName, icon: '👤', placeholder: 'Your Name', label: 'Full Name' },
                { type: 'email', val: email, set: setEmail, icon: '📧', placeholder: 'your@email.com', label: 'Email' },
                { type: 'password', val: password, set: setPassword, icon: '🔒', placeholder: 'Min 6 chars, 1 uppercase, 1 number', label: 'Password' },
                { type: 'password', val: confirmPassword, set: setConfirmPassword, icon: '🔐', placeholder: 'Repeat password', label: 'Confirm Password' },
              ].map((field, i) => (
                <div key={field.label} style={{ animation: `fadeIn 0.4s ease-out forwards`, animationDelay: `${1 + i * 0.1}s`, opacity: 0 }}>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">{field.label}</label>
                  <div className="relative group/input">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">{field.icon}</span>
                    <input
                      type={field.type}
                      value={field.val}
                      onChange={e => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 outline-none transition-all duration-300 focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,45,149,0.3)]"
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-focus-within/input:w-[90%] h-0.5 bg-gradient-to-r from-neon-pink to-purple-500 transition-all duration-500 rounded-full" />
                  </div>
                </div>
              ))}
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
                  <input type="text" value={college} onChange={e => setCollege(e.target.value)} placeholder="Your college" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:ring-2 focus:ring-neon-pink outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-2">Choose Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {AVATARS.map(a => (
                    <button key={a} type="button" onClick={() => setSelectedAvatar(a)} className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedAvatar === a ? 'bg-neon-pink/30 ring-2 ring-neon-pink scale-110 shadow-lg shadow-neon-pink/20' : 'bg-white/10 hover:bg-white/20 hover:scale-105'}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="relative w-full py-3.5 bg-gradient-to-r from-neon-pink to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-neon-pink/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🎉'}
                {loading ? 'Creating account...' : 'Create Account'}
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
            <div className="space-y-4" key="forgot">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Reset Password 🔐</h2>
              <p className="text-indigo-200 text-sm text-center">Enter your email to receive a temporary password</p>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                <div className="relative group/input">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">📧</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 outline-none transition-all duration-300 focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,45,149,0.3)]" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-focus-within/input:w-[90%] h-0.5 bg-gradient-to-r from-neon-pink to-purple-500 transition-all duration-500 rounded-full" />
                </div>
              </div>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="relative w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📧'}
                {loading ? 'Sending...' : 'Send Reset Password'}
              </button>
              <div className="text-center">
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); setTempPassword(''); }} className="text-indigo-300 hover:text-white text-sm transition-colors">
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-indigo-300/50 text-xs mt-6" style={{ animation: 'fadeIn 0.6s ease-out forwards', animationDelay: '2s', opacity: 0 }}>
          Your personal data is hashed (bcrypt, 12 rounds) and stored securely in SQLite. We never share your information.
        </p>
      </div>
    </div>
  );
}
