export interface APQuestion {
  id: string;
  question: string;
  category: string;
  company: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export const apQuestions: APQuestion[] = [
  {
    id: 'ap-001',
    question: 'Why do you want to work in Hyderabad specifically?',
    category: 'Location & Relocation',
    company: 'Infosys Hyderabad',
    tips: [
      'Mention Hyderabad as a major tech hub with great career opportunities',
      'Talk about the city\'s infrastructure, culture, and quality of life',
      'Reference Hyderabad\'s nickname "Cyberabad" and its IT ecosystem',
      'Show you have researched the company\'s Hyderabad office specifically'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-002',
    question: 'How does your background from Andhra Pradesh prepare you for this role?',
    category: 'Personal Background',
    company: 'TCS',
    tips: [
      'Highlight your adaptability having grown up in a diverse state',
      'Mention your multilingual skills (Telugu, Hindi, English) as an asset',
      'Talk about your educational background from AP institutions',
      'Connect your AP upbringing to strong work ethic and determination'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-003',
    question: 'What do you know about our company\'s presence in Andhra Pradesh?',
    category: 'Company Knowledge',
    company: 'Wipro',
    tips: [
      'Research the company\'s offices in Hyderabad, Visakhapatnam, or Vijayawada',
      'Mention any specific projects or initiatives in AP',
      'Show awareness of the company\'s CSR activities in the state',
      'Reference the company\'s growth plans in the AP/Telangana region'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-004',
    question: 'Are you willing to relocate within India or internationally for this role?',
    category: 'Location & Relocation',
    company: 'Accenture',
    tips: [
      'Show flexibility and willingness to move wherever required',
      'Mention that you are excited about new experiences in different cities',
      'Highlight your adaptability to new environments',
      'If you have preferences, express them positively without being rigid'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-005',
    question: 'How has your college education in Andhra Pradesh prepared you for the corporate world?',
    category: 'Personal Background',
    company: 'Cognizant',
    tips: [
      'Talk about specific projects, internships, or workshops you attended',
      'Mention any industry exposure or guest lectures your college arranged',
      'Highlight your technical skills gained through your curriculum',
      'Discuss extracurricular activities that built your soft skills'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-006',
    question: 'What do you think are the biggest challenges facing students in Andhra Pradesh today?',
    category: 'Awareness & Perspective',
    company: 'Google',
    tips: [
      'Discuss the gap between academic curriculum and industry requirements',
      'Mention the need for more internship opportunities in AP',
      'Talk about the importance of English communication skills',
      'Show your awareness of the evolving job market in the state'
    ],
    difficulty: 'hard'
  },
  {
    id: 'ap-007',
    question: 'Tell us about a time you worked in a team during your college projects in AP.',
    category: 'Behavioral',
    company: 'Microsoft',
    tips: [
      'Use the STAR method — Situation, Task, Action, Result',
      'Describe a specific project from your college curriculum',
      'Highlight your role and contribution to the team',
      'Mention any challenges you faced working with diverse team members'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-008',
    question: 'How do you plan to contribute to the growth of the IT sector in Andhra Pradesh?',
    category: 'Vision & Goals',
    company: 'Infosys',
    tips: [
      'Talk about your desire to work on cutting-edge technologies',
      'Mention how you want to mentor and help other AP students',
      'Discuss your interest in contributing to the local tech ecosystem',
      'Show your long-term commitment to the region\'s development'
    ],
    difficulty: 'hard'
  },
  {
    id: 'ap-009',
    question: 'Why should we hire you over students from other states?',
    category: 'Self Introduction',
    company: 'Amazon',
    tips: [
      'Highlight your unique perspective as someone from Andhra Pradesh',
      'Mention your multilingual ability as an advantage',
      'Talk about your strong foundational education from AP',
      'Show your determination and hunger to succeed'
    ],
    difficulty: 'hard'
  },
  {
    id: 'ap-010',
    question: 'Where do you see the IT industry in Hyderabad and Visakhapatnam in the next 5 years?',
    category: 'Industry Awareness',
    company: 'Tech Mahindra',
    tips: [
      'Discuss Hyderabad\'s growth as a global tech destination',
      'Mention Vizag\'s emerging IT corridor and startup ecosystem',
      'Talk about trends like AI, cloud computing, and digital transformation',
      'Show your enthusiasm to be part of this growth story'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-011',
    question: 'How do you handle working in a multi-cultural environment with colleagues from across India?',
    category: 'Behavioral',
    company: 'Deloitte',
    tips: [
      'Share your experience interacting with students from other states',
      'Mention any exposure to diverse cultures during internships or events',
      'Highlight your open-mindedness and willingness to learn from others',
      'Emphasize your strong English communication skills'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-012',
    question: 'What are the top 3 skills you have developed during your engineering in AP?',
    category: 'Personal Background',
    company: 'Capgemini',
    tips: [
      'Pick skills that are relevant to the job you are applying for',
      'Provide specific examples of how you developed each skill',
      'Mention both technical skills and soft skills',
      'Show how these skills make you a strong candidate'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-013',
    question: 'How do you stay updated with the latest technology trends when access to resources may be limited?',
    category: 'Learning & Growth',
    company: 'HCL',
    tips: [
      'Mention online platforms like Coursera, Udemy, and NPTEL',
      'Talk about YouTube channels and tech blogs you follow',
      'Discuss any coding communities or hackathons you participate in',
      'Show your proactive approach to self-learning'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-014',
    question: 'Describe a challenge you faced during your studies in Andhra Pradesh and how you overcame it.',
    category: 'Behavioral',
    company: 'Wipro',
    tips: [
      'Choose a genuine challenge — academic, personal, or technical',
      'Explain the steps you took to overcome it',
      'Highlight what you learned from the experience',
      'End with how it made you stronger'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-015',
    question: 'What do you think sets apart a candidate from Andhra Pradesh colleges?',
    category: 'Self Introduction',
    company: 'TCS',
    tips: [
      'Talk about the strong work ethic and discipline instilled by AP education',
      'Mention the competitive environment that pushes students to excel',
      'Highlight the technical foundation built in AP engineering colleges',
      'Show pride in your background without being arrogant'
    ],
    difficulty: 'hard'
  },
  {
    id: 'ap-016',
    question: 'How comfortable are you with working in night shifts or rotating shifts?',
    category: 'Work Preferences',
    company: 'Tech Mahindra',
    tips: [
      'Show flexibility and willingness to adapt to business needs',
      'Mention any experience you have with flexible schedules',
      'Talk about how you manage your energy and health during shifts',
      'Be honest about any constraints you may have'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-017',
    question: 'What role do you think technology can play in transforming rural Andhra Pradesh?',
    category: 'Awareness & Perspective',
    company: 'Cognizant',
    tips: [
      'Discuss digital literacy programs and their impact',
      'Mention e-governance initiatives transforming rural services',
      'Talk about how technology can improve agriculture and healthcare',
      'Show your broader vision beyond just coding'
    ],
    difficulty: 'hard'
  },
  {
    id: 'ap-018',
    question: 'Where do you see yourself in 5 years, and how does this company fit into that plan?',
    category: 'Career Goals',
    company: 'Accenture',
    tips: [
      'Show ambition to grow into a technical leader or domain expert',
      'Express desire to grow within the same company',
      'Align your goals with the company\'s growth areas',
      'Be realistic about your career progression'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-019',
    question: 'What do you know about our company culture and why does it appeal to you?',
    category: 'Company Knowledge',
    company: 'Google',
    tips: [
      'Research the company\'s values and work environment before the interview',
      'Mention specific aspects that resonate with you personally',
      'Connect the company culture to your own work style and values',
      'Show genuine enthusiasm for how the company operates'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-020',
    question: 'How do you plan to bridge the gap between college education and industry expectations?',
    category: 'Learning & Growth',
    company: 'Amazon',
    tips: [
      'Mention your plans for continuous upskilling and certifications',
      'Talk about learning from industry mentors and seniors',
      'Discuss your participation in hackathons and coding competitions',
      'Show awareness of the specific skills the industry demands'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-021',
    question: 'What motivates you to pursue a career in IT despite the challenges?',
    category: 'Career Goals',
    company: 'Infosys',
    tips: [
      'Share a personal story about what drew you to technology',
      'Talk about the satisfaction of building solutions that help people',
      'Mention role models or mentors who inspired you',
      'Show genuine passion for the field'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-022',
    question: 'How do you handle pressure during exam season or project deadlines?',
    category: 'Behavioral',
    company: 'HCL',
    tips: [
      'Describe specific time management techniques you use',
      'Mention how you prioritize tasks and stay organized',
      'Talk about maintaining a healthy work-life balance',
      'Show that pressure brings out your best performance'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-023',
    question: 'What do you think is the future of the pharmaceutical and IT industries in Visakhapatnam?',
    category: 'Industry Awareness',
    company: 'Capgemini',
    tips: [
      'Discuss Vizag\'s pharma corridor and special economic zone',
      'Mention the growing IT presence in Vizag\'s Madhurawada area',
      'Talk about the synergy between pharma and IT in the region',
      'Show your knowledge of local industry developments'
    ],
    difficulty: 'hard'
  },
  {
    id: 'ap-024',
    question: 'How would you describe the work culture in Andhra Pradesh vs other states?',
    category: 'Awareness & Perspective',
    company: 'Deloitte',
    tips: [
      'Be diplomatic and positive in your comparison',
      'Highlight the collaborative and supportive nature of AP teams',
      'Mention the strong family values that translate to loyalty',
      'Avoid criticizing any region or culture'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-025',
    question: 'Tell me about a project you built during your engineering that solved a real problem.',
    category: 'Technical Experience',
    company: 'Microsoft',
    tips: [
      'Choose a project that had practical applications',
      'Explain the problem, your approach, and the technology stack used',
      'Mention any impact or feedback you received',
      'Connect it to the role you are applying for'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-026',
    question: 'What programming languages are you most comfortable with and why?',
    category: 'Technical Experience',
    company: 'TCS',
    tips: [
      'Be honest about your strongest languages',
      'Mention specific projects where you used each language',
      'Show willingness to learn new languages as needed',
      'Avoid claiming expertise in languages you barely know'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-027',
    question: 'How do you plan to improve your English communication skills for the corporate environment?',
    category: 'Learning & Growth',
    company: 'Wipro',
    tips: [
      'Show self-awareness about areas for improvement',
      'Mention specific steps — reading, speaking practice, online courses',
      'Talk about participating in debates or presentations in college',
      'Express confidence in your ability to improve quickly'
    ],
    difficulty: 'easy'
  },
  {
    id: 'ap-028',
    question: 'What do you know about the startup ecosystem in Hyderabad and what interests you about it?',
    category: 'Industry Awareness',
    company: 'Google',
    tips: [
      'Discuss Hyderabad\'s thriving startup scene in HITEC City',
      'Mention well-known startups founded in Hyderabad',
      'Talk about the government\'s T-Hub initiative supporting startups',
      'Show your entrepreneurial spirit and innovative thinking'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-029',
    question: 'How would you contribute to our company\'s diversity and inclusion efforts?',
    category: 'Vision & Goals',
    company: 'Accenture',
    tips: [
      'Discuss your experience working with diverse teams',
      'Mention the importance of different perspectives in problem-solving',
      'Talk about how your background adds to workplace diversity',
      'Show commitment to creating an inclusive environment'
    ],
    difficulty: 'medium'
  },
  {
    id: 'ap-030',
    question: 'What is your greatest strength and how will it help you succeed in this role?',
    category: 'Self Introduction',
    company: 'Amazon',
    tips: [
      'Choose a strength that is directly relevant to the job',
      'Provide a specific example that demonstrates this strength',
      'Connect it to Amazon\'s leadership principles if possible',
      'Be confident but not arrogant'
    ],
    difficulty: 'easy'
  },
];
