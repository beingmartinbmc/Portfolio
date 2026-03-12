export interface SkillDetail {
  description: string;
  experience: string[];
  projects: string[];
  achievements: string[];
  relatedSkills: string[];
}

export const SKILL_DETAILS: Record<string, SkillDetail> = {
      // ─── Languages ────────────────────────────────────────
      'Java 21': {
        description: 'Proficient in modern Java features including virtual threads, pattern matching, and record patterns.',
        experience: [
          'Extensive experience with Java 8 through Java 21 features',
          'Implemented concurrent programming with virtual threads (Project Loom)',
          'Used pattern matching, sealed classes, and record patterns for type-safe code',
          'Built high-throughput services handling millions of requests per day'
        ],
        projects: [
          'High-performance microservices with Java 21',
          'Concurrent data processing pipelines',
          'RESTful APIs with modern Java features'
        ],
        achievements: [
          'Adopted Java 21 virtual threads for 3x throughput improvement',
          'Reduced code complexity by 40% with pattern matching',
          'Migrated legacy codebase to modern Java features'
        ],
        relatedSkills: ['Spring Boot', 'Microservices', 'DSA']
      },
      'Python': {
        description: 'Strong Python skills for backend services, scripting, data processing, and AI/ML workloads.',
        experience: [
          'Built REST APIs using Flask and FastAPI',
          'Developed automation scripts for infrastructure and CI/CD pipelines',
          'Used Python for data analysis with Pandas and NumPy',
          'Implemented ML pipelines and LLM integrations in Python'
        ],
        projects: [
          'AI-powered code review and analysis tools',
          'Data pipeline orchestration for analytics',
          'Internal automation and developer tooling'
        ],
        achievements: [
          'Automated manual workflows saving 20+ hours per week',
          'Built internal CLI tools adopted by 50+ engineers',
          'Developed ML-based anomaly detection system'
        ],
        relatedSkills: ['Generative AI', 'LLM', 'RAG']
      },
      'GO': {
        description: 'Proficient in Go for building high-performance, concurrent backend services and CLI tools.',
        experience: [
          'Built production microservices using Go and Echo framework',
          'Implemented highly concurrent systems leveraging goroutines and channels',
          'Developed gRPC services for inter-service communication',
          'Created efficient CLI tools and system-level utilities'
        ],
        projects: [
          'Real-time event processing microservice',
          'High-throughput API gateway in Go',
          'Internal developer platform tooling'
        ],
        achievements: [
          'Achieved sub-millisecond p99 latency on critical paths',
          'Built services handling 50K+ requests per second',
          'Reduced memory footprint by 60% migrating from Java to Go'
        ],
        relatedSkills: ['Echo', 'Microservices', 'Kafka']
      },
      'NodeJS': {
        description: 'Experienced with Node.js for building scalable APIs, real-time services, and serverless functions.',
        experience: [
          'Built RESTful APIs with Express and NestJS',
          'Developed real-time features using WebSockets (Socket.io)',
          'Created serverless functions on AWS Lambda',
          'Used Node.js for build tooling, scripting, and SSR'
        ],
        projects: [
          'Real-time notification and chat system',
          'Serverless API backend on AWS Lambda',
          'Angular SSR rendering service'
        ],
        achievements: [
          'Built WebSocket system serving 100K+ concurrent connections',
          'Reduced cold-start times by 70% on Lambda functions',
          'Implemented efficient streaming data processing'
        ],
        relatedSkills: ['Kafka', 'RabbitMQ', 'MongoDB']
      },

      // ─── Architecture ─────────────────────────────────────
      'High Level Design': {
        description: 'Expert in designing large-scale distributed systems with focus on scalability, reliability, and maintainability.',
        experience: [
          'Designed systems handling millions of daily active users',
          'Created architecture documents and conducted design reviews',
          'Applied CAP theorem, CQRS, and event sourcing patterns',
          'Designed for multi-region deployments and disaster recovery'
        ],
        projects: [
          'Gaming platform architecture serving 10M+ users',
          'Real-time leaderboard and scoring system',
          'Multi-tenant SaaS platform design'
        ],
        achievements: [
          'Designed systems achieving 99.99% availability',
          'Scaled architecture from 1M to 10M concurrent users',
          'Reduced infrastructure costs by 40% through design optimization'
        ],
        relatedSkills: ['Low Level Design', 'Microservices', 'Kafka']
      },
      'Low Level Design': {
        description: 'Strong expertise in object-oriented design, SOLID principles, and design patterns for clean, extensible code.',
        experience: [
          'Applied SOLID principles and GoF design patterns in production',
          'Designed modular APIs with clear separation of concerns',
          'Conducted code reviews focused on design quality',
          'Built reusable libraries and frameworks used across teams'
        ],
        projects: [
          'Payment gateway SDK with pluggable providers',
          'Rule engine for dynamic business logic',
          'Extensible notification framework'
        ],
        achievements: [
          'Reduced onboarding time for new developers by 50%',
          'Built internal framework adopted across 8+ teams',
          'Achieved 90%+ code coverage with testable design'
        ],
        relatedSkills: ['High Level Design', 'Java 21', 'Spring Boot']
      },
      'Microservices': {
        description: 'Architected and implemented scalable microservices architectures with proper separation of concerns.',
        experience: [
          'Decomposed monolithic applications into microservices',
          'Implemented service mesh, API gateway, and circuit breaker patterns',
          'Built inter-service communication with REST, gRPC, and event-driven messaging',
          'Set up distributed tracing and centralized logging'
        ],
        projects: [
          'Gaming platform microservices architecture',
          'Financial services distributed system',
          'E-commerce order processing system'
        ],
        achievements: [
          'Scaled system to handle 10M+ concurrent users',
          'Reduced deployment time by 75% with independent service deployments',
          'Implemented circuit breaker and bulkhead patterns for resilience'
        ],
        relatedSkills: ['Spring Boot', 'Kafka', 'High Level Design']
      },

      // ─── Databases ────────────────────────────────────────
      'MySQL': {
        description: 'Extensive experience with MySQL across multiple versions in production environments.',
        experience: [
          'Worked on MySQL 5.6, MySQL 5.7 and MySQL 8',
          'Migrated systems from old DB to new DB using Amazon DMS',
          'Experience in tuning queries making them use to force index',
          'Designed normalized and denormalized schemas for different access patterns'
        ],
        projects: [
          'Database migration for Games24x7 gaming platform',
          'Query optimization for high-traffic applications',
          'Schema design for microservices architecture'
        ],
        achievements: [
          'Reduced query latency by 60% through index optimization',
          'Successfully migrated 5+ production databases with zero downtime',
          'Implemented database monitoring, slow-query alerts, and automated failover'
        ],
        relatedSkills: ['MongoDB', 'Redis', 'Elasti-Cache']
      },
      'MongoDB': {
        description: 'Proficient in MongoDB for document-oriented storage, flexible schemas, and aggregation pipelines.',
        experience: [
          'Designed document schemas for complex domain models',
          'Built aggregation pipelines for real-time analytics',
          'Managed replica sets and sharded clusters in production',
          'Implemented change streams for event-driven architecture'
        ],
        projects: [
          'User activity and event logging system',
          'Content management platform with flexible schemas',
          'Real-time analytics dashboard backend'
        ],
        achievements: [
          'Processed 500K+ writes/sec with sharded MongoDB clusters',
          'Reduced data access latency by 45% with proper indexing strategies',
          'Migrated 2TB+ dataset from MySQL to MongoDB with zero downtime'
        ],
        relatedSkills: ['MySQL', 'Neptune', 'Cassandra']
      },
      'Neptune': {
        description: 'Experience with Amazon Neptune for graph-based data modeling and relationship-heavy queries.',
        experience: [
          'Modeled complex entity relationships using property graphs',
          'Wrote Gremlin and SPARQL queries for traversals',
          'Integrated Neptune with microservices for recommendation engines',
          'Optimized graph queries for low-latency lookups'
        ],
        projects: [
          'Social connection and recommendation engine',
          'Fraud detection using graph traversal patterns',
          'Knowledge graph for AI-powered search'
        ],
        achievements: [
          'Built recommendation engine serving 5M+ users',
          'Reduced fraud detection time from hours to seconds',
          'Designed graph schema handling 100M+ edges'
        ],
        relatedSkills: ['MongoDB', 'MySQL', 'VectorDB']
      },
      'Salesforce DB': {
        description: 'Experience with Salesforce data platform including SOQL, custom objects, and data integration patterns.',
        experience: [
          'Designed custom objects and relationships in Salesforce',
          'Wrote complex SOQL and SOSL queries for reporting',
          'Integrated Salesforce data with external systems via APIs',
          'Managed data migrations between Salesforce orgs'
        ],
        projects: [
          'CRM data integration for sales analytics',
          'Custom Salesforce app for customer lifecycle management',
          'Data synchronization between Salesforce and internal systems'
        ],
        achievements: [
          'Integrated Salesforce with 5+ internal systems',
          'Automated reporting saving 15+ hours per week',
          'Designed data model supporting 1M+ customer records'
        ],
        relatedSkills: ['MySQL', 'MongoDB', 'High Level Design']
      },
      'Cassandra': {
        description: 'Proficient in Apache Cassandra for high-availability, write-heavy workloads at massive scale.',
        experience: [
          'Designed partition keys and clustering columns for optimal read/write patterns',
          'Managed multi-datacenter Cassandra clusters',
          'Implemented time-series data storage with TTL-based expiry',
          'Tuned consistency levels for different use cases'
        ],
        projects: [
          'Time-series data store for IoT sensor data',
          'User session and activity tracking system',
          'High-throughput event logging platform'
        ],
        achievements: [
          'Handled 1M+ writes/sec with sub-5ms p99 latency',
          'Designed schema for 10TB+ dataset with efficient compaction',
          'Achieved 99.999% availability with multi-DC replication'
        ],
        relatedSkills: ['MongoDB', 'MySQL', 'Kafka']
      },

      // ─── Frameworks ───────────────────────────────────────
      'Spring Boot': {
        description: 'Deep expertise in Spring Boot for building production-ready microservices and REST APIs.',
        experience: [
          'Built 10+ production microservices with Spring Boot',
          'Implemented Spring Security with OAuth2 and JWT authentication',
          'Used Spring Data JPA and Spring Data Redis for data access',
          'Set up Spring Actuator for health checks and metrics'
        ],
        projects: [
          'Gaming platform backend services',
          'Financial transaction processing system',
          'User management and authentication service'
        ],
        achievements: [
          'Reduced development time by 50% with Spring Boot starters',
          'Achieved 99.9% uptime in production services',
          'Implemented comprehensive monitoring and distributed logging'
        ],
        relatedSkills: ['Java 21', 'Microservices', 'MySQL']
      },
      'Echo': {
        description: 'Experienced with Echo framework for building lightweight, high-performance Go web services.',
        experience: [
          'Built RESTful APIs with Echo\'s middleware pipeline',
          'Implemented custom middleware for auth, logging, and rate-limiting',
          'Used Echo\'s context and binding for clean request handling',
          'Integrated Echo services with gRPC and Kafka'
        ],
        projects: [
          'High-throughput API microservice',
          'Internal developer platform APIs',
          'Real-time data ingestion endpoint'
        ],
        achievements: [
          'Built APIs handling 50K+ req/s with minimal memory footprint',
          'Reduced API response time by 40% migrating from Node.js to Echo',
          'Implemented graceful shutdown and health-check patterns'
        ],
        relatedSkills: ['GO', 'Microservices', 'Kafka']
      },
      'Dropwizard': {
        description: 'Experience with Dropwizard for building ops-friendly, high-performance Java RESTful web services.',
        experience: [
          'Built production services with Dropwizard\'s opinionated stack',
          'Leveraged Jersey, Jetty, and Jackson for REST APIs',
          'Integrated Dropwizard with Hibernate and database migrations',
          'Used Metrics library for real-time performance monitoring'
        ],
        projects: [
          'Payment processing microservice',
          'User profile and preference service',
          'Admin dashboard backend APIs'
        ],
        achievements: [
          'Achieved sub-10ms p99 latency on critical endpoints',
          'Built services processing 100K+ transactions/day',
          'Implemented comprehensive health checks and alerting'
        ],
        relatedSkills: ['Java 21', 'Spring Boot', 'MySQL']
      },
      'Google Guice': {
        description: 'Proficient in Google Guice for lightweight dependency injection in Java applications.',
        experience: [
          'Used Guice for DI in non-Spring Java applications',
          'Designed modular applications with Guice modules and providers',
          'Implemented custom scopes and interceptors with Guice AOP',
          'Integrated Guice with Dropwizard and other frameworks'
        ],
        projects: [
          'Modular data processing pipeline',
          'Plugin architecture for extensible services',
          'Test-friendly service layer with Guice injection'
        ],
        achievements: [
          'Reduced startup time by 60% using Guice over heavier DI frameworks',
          'Built plugin system supporting 15+ extension modules',
          'Improved testability achieving 95%+ unit test coverage'
        ],
        relatedSkills: ['Java 21', 'Dropwizard', 'Spring Boot']
      },

      // ─── AI / ML ──────────────────────────────────────────
      'Generative AI': {
        description: 'Hands-on experience building applications powered by generative AI models and multi-modal capabilities.',
        experience: [
          'Built conversational AI agents using GPT-4, Claude, and Gemini',
          'Implemented multi-modal AI features with vision and audio models',
          'Designed prompt chains and agent workflows for complex tasks',
          'Evaluated and benchmarked model outputs for quality assurance'
        ],
        projects: [
          'AI-powered portfolio with voice interaction',
          'Automated code review assistant',
          'Content generation and summarization platform'
        ],
        achievements: [
          'Built AI face assistant featured on portfolio site',
          'Reduced content creation time by 70% with generative AI',
          'Implemented guardrails achieving 99% safety compliance'
        ],
        relatedSkills: ['LLM', 'RAG', 'VectorDB']
      },
      'LLM': {
        description: 'Working with Large Language Models for building AI-powered applications and services.',
        experience: [
          'Integrated OpenAI, Claude, and Gemini APIs into production systems',
          'Built RAG systems for domain-specific knowledge retrieval',
          'Implemented prompt engineering and chain-of-thought reasoning',
          'Fine-tuned models for domain-specific tasks'
        ],
        projects: [
          'AI-powered customer support chatbot',
          'Document analysis and summarization system',
          'Code generation and review assistant'
        ],
        achievements: [
          'Reduced customer support response time by 60%',
          'Built RAG system with 95% retrieval accuracy',
          'Automated 40% of code review process with LLM'
        ],
        relatedSkills: ['Generative AI', 'RAG', 'VectorDB']
      },
      'RAG': {
        description: 'Expert in Retrieval-Augmented Generation for grounding LLM responses with domain-specific knowledge.',
        experience: [
          'Designed end-to-end RAG pipelines with chunking, embedding, and retrieval',
          'Implemented hybrid search combining semantic and keyword matching',
          'Optimized chunk sizes and overlap for different document types',
          'Built evaluation frameworks to measure retrieval quality'
        ],
        projects: [
          'Internal knowledge base Q&A system',
          'Customer-facing documentation assistant',
          'Legal document analysis and search'
        ],
        achievements: [
          'Achieved 95%+ retrieval accuracy on domain-specific queries',
          'Reduced hallucination rate by 80% compared to vanilla LLM',
          'Built RAG pipeline processing 100K+ documents'
        ],
        relatedSkills: ['LLM', 'VectorDB', 'Generative AI']
      },
      'VectorDB': {
        description: 'Experience with vector databases for semantic search, embeddings storage, and similarity matching.',
        experience: [
          'Worked with Pinecone, Weaviate, and pgvector',
          'Designed embedding strategies for different data types',
          'Implemented approximate nearest neighbor (ANN) search',
          'Optimized index configurations for latency and recall trade-offs'
        ],
        projects: [
          'Semantic search engine for product catalog',
          'Similar document recommendation system',
          'Image similarity matching for content moderation'
        ],
        achievements: [
          'Built vector search serving 10K+ queries/sec at p99 < 50ms',
          'Indexed 50M+ embeddings with 98% recall@10',
          'Reduced search infrastructure costs by 35% with pgvector'
        ],
        relatedSkills: ['RAG', 'LLM', 'Generative AI']
      },

      // ─── Queues ───────────────────────────────────────────
      'Kafka': {
        description: 'Expert in Apache Kafka for building real-time data pipelines and event-driven architectures.',
        experience: [
          'Designed and managed multi-broker Kafka clusters in production',
          'Built event-driven microservices with Kafka Streams and KSQL',
          'Optimized partition strategies and consumer groups for high throughput',
          'Implemented exactly-once semantics and dead-letter queue patterns'
        ],
        projects: [
          'Real-time analytics pipeline for gaming platform',
          'Event sourcing architecture for financial systems',
          'Kafka-based messaging for microservices'
        ],
        achievements: [
          'Processed 1M+ events per second with Kafka',
          'Built fault-tolerant event streaming with zero data loss',
          'Reduced data processing latency by 80%'
        ],
        relatedSkills: ['RabbitMQ', 'AmazonSQS', 'Microservices']
      },
      'RabbitMQ': {
        description: 'Experienced with RabbitMQ for reliable message queuing, task distribution, and pub/sub patterns.',
        experience: [
          'Designed exchange-queue topologies for various routing patterns',
          'Implemented dead-letter queues and retry mechanisms',
          'Managed RabbitMQ clusters with high-availability queues',
          'Built consumer pools with acknowledgment and prefetch tuning'
        ],
        projects: [
          'Order processing pipeline with guaranteed delivery',
          'Email and notification dispatch system',
          'Distributed task scheduling engine'
        ],
        achievements: [
          'Built message system with 99.99% delivery guarantee',
          'Processed 500K+ messages/day with zero message loss',
          'Reduced order processing time by 65% with async queuing'
        ],
        relatedSkills: ['Kafka', 'AmazonSQS', 'Microservices']
      },
      'AmazonSQS': {
        description: 'Proficient in Amazon SQS for serverless, fully-managed message queuing at scale.',
        experience: [
          'Designed SQS-based architectures with FIFO and standard queues',
          'Implemented Lambda-triggered consumers for serverless processing',
          'Built dead-letter queue strategies with automated alerting',
          'Integrated SQS with SNS for fan-out messaging patterns'
        ],
        projects: [
          'Serverless order fulfillment pipeline',
          'Async image and video processing system',
          'Cross-service event notification system'
        ],
        achievements: [
          'Built serverless pipeline processing 1M+ messages/day',
          'Reduced infrastructure costs by 50% moving from self-managed queues to SQS',
          'Achieved zero message loss with DLQ monitoring and auto-retry'
        ],
        relatedSkills: ['Kafka', 'RabbitMQ', 'Microservices']
      },

      // ─── Core CS ──────────────────────────────────────────
      'DSA': {
        description: 'Strong foundation in data structures and algorithms with competitive programming experience.',
        experience: [
          'Solved 1000+ problems on LeetCode, Codeforces, and HackerRank',
          'Applied advanced data structures: segment trees, tries, and union-find',
          'Designed efficient algorithms for production systems',
          'Mentored junior engineers on problem-solving and DSA fundamentals'
        ],
        projects: [
          'Custom trie-based autocomplete engine',
          'Graph-based route optimization system',
          'Real-time ranking algorithm for gaming platform'
        ],
        achievements: [
          'Top 5% on LeetCode with 1000+ problems solved',
          'Designed algorithm reducing search time from O(n²) to O(n log n)',
          'Published data structure visualizations and educational content'
        ],
        relatedSkills: ['Networking', 'Java 21', 'Python']
      },
      'Networking': {
        description: 'Deep understanding of computer networking, protocols, and distributed system communication.',
        experience: [
          'Expertise in TCP/IP, HTTP/2, gRPC, and WebSocket protocols',
          'Designed network architectures with load balancers and CDNs',
          'Debugged complex networking issues in distributed systems',
          'Implemented service discovery and DNS-based routing'
        ],
        projects: [
          'Custom load balancer with health checking',
          'WebSocket-based real-time communication layer',
          'Network monitoring and alerting platform'
        ],
        achievements: [
          'Reduced network latency by 40% with connection pooling and keep-alive',
          'Designed network topology handling 100K+ concurrent connections',
          'Debugged and resolved critical TCP retransmission issues in production'
        ],
        relatedSkills: ['DSA', 'High Level Design', 'Microservices']
      },

      // ─── Cache ────────────────────────────────────────────
      'Elasti-Cache': {
        description: 'Experience with Amazon ElastiCache for managed Redis and Memcached caching at scale.',
        experience: [
          'Deployed and managed ElastiCache Redis clusters in production',
          'Configured cluster mode, replication, and automatic failover',
          'Implemented cache-aside, write-through, and write-behind patterns',
          'Set up CloudWatch monitoring and alarm-based scaling'
        ],
        projects: [
          'Session management for distributed web applications',
          'API response caching layer for high-traffic services',
          'Real-time feature flags and configuration caching'
        ],
        achievements: [
          'Reduced database load by 70% with ElastiCache caching layer',
          'Achieved sub-millisecond read latency for cached data',
          'Designed multi-AZ caching with automatic failover'
        ],
        relatedSkills: ['Redis', 'MySQL', 'High Level Design']
      },
      'Redis': {
        description: 'Expert in Redis for caching, session management, and real-time data structures.',
        experience: [
          'Designed Redis caching strategies with eviction policies',
          'Implemented session management with Redis Cluster',
          'Used Redis data structures for real-time leaderboards and counters',
          'Built pub/sub systems and stream processing with Redis Streams'
        ],
        projects: [
          'Real-time gaming leaderboards',
          'Session management for microservices',
          'Cache layer for high-traffic APIs'
        ],
        achievements: [
          'Reduced database load by 70% with Redis caching',
          'Built real-time analytics with Redis Streams processing 100K+ events/sec',
          'Implemented distributed locking with Redis for consistency'
        ],
        relatedSkills: ['Elasti-Cache', 'MySQL', 'Kafka']
      }
    };;
