import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { User, Badge, HRResponse, FeedbackReport, GDSession, DailyChallenge, ProgressData, LeaderboardEntry } from '../types';

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
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_HR_RESPONSE'; payload: HRResponse }
  | { type: 'ADD_FEEDBACK'; payload: FeedbackReport }
  | { type: 'ADD_GD_SESSION'; payload: GDSession }
  | { type: 'UPDATE_GD_SESSION'; payload: GDSession }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'ADD_BADGE'; payload: Badge }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'UPDATE_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<ProgressData> }
  | { type: 'TOGGLE_DARK_MODE' };

const defaultUser: User = {
  id: 'user-1',
  name: 'Demo Student',
  email: 'student@college.edu',
  year: 3,
  college: 'National Institute of Technology',
  avatar: '👨‍🎓',
  streak: 0,
  badges: [],
  totalScore: 0,
  joinedAt: new Date().toISOString(),
};

const initialState: AppState = {
  user: defaultUser,
  users: [
    { ...defaultUser, id: 'user-1', name: 'Demo Student', year: 3, avatar: '👨‍🎓', totalScore: 0 },
    { id: 'user-2', name: 'Priya Sharma', email: '', year: 3, college: 'IIT Delhi', avatar: '👩‍🎓', streak: 5, badges: [], totalScore: 1250, joinedAt: '' },
    { id: 'user-3', name: 'Rahul Verma', email: '', year: 4, college: 'BITS Pilani', avatar: '👨‍🎓', streak: 3, badges: [], totalScore: 980, joinedAt: '' },
    { id: 'user-4', name: 'Ananya Reddy', email: '', year: 2, college: 'VIT Vellore', avatar: '👩‍🎓', streak: 7, badges: [], totalScore: 750, joinedAt: '' },
    { id: 'user-5', name: 'Arjun Mehta', email: '', year: 1, college: 'SRM Chennai', avatar: '👨‍🎓', streak: 2, badges: [], totalScore: 320, joinedAt: '' },
    { id: 'user-6', name: 'Sneha Patel', email: '', year: 4, college: 'NIT Surat', avatar: '👩‍🎓', streak: 10, badges: [], totalScore: 1500, joinedAt: '' },
    { id: 'user-7', name: 'Vikram Joshi', email: '', year: 1, college: 'DTU Delhi', avatar: '👨‍🎓', streak: 4, badges: [], totalScore: 410, joinedAt: '' },
    { id: 'user-8', name: 'Kavya Nair', email: '', year: 2, college: 'COEP Pune', avatar: '👩‍🎓', streak: 6, badges: [], totalScore: 680, joinedAt: '' },
  ],
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
    case 'ADD_HR_RESPONSE':
      return { ...state, hrResponses: [...state.hrResponses, action.payload] };
    case 'ADD_FEEDBACK':
      return { ...state, feedbackReports: [...state.feedbackReports, action.payload] };
    case 'ADD_GD_SESSION':
      return { ...state, gdSessions: [...state.gdSessions, action.payload] };
    case 'UPDATE_GD_SESSION':
      return { ...state, gdSessions: state.gdSessions.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        dailyChallenges: state.dailyChallenges.map(c => c.id === action.payload ? { ...c, completed: true } : c),
      };
    case 'ADD_BADGE': {
      const user = state.user;
      if (!user) return state;
      const hasBadge = user.badges.some(b => b.id === action.payload.id);
      return {
        ...state,
        user: { ...user, badges: hasBadge ? user.badges : [...user.badges, action.payload] },
      };
    }
    case 'UPDATE_STREAK': {
      if (!state.user) return state;
      return { ...state, user: { ...state.user, streak: action.payload } };
    }
    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const saved = localStorage.getItem('careercraft_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('careercraft_state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
