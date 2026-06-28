export interface User {
  id: string;
  name: string;
  email: string;
  year: 1 | 2 | 3 | 4;
  college: string;
  avatar: string;
  streak: number;
  badges: Badge[];
  totalScore: number;
  joinedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface HRQuestion {
  id: string;
  question: string;
  category: string;
  company: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface HRResponse {
  questionId: string;
  userAnswer: string;
  feedback: HRFeedback;
  timestamp: string;
}

export interface HRFeedback {
  clarity: number;
  confidence: number;
  relevance: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

export interface TechnicalQuestion {
  id: string;
  topic: 'dsa' | 'dbms' | 'os' | 'cn' | 'oop';
  type: 'mcq' | 'coding';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  codeSnippet?: string;
  hints?: string[];
}

export interface GDTeam {
  name: string;
  color: string;
  members: GDParticipant[];
}

export interface GDParticipant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  fluency: number;
  confidence: number;
  logic: number;
  hasSpoken: boolean;
}

export interface GDSession {
  id: string;
  topic: string;
  teams: GDTeam[];
  currentSpeaker: string | null;
  round: number;
  isActive: boolean;
  messages: GDMessage[];
  scores: Record<string, number>;
}

export interface GDMessage {
  participantId: string;
  participantName: string;
  teamName: string;
  content: string;
  timestamp: string;
  score: number;
}

export interface AptitudeQuestion {
  id: string;
  category: 'quantitative' | 'logical' | 'verbal';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeLimit: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'hr' | 'technical' | 'aptitude' | 'gd';
  tasks: ChallengeTask[];
  reward: { badge?: string; xp: number };
  completed: boolean;
  date: string;
}

export interface ChallengeTask {
  id: string;
  description: string;
  completed: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  year: number;
  avatar: string;
  hrScore: number;
  technicalScore: number;
  gdScore: number;
  aptitudeScore: number;
  totalScore: number;
  badges: Badge[];
  rank: number;
}

export interface FeedbackReport {
  id: string;
  date: string;
  roundType: 'hr' | 'technical' | 'gd' | 'aptitude';
  metrics: {
    communication: number;
    technicalAccuracy: number;
    confidence: number;
    timeManagement: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallScore: number;
}

export interface ProgressData {
  hr: { completed: number; averageScore: number; total: number };
  technical: { completed: number; averageScore: number; total: number };
  gd: { completed: number; averageScore: number; total: number };
  aptitude: { completed: number; averageScore: number; total: number };
}
