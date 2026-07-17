import { useState } from 'react';

const matchedKeywords = ['React', 'TypeScript', 'Python', 'SQL', 'Java', 'Node.js', 'CSS', 'Git'];
const missingKeywords = ['Docker', 'AWS', 'GraphQL', 'Kubernetes', 'Redis'];

const sectionsFound = ['Education', 'Experience', 'Skills', 'Projects', 'Certifications'];

const qualityMetrics = [
  { label: 'Clarity', score: 75, color: 'bg-green-500' },
  { label: 'Action Verbs', score: 60, color: 'bg-yellow-500' },
  { label: 'Quantifiable Achievements', score: 45, color: 'bg-red-500' },
  { label: 'Formatting', score: 80, color: 'bg-green-500' },
];

const suggestions = [
  'Add more quantifiable achievements (e.g., "Increased revenue by 20%")',
  'Include relevant keywords from job description',
  'Use stronger action verbs (e.g., "led", "developed", "implemented")',
  'Add a professional summary section',
  'Reduce bullet points under each role to 4-5',
];

const atsTips = [
  'Use standard section headings (Education, Experience, Skills)',
  'Avoid tables and columns — ATS parsers struggle with them',
  'Use .docx or PDF format for best compatibility',
  'Include a professional summary at the top',
  'Avoid headers/footers — content there is often missed',
  'Spell out acronyms on first use',
];

const sampleBefore = `John Doe
Software Engineer

Company A (2019-present)
- Worked on frontend
- Fixed bugs
- Did some coding
- Helped with projects

Skills: React, JS, CSS
Education: B.Tech in CS`;

const sampleAfter = `John Doe
Professional Summary
Results-driven Software Engineer with 5+ years of experience building scalable web applications using React and TypeScript. Passionate about delivering high-quality, user-centric products.

Experience
Senior Frontend Engineer | Company A | 2019–Present
• Led migration of legacy codebase to React 18, reducing load time by 40%
• Developed 15+ reusable UI components adopted across 3 product teams
• Improved test coverage from 45% to 92% using Jest and React Testing Library
• Collaborated with designers to implement responsive, accessible interfaces

Skills
Languages: TypeScript, JavaScript, Python, SQL
Frameworks: React, Node.js, Express
Tools: Git, Docker, AWS, Figma

Education
B.Tech in Computer Science | University Name | 2015–2019`;

function CircularProgress({ percentage, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-indigo-600 transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-gray-800">{percentage}%</span>
    </div>
  );
}

function RatingBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && /\.(pdf|docx|doc)$/i.test(dropped.name)) {
      setFile({ name: dropped.name, size: dropped.size });
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile({ name: selected.name, size: selected.size });
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  const resetFile = () => {
    setFile(null);
    setAnalyzed(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analyzer</h1>
        <p className="text-gray-600 mb-8">Upload your resume and get instant ATS compatibility feedback.</p>

        {/* Upload Section */}
        {!analyzed && (
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
              dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
          >
            {!file ? (
              <div>
                <div className="text-4xl mb-4 text-gray-400">📄</div>
                <p className="text-gray-600 mb-2">Drag & drop your resume here</p>
                <p className="text-sm text-gray-400 mb-4">Supports .pdf, .docx, .doc</p>
                <label className="inline-block cursor-pointer bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Upload Resume
                  <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2 text-indigo-600">📎</div>
                <p className="text-lg font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-400 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                  <button onClick={resetFile} className="text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300">
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {analyzing && (
          <div className="mt-8 bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="animate-spin text-4xl mb-3">⚙️</div>
            <p className="text-gray-600">Analyzing your resume...</p>
          </div>
        )}

        {/* Results */}
        {analyzed && (
          <div className="mt-8 space-y-6">
            {/* ATS Score */}
            <div className="bg-white rounded-xl p-8 shadow-sm text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ATS Compatibility Score</h2>
              <CircularProgress percentage={72} />
              <p className="text-sm text-gray-500 mt-3">Your resume is moderately ATS-friendly. The suggestions below can help improve it.</p>
            </div>

            {/* Keyword Match */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyword Match</h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">✅ Matched</p>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((kw) => (
                    <span key={kw} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">❌ Missing</p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw) => (
                    <span key={kw} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections Found */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sections Found</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sectionsFound.map((section) => (
                  <div key={section} className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2.5 rounded-lg">
                    <span>✅</span>
                    <span className="font-medium">{section}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Quality */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Quality</h2>
              <div className="space-y-4">
                {qualityMetrics.map((m) => (
                  <RatingBar key={m.label} label={m.label} score={m.score} color={m.color} />
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggestions</h2>
              <ul className="space-y-3">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-amber-500 mt-0.5">💡</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATS Tips */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ATS Tips</h2>
              <ul className="space-y-3">
                {atsTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-500 mt-0.5">📌</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Analyze another */}
            <div className="text-center">
              <button onClick={resetFile} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}

        {/* Sample Resume Toggle */}
        {analyzed && (
          <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowSample(!showSample)}
              className="w-full flex items-center justify-between px-8 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl font-semibold text-gray-900">📝 Sample Resume — Before & After</span>
              <span className={`transform transition-transform ${showSample ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showSample && (
              <div className="px-8 pb-8 grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                  <h3 className="font-semibold text-red-700 mb-3">❌ Before</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{sampleBefore}</pre>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <h3 className="font-semibold text-green-700 mb-3">✅ After</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{sampleAfter}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
