import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback, useState } from 'react';
import type { User, Badge, HRResponse, FeedbackReport, GDSession, DailyChallenge, ProgressData, LeaderboardEntry } from '../types';
import { api, getStoredToken, setToken } from '../utils/api';

interface AppState {
  user: User | null;
  users: User[];
  hrResponses: HRResponse[];
  feedbackReports: FeedbackReport[];
  gdSessions: GDSession[];
  dailyChallenges: DailyChallenge[];
  leaderboard: LeaderboardEntry[];
  progress: ProgressData;
  darkMode: boolean;
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_HR_RESPONSE'; payload: HRResponse }
  | { type: 'ADD_FEEDBACK'; payload: FeedbackReport }
  | { type: 'ADD_GD_SESSION'; payload: GDSession }
  | { type: 'UPDATE_GD_SESSION'; payload: GDSession }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'ADD_BADGE'; payload: Badge }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'UPDATE_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<ProgressData> }
  | { type: 'SET_PROGRESS'; payload: ProgressData }
  | { type: 'TOGGLE_DARK_MODE' };

const initialState: AppState = {
  user: null,
  users: [],
  hrResponses: [],
  feedbackReports: [],
  gdSessions: [],
  dailyChallenges: [],
  leaderboard: [],
  progress: { hr: { completed: 0, averageScore: 0, total: 30 }, technical: { completed: 0, averageScore: 0, total: 30 }, gd: { completed: 0, averageScore: 0, total: 10 }, aptitude: { completed: 0, averageScore: 0, total: 30 } },
  darkMode: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_HR_RESPONSE':
      return { ...state, hrResponses: [...state.hrResponses, action.payload] };
    case 'ADD_FEEDBACK':
      return { ...state, feedbackReports: [...state.feedbackReports, action.payload] };
    case 'ADD_GD_SESSION':
      return { ...state, gdSessions: [...state.gdSessions, action.payload] };
    case 'UPDATE_GD_SESSION':
      return { ...state, gdSessions: state.gdSessions.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'COMPLETE_CHALLENGE':
      return { ...state, dailyChallenges: state.dailyChallenges.map(c => c.id === action.payload ? { ...c, completed: true } : c) };
    case 'ADD_BADGE': {
      const user = state.user;
      if (!user) return state;
      const hasBadge = user.badges.some(b => b.id === action.payload.id);
      return { ...state, user: { ...user, badges: hasBadge ? user.badges : [...user.badges, action.payload] } };
    }
    case 'UPDATE_STREAK': {
      if (!state.user) return state;
      return { ...state, user: { ...state.user, streak: action.payload } };
    }
    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isAuthLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [initialized, setInitialized] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('careercraft_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
          dispatch({ type: `SET_${key.toUpperCase()}` as any, payload: parsed[key] });
        });
      } catch { /* ignore */ }
    }
    setInitialized(true);
  }, []);

  const loadProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setIsAuthLoading(false);
      return;
    }
    try {
      const data = await api.getProfile();
      dispatch({ type: 'SET_USER', payload: data.user as any });
      if (data.progress) {
        dispatch({ type: 'SET_PROGRESS', payload: data.progress });
      }
    } catch {
      setToken(null);
    }
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    if (initialized) {
      loadProfile();
    }
  }, [initialized, loadProfile]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('careercraft_state', JSON.stringify({
        users: state.users,
        hrResponses: state.hrResponses,
        feedbackReports: state.feedbackReports,
        gdSessions: state.gdSessions,
        dailyChallenges: state.dailyChallenges,
        leaderboard: state.leaderboard,
        progress: state.progress,
        darkMode: state.darkMode,
      }));
    }
  }, [state, initialized]);

  return (
    <AppContext.Provider value={{ state, dispatch, isAuthLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
