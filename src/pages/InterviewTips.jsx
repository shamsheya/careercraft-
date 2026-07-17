import { useState } from 'react';

const categories = [
  {
    icon: '🧍',
    title: 'Body Language',
    description: 'Non-verbal cues that convey confidence and engagement.',
    color: 'border-blue-500',
    tips: [
      'Sit up straight and lean slightly forward to show interest',
      'Maintain natural eye contact — 60-70% of the time',
      'Use hand gestures to emphasize key points',
      'Avoid crossing your arms or fidgeting',
      'Nod occasionally to show you are listening',
      'Keep a calm, genuine smile throughout',
    ],
  },
  {
    icon: '👔',
    title: 'Dress Code',
    description: 'What to wear to make the right impression.',
    color: 'border-purple-500',
    tips: [
      'Corporate: Dark suit, tie, polished shoes for men; blazer + slacks for women',
      'Startup/Business Casual: Clean button-down or polo, chinos, neat sneakers',
      'Creative/Tech: Smart casual — well-fitted jeans, collared shirt, clean shoes',
      'Always iron your clothes and check for lint or stains',
      'Avoid heavy cologne/perfume — keep it subtle',
      'Keep jewelry minimal and professional',
    ],
  },
  {
    icon: '❌',
    title: 'Common Mistakes',
    description: 'Frequent pitfalls that cost candidates the job.',
    color: 'border-red-500',
    tips: [
      'Badmouthing a previous employer or colleague',
      'Giving vague answers without specific examples',
      'Interrupting the interviewer',
      'Failing to research the company beforehand',
      'Asking about salary or benefits too early',
      'Checking your phone or watch repeatedly',
    ],
  },
  {
    icon: '📋',
    title: 'Before Interview',
    description: 'Preparation checklist for the day before.',
    color: 'border-green-500',
    tips: [
      'Research the company: mission, values, recent news, products',
      'Study the job description and map your experience to requirements',
      'Prepare your STAR stories — 3-5 strong examples',
      'Plan your route and confirm the time/format',
      'Prepare 3-5 thoughtful questions to ask',
      'Lay out your outfit and pack your bag the night before',
    ],
  },
  {
    icon: '🎯',
    title: 'During Interview',
    description: 'Maximize your performance during the conversation.',
    color: 'border-amber-500',
    tips: [
      'Arrive 10-15 minutes early (or log in 5 min early for video)',
      'Start with a firm handshake (or warm greeting for video)',
      'Listen carefully before answering — pause if needed',
      'Use the STAR method for behavioral questions',
      'Be honest — it is okay to say "I don\'t know" and how you\'d find out',
      'Close by reiterating your interest and thanking them',
    ],
  },
  {
    icon: '📧',
    title: 'Follow Up',
    description: 'Post-interview etiquette that leaves a lasting impression.',
    color: 'border-teal-500',
    tips: [
      'Send a thank-you email within 24 hours of the interview',
      'Reference a specific topic discussed to show attentiveness',
      'Reaffirm your enthusiasm for the role and company',
      'Keep it concise — 2-3 short paragraphs max',
      'Follow up if you haven\'t heard back after 5-7 business days',
      'Connect on LinkedIn with a personalized note',
    ],
  },
];

const quickTips = [
  'Research the company before the interview',
  'Practice the STAR method',
  'Prepare 3 questions to ask the interviewer',
  'Arrive 10-15 minutes early',
  'Turn off your phone',
  'Bring extra copies of your resume',
  'Smile and be confident',
  'Dress one level above the company dress code',
  'Send a thank-you note within 24 hours',
  'Use specific numbers and metrics in answers',
  'Prepare a 30-second elevator pitch',
  'Review common behavioral questions',
];

const dos = [
  'Arrive early and prepared',
  'Research the company thoroughly',
  'Use the STAR method to answer questions',
  'Ask thoughtful questions',
  'Send a thank-you note',
  'Maintain good eye contact',
  'Dress professionally',
  'Bring extra resume copies',
  'Show enthusiasm and genuine interest',
  'Listen carefully before answering',
];

const donts = [
  'Arrive late or unprepared',
  'Badmouth previous employers',
  'Give one-word or vague answers',
  'Interrupt the interviewer',
  'Forget to follow up',
  'Check your phone during the interview',
  'Dress too casually',
  'Lie or exaggerate experience',
  'Ask about salary/benefits too early',
  'Speak negatively about yourself',
];

export default function InterviewTips() {
  const [expanded, setExpanded] = useState(null);
  const [tickerIndex, setTickerIndex] = useState(0);

  const toggleCategory = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Tips & Advice</h1>
        <p className="text-gray-600 mb-8">Master your next interview with these expert-backed tips.</p>

        {/* Quick Tips Ticker */}
        <div className="bg-indigo-600 rounded-xl p-4 mb-10 overflow-hidden">
          <div className="flex items-center gap-3 text-white">
            <span className="text-lg font-semibold whitespace-nowrap">⚡ Quick Tips</span>
            <div className="h-8 w-px bg-indigo-400" />
            <div className="relative flex-1 overflow-hidden h-6">
              <p
                className="absolute whitespace-nowrap text-sm font-medium transition-all duration-500"
                style={{ top: 0, left: 0, opacity: 1 }}
              >
                {quickTips[tickerIndex]}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              {quickTips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTickerIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === tickerIndex ? 'bg-white' : 'bg-indigo-400'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {categories.map((cat, idx) => (
            <div
              key={cat.title}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${cat.color} overflow-hidden transition-all duration-200`}
            >
              <button
                onClick={() => toggleCategory(idx)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
              </button>
              {expanded === idx && (
                <div className="px-6 pb-6 animate-fade-in">
                  <ul className="space-y-2 mt-1">
                    {cat.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dos and Don'ts Table */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Dos and Don'ts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                <span>✅</span> Do
              </h3>
              <ul className="space-y-3">
                {dos.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                <span>❌</span> Don't
              </h3>
              <ul className="space-y-3">
                {donts.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
