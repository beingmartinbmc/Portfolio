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

export const EXPERIENCE_START_DATE = '2020-01-01';

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'smts-salesforce',
    title: 'SMTS (Senior Member of Technical Staff)',
    company: 'Salesforce',
    companyUrl: COMPANY_LINKS.salesforce,
    logo: 'assets/images/salesforce.webp',
    location: 'Bengaluru, India',
    duration: 'Current',
    period: 'Nov 2025 - Present',
    description: 'Driving telephony infrastructure and support automation: architecture and on-call ownership for a Go-based SIP/PSTN platform, plus LLM-driven support tooling.',
    technologies: ['Go', 'Java', 'Spring Boot', 'SIP / PSTN', 'Kafka', 'AWS', 'LLMs', 'Slack', 'Observability'],
    achievements: [
      'Drive architecture and on-call operations for a Go-based SIP/PSTN telephony platform handling 50K+ concurrent sessions',
      'Built an LLM-driven Slack bot in Java and Spring Boot that automates 65% of internal support workflows',
      'Designed Kafka and AWS event-processing services that handle 10K+ events/sec with sub-200ms P99 latency'
    ]
  },
  {
    id: 'sse-games24x7',
    title: 'Senior Software Engineer',
    company: 'Games24x7',
    companyUrl: COMPANY_LINKS.games24x7,
    logo: 'assets/images/games24x7.webp',
    location: 'Bengaluru, India',
    duration: '3 years',
    period: 'Oct 2022 - Oct 2025',
    description: 'Backend engineer on platform services shared by RummyCircle and My11Circle (risk, KYC, payments, and onboarding). Led critical platform initiatives and mentored junior developers.',
    technologies: ['Java 21', 'Spring WebFlux', 'Kafka', 'Redis', 'AWS Textract', 'AWS SageMaker', 'Neptune DB', 'Gremlin', 'ElastiCache', 'Google Ads APIs', 'Grafana', 'Prometheus', 'PagerDuty'],
    achievements: [
      'Cut fraud false negatives from 12% to 2% across 2M+ daily transactions with low-latency detection pipelines in Java 21, Kafka, and Redis',
      'Boosted KYC onboarding conversion by 40% (100K+ daily users) by scaling a Partial KYC flow on Spring WebFlux, Redis, and AWS Textract',
      'Developed an advertising spend monitoring service for the marketing team',
      'Standardized and migrated services from EC2 to Graviton in K8s',
      'Set up alerting for business dashboards and PagerDuty alerts',
      'Mentored a team of 3 junior developers'
    ]
  },
  {
    id: 'swe-games24x7',
    title: 'Software Engineer',
    company: 'Games24x7',
    companyUrl: COMPANY_LINKS.games24x7,
    logo: 'assets/images/games24x7.webp',
    location: 'Bengaluru, India',
    duration: '1 year',
    period: 'Oct 2021 - Oct 2022',
    description: 'Backend developer on high-throughput payment and gaming microservices for a high-traffic consumer gaming platform.',
    technologies: ['Java 11', 'Microservices', 'AWS', 'OCR', 'Redis', 'Kafka', 'RabbitMQ', 'MySQL', 'Spring Boot', 'Spring Cloud', 'Distributed Locking'],
    achievements: [
      'Developed high-throughput payment and gaming microservices using Kafka and Redis',
      'Earned a promotion to Senior Software Engineer within 12 months',
      'Developed an automated identity-verification platform from scratch',
      'Helped the platform scale through major seasonal traffic events',
      'Shipped customer progression and membership features'
    ]
  },
  {
    id: 'swe-walmart',
    title: 'Software Engineer',
    company: 'Walmart Global Tech',
    companyUrl: COMPANY_LINKS.walmart,
    logo: 'assets/images/walmart.webp',
    location: 'Bengaluru, India',
    duration: '6 months',
    period: 'May 2021 - Oct 2021',
    description: 'Built an end-to-end benefits enrollment workflow for Walmart\'s US associates.',
    technologies: ['React', 'Node.js', 'WCNP', 'OneOps', 'Jenkins'],
    achievements: [
      'Built an end-to-end benefits enrollment workflow with React and Node.js, increasing completion rates by 65%',
      'Delivered benefits-enrollment features for a large US associate population',
      'Shipped production code within the first month, collaborating across US and India teams'
    ]
  },
  {
    id: 'swe-extramarks',
    title: 'Software Engineer',
    company: 'Extramarks Education',
    companyUrl: COMPANY_LINKS.extramarks,
    logo: 'assets/images/extramarks.webp',
    location: 'New Delhi, India',
    duration: '1.2 years',
    period: 'Jan 2020 - Mar 2021',
    description: 'Built personalized K-12 learning systems and real-time backend operations for school platforms.',
    technologies: ['Node.js', 'MongoDB', 'Redis'],
    achievements: [
      'Launched personalized learning systems in Node.js and MongoDB, growing school platform adoption by 43%',
      'Automated real-time backend operations with Redis, reducing manual support tickets by 20%',
      'Developed and deployed 5+ production-ready applications'
    ]
  }
];
