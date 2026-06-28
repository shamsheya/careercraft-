import type { HRFeedback, FeedbackReport, GDParticipant } from '../types';

export function generateHRFeedback(question: string, answer: string): HRFeedback {
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const sentenceCount = answer.split(/[.!?]+/).filter(Boolean).length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;

  const fillerWords = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'i mean'];
  const fillerCount = fillerWords.reduce((sum, fw) => {
    const regex = new RegExp(fw, 'gi');
    return sum + (answer.match(regex)?.length || 0);
  }, 0);

  const hasStructure = /^(first(ly)?|to begin|in my opinion|i believe|my name is|currently)/i.test(answer.trim());
  const hasExample = /(for example|for instance|such as|specifically|in my experience|during|project|internship)/i.test(answer);
  const hasResult = /(result|outcome|achieved|learned|improved|saved|increased|reduced)/i.test(answer);

  const relevanceKeywords = extractKeywords(question);
  const relevanceMatch = relevanceKeywords.filter(kw => answer.toLowerCase().includes(kw.toLowerCase())).length;
  const relevanceScore = Math.min(100, Math.round((relevanceMatch / Math.max(relevanceKeywords.length, 1)) * 100 + 20));

  const clarityScore = Math.min(100, Math.round(
    (hasStructure ? 25 : 0) +
    (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 25 ? 25 : avgWordsPerSentence > 8 ? 15 : 10) +
    (sentenceCount >= 2 ? 20 : 5) +
    (wordCount >= 50 ? 20 : wordCount >= 30 ? 15 : 5) +
    (fillerCount === 0 ? 10 : fillerCount <= 2 ? 5 : 0)
  ));

  const confidenceScore = Math.min(100, Math.round(
    (fillerCount === 0 ? 25 : fillerCount <= 2 ? 15 : 5) +
    (wordCount >= 60 ? 25 : wordCount >= 30 ? 15 : 5) +
    (hasStructure ? 20 : 0) +
    (sentenceCount >= 3 ? 20 : sentenceCount >= 2 ? 10 : 0) +
    (hasExample ? 10 : 0)
  ));

  const overallScore = Math.min(100, Math.round((clarityScore + confidenceScore + relevanceScore) / 3));

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (clarityScore >= 70) strengths.push('Clear and well-structured answer');
  else if (clarityScore >= 50) improvements.push('Try structuring your answer with a clear beginning, middle, and end');
  else improvements.push('Your answer needs more structure. Use frameworks like STAR (Situation, Task, Action, Result)');

  if (wordCount < 30) improvements.push('Answer is too brief. Aim for 60-90 seconds of content');
  else if (wordCount > 200) improvements.push('Answer is too lengthy. Try to be more concise');
  else strengths.push('Good length and pacing');

  if (fillerCount > 2) improvements.push(`Avoid filler words (found ${fillerCount} instances). Practice pausing instead`);
  else if (fillerCount === 0) strengths.push('Minimal filler words — great confidence');

  if (!hasExample) improvements.push('Include a specific example or experience to strengthen your answer');
  else strengths.push('Good use of specific examples');

  if (!hasResult) improvements.push('Add measurable outcomes or results to your examples');
  else strengths.push('Effective use of results to demonstrate impact');

  if (relevanceScore < 50) improvements.push('Your answer could be more relevant to the question asked');
  else strengths.push('Answer is well-aligned with the question');

  return {
    clarity: clarityScore,
    confidence: confidenceScore,
    relevance: relevanceScore,
    overall: overallScore,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    suggestedAnswer: generateSuggestedAnswer(question),
  };
}

export function generateFeedbackReport(roundType: string, metrics: any): FeedbackReport {
  const randomOffset = () => Math.floor(Math.random() * 15) - 5;

  let communication = 0, technicalAccuracy = 0, confidence = 0, timeManagement = 0;

  if (roundType === 'hr') {
    communication = Math.min(100, Math.max(40, metrics.clarity || 70 + randomOffset()));
    confidence = Math.min(100, Math.max(40, metrics.confidence || 65 + randomOffset()));
    technicalAccuracy = Math.min(100, Math.max(40, 60 + randomOffset()));
    timeManagement = Math.min(100, Math.max(40, 70 + randomOffset()));
  } else if (roundType === 'technical') {
    technicalAccuracy = Math.min(100, Math.max(40, metrics.score || 70 + randomOffset()));
    communication = Math.min(100, Math.max(40, 65 + randomOffset()));
    confidence = Math.min(100, Math.max(40, 60 + randomOffset()));
    timeManagement = Math.min(100, Math.max(40, metrics.timeSpent ? Math.round((1 - metrics.timeSpent / metrics.timeLimit) * 100) : 70 + randomOffset()));
  } else if (roundType === 'gd') {
    communication = Math.min(100, Math.max(40, metrics.fluency || 70 + randomOffset()));
    confidence = Math.min(100, Math.max(40, metrics.confidence || 65 + randomOffset()));
    technicalAccuracy = Math.min(100, Math.max(40, metrics.logic || 60 + randomOffset()));
    timeManagement = Math.min(100, Math.max(40, 70 + randomOffset()));
  } else {
    communication = 70 + randomOffset();
    technicalAccuracy = Math.min(100, Math.max(40, metrics.score || 70 + randomOffset()));
    confidence = 65 + randomOffset();
    timeManagement = Math.min(100, Math.max(40, (metrics.answered / metrics.total) * 100));
  }

  const overallScore = Math.round((communication + technicalAccuracy + confidence + timeManagement) / 4);

  const strengths = generateStrengths(roundType, communication, technicalAccuracy, confidence);
  const weaknesses = generateWeaknesses(roundType, communication, technicalAccuracy, confidence, timeManagement);
  const suggestions = generateSuggestions(roundType, weaknesses);

  return {
    id: `report-${Date.now()}`,
    date: new Date().toISOString(),
    roundType: roundType as any,
    metrics: {
      communication: Math.round(communication),
      technicalAccuracy: Math.round(technicalAccuracy),
      confidence: Math.round(confidence),
      timeManagement: Math.round(timeManagement),
    },
    strengths,
    weaknesses,
    suggestions,
    overallScore,
  };
}

function generateStrengths(roundType: string, comm: number, tech: number, conf: number): string[] {
  const s: string[] = [];
  if (comm >= 70) s.push('Strong communication skills with clear articulation');
  if (tech >= 70) s.push('Good technical knowledge and accuracy');
  if (conf >= 70) s.push('High confidence level in responses');
  if (comm >= 60 && comm < 70) s.push('Adequate verbal表达能力');
  if (s.length === 0) s.push('Shows willingness to learn and improve');
  return s;
}

function generateWeaknesses(roundType: string, comm: number, tech: number, conf: number, time: number): string[] {
  const w: string[] = [];
  if (comm < 60) w.push('Need to improve communication clarity and structure');
  if (tech < 60) w.push('Technical concepts need more practice');
  if (conf < 60) w.push('Confidence level needs improvement — practice more');
  if (time < 60) w.push('Time management needs attention — pace yourself better');
  if (w.length === 0 && comm < 75) w.push('Could provide more detailed examples');
  if (w.length === 0) w.push('Continue practicing to maintain current performance');
  return w;
}

function generateSuggestions(roundType: string, weaknesses: string[]): string[] {
  const suggestions: Record<string, string[]> = {
    hr: [
      'Practice the STAR method for behavioral questions',
      'Record yourself answering questions and review',
      'Prepare 3-4 strong examples from your experience',
      'Work on reducing filler words',
      'Research company values before interviews',
    ],
    technical: [
      'Review core Data Structures and Algorithms',
      'Practice coding problems on a daily basis',
      'Focus on understanding time and space complexity',
      'Review database normalization and query optimization',
      'Study operating system concepts like scheduling and memory',
    ],
    gd: [
      'Practice speaking for 1-2 minutes on random topics',
      'Work on structuring arguments logically',
      'Improve active listening skills',
      'Build confidence by participating in group discussions',
    ],
    aptitude: [
      'Practice mental math calculations daily',
      'Focus on weak areas like probability or permutations',
      'Learn shortcut techniques for quantitative problems',
      'Solve logical puzzles to improve reasoning speed',
    ],
  };

  const base = suggestions[roundType] || suggestions.hr;
  const result = [...weaknesses.map(w => `Address: ${w.toLowerCase()}`), ...base];
  return result.slice(0, 5);
}

function extractKeywords(question: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'and', 'or', 'but', 'do', 'does', 'did', 'what', 'why', 'how', 'tell', 'describe', 'explain', 'about', 'your', 'you', 'me']);
  return question
    .toLowerCase()
    .replace(/[?.,!]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

function generateSuggestedAnswer(question: string): string {
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('tell me about yourself')) {
    return 'I am a [year] year [major] student at [college] with a strong passion for [field]. I have worked on projects involving [skill 1] and [skill 2]. Recently, I completed an internship at [company] where I [achievement]. I am excited about this opportunity because [reason].';
  }
  if (lowerQ.includes('strength') || lowerQ.includes('weakness')) {
    return 'My greatest strength is [strength], which I demonstrated when [example]. As for weaknesses, I used to struggle with [weakness], but I have been actively working on it by [action taken]. I believe self-awareness is key to growth.';
  }
  if (lowerQ.includes('why should we hire you')) {
    return 'You should hire me because I bring [unique skill 1] and [unique skill 2] to the table. My experience in [relevant area] has prepared me to contribute from day one. I am passionate about [company mission] and eager to grow with the organization.';
  }
  if (lowerQ.includes('5 year') || lowerQ.includes('five year') || lowerQ.includes('see yourself')) {
    return 'In 5 years, I see myself as a [role] professional who has mastered [skill area] and is taking on leadership responsibilities. I want to grow with this company, contribute to impactful projects, and mentor junior team members.';
  }
  return 'A strong answer would address the question directly, provide a specific example from your experience, and connect it to the role you are applying for. Use the STAR method: describe the Situation, Task, Action you took, and the measurable Result.';
}

export function evaluateTechnicalAnswer(question: string, userAnswer: string, correctAnswer: string): {
  correct: boolean; score: number; feedback: string; explanation: string
} {
  const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  const score = isCorrect ? 100 : Math.max(0, 70 - Math.random() * 30);
  const feedback = isCorrect
    ? 'Correct! Great job.'
    : `Not quite. The correct answer is: ${correctAnswer}`;
  return { correct: isCorrect, score: Math.round(score), feedback, explanation: feedback };
}

export function evaluateGDResponse(topic: string, response: string): { fluency: number; confidence: number; logic: number; score: number; feedback: string } {
  const wordCount = response.split(/\s+/).filter(Boolean).length;
  const sentences = response.split(/[.!?]+/).filter(Boolean).length;
  const hasStructure = /^(i believe|i think|according to|first|the|in my|from my)/i.test(response.trim());
  const hasEvidence = /(research|study|data|statistics|according to|for example|for instance|specifically)/i.test(response);
  const hasConclusion = /(therefore|thus|hence|in conclusion|to sum up|overall|ultimately)/i.test(response);

  const fluency = Math.min(100, Math.round(
    (wordCount >= 30 ? 25 : 10) +
    (sentences >= 3 ? 25 : 10) +
    (!/(um|uh|er|ah)/i.test(response) ? 25 : 10) +
    (hasStructure ? 25 : 10)
  ));

  const confidence = Math.min(100, Math.round(
    (wordCount >= 40 ? 30 : 10) +
    (!/^(maybe|perhaps|i guess|i think|probably)/i.test(response.trim()) ? 25 : 10) +
    (sentences >= 3 ? 25 : 15) +
    (!response.endsWith('?') ? 20 : 10)
  ));

  const logic = Math.min(100, Math.round(
    (hasStructure ? 25 : 5) +
    (hasEvidence ? 30 : 10) +
    (hasConclusion ? 25 : 10) +
    (sentences >= 4 ? 20 : 10)
  ));

  const score = Math.round((fluency + confidence + logic) / 3);
  return { fluency, confidence, logic, score, feedback: `Score: ${score}/100 — ${score >= 70 ? 'Strong performance!' : score >= 50 ? 'Good effort, keep practicing.' : 'Needs improvement.'}` };
}

export function calculateLeaderboard(users: any[], reports: FeedbackReport[]): any[] {
  const scores: Record<string, { hr: number; tech: number; gd: number; apt: number; total: number; count: number }> = {};

  for (const u of users) {
    scores[u.id] = { hr: 0, tech: 0, gd: 0, apt: 0, total: 0, count: 0 };
  }

  for (const r of reports) {
    if (!scores[r.id.split('-')[0]]) continue;
    const key = r.roundType === 'hr' ? 'hr' : r.roundType === 'technical' ? 'tech' : r.roundType === 'gd' ? 'gd' : 'apt';
    scores[r.id.split('-')[0]] = scores[r.id.split('-')[0]] || { hr: 0, tech: 0, gd: 0, apt: 0, total: 0, count: 0 };
    if (scores[r.id.split('-')[0]]) {
      scores[r.id.split('-')[0]][key] += r.overallScore;
      scores[r.id.split('-')[0]].count++;
    }
  }

  return users.map(u => ({
    userId: u.id,
    name: u.name,
    year: u.year,
    avatar: u.avatar,
    hrScore: scores[u.id]?.hr || 0,
    technicalScore: scores[u.id]?.tech || 0,
    gdScore: scores[u.id]?.gd || 0,
    aptitudeScore: scores[u.id]?.apt || 0,
    totalScore: u.totalScore || Object.values(scores[u.id] || {}).reduce((s: number, v: any) => s + (typeof v === 'number' ? v : 0), 0),
    badges: u.badges || [],
    rank: 0,
  }));
}
