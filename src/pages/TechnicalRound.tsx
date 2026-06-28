import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../store/AppContext';
import { technicalQuestions } from '../data/technicalQuestions';
import { generateFeedbackReport } from '../utils/aiEngine';
import type { TechnicalQuestion } from '../types';

const TOPICS = [
  { key: 'dsa', label: 'Data Structures & Algorithms', emoji: '💻' },
  { key: 'dbms', label: 'Database Management Systems', emoji: '🗄️' },
  { key: 'os', label: 'Operating Systems', emoji: '⚙️' },
  { key: 'cn', label: 'Computer Networks', emoji: '🌐' },
  { key: 'oop', label: 'Object-Oriented Programming', emoji: '🔷' },
] as const;

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

const DIFFICULTY_TIME: Record<string, number> = {
  easy: 60,
  medium: 90,
  hard: 120,
};

function TimerBar({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = total > 0 ? (timeLeft / total) * 100 : 0;
  const color = pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="h-1.5 bg-gray-100">
      <div
        className={`h-full transition-all duration-1000 ease-linear ${color}`}
        style={{ width: `${Math.max(pct, 0)}%` }}
      />
    </div>
  );
}

function AccuracyBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-800">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function getTimeForDifficulty(difficulty?: string): number {
  return DIFFICULTY_TIME[difficulty || 'easy'] || 60;
}

export default function TechnicalRound() {
  const { state, dispatch } = useApp();

  const [activeTopic, setActiveTopic] = useState<string>('dsa');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [codingAnswer, setCodingAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  const [topicResults, setTopicResults] = useState<Record<string, { correct: number; total: number; timeSpent: number; timeLimit: number }>>({});
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<any>(null);

  const questions = technicalQuestions.filter((q: TechnicalQuestion) => q.topic === activeTopic);
  const currentQuestion: TechnicalQuestion | undefined = questions[questionIndex];
  const maxTime = currentQuestion ? getTimeForDifficulty(currentQuestion.difficulty) : 60;

  const totalCorrect = Object.values(topicResults).reduce((s, r) => s + r.correct, 0);
  const totalAttempted = Object.values(topicResults).reduce((s, r) => s + r.total, 0);
  const overallPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const hasTopicResult = topicResults[activeTopic] && topicResults[activeTopic].total > 0;

  const allTopicsComplete = TOPICS.every(t => {
    const r = topicResults[t.key];
    const qs = technicalQuestions.filter(q => q.topic === t.key);
    return r && r.total >= qs.length;
  });

  const handleTimeout = useCallback(() => {
    if (answered) return;
    setIsCorrect(false);
    setAnswered(true);
    setTimerActive(false);
    setTopicResults(prev => {
      const cur = prev[activeTopic] || { correct: 0, total: 0, timeSpent: 0, timeLimit: 0 };
      return {
        ...prev,
        [activeTopic]: {
          correct: cur.correct,
          total: cur.total + 1,
          timeSpent: cur.timeSpent + maxTime,
          timeLimit: cur.timeLimit + maxTime,
        },
      };
    });
  }, [answered, activeTopic, maxTime]);

  useEffect(() => {
    if (answered || !timerActive) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, answered, timerActive, handleTimeout]);

  useEffect(() => {
    setQuestionIndex(0);
    resetQuestionState();
    setShowReport(false);
    setReport(null);
  }, [activeTopic]);

  function resetQuestionState() {
    setSelectedOption(null);
    setCodingAnswer('');
    setAnswered(false);
    setIsCorrect(false);
    setTimerActive(true);
  }

  useEffect(() => {
    if (currentQuestion) {
      resetQuestionState();
      setTimeLeft(getTimeForDifficulty(currentQuestion.difficulty));
    }
  }, [questionIndex, activeTopic]);

  function handleTopicClick(topic: string) {
    if (topic === activeTopic) return;
    setActiveTopic(topic);
  }

  function handleOptionClick(index: number) {
    if (answered || !currentQuestion || !currentQuestion.options) return;
    setSelectedOption(index);
    const correct = currentQuestion.options[index] === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);
    setTimerActive(false);
    setTopicResults(prev => {
      const cur = prev[activeTopic] || { correct: 0, total: 0, timeSpent: 0, timeLimit: 0 };
      return {
        ...prev,
        [activeTopic]: {
          correct: cur.correct + (correct ? 1 : 0),
          total: cur.total + 1,
          timeSpent: cur.timeSpent + (maxTime - timeLeft),
          timeLimit: cur.timeLimit + maxTime,
        },
      };
    });
  }

  function handleCodingSubmit() {
    if (answered || !currentQuestion || !codingAnswer.trim()) return;
    const correct = codingAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);
    setTimerActive(false);
    setTopicResults(prev => {
      const cur = prev[activeTopic] || { correct: 0, total: 0, timeSpent: 0, timeLimit: 0 };
      return {
        ...prev,
        [activeTopic]: {
          correct: cur.correct + (correct ? 1 : 0),
          total: cur.total + 1,
          timeSpent: cur.timeSpent + (maxTime - timeLeft),
          timeLimit: cur.timeLimit + maxTime,
        },
      };
    });
  }

  function handleNext() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(i => i + 1);
    } else {
      const topicResult = topicResults[activeTopic] || { correct: 0, total: 0, timeSpent: 0, timeLimit: 0 };
      const score = topicResult.total > 0 ? Math.round((topicResult.correct / topicResult.total) * 100) : 0;
      const reportData = generateFeedbackReport('technical', {
        score,
        timeSpent: topicResult.timeSpent,
        timeLimit: topicResult.timeLimit || 1,
        answered: topicResult.total,
        total: questions.length,
      });
      setReport(reportData);
      dispatch({ type: 'ADD_FEEDBACK', payload: reportData });
      setShowReport(true);
    }
  }

  const topicAccuracyEntries = TOPICS
    .filter(t => topicResults[t.key] && topicResults[t.key].total > 0)
    .map(t => ({
      label: t.key.toUpperCase(),
      value: Math.round((topicResults[t.key].correct / topicResults[t.key].total) * 100),
      color: topicResults[t.key].correct / topicResults[t.key].total >= 0.7 ? 'bg-emerald-500' : topicResults[t.key].correct / topicResults[t.key].total >= 0.4 ? 'bg-amber-500' : 'bg-red-500',
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {TOPICS.map(t => {
            const r = topicResults[t.key];
            const qs = technicalQuestions.filter(q => q.topic === t.key);
            const done = r && r.total >= qs.length;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  activeTopic === t.key
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : done
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{t.emoji}</span>
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.key.toUpperCase()}</span>
                {done && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Correct</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCorrect}<span className="text-sm font-normal text-gray-400">/{totalAttempted}</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Accuracy</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{overallPct}<span className="text-sm font-normal text-gray-400">%</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Topic Progress</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Object.values(topicResults).filter(r => r.total > 0).length}
              <span className="text-sm font-normal text-gray-400">/{TOPICS.length}</span>
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Current Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {hasTopicResult ? Math.round((topicResults[activeTopic].correct / topicResults[activeTopic].total) * 100) : '-'}
              {hasTopicResult && <span className="text-sm font-normal text-gray-400">%</span>}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <TimerBar timeLeft={timeLeft} total={maxTime} />

          {!currentQuestion ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">No questions available for this topic.</p>
            </div>
          ) : (
            <>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[currentQuestion.difficulty]}`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {questionIndex + 1}/{questions.length}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 leading-relaxed">{currentQuestion.question}</h3>
              </div>

              {currentQuestion.type === 'mcq' && currentQuestion.options && (
                <div className="px-6 pb-4 space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    let btnClass = 'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ';
                    if (answered && selectedOption === idx) {
                      btnClass += isCorrect
                        ? 'border-green-500 bg-green-50 text-green-800 ring-2 ring-green-300'
                        : 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-300';
                    } else if (answered && opt === currentQuestion.correctAnswer && selectedOption !== idx) {
                      btnClass += 'border-green-400 bg-green-50 text-green-700';
                    } else if (selectedOption === idx && !answered) {
                      btnClass += 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-300';
                    } else {
                      btnClass += 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50';
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={answered}
                        className={btnClass}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-bold mr-3 flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'coding' && (
                <div className="px-6 pb-4">
                  {currentQuestion.codeSnippet && (
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm mb-4 leading-relaxed">{currentQuestion.codeSnippet}</pre>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codingAnswer}
                      onChange={e => setCodingAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      disabled={answered}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none disabled:bg-gray-50"
                      onKeyDown={e => { if (e.key === 'Enter') handleCodingSubmit(); }}
                    />
                    <button
                      onClick={handleCodingSubmit}
                      disabled={!codingAnswer.trim() || answered}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {answered && (
                <div className="px-6 pb-6 space-y-4">
                  <div className={`flex items-center gap-2 text-sm font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? (
                      <>
                        <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Correct!
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Incorrect
                      </>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Explanation</p>
                    <p className="text-sm text-green-800 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      {questionIndex < questions.length - 1 ? 'Next Question' : 'See Report'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {topicAccuracyEntries.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Accuracy by Topic</h3>
            {topicAccuracyEntries.map(e => (
              <AccuracyBar key={e.label} label={e.label} value={e.value} color={e.color} />
            ))}
          </div>
        )}

        {showReport && report && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {TOPICS.find(t => t.key === activeTopic)?.emoji} Feedback Report — {TOPICS.find(t => t.key === activeTopic)?.label}
              </h3>
              <button onClick={() => setShowReport(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div>
                <p className="text-xs text-gray-500">Communication</p>
                <p className="text-xl font-bold text-gray-900">{report.metrics.communication}%</p>
                <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${report.metrics.communication}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Technical Accuracy</p>
                <p className="text-xl font-bold text-gray-900">{report.metrics.technicalAccuracy}%</p>
                <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${report.metrics.technicalAccuracy}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Confidence</p>
                <p className="text-xl font-bold text-gray-900">{report.metrics.confidence}%</p>
                <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${report.metrics.confidence}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Time Management</p>
                <p className="text-xl font-bold text-gray-900">{report.metrics.timeManagement}%</p>
                <div className="h-1.5 bg-gray-200 rounded-full mt-1">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${report.metrics.timeManagement}%` }} />
                </div>
              </div>
            </div>
            <div className="text-center mb-5">
              <span className="text-xs text-gray-500">Overall Score</span>
              <p className={`text-4xl font-bold ${report.overallScore >= 70 ? 'text-emerald-600' : report.overallScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{report.overallScore}%</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-green-600 mb-1">Strengths</p>
                <ul className="space-y-1">
                  {report.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-600 mb-1">Weaknesses</p>
                <ul className="space-y-1">
                  {report.weaknesses.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-indigo-600 mb-1">Suggestions</p>
                <ul className="space-y-1">
                  {report.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
