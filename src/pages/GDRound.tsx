import { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { evaluateGDResponse, generateFeedbackReport } from '../utils/aiEngine';
import type { GDSession, GDTeam, GDParticipant, GDMessage } from '../types';

const topics = [
  { id: 'ai-jobs', title: 'Impact of AI on Jobs', emoji: '🤖', color: '#6366f1' },
  { id: 'climate-tech', title: 'Climate Change & Technology', emoji: '🌍', color: '#10b981' },
  { id: 'digital-india', title: 'Digital Transformation in India', emoji: '📱', color: '#f59e0b' },
  { id: 'remote-vs-office', title: 'Remote Work vs Office Work', emoji: '🏠', color: '#8b5cf6' },
  { id: 'social-media-health', title: 'Social Media & Mental Health', emoji: '🧠', color: '#ec4899' },
  { id: 'gender-equality', title: 'Gender Equality in Workplace', emoji: '⚖️', color: '#14b8a6' },
];

const topicContent: Record<string, Record<string, string>> = {
  'Impact of AI on Jobs': {
    'p-0': 'I believe AI will fundamentally reshape our workforce, but we must not fear it. Automation has historically displaced workers temporarily while creating entirely new categories of employment. The key lies in massive reskilling initiatives and educational reform to prepare people for an AI-augmented future. We need proactive policies rather than reactive panic.',
    'p-1': 'While AI does threaten routine jobs, I see it as a powerful tool for augmentation rather than pure replacement. In healthcare, AI assists doctors with diagnosis; in law, it helps with document review. The human element of empathy, creativity, and ethical judgment cannot be automated. We should focus on human-AI collaboration models.',
    'p-2': 'The reality is that AI will disproportionately affect marginalized workers in manufacturing, data entry, and customer service. Without strong social safety nets and universal basic income experiments, we risk massive inequality. India, with its large informal workforce, needs unique solutions that combine technology with social protection.',
    'p-3': "From what I have observed in the tech sector, AI is already eliminating intermediate-level positions. Junior developers using GitHub Copilot produce senior-level output. This compression of the experience curve means fewer entry-level jobs. We must redesign career progression to account for this new reality where AI handles the grunt work.",
    'p-4': "I think we're underestimating AI's potential to create entirely new industries. The app economy, social media management, and data science barely existed two decades ago. AI will birth roles we cannot even imagine today. The key is building a culture of lifelong learning and adaptability in our workforce.",
    'p-5': 'Job displacement from AI is a real concern, but consider the demographics. India has a young population that is digitally native. We can leapfrog older economies by embedding AI literacy into our education system from primary school. The countries that invest in AI education now will dominate the future economy.',
    'p-6': 'My concern is about the speed of change. Industrial revolution took centuries; AI transformation is happening in decades. Our institutions - education, labor laws, social security - cannot adapt fast enough. We need a moratorium on certain AI deployments until regulatory frameworks catch up.',
    'p-7': 'I respectfully disagree about a moratorium. Other nations will not wait for us. China and the US are racing ahead in AI adoption. If India slows down, we will lose our competitive advantage in IT services. Instead of slowing AI, we should accelerate our adaptation mechanisms.',
    'p-8': 'The gig economy powered by AI platforms is already creating precarious work. Cab drivers, delivery workers, and freelancers are at the mercy of algorithmic management. We need new labor rights for the AI age - portable benefits, algorithmic transparency, and the right to human review of automated decisions.',
    'p-9': 'Looking at historical patterns, every major technological shift from the printing press to the internet initially caused job losses but ultimately raised living standards. AI is no different. The real risk is not technology itself but how we manage the transition. I am cautiously optimistic if we implement proper policies.',
  },
  'Climate Change & Technology': {
    'p-0': 'Technology is our most powerful weapon against climate change. Renewable energy costs have dropped 90% in a decade, electric vehicles are becoming mainstream, and carbon capture technology is advancing rapidly. We have the tools; we just need the political will and capital allocation to deploy them at scale.',
    'p-1': 'I agree that technology helps, but we cannot tech-bubble our way out of this crisis. The rebound effect is real - efficiency gains often lead to increased consumption. We need behavioral change, reduced consumption, and systemic economic restructuring. Technology alone is not a silver bullet.',
    'p-2': 'India faces a unique challenge - we need to grow our economy while decarbonizing. Developed nations grew by polluting freely for centuries. Climate justice demands that rich countries fund our green transition. Technology transfer from the global north to south is essential for global climate goals.',
    'p-3': 'Precision agriculture using AI and IoT sensors can reduce water usage by 30% and fertilizer use by 20%. For an agricultural economy like India, this is transformative. Smart grids with renewable integration can make our power sector greener. Technology enables efficiency that directly reduces emissions.',
    'p-4': 'Carbon pricing through cap-and-trade systems, enabled by blockchain for transparent tracking, could create market mechanisms for emission reduction. I believe market forces, guided by smart regulation, can drive innovation faster than mandates. Green technology is already profitable without subsidies in many sectors.',
    'p-5': 'We are running out of time. The IPCC reports keep getting more dire, and our emissions keep rising. While technology offers hope, we have already passed several tipping points. Adaptation technologies like flood-resistant infrastructure and drought-resistant crops are as important as mitigation.',
    'p-6': 'Nuclear energy is the overlooked solution. Modern small modular reactors are safe, produce zero emissions, and provide baseload power that solar and wind cannot. Germany\'s Energiewende shows the limits of renewables without nuclear. We need an honest conversation about nuclear power.',
    'p-7': 'The simplest and cheapest climate technology is planting trees. Reforestation and afforestation, combined with regenerative agriculture, can sequester massive amounts of carbon. Technology should complement nature-based solutions, not replace them. We cannot engineer our way out of a problem we created by disrupting natural systems.',
    'p-8': 'Green hydrogen is the breakthrough we need for hard-to-abate sectors like steel, cement, and shipping. India\'s National Green Hydrogen Mission is ambitious but achievable. We have the solar resources to produce green hydrogen at scale. This could make India a clean energy superpower.',
    'p-9': 'I worry about the resource intensity of green technology. Electric vehicle batteries require lithium, cobalt, and rare earth metals, often mined under terrible conditions. Solar panels have a 25-year lifespan and create e-waste. We need circular economy thinking in green technology design from the start.',
  },
  'Digital Transformation in India': {
    'p-0': 'India\'s digital transformation is nothing short of remarkable. UPI processed over 10 billion transactions monthly, making India the largest real-time payments market globally. We have skipped the credit card generation entirely and gone straight to mobile payments. This is a model for the developing world.',
    'p-1': 'While urban India enjoys seamless digital services, the digital divide remains stark. Only 45% of rural India has internet access. Women are 30% less likely to own smartphones than men. Digital transformation must be inclusive, or it risks exacerbating existing inequalities rather than reducing them.',
    'p-2': 'Aadhaar and India Stack have created a digital public infrastructure that enables innovation at population scale. From fintech to healthtech, startups are building on this foundation. The key insight is that India built digital rails like UPI, Aadhaar, and DigiLocker as public goods, enabling private sector innovation.',
    'p-3': 'Digital transformation in education through platforms like DIKSHA and SWAYAM is democratizing access to quality learning. A student in a remote village can now access IIT lectures. Online education exploded during COVID and has now become a permanent supplement to traditional schooling.',
    'p-4': 'E-governance initiatives like e-NAM for agricultural markets have reduced middlemen and increased farmer incomes. Digitizing land records, property registration, and business licensing reduces corruption and transaction costs. According to studies, digitization could add $1 trillion to India\'s GDP by 2025.',
    'p-5': 'We must discuss cybersecurity. As India becomes more digital, it becomes more vulnerable. The AIIMS ransomware attack and frequent data breaches show our defenses are inadequate. Digital transformation must be accompanied by robust cybersecurity frameworks and data protection legislation.',
    'p-6': 'The real story is how small businesses have digitized. Chai wallahs using UPI, local kirana stores on e-commerce platforms, artisans selling globally on Etsy. Digital transformation in India is bottom-up, driven by adoption at the grassroots, not just top-down government initiatives.',
    'p-7': 'Interoperability remains a challenge. Different government databases don\'t talk to each other, multiple digital IDs create confusion, and last-mile connectivity in the Himalayan and northeastern regions is poor. True digital transformation requires ubiquitous, affordable, and reliable internet connectivity.',
    'p-8': 'Digital transformation of healthcare through telemedicine and Ayushman Bharat Digital Mission can solve India\'s doctor-to-patient ratio problem. With one doctor per 1,400 patients in urban areas and far worse in rural areas, technology-enabled healthcare delivery is not optional - it is essential.',
    'p-9': 'I am concerned about digital surveillance and privacy. As government services go digital, citizens leave data trails that could be misused. The Digital Personal Data Protection Act is a start, but enforcement and awareness remain weak. Digital rights must be part of the transformation conversation.',
  },
  'Remote Work vs Office Work': {
    'p-0': 'Remote work is the future of employment. Studies show productivity increased by 13% on average during forced remote work. Employees save two hours daily on commuting, companies save on real estate costs. For India\'s traffic-clogged cities, remote work is an environmental and quality-of-life necessity.',
    'p-1': 'I strongly believe physical offices provide irreplaceable value. Spontaneous collaboration, mentorship through osmosis, and team culture are difficult to replicate remotely. Junior employees especially suffer from remote work because they miss informal learning from observing senior colleagues.',
    'p-2': 'The truth is somewhere in between. Hybrid models that combine remote flexibility with intentional in-person collaboration are optimal. Companies like Microsoft and Google have found that three days in office, two days remote maximizes both collaboration and focused work. One size does not fit all.',
    'p-3': 'Remote work has been a game-changer for women\'s workforce participation. Many women who had to leave careers due to childcare responsibilities or safety concerns can now work effectively from home. In India, female labor force participation could increase significantly with remote work options.',
    'p-4': 'The Indian IT services industry, which employs 5 million people, is built on the office model. Wipro, Infosys, and TCS have invested billions in campuses. A wholesale shift to remote work would strand these assets and disrupt the established training and team-building models that made Indian IT successful globally.',
    'p-5': 'Collaboration tools have matured enormously. Miro for whiteboarding, Slack for communication, Zoom for meetings, and Notion for documentation create a digital workplace that can be more efficient than physical offices. Async communication reduces meeting overload and allows deep work.',
    'p-6': 'Creativity and innovation suffer in remote settings. The random encounters at the coffee machine, the whiteboard brainstorming sessions, the post-meeting hallway conversations - these serendipitous interactions drive innovation. Steve Jobs famously designed Pixar\'s offices to force unexpected encounters.',
    'p-7': 'Global talent competition has changed the game. With remote work, Indian talent can work for US companies without relocating. This means better salaries and global exposure. Conversely, Indian companies can hire the best talent from smaller cities, not just from metro areas.',
    'p-8': 'The mental health impact of remote work is concerning. Loneliness, burnout from extended hours, and the blurring of work-life boundaries are real issues. Not everyone has a proper home office setup. We need to design remote work policies that address these challenges.',
    'p-9': 'Real estate and infrastructure will adapt. We are seeing the rise of co-working spaces near residential areas, reducing commute times while providing professional environments. The future is not purely remote or office-based, but a diverse ecosystem of work arrangements tailored to individual and team needs.',
  },
  'Social Media & Mental Health': {
    'p-0': 'Social media platforms are designed to be addictive. The infinite scroll, notification algorithms, and like-counts trigger dopamine responses that keep users hooked. Studies show a direct correlation between social media usage exceeding three hours daily and increased rates of anxiety and depression in teenagers.',
    'p-1': 'I agree there are risks, but social media also provides crucial support networks. LGBTQ+ youth in conservative families, patients with rare diseases, and minorities in isolated areas find community online. We cannot ignore these benefits while discussing mental health impacts.',
    'p-2': 'The comparison culture on Instagram and Facebook is devastating for self-esteem. People present curated highlight reels while viewers compare their messy reality. This social comparison theory in action has led to body image issues, especially among young women. Beauty filters are making this worse.',
    'p-3': 'Social media has democratized access to mental health information and resources. Therapy accounts, mindfulness content, and peer support groups on platforms like Reddit and Twitter help people understand and manage their mental health. For many, the first step to seeking help comes from online content.',
    'p-4': 'The Indian context is different. With 600 million internet users, many experiencing their first digital interactions on cheap smartphones, digital literacy around social media is low. Misinformation, cyberbullying, and online radicalization are severe threats that India has not adequately addressed.',
    'p-5': 'I believe the solution is digital hygiene education, not abstinence. Teaching children and adults to use social media mindfully, to curate their feeds, to take digital detoxes, and to recognize manipulation tactics. Finland teaches media literacy in schools - India should too.',
    'p-6': 'The algorithms themselves are the problem. Engagement-based algorithms amplify extreme content because outrage drives more clicks than nuanced discussion. YouTube has been shown to radicalize users by recommending increasingly extreme videos. Platform design choices have mental health consequences.',
    'p-7': 'Screen time before bed disrupts sleep patterns through blue light exposure and cognitive stimulation. Poor sleep is linked to depression, anxiety, and reduced academic performance. The always-on culture means teenagers are connected 24/7, unable to disconnect even for essential rest.',
    'p-8': 'Parental controls and platform regulations like the Digital Services Act in Europe can help, but ultimately tech companies need to prioritize well-being over engagement. Apple\'s Screen Time and Instagram\'s "Take a Break" features are steps in the right direction but need to go further.',
    'p-9': 'We are conducting an unprecedented global experiment on human psychology without informed consent. Billions of people are using platforms designed by a few engineers in Silicon Valley. The long-term effects of a childhood spent on social media will not be fully understood for another decade. We need precaution.',
  },
  'Gender Equality in Workplace': {
    'p-0': 'Gender equality is not just a moral imperative but an economic one. McKinsey research shows that advancing women\'s equality could add $12 trillion to global GDP by 2025. Companies with gender-diverse leadership outperform their peers by 25% on profitability. The business case is overwhelming.',
    'p-1': 'While we have made progress in entry-level hiring, the leaky pipeline problem persists. Women drop out at every career stage due to unconscious bias, unequal caregiving responsibilities, and hostile work environments. Only 5% of CEOs in the Fortune 500 are women. The numbers are worse in India.',
    'p-2': 'Maternity and paternity leave policies need fundamental reform. India mandates 26 weeks of maternity leave but only one week of paternity leave. This reinforces the stereotype that childcare is women\'s work. Equal parental leave, on-site childcare, and flexible hours help retain women.',
    'p-3': 'Sexual harassment at workplace remains a pervasive issue despite POSH Act compliance. Many companies have committees on paper but lack real enforcement. Fear of retaliation prevents reporting. True equality requires safe workspaces where women can work without harassment or discrimination.',
    'p-4': 'I believe quota systems are necessary as a temporary measure. Norway\'s 40% board quota for women worked - it broke the old boys\' network and created role models. India\'s reservation for women in local governance has been highly effective. Corporate boards should follow similar principles.',
    'p-5': 'The gender pay gap in India is 19% on average and higher in senior roles. Transparent salary structures, regular pay equity audits, and banning salary history questions during hiring can help close this gap. When women know what men earn, they can negotiate more effectively.',
    'p-6': 'We need more women in STEM and technology fields. Currently only 30% of STEM students in India are women. Programs like "Women in Engineering" at IITs and scholarships for girls in technical education can help. Role models like Kiran Mazumdar-Shaw and Falguni Nayar inspire the next generation.',
    'p-7': 'Unconscious bias training for managers, diverse hiring panels, and blind resume screening can reduce bias in recruitment and promotion. Many tech companies have implemented Rooney Rule-type policies requiring diverse candidate slates. These interventions measurably improve diversity outcomes.',
    'p-8': 'The conversation must also include intersectionality - women from Dalit, tribal, and religious minority backgrounds face compounded discrimination. Gender equality policies that ignore caste and class dimensions will only benefit privileged women. We need an inclusive feminism.',
    'p-9': 'Men must be active allies in this fight. Gender equality is not a zero-sum game where men lose. Diverse teams make better decisions, and work environments that support women also support men\'s mental health and work-life balance. We all benefit from breaking free of rigid gender roles.',
  },
};

const roundTurns = [
  { round: 1, label: 'Opening Statements', participants: ['p-0', 'p-1', 'p-2', 'p-3'] },
  { round: 2, label: 'Rebuttals & Counter-arguments', participants: ['p-4', 'p-5', 'p-6', 'p-7'] },
  { round: 3, label: 'Closing Remarks', participants: ['p-8', 'p-9'] },
];

function createGDParticipants(users: any[]): GDParticipant[] {
  const names = [
    'Demo Student', 'Priya Sharma', 'Rahul Verma', 'Ananya Reddy',
    'Arjun Mehta', 'Sneha Patel', 'Vikram Joshi', 'Kavya Nair',
    'Neha Gupta', 'Rohan Desai',
  ];
  const avatars = [
    '👨‍🎓', '👩‍🎓', '👨‍🎓', '👩‍🎓',
    '👨‍🎓', '👩‍🎓', '👨‍🎓', '👩‍🎓',
    '👩‍🎓', '👨‍🎓',
  ];
  const existingNames = new Set(users.map((u: any) => u.name));
  return names.map((name, i) => {
    const existing = users.find((u: any) => u.name === name);
    return {
      id: `p-${i}`,
      name,
      avatar: existing?.avatar || avatars[i],
      score: 0,
      fluency: 0,
      confidence: 0,
      logic: 0,
      hasSpoken: false,
    };
  });
}

const s: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#e2e8f0',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: '24px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    maxWidth: '960px',
    margin: '0 auto',
  },
  topicCard: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  topicEmoji: {
    fontSize: '40px',
    marginBottom: '12px',
    display: 'block',
  },
  topicTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  teamsContainer: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  teamCard: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    flex: '1',
    minWidth: '280px',
    maxWidth: '400px',
  },
  teamHeader: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  participantItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: '#0f172a',
    borderRadius: '10px',
    marginBottom: '8px',
  },
  avatar: {
    fontSize: '28px',
    width: '40px',
    textAlign: 'center' as const,
  },
  participantName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  simulationArea: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  mainChat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  moderatorBar: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    borderBottom: '3px solid #f59e0b',
  },
  moderatorAvatar: {
    fontSize: '48px',
    animation: 'pulse 2s infinite',
  },
  moderatorInfo: {
    flex: '1',
  },
  moderatorName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#fbbf24',
  },
  moderatorStatus: {
    fontSize: '13px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  speakingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: '#0f172a',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#60a5fa',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#60a5fa',
    animation: 'pulse 1s infinite',
  },
  messageBubble: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '16px 20px',
    animation: 'fadeIn 0.3s ease',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  messageAvatar: {
    fontSize: '24px',
  },
  messageName: {
    fontSize: '14px',
    fontWeight: '600',
  },
  teamBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#cbd5e1',
  },
  scoreCard: {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '12px',
    border: '1px solid #334155',
    animation: 'fadeIn 0.3s ease',
  },
  scoreRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  scoreItem: {
    flex: '1',
    background: '#0f172a',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center' as const,
  },
  scoreLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  scoreValue: {
    fontSize: '22px',
    fontWeight: '800',
    marginTop: '2px',
  },
  scoreboardContainer: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '16px',
    position: 'sticky' as const,
    top: '16px',
    alignSelf: 'start',
  },
  scoreboardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#f1f5f9',
  },
  scoreboardTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '12px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '6px 4px',
    borderBottom: '1px solid #334155',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '10px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  td: {
    padding: '6px 4px',
    borderBottom: '1px solid #1e293b',
    fontSize: '12px',
  },
  highlightedRow: {
    background: 'rgba(96, 165, 250, 0.1)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '600',
  },
  startButton: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    color: 'white',
    padding: '14px 40px',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  resultsContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  winnerBanner: {
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    marginBottom: '24px',
    border: '2px solid #f59e0b',
  },
  winnerTeam: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  winnerScore: {
    fontSize: '16px',
    color: '#94a3b8',
  },
  podium: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  podiumCard: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    flex: '1',
    minWidth: '160px',
    maxWidth: '220px',
  },
  goldAccent: {
    border: '2px solid #f59e0b',
  },
  silverAccent: {
    border: '2px solid #94a3b8',
  },
  bronzeAccent: {
    border: '2px solid #b45309',
  },
  rankBadge: {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block',
  },
  chartContainer: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  barLabel: {
    width: '80px',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'right' as const,
  },
  barTrack: {
    flex: '1',
    height: '28px',
    background: '#0f172a',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '14px',
    transition: 'width 1s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '10px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    minWidth: '40px',
  },
  feedbackButton: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    border: 'none',
    color: 'white',
    padding: '14px 36px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'block',
    margin: '32px auto 0',
  },
  roundIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  roundDot: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
};

const styles: Record<string, React.CSSProperties> = s;

export default function GDRound() {
  const { state } = useApp();
  const [topic, setTopic] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'teams' | 'simulating' | 'finished'>('select');
  const [session, setSession] = useState<GDSession | null>(null);
  const [currentMsgIdx, setCurrentMsgIdx] = useState(-1);
  const [showScoreFor, setShowScoreFor] = useState<number | null>(null);
  const [report, setReport] = useState<any>(null);

  const participants = useMemo(() => createGDParticipants(state.users), []);
  const orderedParticipants = useMemo(() => {
    const teamA = participants.slice(0, 5);
    const teamB = participants.slice(5, 10);
    const order: GDParticipant[] = [];
    for (let i = 0; i < 5; i++) {
      order.push(teamA[i], teamB[i]);
    }
    return order;
  }, [participants]);

  const teamA = useMemo(() => participants.slice(0, 5), [participants]);
  const teamB = useMemo(() => participants.slice(5, 10), [participants]);

  const getTeamColor = useCallback((participantId: string) => {
    const idx = participants.findIndex(p => p.id === participantId);
    return idx < 5 ? '#2563eb' : '#dc2626';
  }, [participants]);

  const getTeamName = useCallback((participantId: string) => {
    const idx = participants.findIndex(p => p.id === participantId);
    return idx < 5 ? 'Team A' : 'Team B';
  }, [participants]);

  function handleSelectTopic(topicTitle: string) {
    setTopic(topicTitle);
    const gdParticipants = participants.map(p => ({ ...p }));
    const newSession: GDSession = {
      id: `gd-${Date.now()}`,
      topic: topicTitle,
      teams: [
        { name: 'Team A', color: '#2563eb', members: gdParticipants.slice(0, 5) },
        { name: 'Team B', color: '#dc2626', members: gdParticipants.slice(5, 10) },
      ],
      currentSpeaker: null,
      round: 1,
      isActive: false,
      messages: [],
      scores: {},
    };
    setSession(newSession);
    setPhase('teams');
  }

  function startGD() {
    if (!session || !topic) return;
    setPhase('simulating');
    setCurrentMsgIdx(0);
    setSession(prev => prev ? { ...prev, isActive: true, currentSpeaker: orderedParticipants[0].id } : null);
  }

  useEffect(() => {
    if (phase !== 'simulating' || currentMsgIdx < 0 || currentMsgIdx >= orderedParticipants.length) {
      if (phase === 'simulating' && currentMsgIdx >= orderedParticipants.length) {
        const finishTimer = setTimeout(() => {
          setPhase('finished');
        }, 500);
        return () => clearTimeout(finishTimer);
      }
      return;
    }

    const participant = orderedParticipants[currentMsgIdx];
    const responses = topicContent[topic!];
    const content = responses[participant.id] || 'Interesting topic. I have mixed views on this. Both sides have valid arguments and we need to find common ground through constructive dialogue.';

    if (showScoreFor === null) {
      const msgTimer = setTimeout(() => {
        setShowScoreFor(currentMsgIdx);
        const evalResult = evaluateGDResponse(topic!, content);
        setSession(prev => {
          if (!prev) return prev;
          const newMessage: GDMessage = {
            participantId: participant.id,
            participantName: participant.name,
            teamName: getTeamName(participant.id),
            content,
            timestamp: new Date().toISOString(),
            score: evalResult.score,
          };
          const updatedTeams = prev.teams.map(team => ({
            ...team,
            members: team.members.map(m =>
              m.id === participant.id
                ? {
                    ...m,
                    hasSpoken: true,
                    score: evalResult.score,
                    fluency: evalResult.fluency,
                    confidence: evalResult.confidence,
                    logic: evalResult.logic,
                  }
                : m
            ),
          }));
          const nextIdx = currentMsgIdx + 1;
          const nextSpeaker = nextIdx < orderedParticipants.length ? orderedParticipants[nextIdx].id : null;
          const round = nextIdx < 4 ? 1 : nextIdx < 8 ? 2 : 3;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
            teams: updatedTeams,
            currentSpeaker: nextSpeaker,
            round,
            scores: { ...prev.scores, [participant.id]: evalResult.score },
          };
        });
      }, 2500);
      return () => clearTimeout(msgTimer);
    }

    const scoreTimer = setTimeout(() => {
      setShowScoreFor(null);
      setCurrentMsgIdx(prev => prev + 1);
    }, 3000);
    return () => clearTimeout(scoreTimer);
  }, [phase, currentMsgIdx, showScoreFor, topic, orderedParticipants, getTeamName]);

  const allParticipants = useMemo(() => {
    return [...(session?.teams[0]?.members || teamA), ...(session?.teams[1]?.members || teamB)];
  }, [session, teamA, teamB]);

  const sortedParticipants = useMemo(() => {
    return [...allParticipants].sort((a, b) => b.score - a.score);
  }, [allParticipants]);

  function calcTeamAverage(team: GDTeam) {
    const total = team.members.reduce((sum, m) => sum + m.score, 0);
    return total / team.members.length;
  }

  const teamAAvg = useMemo(() => {
    if (!session) return 0;
    return calcTeamAverage(session.teams[0]);
  }, [session]);

  const teamBAvg = useMemo(() => {
    if (!session) return 0;
    return calcTeamAverage(session.teams[1]);
  }, [session]);

  const winner = useMemo(() => {
    if (!session) return null;
    return teamAAvg >= teamBAvg ? session.teams[0] : session.teams[1];
  }, [session, teamAAvg, teamBAvg]);

  const top3 = useMemo(() => {
    return sortedParticipants.slice(0, 3);
  }, [sortedParticipants]);

  function handleGenerateReport() {
    if (!session || !topic) return;
    const avgFluency = allParticipants.reduce((s, p) => s + p.fluency, 0) / allParticipants.length;
    const avgConfidence = allParticipants.reduce((s, p) => s + p.confidence, 0) / allParticipants.length;
    const avgLogic = allParticipants.reduce((s, p) => s + p.logic, 0) / allParticipants.length;
    const r = generateFeedbackReport('gd', { fluency: avgFluency, confidence: avgConfidence, logic: avgLogic });
    setReport(r);
  }

  const currentSpeakerIdx = phase === 'simulating' && currentMsgIdx < orderedParticipants.length ? currentMsgIdx : -1;
  const currentSpeaker = currentSpeakerIdx >= 0 ? orderedParticipants[currentSpeakerIdx] : null;
  const currentRound = currentSpeakerIdx < 0 ? 1 : currentSpeakerIdx < 4 ? 1 : currentSpeakerIdx < 8 ? 2 : 3;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🎤 Group Discussion Simulator</h1>
        {phase === 'select' && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Select a topic to begin the discussion</p>}
        {phase === 'teams' && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Teams are formed. Ready to start the GD?</p>}
        {phase === 'simulating' && (
          <div style={styles.roundIndicator}>
            {[1, 2, 3].map(r => (
              <div
                key={r}
                style={{
                  ...styles.roundDot,
                  background: currentRound === r ? '#6366f1' : '#1e293b',
                  color: currentRound === r ? 'white' : '#64748b',
                  border: currentRound === r ? 'none' : '1px solid #334155',
                }}
              >
                Round {r}
              </div>
            ))}
          </div>
        )}
        {phase === 'finished' && <p style={{ color: '#94a3b8', fontSize: '14px' }}>Discussion complete! View results below.</p>}
      </div>

      {phase === 'select' && (
        <div style={styles.topicGrid}>
          {topics.map(t => (
            <div
              key={t.id}
              style={styles.topicCard}
              onClick={() => handleSelectTopic(t.title)}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = t.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${t.color}33`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={styles.topicEmoji}>{t.emoji}</span>
              <div style={styles.topicTitle}>{t.title}</div>
            </div>
          ))}
        </div>
      )}

      {phase === 'teams' && (
        <div>
          <div style={styles.teamsContainer}>
            <div style={styles.teamCard}>
              <div style={{ ...styles.teamHeader, color: '#60a5fa' }}>🔵 Team A</div>
              {teamA.map(p => (
                <div key={p.id} style={styles.participantItem}>
                  <span style={styles.avatar}>{p.avatar}</span>
                  <span style={styles.participantName}>{p.name}</span>
                </div>
              ))}
            </div>
            <div style={styles.teamCard}>
              <div style={{ ...styles.teamHeader, color: '#f87171' }}>🔴 Team B</div>
              {teamB.map(p => (
                <div key={p.id} style={styles.participantItem}>
                  <span style={styles.avatar}>{p.avatar}</span>
                  <span style={styles.participantName}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button style={styles.startButton} onClick={startGD}>
              🚀 Start GD
            </button>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '12px' }}>
              Topic: <strong style={{ color: '#e2e8f0' }}>{topic}</strong>
            </p>
          </div>
        </div>
      )}

      {(phase === 'simulating' || phase === 'finished') && (
        <div style={styles.simulationArea}>
          <div style={styles.mainChat}>
            <div style={styles.moderatorBar}>
              <span style={styles.moderatorAvatar}>🧑‍⚖️</span>
              <div style={styles.moderatorInfo}>
                <div style={styles.moderatorName}>AI Moderator</div>
                <div style={styles.moderatorStatus}>
                  {phase === 'simulating' ? (
                    currentMsgIdx < orderedParticipants.length ? (
                      <>
                        Round {currentRound} • {roundTurns[currentRound - 1]?.label}
                        {currentSpeaker && (
                          <div style={styles.speakingIndicator}>
                            <span style={styles.dot} />
                            {getTeamName(currentSpeaker.id)} - {currentSpeaker.name} is speaking...
                          </div>
                        )}
                      </>
                    ) : (
                      'Discussion concluded. Generating results...'
                    )
                  ) : (
                    'Discussion complete!'
                  )}
                </div>
              </div>
            </div>

            {session?.messages.slice().reverse().map((msg, i) => {
              const isLatest = i === 0 && phase === 'simulating';
              const scoreData = evaluateGDResponse(topic!, msg.content);
              return (
                <div
                  key={i}
                  style={{
                    ...styles.messageBubble,
                    borderLeft: `4px solid ${getTeamColor(msg.participantId)}`,
                    opacity: isLatest ? 1 : 0.8,
                  }}
                >
                  <div style={styles.messageHeader}>
                    <span style={styles.messageAvatar}>
                      {participants.find(p => p.id === msg.participantId)?.avatar || '👤'}
                    </span>
                    <span style={styles.messageName}>{msg.participantName}</span>
                    <span
                      style={{
                        ...styles.teamBadge,
                        background: getTeamColor(msg.participantId),
                        color: 'white',
                      }}
                    >
                      {msg.teamName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', marginLeft: 'auto' }}>
                      Score: {msg.score}
                    </span>
                  </div>
                  <div style={styles.messageContent}>{msg.content}</div>
                  {isLatest && showScoreFor === currentMsgIdx && (
                    <div style={styles.scoreCard}>
                      <div style={styles.scoreRow}>
                        <div style={styles.scoreItem}>
                          <div style={styles.scoreLabel}>Fluency</div>
                          <div style={{ ...styles.scoreValue, color: scoreData.fluency >= 70 ? '#34d399' : scoreData.fluency >= 50 ? '#fbbf24' : '#f87171' }}>
                            {scoreData.fluency}
                          </div>
                        </div>
                        <div style={styles.scoreItem}>
                          <div style={styles.scoreLabel}>Confidence</div>
                          <div style={{ ...styles.scoreValue, color: scoreData.confidence >= 70 ? '#34d399' : scoreData.confidence >= 50 ? '#fbbf24' : '#f87171' }}>
                            {scoreData.confidence}
                          </div>
                        </div>
                        <div style={styles.scoreItem}>
                          <div style={styles.scoreLabel}>Logic</div>
                          <div style={{ ...styles.scoreValue, color: scoreData.logic >= 70 ? '#34d399' : scoreData.logic >= 50 ? '#fbbf24' : '#f87171' }}>
                            {scoreData.logic}
                          </div>
                        </div>
                        <div style={styles.scoreItem}>
                          <div style={styles.scoreLabel}>Total</div>
                          <div style={{ ...styles.scoreValue, color: '#60a5fa' }}>{scoreData.score}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                        {scoreData.feedback}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {session?.messages.length === 0 && phase === 'simulating' && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                The discussion is starting...
              </div>
            )}
          </div>

          <div style={styles.scoreboardContainer}>
            <div style={styles.scoreboardTitle}>📊 Live Scoreboard</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.scoreboardTable}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Team</th>
                    <th style={styles.th}>Flu</th>
                    <th style={styles.th}>Con</th>
                    <th style={styles.th}>Log</th>
                    <th style={styles.th}>Tot</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedParticipants.map(p => {
                    const isCurrent = phase === 'simulating' && p.id === currentSpeaker?.id;
                    const spoken = session?.messages.some(m => m.participantId === p.id);
                    return (
                      <tr
                        key={p.id}
                        style={{
                          ...(isCurrent ? styles.highlightedRow : {}),
                          background: isCurrent ? 'rgba(96, 165, 250, 0.15)' : undefined,
                        }}
                      >
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{p.avatar}</span>
                            <span style={{ fontWeight: isCurrent ? '700' : '400' }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{ color: getTeamColor(p.id), fontWeight: '700', fontSize: '11px' }}>
                            {getTeamName(p.id) === 'Team A' ? 'A' : 'B'}
                          </span>
                        </td>
                        <td style={styles.td}>{p.fluency || '-'}</td>
                        <td style={styles.td}>{p.confidence || '-'}</td>
                        <td style={styles.td}>{p.logic || '-'}</td>
                        <td style={{ ...styles.td, fontWeight: '700', color: '#60a5fa' }}>{p.score || '-'}</td>
                        <td style={styles.td}>
                          {spoken ? (
                            <span style={{ ...styles.statusBadge, background: '#065f4622', color: '#34d399', border: '1px solid #34d39933' }}>
                              ✓ Spoken
                            </span>
                          ) : (
                            <span style={{ ...styles.statusBadge, background: '#1e293b', color: '#64748b', border: '1px solid #334155' }}>
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {phase === 'finished' && session && (
        <div style={styles.resultsContainer}>
          <div style={styles.winnerBanner}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {winner === session.teams[0] ? '🔵' : '🔴'}
            </div>
            <div style={{ ...styles.winnerTeam, color: winner?.color === '#2563eb' ? '#60a5fa' : '#f87171' }}>
              {winner?.name} Wins!
            </div>
            <div style={styles.winnerScore}>
              Average Score: {winner === session.teams[0] ? teamAAvg.toFixed(1) : teamBAvg.toFixed(1)} vs{' '}
              {winner === session.teams[0] ? teamBAvg.toFixed(1) : teamAAvg.toFixed(1)}
            </div>
          </div>

          <div style={styles.podium}>
            {top3.map((p, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const accents = [styles.goldAccent, styles.silverAccent, styles.bronzeAccent];
              return (
                <div key={p.id} style={{ ...styles.podiumCard, ...accents[i] }}>
                  <span style={styles.rankBadge}>{medals[i]}</span>
                  <div style={{ fontSize: '32px', marginBottom: '4px' }}>{p.avatar}</div>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ color: '#60a5fa', fontWeight: '800', fontSize: '20px' }}>{p.score}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>points</div>
                </div>
              );
            })}
          </div>

          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>📊 Team Comparison</div>
            <div style={styles.barRow}>
              <div style={styles.barLabel}>🔵 Team A</div>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${Math.min(100, teamAAvg)}%`,
                    background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                  }}
                >
                  {teamAAvg.toFixed(1)}
                </div>
              </div>
            </div>
            <div style={styles.barRow}>
              <div style={styles.barLabel}>🔴 Team B</div>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${Math.min(100, teamBAvg)}%`,
                    background: 'linear-gradient(90deg, #dc2626, #f87171)',
                  }}
                >
                  {teamBAvg.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.chartContainer}>
            <div style={styles.chartTitle}>🏅 Top Performers</div>
            {sortedParticipants.slice(0, 10).map((p, i) => (
              <div key={p.id} style={styles.barRow}>
                <div style={{ ...styles.barLabel, width: '100px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{p.avatar}</span>
                  <span>{p.name}</span>
                </div>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${Math.max(10, (p.score / Math.max(...sortedParticipants.map(x => x.score))) * 100)}%`,
                      background: i < 3
                        ? i === 0 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : i === 1 ? 'linear-gradient(90deg, #94a3b8, #cbd5e1)' : 'linear-gradient(90deg, #b45309, #d97706)'
                        : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                  >
                    {p.score}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {report && (
            <div style={styles.chartContainer}>
              <div style={styles.chartTitle}>📋 Feedback Report</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Communication', value: report.metrics.communication, color: '#60a5fa' },
                  { label: 'Logic & Reasoning', value: report.metrics.technicalAccuracy, color: '#34d399' },
                  { label: 'Confidence', value: report.metrics.confidence, color: '#fbbf24' },
                  { label: 'Time Management', value: report.metrics.timeManagement, color: '#f87171' },
                ].map(m => (
                  <div key={m.label} style={styles.scoreItem}>
                    <div style={styles.scoreLabel}>{m.label}</div>
                    <div style={{ ...styles.scoreValue, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
                Overall Score: <span style={{ color: '#fbbf24' }}>{report.overallScore}/100</span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', color: '#34d399', marginBottom: '6px' }}>✅ Strengths</div>
                {report.strengths.map((s: string, i: number) => (
                  <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '4px 0' }}>• {s}</div>
                ))}
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', color: '#f87171', marginBottom: '6px' }}>⚠️ Areas to Improve</div>
                {report.weaknesses.map((w: string, i: number) => (
                  <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '4px 0' }}>• {w}</div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#60a5fa', marginBottom: '6px' }}>💡 Suggestions</div>
                {report.suggestions.map((s: string, i: number) => (
                  <div key={i} style={{ fontSize: '13px', color: '#94a3b8', padding: '4px 0' }}>• {s}</div>
                ))}
              </div>
            </div>
          )}

          <button style={styles.feedbackButton} onClick={handleGenerateReport}>
            📄 Generate Feedback Report
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', paddingBottom: '32px' }}>
            <button
              style={{
                ...styles.startButton,
                background: 'linear-gradient(135deg, #64748b, #475569)',
                fontSize: '14px',
                padding: '10px 24px',
              }}
              onClick={() => {
                setPhase('select');
                setTopic(null);
                setSession(null);
                setCurrentMsgIdx(-1);
                setShowScoreFor(null);
                setReport(null);
              }}
            >
              🔄 Start New GD
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
    </div>
  );
}
