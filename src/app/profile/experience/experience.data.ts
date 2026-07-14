import {COMPANY_LINKS} from '../../config/profile-links';

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl: string;
  logo: string;
  location: string;
  duration: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface OrbitPlanet {
  id: string;
  company: string;
  logo: string;
  items: ExperienceItem[];
  isExpanded: boolean;
}

export const EXPERIENCE_START_DATE = '2019-12-20';

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'smts-salesforce',
    title: 'SMTS (Senior Member of Technical Staff)',
    company: 'Salesforce',
    companyUrl: COMPANY_LINKS.salesforce,
    logo: 'assets/images/salesforce.jpeg',
    location: 'Hybrid in Hyderabad, India',
    duration: 'Current',
    period: '2025 - Present',
    description: 'Senior Member of Technical Staff building AI agents and LLM-backed services for enterprise collaboration and engineering workflows.',
    technologies: ['Java', 'AI Agents', 'LLMs', 'RAG', 'Tool Calling', 'Evaluation', 'Observability', 'Microservices'],
    achievements: [
      'Built AI-assisted operational workflows that synthesize approved engineering context into reviewable summaries',
      'Set up retrieval and tool-calling patterns with grounding, evaluations, and guardrails',
      'Improved reliability, latency, and failure handling for LLM-backed services',
      'Contributed to enterprise collaboration and assistant experiences',
      'Raised engineering practices and code quality across the team'
    ]
  },
  {
    id: 'sde2-games24x7',
    title: 'SDE-2',
    company: 'Games24x7',
    companyUrl: COMPANY_LINKS.games24x7,
    logo: 'assets/images/games24x7.png',
    location: 'Bangalore, India',
    duration: '3 years',
    period: '2022 - 2025',
    description: 'Worked as a backend developer in Platform services, for both RummyCircle and My11Circle. Led critical platform initiatives and mentored junior developers.',
    technologies: ['Kafka', 'Spring Cloud', 'LLM', 'AWS Sage Maker', 'Google AD APIs', 'Elasti-cache', 'JDK 21', 'Neptune DB', 'Gremlin', 'Grafana', 'Prometheus', 'Pager Duty'],
    achievements: [
      'Developed a real-time, configurable risk evaluation platform for consumer gaming products',
      'Developed an advertising spend monitoring service for the marketing team',
      'Standardized and migrated services from EC2 to Graviton in K8s',
      'Set up proper alerting for business dashboards and created PD alerts',
      'Mentored a team of 3 junior developers'
    ]
  },
  {
    id: 'sde1-games24x7',
    title: 'SDE-1',
    company: 'Games24x7',
    companyUrl: COMPANY_LINKS.games24x7,
    logo: 'assets/images/games24x7.png',
    location: 'Bangalore, India',
    duration: '1.1 years',
    period: '2021 - 2022',
    description: 'Worked as a backend developer on scalable solutions for a high-traffic consumer gaming platform.',
    technologies: ['Java 11', 'Microservices', 'AWS', 'OCR', 'Redis', 'Kafka', 'RabbitMQ', 'MySQL', 'Spring Boot', 'Spring Cloud', 'Distributed Locking'],
    achievements: [
      'Helped a high-traffic gaming platform scale through major seasonal events',
      'Worked on shared backend capabilities across multiple gaming products',
      'Developed an automated identity-verification platform from scratch',
      'Shipped customer progression and membership features'
    ]
  },
  {
    id: 'swe-walmart',
    title: 'SWE IN2',
    company: 'Walmart Global Tech',
    companyUrl: COMPANY_LINKS.walmart,
    logo: 'assets/images/walmart.png',
    location: 'Bangalore, India',
    duration: '4 months',
    period: '2021',
    description: 'Built features for Walmart\'s employee benefits enrollment platform.',
    technologies: ['Java 8', 'Angular', 'JSP', 'OneOps', 'WCNP', 'Jenkins'],
    achievements: [
      'Developed benefits-enrollment features for a large US associate population',
      'Built on enterprise cloud infrastructure with CI/CD via Jenkins',
      'Shipped production code within first month, collaborating across US and India teams'
    ]
  },
  {
    id: 'sde1-extramarks',
    title: 'SDE 1',
    company: 'Extramarks Education',
    companyUrl: COMPANY_LINKS.extramarks,
    logo: 'assets/images/extramarks.png',
    location: 'Noida, India',
    duration: '1.3 years',
    period: '2020 - 2021',
    description: 'Got hands on project experience, worked in a collaborative environment. Created from scratch projects and deployed it into production environment.',
    technologies: ['Java 8/11', 'Spring Boot', 'OAuth2.0 + JWT', 'AWS Cognito', 'Docker', 'MySQL 8+'],
    achievements: [
      'Broke Monolithic architecture to Microservices and discussed the whole architecture with the team',
      'Developed and deployed 5+ production-ready applications',
      'Implemented OAuth2.0 authentication system',
      'Improved system reliability through service-oriented architecture'
    ]
  }
];
