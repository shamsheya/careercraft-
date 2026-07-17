import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { hrQuestions } from '../data/hrQuestions';
import { apQuestions } from '../data/apQuestions';
import { generateHRFeedback, generateFeedbackReport } from '../utils/aiEngine';

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

function ScoreBar({ label, value, color }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-gray-600">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ChatMessage({ role, content, feedback }) {
  const isAi = role === 'ai';
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isAi ? 'bg-gray-100 text-gray-900 rounded-bl-sm' : 'bg-indigo-600 text-white rounded-br-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {isAi && feedback && (
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <ScoreBar label="Clarity" value={feedback.clarity} color="bg-blue-500" />
              <ScoreBar label="Confidence" value={feedback.confidence} color="bg-emerald-500" />
              <ScoreBar label="Relevance" value={feedback.relevance} color="bg-amber-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Overall:</span>
              <span className={`text-lg font-bold ${
                feedback.overall >= 70 ? 'text-emerald-600' : feedback.overall >= 50 ? 'text-amber-600' : 'text-red-600'
              }`}>{feedback.overall}%</span>
            </div>
            {feedback.strengths.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Strengths</p>
                <ul className="space-y-0.5">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.improvements.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Improvements</p>
                <ul className="space-y-0.5">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Suggested Answer</p>
              <p className="text-xs text-gray-700 leading-relaxed">{feedback.suggestedAnswer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HRRound() {
  const { dispatch } = useApp();

  const [activeTab, setActiveTab] = useState('general');
  const [filterCompany, setFilterCompany] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const [activeQuestions, setActiveQuestions] = useState([]);

  useEffect(() => {
    const pool = activeTab === 'general' ? hrQuestions : apQuestions;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const count = Math.min(pool.length, Math.floor(Math.random() * 6) + 8);
    setActiveQuestions(shuffled.slice(0, count));
  }, [activeTab]);

  const activeCompanies = activeTab === 'general'
    ? Array.from(new Set(hrQuestions.map(q => q.company))).sort()
    : Array.from(new Set(apQuestions.map(q => q.company))).sort();
  const activeCategories = activeTab === 'general'
    ? Array.from(new Set(hrQuestions.map(q => q.category))).sort()
    : Array.from(new Set(apQuestions.map(q => q.category))).sort();

  const [selectedQuestionId, setSelectedQuestionId] = useState(activeQuestions[0]?.id || '');
  const [userAnswer, setUserAnswer] = useState('');
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [sessionStats, setSessionStats] = useState({ totalAnswered: 0, totalClarity: 0, totalConfidence: 0, totalRelevance: 0, bestScore: 0 });

  useEffect(() => {
    if (activeQuestions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(activeQuestions[0].id);
    }
  }, [activeQuestions, selectedQuestionId]);

  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);

  const selectedQuestion = (activeTab === 'general' ? hrQuestions : apQuestions).find(q => q.id === selectedQuestionId);

  useEffect(() => {
    if (selectedQuestion && chatHistory.length === 0) {
      const questionText = 'question' in selectedQuestion
        ? selectedQuestion.question
        : selectedQuestion.question || '';
      setChatHistory([{ role: 'ai', content: questionText }]);
    }
  }, [selectedQuestionId, activeTab]);

  const filteredQuestions = (activeTab === 'general' ? hrQuestions : apQuestions).filter(q => {
    const matchCompany = filterCompany === 'All' || q.company === filterCompany;
    const matchCategory = filterCategory === 'All' || q.category === filterCategory;
    return matchCompany && matchCategory;
  });

  const handleSelectQuestion = (id) => {
    setSelectedQuestionId(id);
    setUserAnswer('');
    setCurrentFeedback(null);
    const questions = activeTab === 'general' ? hrQuestions : apQuestions;
    const q = questions.find(x => x.id === id);
    const questionText = q?.question || '';
    setChatHistory(q ? [{ role: 'ai', content: questionText }] : []);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedQuestionId('');
    setUserAnswer('');
    setCurrentFeedback(null);
    setChatHistory([]);
    setCompletedIds(new Set());
    setSessionStats({ totalAnswered: 0, totalClarity: 0, totalConfidence: 0, totalRelevance: 0, bestScore: 0 });
    setFilterCompany('All');
    setFilterCategory('All');
    setShowReport(false);
    setReport(null);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim() || !selectedQuestion || isGenerating) return;
    setIsGenerating(true);
    const historyWithAnswer = [
      ...chatHistory,
      { role: 'user', content: userAnswer },
    ];
    setChatHistory(historyWithAnswer);
    const answerText = userAnswer;
    setUserAnswer('');

    setTimeout(() => {
      const feedback = generateHRFeedback(selectedQuestion.question, answerText);
      setCurrentFeedback(feedback);
      const updatedHistory = [
        ...historyWithAnswer,
        { role: 'ai', content: '', feedback },
      ];
      setChatHistory(updatedHistory);
      setCompletedIds(prev => new Set(prev).add(selectedQuestion.id));
      dispatch({
        type: 'ADD_HR_RESPONSE',
        payload: {
          questionId: selectedQuestion.id,
          userAnswer: answerText,
          feedback,
          timestamp: new Date().toISOString(),
        },
      });
      setSessionStats(prev => ({
        totalAnswered: prev.totalAnswered + 1,
        totalClarity: prev.totalClarity + feedback.clarity,
        totalConfidence: prev.totalConfidence + feedback.confidence,
        totalRelevance: prev.totalRelevance + feedback.relevance,
        bestScore: Math.max(prev.bestScore, feedback.overall),
      }));
      setIsGenerating(false);
    }, 800);
  };

  const handleNextQuestion = () => {
    const questions = activeTab === 'general' ? hrQuestions : apQuestions;
    const currentIndex = questions.findIndex(q => q.id === selectedQuestionId);
    if (currentIndex < questions.length - 1) {
      handleSelectQuestion(questions[currentIndex + 1].id);
    }
  };

  const handleGenerateReport = () => {
    const avgClarity = sessionStats.totalAnswered > 0 ? Math.round(sessionStats.totalClarity / sessionStats.totalAnswered) : 0;
    const avgConfidence = sessionStats.totalAnswered > 0 ? Math.round(sessionStats.totalConfidence / sessionStats.totalAnswered) : 0;
    const avgRelevance = sessionStats.totalAnswered > 0 ? Math.round(sessionStats.totalRelevance / sessionStats.totalAnswered) : 0;
    const reportData = generateFeedbackReport('hr', { clarity: avgClarity, confidence: avgConfidence, relevance: avgRelevance });
    setReport(reportData);
    dispatch({ type: 'ADD_FEEDBACK', payload: reportData });
    setShowReport(true);
  };

  const avgScore = sessionStats.totalAnswered > 0
    ? Math.round((sessionStats.totalClarity + sessionStats.totalConfidence + sessionStats.totalRelevance) / (sessionStats.totalAnswered * 3))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 inline-flex">
          <button
            onClick={() => handleTabChange('general')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏢 General HR Questions
          </button>
          <button
            onClick={() => handleTabChange('ap')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ap' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🇮🇳 Andhra Pradesh
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">AP</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Practiced</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{sessionStats.totalAnswered}<span className="text-sm font-normal text-gray-400">/{activeQuestions.length}</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Avg Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{avgScore}<span className="text-sm font-normal text-gray-400">%</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Best Score</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{sessionStats.bestScore}<span className="text-sm font-normal text-gray-400">%</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-3 sm:col-span-1">
            <p className="text-xs text-gray-500 font-medium">Completion</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {sessionStats.totalAnswered > 0 ? Math.round((sessionStats.totalAnswered / activeQuestions.length) * 100) : 0}<span className="text-sm font-normal text-gray-400">%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Question List */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">{activeTab === 'general' ? 'HR Questions' : 'AP Questions'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{completedIds.size} of {activeQuestions.length} completed</p>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                {activeQuestions.map((q, idx) => {
                  const isSelected = q.id === selectedQuestionId;
                  const isCompleted = completedIds.has(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuestion(q.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 transition-colors ${
                        isSelected ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : 'hover:bg-gray-50 border-l-2 border-l-transparent'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted ? 'bg-green-100 text-green-700' : isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs truncate ${isSelected ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>{q.question}</p>
                        <span className={`inline-block mt-0.5 text-[10px] font-medium ${difficultyColors[q.difficulty]}`}>{q.difficulty}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center - Chat Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {/* Question Library Toggle */}
              <details className="border-b border-gray-100">
                <summary className="px-5 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between text-sm font-semibold text-gray-700">
                  {activeTab === 'general' ? 'Most Frequently Asked HR Questions' : '🇮🇳 Andhra Pradesh Interview Questions'}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <select
                      value={filterCompany}
                      onChange={e => setFilterCompany(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none"
                    >
                      <option value="All">{activeTab === 'general' ? 'All Companies' : 'All Exams'}</option>
                      {activeCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none"
                    >
                      <option value="All">All Categories</option>
                      {activeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="text-xs text-gray-400 self-center ml-auto">{filteredQuestions.length} questions</span>
                  </div>
                  <div className="space-y-2">
                    {filteredQuestions.map(q => (
                      <div key={q.id} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md">
                        <button
                          onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                          className="w-full flex items-start gap-3 p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm leading-relaxed">{q.question}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {q.company}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[q.difficulty]}`}>
                                {q.difficulty}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                                {q.category}
                              </span>
                            </div>
                          </div>
                          <svg className={`w-5 h-5 mt-1 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expandedId === q.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedId === q.id && (
                          <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                            <div className="pt-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tips</p>
                              <ul className="space-y-1.5">
                                {q.tips.map((tip, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </details>

              {/* Chat */}
              <div className="flex-1 p-5 overflow-y-auto max-h-[500px] min-h-[400px] space-y-1">
                {chatHistory.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} feedback={msg.feedback} />
                ))}
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Select a question to begin</p>
                    <p className="text-xs text-gray-400 mt-1">Practice your HR interview skills with AI feedback</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <textarea
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitAnswer();
                        }
                      }}
                    />
                    <button
                      className="absolute right-2 bottom-2 p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
                      title="Voice input"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || !selectedQuestion || isGenerating}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : null}
                    {isGenerating ? 'Analyzing...' : 'Send'}
                  </button>
                </div>
                {currentFeedback && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Next Question
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Report */}
            {sessionStats.totalAnswered > 0 && !showReport && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleGenerateReport}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Full Report
                </button>
              </div>
            )}

            {/* Report Modal */}
            {showReport && report && (
              <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Feedback Report</h3>
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
                      {report.strengths.map((s, i) => (
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
                      {report.weaknesses.map((s, i) => (
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
                      {report.suggestions.map((s, i) => (
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
      </div>
    </div>
  );
}
