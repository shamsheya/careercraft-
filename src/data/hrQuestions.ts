export interface HRQuestion {
  id: string;
  question: string;
  category: string;
  company: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export const hrQuestions: HRQuestion[] = [
  {
    id: 'hr-001',
    question: 'Tell me about yourself.',
    category: 'Self Introduction',
    company: 'TCS',
    tips: [
      'Start with your current role and briefly summarize your educational background.',
      'Highlight 2-3 key technical skills relevant to the job you are applying for.',
      'Mention a recent project or achievement that demonstrates your capabilities.',
      'End with why you are excited about this opportunity at TCS.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-002',
    question: 'What are your strengths and weaknesses?',
    category: 'Strengths & Weaknesses',
    company: 'Infosys',
    tips: [
      'Choose strengths that are relevant to the role, such as problem-solving or teamwork.',
      'Back each strength with a brief example from your experience.',
      'Pick a real weakness and explain the steps you are taking to improve it.',
      'Avoid clichés like "I work too hard" — be honest and self-aware.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-003',
    question: 'Why should we hire you?',
    category: 'Self Introduction',
    company: 'Accenture',
    tips: [
      'Connect your technical skills directly to the job description requirements.',
      'Highlight what sets you apart from other candidates — unique experience or perspective.',
      'Show enthusiasm for Accenture\'s global impact and client-focused culture.',
      'Be concise and confident; summarize your value proposition in 30 seconds.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-004',
    question: 'Where do you see yourself in 5 years?',
    category: 'Career Goals',
    company: 'Wipro',
    tips: [
      'Show ambition while remaining realistic about career progression.',
      'Express desire to grow within the company, not just jump ship.',
      'Mention wanting to take on more responsibility or leadership roles.',
      'Align your answer with Wipro\'s focus areas like digital transformation.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-005',
    question: 'Why do you want to work at Amazon?',
    category: 'Company Specific',
    company: 'Amazon',
    tips: [
      'Reference Amazon\'s Leadership Principles and give examples that demonstrate them.',
      'Mention your admiration for Amazon\'s customer obsession and innovation.',
      'Talk about a specific Amazon product or service you personally value.',
      'Show that you understand the fast-paced nature of Amazon\'s work environment.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-006',
    question: 'Tell me about a time you faced a challenge at work or in a project.',
    category: 'Behavioral',
    company: 'Google',
    tips: [
      'Use the STAR method — Situation, Task, Action, Result.',
      'Choose a challenge that had real stakes and a measurable outcome.',
      'Emphasize your problem-solving process and the steps you took.',
      'End with what you learned and how it made you a better engineer.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-007',
    question: 'How do you handle pressure or stressful situations?',
    category: 'Behavioral',
    company: 'Tech Mahindra',
    tips: [
      'Describe a specific high-pressure scenario and how you managed it.',
      'Mention techniques like prioritizing, breaking tasks down, or staying calm.',
      'Show that pressure motivates you rather than paralyzes you.',
      'Avoid saying you never feel pressure — it sounds unrealistic.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-008',
    question: 'Describe a situation where you worked successfully in a team.',
    category: 'Behavioral',
    company: 'Cognizant',
    tips: [
      'Highlight your specific contribution to the team\'s success.',
      'Mention how you handled disagreements or differing opinions.',
      'Show that you value collaboration and can adapt to team dynamics.',
      'Use metrics or outcomes to demonstrate the team\'s achievement.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-009',
    question: 'What is your greatest professional achievement?',
    category: 'Behavioral',
    company: 'Microsoft',
    tips: [
      'Pick an achievement that had quantifiable impact, like performance improvement.',
      'Explain the obstacles you overcame to reach that achievement.',
      'Connect it to skills that are relevant to the Microsoft role.',
      'Be passionate — let your pride in the work show naturally.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-010',
    question: 'Why did you choose this career path?',
    category: 'Career Goals',
    company: 'HCL',
    tips: [
      'Share a genuine story about what sparked your interest in this field.',
      'Mention how your skills align with the demands of the career.',
      'Show that you have a long-term vision for growth in this domain.',
      'Relate it to HCL\'s culture of innovation and employee development.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-011',
    question: 'How do you prioritize your tasks when you have multiple deadlines?',
    category: 'Behavioral',
    company: 'Capgemini',
    tips: [
      'Explain your method — Eisenhower Matrix, task lists, or Agile tools.',
      'Mention how you communicate with stakeholders about shifting priorities.',
      'Give an example where prioritization saved a project from missing a deadline.',
      'Emphasize flexibility — priorities can change, and you adapt quickly.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-012',
    question: 'Tell me about a time you failed and what you learned from it.',
    category: 'Behavioral',
    company: 'Deloitte',
    tips: [
      'Own the failure completely — do not blame others or external factors.',
      'Explain what went wrong and the root cause you identified afterward.',
      'Detail the specific changes you made to prevent it from happening again.',
      'Show maturity by framing failure as a learning opportunity.'
    ],
    difficulty: 'hard'
  },
  {
    id: 'hr-013',
    question: 'What motivates you to do your best work?',
    category: 'Behavioral',
    company: 'TCS',
    tips: [
      'Be honest — mention what genuinely drives you, like solving problems or learning.',
      'Connect your motivation to the company\'s mission or team goals.',
      'Avoid generic answers like "money" — focus on intrinsic motivators.',
      'Give a brief example of a time motivation led to great results.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-014',
    question: 'How do you deal with conflict in a team?',
    category: 'Behavioral',
    company: 'Infosys',
    tips: [
      'Emphasize listening first — understand all perspectives before responding.',
      'Focus on the problem, not the person, to keep discussions constructive.',
      'Describe how you work toward a compromise or win-win solution.',
      'Mention when it is appropriate to involve a manager or mediator.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-015',
    question: 'What are your salary expectations?',
    category: 'Behavioral',
    company: 'Accenture',
    tips: [
      'Research industry standards and the typical range for the role beforehand.',
      'Provide a range rather than a fixed number to leave room for negotiation.',
      'Consider the total compensation package, not just the base salary.',
      'Be confident but flexible — express openness to discuss based on responsibilities.'
    ],
    difficulty: 'hard'
  },
  {
    id: 'hr-016',
    question: 'Describe your leadership experience.',
    category: 'Behavioral',
    company: 'Amazon',
    tips: [
      'Use a specific example where you led a team, project, or initiative.',
      'Talk about how you motivated others and handled disagreements.',
      'Mention outcomes — did the team deliver on time or exceed goals?',
      'Reference Amazon\'s "Hire and Develop the Best" leadership principle.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-017',
    question: 'How do you stay updated with the latest industry trends?',
    category: 'Behavioral',
    company: 'Microsoft',
    tips: [
      'Mention specific sources — blogs, newsletters, podcasts, or conferences.',
      'Show that learning is a habit, not something you do only when asked.',
      'Give an example of a trend you adopted that improved your work.',
      'Connect your learning approach to Microsoft\'s growth mindset culture.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-018',
    question: 'What do you know about our company?',
    category: 'Company Specific',
    company: 'Google',
    tips: [
      'Research Google\'s products, mission, and recent news before the interview.',
      'Mention specific initiatives or technologies Google is working on.',
      'Show genuine interest in the company culture and work environment.',
      'Avoid generic statements — demonstrate that you have done your homework.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-019',
    question: 'Why is there a gap in your resume?',
    category: 'Behavioral',
    company: 'Wipro',
    tips: [
      'Be honest and upfront about the reason for the gap.',
      'Explain what you did during that time — upskilling, freelancing, or personal growth.',
      'Emphasize that you are now fully ready and excited to return to work.',
      'Keep the explanation brief and positive — do not dwell on negatives.'
    ],
    difficulty: 'hard'
  },
  {
    id: 'hr-020',
    question: 'Are you willing to relocate?',
    category: 'Behavioral',
    company: 'HCL',
    tips: [
      'Give a clear yes or no — ambiguity can hurt your chances.',
      'If yes, mention that you are excited about the opportunity to move.',
      'If you have conditions, state them politely and professionally.',
      'Show flexibility and willingness to adapt to the company\'s needs.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-021',
    question: 'How do you handle constructive criticism?',
    category: 'Behavioral',
    company: 'Capgemini',
    tips: [
      'Show that you see feedback as a tool for growth, not a personal attack.',
      'Give an example where feedback helped you improve your performance.',
      'Mention that you actively seek feedback to identify blind spots.',
      'Explain your process for acting on feedback and tracking improvement.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-022',
    question: 'What makes you unique as a candidate?',
    category: 'Self Introduction',
    company: 'Deloitte',
    tips: [
      'Identify a combination of skills or experiences that few candidates have.',
      'Share a perspective or background that adds diversity to the team.',
      'Connect your uniqueness to how it will benefit Deloitte\'s clients.',
      'Be memorable — tell a short story that illustrates your distinct value.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-023',
    question: 'Describe a time you went above and beyond for a project or client.',
    category: 'Behavioral',
    company: 'Cognizant',
    tips: [
      'Choose an instance where you voluntarily took on extra responsibility.',
      'Quantify the impact — saved time, reduced cost, or improved satisfaction.',
      'Explain your thought process and what motivated you to go the extra mile.',
      'Highlight how it reflects your commitment to quality and client success.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-024',
    question: 'How do you manage multiple deadlines and competing priorities?',
    category: 'Behavioral',
    company: 'Tech Mahindra',
    tips: [
      'Describe your system — calendars, task managers, or Agile boards.',
      'Explain how you assess urgency and impact when deciding what to do first.',
      'Mention how you communicate proactively when deadlines are at risk.',
      'Give a real example of juggling multiple projects successfully.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-025',
    question: 'What skills do you want to develop in the next year?',
    category: 'Career Goals',
    company: 'Infosys',
    tips: [
      'Choose skills that align with the role and the company\'s future direction.',
      'Show that you have already started working on developing them.',
      'Be specific — not "better coding" but "mastering React with TypeScript."',
      'Demonstrate a growth mindset and eagerness to contribute more.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-026',
    question: 'Why do you want to leave your current job?',
    category: 'Career Goals',
    company: 'Accenture',
    tips: [
      'Focus on what you are moving toward, not what you are escaping.',
      'Mention desire for growth, new challenges, or better alignment with values.',
      'Never badmouth your current or past employer.',
      'Frame it as a positive career decision tied to your long-term goals.'
    ],
    difficulty: 'hard'
  },
  {
    id: 'hr-027',
    question: 'Tell me about a time you had to learn a new technology quickly.',
    category: 'Behavioral',
    company: 'Google',
    tips: [
      'Describe the situation — tight deadline, unfamiliar tech, high stakes.',
      'Explain your learning approach — documentation, courses, or mentorship.',
      'Show that you delivered a working solution despite the learning curve.',
      'Highlight your adaptability and confidence in picking up new tools.'
    ],
    difficulty: 'medium'
  },
  {
    id: 'hr-028',
    question: 'How would your colleagues describe you?',
    category: 'Self Introduction',
    company: 'Microsoft',
    tips: [
      'Choose 2-3 adjectives backed by real feedback or anecdotes.',
      'Mention both technical skills and soft skills for a balanced picture.',
      'Keep it authentic — do not claim traits you cannot support with examples.',
      'Align the traits with Microsoft\'s values like collaboration and innovation.'
    ],
    difficulty: 'easy'
  },
  {
    id: 'hr-029',
    question: 'Describe a time you had to persuade someone to see your point of view.',
    category: 'Behavioral',
    company: 'Amazon',
    tips: [
      'Use a work-related example where stakes were meaningful.',
      'Explain the data or reasoning you used to build your case.',
      'Show that you listened to the other side and addressed their concerns.',
      'Reference Amazon\'s "Have Backbone; Disagree and Commit" principle.'
    ],
    difficulty: 'hard'
  },
  {
    id: 'hr-030',
    question: 'What do you think is the biggest challenge facing our industry today?',
    category: 'Company Specific',
    company: 'TCS',
    tips: [
      'Show that you follow industry news and understand macro trends.',
      'Pick a specific challenge — AI disruption, cybersecurity, or talent shortage.',
      'Offer your perspective on how companies like TCS can address it.',
      'Stay positive — frame challenges as opportunities for innovation.'
    ],
    difficulty: 'hard'
  }
];
