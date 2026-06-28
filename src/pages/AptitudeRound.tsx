import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../store/AppContext';
import { aptitudeQuestions } from '../data/aptitudeQuestions';
import { generateFeedbackReport } from '../utils/aiEngine';

const categories = [
  { key: 'quantitative', label: 'Quantitative', emoji: '\u{1F9EE}' },
  { key: 'logical', label: 'Logical', emoji: '\u{1F9E9}' },
  { key: 'verbal', label: 'Verbal', emoji: '\u{1F4DD}' },
];

const catColors: Record<string, string> = {
  quantitative: 'from-blue-500 to-blue-600',
  logical: 'from-purple-500 to-purple-600',
  verbal: 'from-emerald-500 to-emerald-600',
};

export default function AptitudeRound() {
  const { state, dispatch } = useApp();

  const [activeCategory, setActiveCategory] = useState('quantitative');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [sessionDone, setSessionDone] = useState(false);

  const categoryQuestions = aptitudeQuestions.filter(q => q.category === activeCategory);
  const question = categoryQuestions[currentIndex] || null;
  const totalQuestions = categoryQuestions.length;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerState('idle');
    setScore(0);
    setCorrectCount(0);
    setTotalAnswered(0);
    setTotalTimeSpent(0);
    setShowReport(false);
    setReport(null);
    setSessionDone(false);
  }, [activeCategory]);

  useEffect(() => {
    if (question && answerState === 'idle') {
      setTimeLeft(question.timeLimit);
      setTimerActive(true);
      setStartTime(Date.now());
    }
  }, [question, answerState]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleOptionSelect = useCallback((optIndex: number) => {
    if (answerState !== 'idle' || !question) return;
    setTimerActive(false);
    setSelectedOption(optIndex);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTotalTimeSpent(prev => prev + elapsed);
    const isCorrect = optIndex === question.correctAnswer;
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
    }
    setTotalAnswered(prev => prev + 1);
  }, [answerState, question, startTime]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswerState('idle');
    } else {
      setSessionDone(true);
      const reportData = generateFeedbackReport('aptitude', {
        score: correctCount,
        total: totalQuestions,
        answered: totalAnswered,
        timeSpent: totalTimeSpent,
        timeLimit: question?.timeLimit || 60,
      });
      setReport(reportData);
      dispatch({ type: 'ADD_FEEDBACK', payload: reportData });
    }
  }, [currentIndex, totalQuestions, correctCount, totalAnswered, totalTimeSpent, question, dispatch]);

  const handleGenerateReport = () => {
    if (!sessionDone) {
      setSessionDone(true);
    }
    setShowReport(true);
  };

  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const timerColor = timeLeft > 10 ? 'text-emerald-600' : timeLeft > 5 ? 'text-amber-600' : 'text-red-600';
  const timerBg = timeLeft > 10 ? 'bg-emerald-100' : timeLeft > 5 ? 'bg-amber-100' : 'bg-red-100';

  if (question === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">No questions available for this category.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 inline-flex flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? `bg-gradient-to-r ${catColors[cat.key]} text-white shadow-md`
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Correct</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {correctCount}<span className="text-sm font-normal text-gray-400">/{totalAnswered}</span>
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Accuracy</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {accuracy}<span className="text-sm font-normal text-gray-400">%</span>
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{score}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Time Spent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalTimeSpent}<span className="text-sm font-normal text-gray-400">s</span>
            </p>
          </div>
        </div>

        {sessionDone && !showReport ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">{accuracy >= 70 ? '\u{1F389}' : accuracy >= 40 ? '\u{1F44D}' : '\u{1F4AA}'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
            <p className="text-gray-500 mb-1">You answered {correctCount}/{totalAnswered} correctly</p>
            <p className="text-gray-500 mb-6">Score: {score} points | Accuracy: {accuracy}%</p>
            <button
              onClick={handleGenerateReport}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
            >
              View Feedback Report
            </button>
          </div>
        ) : showReport && report ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Aptitude Feedback Report</h3>
              <button onClick={() => setShowReport(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
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
            <div className="text-center mb-4">
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
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  setActiveCategory(activeCategory);
                  setShowReport(false);
                  setSessionDone(false);
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Retry Session
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question Counter */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-medium">
                Question <span className="text-gray-900 font-bold">{currentIndex + 1}</span>/{totalQuestions}
              </p>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${timerBg} ${timerColor}`}>
                  {timeLeft}s
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${timeLeft > 10 ? 'bg-emerald-500' : timeLeft > 5 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${(timeLeft / (question?.timeLimit || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
              <div className="flex items-start gap-3 mb-4">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${catColors[activeCategory]} text-white flex items-center justify-center text-sm font-bold`}>
                  {currentIndex + 1}
                </span>
                <p className="text-lg font-semibold text-gray-900 leading-relaxed">{question.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOpt = idx === question.correctAnswer;
                  let btnClass = 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';

                  if (answerState === 'correct' && isSelected) {
                    btnClass = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-400';
                  } else if (answerState === 'incorrect' && isSelected) {
                    btnClass = 'border-red-400 bg-red-50 ring-2 ring-red-400';
                  } else if (answerState !== 'idle' && isCorrectOpt) {
                    btnClass = 'border-emerald-400 bg-emerald-50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={answerState !== 'idle'}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-300 ${btnClass} disabled:cursor-default`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        answerState !== 'idle' && isCorrectOpt
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : answerState !== 'idle' && isSelected && !isCorrectOpt
                          ? 'border-red-500 bg-red-500 text-white'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-gray-300 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-sm font-medium ${
                        answerState !== 'idle' && isCorrectOpt
                          ? 'text-emerald-800'
                          : answerState !== 'idle' && isSelected && !isCorrectOpt
                          ? 'text-red-800'
                          : 'text-gray-800'
                      }`}>{opt}</span>
                      {answerState !== 'idle' && isCorrectOpt && (
                        <svg className="w-5 h-5 ml-auto text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {answerState !== 'idle' && isSelected && !isCorrectOpt && (
                        <svg className="w-5 h-5 ml-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {answerState !== 'idle' && (
                <div className={`mt-4 p-4 rounded-xl ${
                  answerState === 'correct' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {answerState === 'correct' ? (
                      <>
                        <span className="text-2xl">\u2705</span>
                        <span className="font-bold text-emerald-700">Correct! +10 points</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">\u274C</span>
                        <span className="font-bold text-red-700">Incorrect</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {answerState !== 'idle' && (
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setActiveCategory(activeCategory);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Category
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
                >
                  {currentIndex < totalQuestions - 1 ? (
                    <>Next Question
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  ) : (
                    'View Results'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
