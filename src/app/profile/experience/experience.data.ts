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
    description: 'Senior Member of Technical Staff working on Slack. Powering Salesforce Thunderbird architecture and enhancing Slackbot & Einstein with Agentforce integration.',
    technologies: ['Java', 'Slack Platform', 'Agentforce', 'Thunderbird', 'Einstein AI', 'Microservices'],
    achievements: [
      'Powering Salesforce Thunderbird architecture for Slack',
      'Enhancing Slackbot & Einstein with Agentforce integration',
      'Driving engineering best practices and code quality across the team'
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
      'Developed Risk Rule Engine for Games24x7 that works in My11Circle and RummyCircle, that identifies Fraud done by users in real time',
      'Developed Google ad monitoring service which keeps on monitoring the campaign spends done by the marketing team',
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
    description: 'Working as a backend developer in My11Circle team. Developed scalable solutions for high-traffic gaming platform.',
    technologies: ['Java 11', 'Microservices', 'AWS', 'OCR', 'Redis', 'Kafka', 'RabbitMQ', 'MySQL', 'Spring Boot', 'Spring Cloud', 'Distributed Locking'],
    achievements: [
      'Helped My11Circle grow and scale to achieve 10 Million concurrent users',
      'Worked on several projects for My11Circle and RummyCircle',
      'Developed Automated KYC system of Games24x7 from scratch',
      'Developed Club upgradation to turn to VIP users, features for My11Circle users'
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
    description: 'Built features for Walmart\'s Annual Enrollment platform — the system employees use to enroll in health benefits (life insurance, dental, health coverage) for 2.2M+ associates.',
    technologies: ['Java 8', 'Angular', 'JSP', 'OneOps', 'WCNP', 'Jenkins'],
    achievements: [
      'Developed enrollment features serving 2.2M+ Walmart associates across the US',
      'Built on Walmart\'s private cloud (OneOps/WCNP) with CI/CD via Jenkins',
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
      'Reduced system downtime by 80% through improved architecture'
    ]
  }
];
