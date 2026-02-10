import {Component, OnDestroy, OnInit} from '@angular/core';

import {TimeService} from '../../time.service';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl: string;
  location: string;
  duration: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  standalone: true,
  imports: []
})
export class ExperienceComponent implements OnInit, OnDestroy {

  numberOfMonths: number;
  totalExperience: string;
  interval: any;
  expandedItem: string | null = null;

  experienceItems: ExperienceItem[] = [
    {
      id: 'smts-salesforce',
      title: 'SMTS (Senior Member of Technical Staff)',
      company: 'Salesforce',
      companyUrl: 'https://www.salesforce.com/',
      location: 'Hybrid in Hyderabad, India',
      duration: 'Current',
      period: '2025 - Present',
      description: 'Senior Member of Technical Staff role at Salesforce, exploring new challenges and opportunities in enterprise cloud solutions.',
      technologies: ['Salesforce Platform', 'Apex', 'Lightning', 'Java', 'Cloud Technologies'],
      achievements: [
        'Still exploring and learning the Salesforce ecosystem',
        'Transitioning into enterprise cloud solutions',
        'Working on scalable cloud-based applications'
      ],
      isExpanded: false
    },
    {
      id: 'sde2-games24x7',
      title: 'SDE-2',
      company: 'Games24x7',
      companyUrl: 'https://www.games24x7.com/',
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
      ],
      isExpanded: false
    },
    {
      id: 'sde1-games24x7',
      title: 'SDE-1',
      company: 'Games24x7',
      companyUrl: 'https://www.games24x7.com/',
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
      ],
      isExpanded: false
    },
    {
      id: 'swe-walmart',
      title: 'SWE IN2',
      company: 'Walmart Global Tech',
      companyUrl: 'https://one.walmart.com/content/globaltechindia/en_in.html',
      location: 'Bangalore, India',
      duration: '4 months',
      period: '2021',
      description: 'Worked as Fullstack developer with Java as Backend and Angular as Frontend. Worked on Annual Enrollment for Walmart Employees to avail health benefits - life insurance, dental coverage, health insurance for year 2022.',
      technologies: ['Java 8', 'JSP', 'WCNP', 'OneOps', 'Jenkins', 'Angular'],
      achievements: [
        'Worked on Walmart\'s own cloud OneOps and WCNP',
        'Collaborated with global teams across different time zones',
        'Gained experience of Retail projects',
        'Developed features for Walmart\'s e-commerce platform'
      ],
      isExpanded: false
    },
    {
      id: 'sde1-extramarks',
      title: 'SDE 1',
      company: 'Extramarks Education',
      companyUrl: 'https://www.extramarks.com/',
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
      ],
      isExpanded: false
    }
  ];

  constructor(private timeService: TimeService) {
  }

  private calculateTotalExperience(): void {
    const startDate = new Date('2019-12-20'); // First professional role start date
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = diffDays / 365.25;
    this.totalExperience = diffYears.toFixed(1);
  }

  private refreshData() {
    this.timeService.getNumberOfMonths()
      .subscribe(data => {
        this.numberOfMonths = data;
      });
    this.calculateTotalExperience();
  }

  toggleExpanded(itemId: string): void {
    this.expandedItem = this.expandedItem === itemId ? null : itemId;
    this.experienceItems.forEach(item => {
      item.isExpanded = item.id === this.expandedItem;
    });
  }

  ngOnInit(): void {
    this.refreshData();
    this.interval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
