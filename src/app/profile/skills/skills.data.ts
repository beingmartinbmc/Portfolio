export interface SkillDetail {
  description: string;
  experience: string[];
  projects: string[];
  achievements: string[];
  relatedSkills: string[];
}

export const SKILL_DETAILS: Record<string, SkillDetail> = {
  // ─── Languages ────────────────────────────────────────
  'Java': {
    description: 'Strong Java experience with modern language features, concurrency improvements, and production-grade backend development on recent JDKs including Java 21.',
    experience: [
      'Worked across Java 8 through Java 21 in production systems',
      'Used records, sealed classes, switch pattern matching, and record patterns to simplify domain modeling',
      'Applied virtual threads selectively for I/O-heavy request flows and background tasks',
      'Built and maintained backend services with attention to performance, observability, and clean API design'
    ],
    projects: [
      'Backend microservices using modern Java features',
      'Concurrent data processing and job execution pipelines',
      'REST APIs with strong typing and validation'
    ],
    achievements: [
      'Improved throughput on selected I/O-bound flows after adopting virtual threads',
      'Reduced branching complexity in polymorphic business logic using sealed classes and pattern matching',
      'Helped modernize legacy Java codebases by incrementally adopting newer language features'
    ],
    relatedSkills: ['Spring Boot', 'Microservices', 'DSA']
  },

  'Python': {
    description: 'Strong Python skills for backend services, automation, data processing, and AI-enabled application development.',
    experience: [
      'Built REST APIs using Flask and FastAPI',
      'Developed automation scripts for CI/CD, support workflows, and operational tasks',
      'Used Pandas and NumPy for data analysis, transformation, and reporting',
      'Implemented ML and LLM-backed workflows in Python for internal tools and prototypes'
    ],
    projects: [
      'AI-assisted code review and analysis tooling',
      'Data processing and reporting pipelines',
      'Internal automation and developer productivity tools'
    ],
    achievements: [
      'Automated recurring manual workflows and saved engineering/support time each week',
      'Built internal CLI and utility scripts adopted across multiple teams',
      'Implemented anomaly detection and data quality checks for operational datasets'
    ],
    relatedSkills: ['Generative AI', 'LLM', 'RAG']
  },

  'GO': {
    description: 'Proficient in Go for building backend services, concurrent workers, and lightweight CLI tooling.',
    experience: [
      'Built production services in Go using standard library patterns and Echo where appropriate',
      'Implemented concurrent processing with goroutines, channels, contexts, and worker pools',
      'Developed HTTP and gRPC services for internal and external APIs',
      'Used profiling and benchmarking to improve latency, memory use, and CPU efficiency'
    ],
    projects: [
      'Real-time event processing service',
      'Low-latency API layer in Go',
      'Internal developer tooling and command-line utilities'
    ],
    achievements: [
      'Delivered services with predictable latency and small runtime footprint',
      'Reduced memory usage and startup overhead for selected workloads by moving them to Go',
      'Improved operational simplicity through static binaries and straightforward deployment patterns'
    ],
    relatedSkills: ['Echo', 'Microservices', 'Kafka']
  },

  'NodeJS': {
    description: 'Experienced with Node.js for building APIs, real-time features, and serverless backends.',
    experience: [
      'Built REST APIs using Express and NestJS',
      'Implemented real-time features with WebSockets and Socket.io',
      'Developed Lambda-based services and utility functions on AWS',
      'Used Node.js for scripting, build tooling, and SSR-related backend tasks'
    ],
    projects: [
      'Real-time notification and chat features',
      'Serverless API backend on AWS',
      'SSR support service for frontend rendering'
    ],
    achievements: [
      'Built socket-based features that handled high concurrent connection counts reliably',
      'Improved Lambda cold-start behavior through dependency and bundle-size optimization',
      'Implemented streaming and queue-backed processing for bursty workloads'
    ],
    relatedSkills: ['Kafka', 'RabbitMQ', 'MongoDB']
  },

  // ─── Architecture ─────────────────────────────────────
  'High Level Design': {
    description: 'Strong system design skills for building scalable, observable, and maintainable distributed systems.',
    experience: [
      'Designed service-oriented systems with clear boundaries, failure isolation, and operational ownership',
      'Created architecture documents, reviewed trade-offs, and participated in design reviews',
      'Evaluated consistency, availability, caching, and asynchronous processing trade-offs for different workloads',
      'Designed for horizontal scaling, high availability, and graceful degradation'
    ],
    projects: [
      'Scalable gaming and leaderboard systems',
      'Real-time event-driven backend architecture',
      'Multi-tenant SaaS-style platform design'
    ],
    achievements: [
      'Designed systems with clearer service boundaries and more predictable scaling characteristics',
      'Improved reliability by introducing retries, idempotency, fallback paths, and rate limiting where needed',
      'Reduced infrastructure waste through better capacity planning, caching, and async processing'
    ],
    relatedSkills: ['Low Level Design', 'Microservices', 'Kafka']
  },

  'Low Level Design': {
    description: 'Strong low-level design skills with focus on domain modeling, SOLID principles, extensibility, and testable code.',
    experience: [
      'Designed object-oriented systems with clear abstractions and separation of concerns',
      'Applied design patterns pragmatically rather than by default',
      'Reviewed code for maintainability, coupling, and API ergonomics',
      'Built reusable libraries and shared components for common application concerns'
    ],
    projects: [
      'Payment gateway abstraction with pluggable providers',
      'Rule engine for configurable business workflows',
      'Notification framework supporting multiple delivery channels'
    ],
    achievements: [
      'Improved code readability and change safety through better interfaces and domain boundaries',
      'Built reusable internal components adopted by multiple teams',
      'Increased test coverage and reduced mocking complexity through cleaner design'
    ],
    relatedSkills: ['High Level Design', 'Java', 'Spring Boot']
  },

  'Microservices': {
    description: 'Hands-on experience designing and implementing microservices with clear ownership, observability, and resilience patterns.',
    experience: [
      'Helped decompose monolithic or tightly coupled systems into service-aligned modules where it made sense',
      'Built service-to-service communication using REST, gRPC, and event-driven messaging',
      'Implemented resilience patterns such as timeouts, retries, circuit breaking, and dead-letter handling',
      'Set up tracing, structured logging, and metrics for distributed debugging'
    ],
    projects: [
      'Gaming platform service decomposition',
      'Financial workflow orchestration services',
      'E-commerce-style order processing system'
    ],
    achievements: [
      'Improved deployment velocity through independently deployable services and CI/CD pipelines',
      'Reduced cross-service failure impact with better timeout, retry, and fallback strategies',
      'Introduced clearer ownership boundaries around APIs, data, and operational responsibilities'
    ],
    relatedSkills: ['Spring Boot', 'Kafka', 'High Level Design']
  },

  // ─── Databases ────────────────────────────────────────
  'MySQL': {
    description: 'Hands-on experience with MySQL 5.6, 5.7, and 8.0 in transactional production systems.',
    experience: [
      'Designed normalized and denormalized schemas based on access patterns and consistency needs',
      'Tuned slow queries using EXPLAIN, indexing, query rewrites, and execution-plan analysis',
      'Worked with replication, backups, migration strategies, and operational monitoring',
      'Used Amazon DMS and controlled cutovers for database migration work'
    ],
    projects: [
      'Production database migration for gaming workloads',
      'Query optimization for high-traffic APIs',
      'Schema design for service-oriented applications'
    ],
    achievements: [
      'Improved hot-path query performance through indexing and execution-plan tuning',
      'Supported production migrations with rollback plans and low-risk cutover approaches',
      'Added visibility into slow queries, lock contention, and replication lag'
    ],
    relatedSkills: ['MongoDB', 'Redis', 'Elasti-Cache']
  },

  'MongoDB': {
    description: 'Proficient in MongoDB for document-oriented data models, flexible schemas, and aggregation-heavy workloads.',
    experience: [
      'Designed collections and document shapes around application access patterns',
      'Built aggregation pipelines for reporting, filtering, and event analytics',
      'Worked with replica sets, sharding, indexing, and TTL-based data retention',
      'Used change streams for event-driven integrations where near-real-time updates were needed'
    ],
    projects: [
      'User activity and event logging platform',
      'Content management backend with flexible schemas',
      'Analytics dashboard backend using MongoDB aggregations'
    ],
    achievements: [
      'Improved read and write performance using better indexing and document modeling',
      'Supported high-ingest workloads through sharding and batch-write strategies',
      'Migrated selected workloads to MongoDB where schema flexibility was a better fit than relational storage'
    ],
    relatedSkills: ['MySQL', 'Neptune', 'Cassandra']
  },

  'Neptune': {
    description: 'Experience using Amazon Neptune for graph-oriented use cases such as relationship traversal, recommendations, and fraud/risk analysis.',
    experience: [
      'Modeled entities and relationships using graph structures for multi-hop queries',
      'Wrote Gremlin and SPARQL queries for traversal-heavy access patterns',
      'Integrated graph-backed services with application APIs and recommendation workflows',
      'Optimized traversals and indexing choices for low-latency relationship lookups'
    ],
    projects: [
      'Relationship and recommendation prototype',
      'Fraud/risk analysis using graph traversal',
      'Knowledge graph-backed search use case'
    ],
    achievements: [
      'Modeled relationship-heavy domains that were awkward to express in relational schemas',
      'Reduced complexity of multi-hop lookups by moving them to a graph model',
      'Built graph-backed features over datasets with millions of connected records'
    ],
    relatedSkills: ['MongoDB', 'MySQL', 'VectorDB']
  },

  'Salesforce DB': {
    description: 'Experience working with Salesforce data models, SOQL/SOSL, custom objects, and integration patterns with external systems.',
    experience: [
      'Designed custom objects, relationships, and field mappings in Salesforce',
      'Wrote SOQL and SOSL queries for reporting, support workflows, and operational data extraction',
      'Integrated Salesforce with external services through APIs and data sync jobs',
      'Supported data migrations, cleanup, and reconciliation across orgs or systems'
    ],
    projects: [
      'CRM data integration for operational reporting',
      'Custom Salesforce workflow support tooling',
      'Salesforce sync with internal systems'
    ],
    achievements: [
      'Automated recurring reporting and synchronization tasks',
      'Improved data quality through validation, deduplication, and reconciliation checks',
      'Supported integration flows with clear field mapping, retry handling, and auditability'
    ],
    relatedSkills: ['MySQL', 'MongoDB', 'High Level Design']
  },

  'Cassandra': {
    description: 'Working knowledge of Apache Cassandra for write-heavy, high-availability workloads and time-series/event data.',
    experience: [
      'Designed schemas around query patterns using partition keys and clustering columns carefully',
      'Worked with replication, consistency levels, TTL-based expiry, and operational tuning',
      'Handled time-series and append-heavy data models with awareness of tombstones and compaction behavior',
      'Monitored repair, compaction, and partition hot spots in production-like environments'
    ],
    projects: [
      'Time-series event storage',
      'User session and activity tracking',
      'Append-heavy event logging pipeline'
    ],
    achievements: [
      'Designed schemas that avoided hot partitions and supported predictable read paths',
      'Supported sustained write-heavy workloads with replication across nodes or zones',
      'Improved cluster health by tuning compaction strategy and query patterns'
    ],
    relatedSkills: ['MongoDB', 'MySQL', 'Kafka']
  },

  // ─── Frameworks ───────────────────────────────────────
  'Spring Boot': {
    description: 'Deep experience with Spring Boot for building production-ready services, REST APIs, and internal platforms.',
    experience: [
      'Built multiple production services using Spring Boot and Spring MVC/WebFlux where appropriate',
      'Implemented authentication and authorization with Spring Security, OAuth2, and JWT',
      'Used Spring Data JPA, transactional boundaries, and caching for data access layers',
      'Added Actuator, metrics, logging, and tracing for operational visibility'
    ],
    projects: [
      'Gaming and transaction-processing backend services',
      'Authentication and user-management services',
      'Internal platform APIs and business workflows'
    ],
    achievements: [
      'Shipped multiple services using shared conventions and reusable starters',
      'Improved maintainability through consistent error handling, validation, and configuration patterns',
      'Made services easier to operate through health checks, metrics, and structured observability'
    ],
    relatedSkills: ['Java', 'Microservices', 'MySQL']
  },

  'Echo': {
    description: 'Experienced with Echo for building lightweight, high-performance Go web services.',
    experience: [
      'Built REST APIs using Echo middleware, routing, and request binding',
      'Implemented middleware for authentication, logging, panic recovery, and rate limiting',
      'Used context-aware request handling and cancellation for robust service behavior',
      'Integrated Echo services with gRPC, Kafka, and background workers'
    ],
    projects: [
      'Low-latency Go API service',
      'Internal developer platform APIs',
      'Data ingestion endpoint for asynchronous processing'
    ],
    achievements: [
      'Built lean APIs with a small memory footprint and fast startup time',
      'Improved latency compared with heavier service stacks for selected endpoints',
      'Standardized middleware and lifecycle handling across Go services'
    ],
    relatedSkills: ['GO', 'Microservices', 'Kafka']
  },

  'Dropwizard': {
    description: 'Experience with Dropwizard for lightweight, ops-friendly Java services with strong operational conventions.',
    experience: [
      'Built services using Dropwizard with Jersey, Jetty, and Jackson',
      'Integrated persistence layers using Hibernate and migration tooling',
      'Used Dropwizard Metrics and health checks for monitoring and operational readiness',
      'Tuned thread pools and request handling for predictable service behavior'
    ],
    projects: [
      'Payment and workflow microservice',
      'Profile and preference management API',
      'Operational admin backend service'
    ],
    achievements: [
      'Built services with clear health endpoints and operational visibility',
      'Kept latency predictable by controlling thread pools and dependency footprint',
      'Simplified troubleshooting with structured logs and metrics-first service design'
    ],
    relatedSkills: ['Java', 'Spring Boot', 'MySQL']
  },

  'Google Guice': {
    description: 'Proficient in Google Guice for dependency injection in lightweight Java applications and non-Spring services.',
    experience: [
      'Used Guice modules and providers to structure non-Spring Java services cleanly',
      'Built test-friendly wiring for service, repository, and infrastructure layers',
      'Implemented custom bindings and scopes where needed',
      'Integrated Guice with service frameworks and internal libraries'
    ],
    projects: [
      'Modular data processing service',
      'Plugin-style service architecture',
      'Testable service layer with dependency injection'
    ],
    achievements: [
      'Improved modularity and testability in non-Spring Java codebases',
      'Reduced manual wiring boilerplate through consistent DI configuration',
      'Kept startup and framework overhead low for simpler services'
    ],
    relatedSkills: ['Java', 'Dropwizard', 'Spring Boot']
  },

  // ─── AI / ML ──────────────────────────────────────────
  'Generative AI': {
    description: 'Hands-on experience building applications on top of modern generative AI models, including chat, summarization, retrieval, and multimodal workflows.',
    experience: [
      'Integrated hosted models from providers such as OpenAI, Anthropic, and Google into application workflows',
      'Designed prompt workflows, tool-calling flows, and response validation strategies',
      'Built multimodal prototypes using text, image, and audio capabilities where relevant',
      'Evaluated outputs with human review and task-specific quality checks'
    ],
    projects: [
      'AI-assisted portfolio and interactive demo features',
      'Code review and analysis assistant',
      'Content generation and summarization workflows'
    ],
    achievements: [
      'Built AI-assisted features that reduced manual drafting and triage effort',
      'Improved output quality through prompt iteration, retrieval, and structured response handling',
      'Added moderation, fallback logic, and validation checks to make AI features safer in production'
    ],
    relatedSkills: ['LLM', 'RAG', 'VectorDB']
  },

  'LLM': {
    description: 'Practical experience integrating large language models into applications for Q&A, summarization, extraction, and developer productivity workflows.',
    experience: [
      'Integrated LLM APIs into backend services and internal tools',
      'Built retrieval-backed flows for grounded question answering and document understanding',
      'Used prompt engineering, structured outputs, and tool use to improve reliability',
      'Evaluated when prompt-based approaches, retrieval, or fine-tuning-style customization were the right fit'
    ],
    projects: [
      'Customer support and documentation assistant',
      'Document analysis and summarization workflow',
      'Code generation and review helper'
    ],
    achievements: [
      'Reduced response or turnaround time on knowledge-heavy workflows',
      'Improved answer grounding by combining retrieval with clear response formatting',
      'Automated selected support or review steps with human-in-the-loop checks'
    ],
    relatedSkills: ['Generative AI', 'RAG', 'VectorDB']
  },

  'RAG': {
    description: 'Strong experience with Retrieval-Augmented Generation for grounding LLM responses in internal and domain-specific knowledge sources.',
    experience: [
      'Designed RAG pipelines including chunking, embeddings, indexing, retrieval, and answer synthesis',
      'Implemented hybrid retrieval using semantic search, keyword filtering, and metadata constraints',
      'Used reranking and chunking strategies tailored to different document types',
      'Built evaluation datasets and review loops to measure retrieval relevance and answer quality'
    ],
    projects: [
      'Internal knowledge base assistant',
      'Documentation search and Q&A system',
      'Long-form document analysis workflow'
    ],
    achievements: [
      'Improved answer relevance on internal evaluation sets through better retrieval and reranking',
      'Reduced hallucinations compared with pure prompt-only generation by grounding responses in retrieved content',
      'Built pipelines that scaled to large internal document collections'
    ],
    relatedSkills: ['LLM', 'VectorDB', 'Generative AI']
  },

  'VectorDB': {
    description: 'Experience with vector search systems for semantic retrieval, similarity matching, and recommendation-style applications.',
    experience: [
      'Worked with Pinecone, Weaviate, and pgvector-based setups',
      'Designed embedding and metadata strategies for documents, code, and mixed-content search',
      'Used ANN search, filtering, and reranking to balance latency and relevance',
      'Managed embedding backfills, re-indexing, and versioned retrieval workflows'
    ],
    projects: [
      'Semantic search for internal or product data',
      'Similar document recommendation workflow',
      'Content similarity and deduplication use case'
    ],
    achievements: [
      'Built low-latency semantic retrieval for AI-assisted workflows',
      'Improved relevance by combining vector retrieval with keyword filters and reranking',
      'Operationalized embedding refresh and index maintenance for evolving datasets'
    ],
    relatedSkills: ['RAG', 'LLM', 'Generative AI']
  },

  'Semantic Caching': {
    description: 'Embedding-based caching for LLM workloads that serves answers to semantically similar prompts from cache instead of hitting the model, cutting cost and latency.',
    experience: [
      'Built a semantic cache that embeds incoming prompts and matches them against prior responses by similarity threshold',
      'Tuned similarity thresholds, TTLs, and namespace partitioning to balance hit rate against staleness',
      'Backed the cache with a vector store plus Redis for metadata and fast lookups',
      'Added cache-hit/miss metrics and guardrails to avoid serving stale or low-confidence matches'
    ],
    projects: [
      'Semantic cache layer in front of the on-call AI agent',
      'Cost-reduction layer for high-traffic LLM endpoints',
      'Prompt deduplication for repeated support questions'
    ],
    achievements: [
      'Reduced LLM spend and tail latency by serving repeated and near-duplicate queries from cache',
      'Kept answer quality high with confidence thresholds and selective invalidation',
      'Sustained sub-second p95 on cached retrieval paths under production load'
    ],
    relatedSkills: ['RAG', 'VectorDB', 'Redis']
  },

  'MCP Servers': {
    description: 'Hands-on experience exposing tools and data to LLM agents through the Model Context Protocol, giving models a standard, secure way to call external systems.',
    experience: [
      'Built MCP servers that expose logs, code, and documentation as agent-callable tools',
      'Designed tool schemas, auth, and input validation so agents call systems safely',
      'Wired MCP tool-calling into RAG and agent workflows for grounded, action-capable responses',
      'Handled timeouts, retries, and result shaping to keep tool calls reliable inside agent loops'
    ],
    projects: [
      'MCP tool layer for the on-call AI agent (Splunk, GitHub, Drive, Confluence, Slack)',
      'Standardized tool gateway shared across multiple agents',
      'Secure data-access tools for grounded LLM workflows'
    ],
    achievements: [
      'Let agents pull live context from many systems through one consistent protocol',
      'Reduced bespoke integration glue by standardizing on MCP tool contracts',
      'Improved agent safety with validated, scoped, auditable tool access'
    ],
    relatedSkills: ['LLM', 'RAG', 'Generative AI']
  },

  'Bedrock': {
    description: 'Experience building on Amazon Bedrock to run multiple foundation models behind one managed API, with grounding, guardrails, and provider fallback.',
    experience: [
      'Integrated Bedrock-hosted models (including Anthropic Claude and Titan) into backend AI services',
      'Used Bedrock alongside OpenAI and Anthropic APIs with a provider-abstraction and fallback layer',
      'Applied Bedrock Guardrails and grounding to keep responses safe and on-policy',
      'Tuned model selection, token budgets, and streaming for cost and latency targets'
    ],
    projects: [
      'Multi-model inference layer for the on-call AI agent',
      'Provider-agnostic LLM gateway with Bedrock as a backend',
      'Grounded RCA summarization running across Bedrock, Anthropic, and OpenAI'
    ],
    achievements: [
      'Ran production AI features across multiple model providers with graceful fallback',
      'Kept inference within cost and latency budgets through model and token tuning',
      'Improved safety and compliance using managed guardrails and grounding'
    ],
    relatedSkills: ['Generative AI', 'LLM', 'AWS']
  },

  // ─── Queues ───────────────────────────────────────────
  'Kafka': {
    description: 'Strong working experience with Apache Kafka for event-driven systems, asynchronous processing, and real-time data pipelines.',
    experience: [
      'Designed topics, partitions, and consumer-group strategies for scalable event processing',
      'Built producers and consumers with schema-aware event contracts',
      'Used retries, dead-letter topics, idempotent processing, and lag monitoring',
      'Worked with streaming-style workflows and service integration through events'
    ],
    projects: [
      'Real-time analytics and event pipeline',
      'Event-driven backend integration flows',
      'Messaging backbone for service communication'
    ],
    achievements: [
      'Built event-driven pipelines that handled sustained high-throughput workloads',
      'Reduced coupling between services by shifting integrations to asynchronous events',
      'Improved resiliency with retry topics, monitoring, and safer consumer handling'
    ],
    relatedSkills: ['RabbitMQ', 'AmazonSQS', 'Microservices']
  },

  'RabbitMQ': {
    description: 'Experienced with RabbitMQ for reliable asynchronous job processing and queue-based workflow orchestration.',
    experience: [
      'Designed exchanges, queues, routing keys, and consumer patterns for task distribution',
      'Implemented retry handling, dead-letter queues, acknowledgments, and prefetch tuning',
      'Worked with publisher confirms and delivery guarantees appropriate to the use case',
      'Operated queue-backed worker systems for background processing'
    ],
    projects: [
      'Order and task processing workflow',
      'Email and notification dispatch pipeline',
      'Background job orchestration service'
    ],
    achievements: [
      'Improved delivery reliability through acknowledgments, retries, and dead-letter handling',
      'Smoothed traffic spikes by moving expensive work off the request path',
      'Simplified task routing with clean exchange and queue topology design'
    ],
    relatedSkills: ['Kafka', 'AmazonSQS', 'Microservices']
  },

  'AmazonSQS': {
    description: 'Proficient with Amazon SQS and SNS for managed queue-based and fan-out architectures on AWS.',
    experience: [
      'Designed workflows using Standard and FIFO queues depending on ordering and throughput needs',
      'Integrated SQS with Lambda, ECS, and other AWS consumers for background processing',
      'Implemented DLQs, redrive policies, visibility timeouts, and idempotent consumers',
      'Used SNS plus SQS fan-out patterns for event distribution'
    ],
    projects: [
      'Serverless background processing pipeline',
      'Async media or file-processing workflow',
      'Cross-service notification architecture on AWS'
    ],
    achievements: [
      'Reduced operational overhead by moving async workloads to fully managed messaging',
      'Improved resilience for bursty traffic using decoupled queues and dead-letter handling',
      'Built cost-effective background job pipelines with simple AWS-native components'
    ],
    relatedSkills: ['Kafka', 'RabbitMQ', 'Microservices']
  },

  // ─── Core CS ──────────────────────────────────────────
  'DSA': {
    description: 'Solid foundation in data structures and algorithms, applied both in problem-solving practice and production engineering.',
    experience: [
      'Solved hundreds of problems across platforms such as LeetCode, Codeforces, and HackerRank',
      'Worked with advanced structures such as tries, heaps, union-find, segment trees, and graph algorithms',
      'Applied time and space complexity analysis when designing production code paths',
      'Mentored junior engineers on problem solving, complexity analysis, and interview preparation'
    ],
    projects: [
      'Trie-based autocomplete/search prototype',
      'Graph-based optimization workflow',
      'Ranking and scoring logic for competitive systems'
    ],
    achievements: [
      'Built strong algorithmic intuition through sustained problem-solving practice',
      'Used better data structures to eliminate obvious bottlenecks in hot paths',
      'Created explanations and guidance that helped others improve problem-solving skills'
    ],
    relatedSkills: ['Networking', 'Java', 'Python']
  },

  'Networking': {
    description: 'Good grasp of networking fundamentals relevant to backend engineering and distributed systems.',
    experience: [
      'Worked with TCP/IP, HTTP/1.1, HTTP/2, gRPC, and WebSocket-based communication',
      'Designed systems behind load balancers, reverse proxies, and service discovery layers',
      'Debugged issues related to DNS, TLS, keep-alives, connection reuse, and timeouts',
      'Used logs, traces, and network-level diagnostics to investigate production issues'
    ],
    projects: [
      'Real-time communication layer',
      'Backend systems behind load balancers and proxies',
      'Network-aware service diagnostics and monitoring'
    ],
    achievements: [
      'Improved service-to-service latency through connection reuse and timeout tuning',
      'Diagnosed and resolved issues involving retransmissions, handshake failures, and unstable upstream calls',
      'Applied networking knowledge to make real-time and API-heavy systems more reliable'
    ],
    relatedSkills: ['DSA', 'High Level Design', 'Microservices']
  },

  // ─── Cache ────────────────────────────────────────────
  'Elasti-Cache': {
    description: 'Experience with Amazon ElastiCache, primarily Redis, for caching, session storage, and low-latency shared state.',
    experience: [
      'Deployed and operated ElastiCache Redis clusters in production environments',
      'Configured replication, failover, TTL policies, and memory-aware caching strategies',
      'Implemented cache-aside and write-through patterns based on workload characteristics',
      'Used CloudWatch metrics and alarms for cache health, memory pressure, and latency visibility'
    ],
    projects: [
      'Session storage for distributed applications',
      'Read-heavy API caching layer',
      'Low-latency configuration and feature flag cache'
    ],
    achievements: [
      'Reduced database pressure by caching hot reads and frequently accessed session data',
      'Improved resiliency with replicated cache setups and failover support',
      'Added visibility into hit rates, evictions, memory usage, and cache latency'
    ],
    relatedSkills: ['Redis', 'MySQL', 'High Level Design']
  },

  'Redis': {
    description: 'Strong Redis experience for caching, counters, leaderboards, rate limiting, and lightweight coordination patterns.',
    experience: [
      'Designed Redis-based caching strategies with appropriate TTLs and eviction behavior',
      'Used Redis data structures such as hashes, sets, sorted sets, and streams for real-time use cases',
      'Implemented session storage, counters, feature flags, and request-throttling workflows',
      'Applied Redis-based coordination carefully for idempotency and simple locking scenarios'
    ],
    projects: [
      'Real-time leaderboard and ranking features',
      'Session and token storage for distributed services',
      'Cache layer for read-heavy APIs'
    ],
    achievements: [
      'Reduced response times for hot endpoints by caching frequently requested data',
      'Built real-time features using sorted sets, counters, and stream-based event handling',
      'Used Redis pragmatically for low-latency shared state without overextending it as a primary datastore'
    ],
    relatedSkills: ['Elasti-Cache', 'MySQL', 'Kafka']
  }
};
