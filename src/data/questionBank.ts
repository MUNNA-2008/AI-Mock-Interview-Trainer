export interface CuratedQuestion {
  id: string;
  category: 'Behavioral & STAR' | 'System Architecture' | 'Technical & Coding Logic' | 'Product Strategy' | 'Conflict & Leadership';
  difficulty: 'Entry' | 'Mid' | 'Senior' | 'Staff+';
  question: string;
  context: string;
  keySignals: string[];
  sampleFollowUps: string[];
  starGuide: {
    situationHint: string;
    taskHint: string;
    actionHint: string;
    resultHint: string;
  };
}

export interface InterviewerPersona {
  id: string;
  name: string;
  title: string;
  companyVibe: string;
  avatarUrl: string;
  voiceName: string;
  styleDescription: string;
  introMessage: string;
}

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: 'sarah-director',
    name: 'Sarah Chen',
    title: 'Senior Engineering Director',
    companyVibe: 'Tier-1 Tech & High-Bar Architecture',
    avatarUrl: '/src/assets/images/interviewer_sarah_director_1793272147822.jpg',
    voiceName: 'Kore',
    styleDescription: 'Pragmatic, deeply technical, and focused on distributed scalability, edge cases, and architectural trade-offs.',
    introMessage: "Hi there! I'm Sarah. Thanks for taking the time to meet today. We'll dive into your background and walk through some technical and real-world leadership scenarios. Take your time, think out loud, and let's get started whenever you're ready."
  },
  {
    id: 'marcus-vp',
    name: 'Marcus Vance',
    title: 'VP of Product & Strategy',
    companyVibe: 'High-Growth Startup & User Impact',
    avatarUrl: '/src/assets/images/interviewer_marcus_vp_1793272148004.jpg',
    voiceName: 'Puck',
    styleDescription: 'Strategic, inquisitive, and laser-focused on user value, prioritization frameworks, and measurable metrics.',
    introMessage: "Hey! Glad to connect. I'm Marcus. Today we're going to explore how you approach ambiguity, navigate tough product trade-offs, and align cross-functional teams. Speak naturally—I love hearing the 'why' behind your decisions."
  }
];

export const CURATED_QUESTION_BANK: CuratedQuestion[] = [
  {
    id: 'q-star-1',
    category: 'Behavioral & STAR',
    difficulty: 'Senior',
    question: 'Describe a time when a critical project was falling behind schedule. How did you diagnose the bottleneck and steer it back on track?',
    context: 'Evaluates project ownership, cross-functional risk triage, prioritization, and communication under pressure.',
    keySignals: ['Root-cause analysis', 'Decisive scope trimming', 'Stakeholder alignment', 'Quantifiable delivery outcome'],
    sampleFollowUps: [
      'What technical debt or scope was deliberately dropped, and how did stakeholders respond?',
      'If you could replay that timeline, what early warning indicator would you monitor?'
    ],
    starGuide: {
      situationHint: 'Establish the project scale, deadline stakes, and root cause of the delay.',
      taskHint: 'Clarify your personal responsibility versus the broader team.',
      actionHint: 'Detail the concrete changes: deprioritized features, revised architecture, or sprint re-alignment.',
      resultHint: 'Quantify the outcome (e.g., delivered 3 days ahead of revised date with zero SLA breaks).'
    }
  },
  {
    id: 'q-sys-1',
    category: 'System Architecture',
    difficulty: 'Senior',
    question: 'How would you design a globally distributed URL shortener service handling 50,000 writes/sec and 500,000 reads/sec with sub-20ms p99 read latency?',
    context: 'Assesses distributed caching, base62 encoding schemes, database sharding/partitioning, and CDN cache eviction.',
    keySignals: ['Capacity estimation (QPS, storage, bandwidth)', 'Data model & unique ID generation', 'Cache-aside with Redis', 'Read replicas'],
    sampleFollowUps: [
      'How do you prevent collisions when generating IDs across independent database shards?',
      'What happens if a celebrity tweets a URL and creates a severe hotkey cache stampede?'
    ],
    starGuide: {
      situationHint: 'Acknowledge non-functional requirements: read-heavy ratio (10:1), durability, sub-20ms latency.',
      taskHint: 'Specify the API interface and end-to-end data flow contract.',
      actionHint: 'Architect the pipeline: reverse proxy, Redis cluster, Cassandra/DynamoDB key-value store, Snowflake ID generator.',
      resultHint: 'Verify failure modes: cache warm-up, rate limiting, and multi-region replication consistency.'
    }
  },
  {
    id: 'q-conflict-1',
    category: 'Conflict & Leadership',
    difficulty: 'Staff+',
    question: 'Tell me about a disagreement you had with a principal engineer or product leader regarding an architectural or roadmap decision. How was it resolved?',
    context: 'Measures intellectual humility, data-driven persuasion, disagree-and-commit capability, and team cohesion.',
    keySignals: ['Respectful debate', 'Reliance on benchmarks/data over ego', 'Constructive compromise', 'Post-decision commitment'],
    sampleFollowUps: [
      'What was their strongest argument, and did you concede any part of your proposal?',
      'How did you ensure there was no lingering friction on the team afterwards?'
    ],
    starGuide: {
      situationHint: 'Describe the technical debate (e.g., GraphQL vs REST, Postgres vs NoSQL) and why both sides had valid merits.',
      taskHint: 'Highlight your responsibility to preserve velocity without sacrificing reliability.',
      actionHint: 'Walk through the proof of concept (POC) benchmark or user research you conducted to gather unbiased evidence.',
      resultHint: 'Share the agreed path, the metric outcome, and how it strengthened mutual trust.'
    }
  },
  {
    id: 'q-code-1',
    category: 'Technical & Coding Logic',
    difficulty: 'Mid',
    question: 'How would you implement an in-memory Least Recently Used (LRU) Cache with O(1) get and put operations in production code?',
    context: 'Evaluates algorithmic efficiency, data structure composition (Hash Map + Doubly Linked List), concurrency safety, and boundary validation.',
    keySignals: ['Hash Map + Doubly Linked List', 'O(1) pointer updates', 'Capacity eviction logic', 'Thread safety awareness'],
    sampleFollowUps: [
      'How would you make this LRU cache thread-safe in a multi-threaded web application?',
      'What are the memory overhead trade-offs compared to an approximate LRU algorithm like Redis uses?'
    ],
    starGuide: {
      situationHint: 'Explain why a plain array or map fails to achieve O(1) eviction ordering.',
      taskHint: 'Define the Node structure and sentinel head/tail nodes to avoid null pointer edge cases.',
      actionHint: 'Demonstrate the exact step-by-step logic for move-to-head on read and evict-tail on capacity breach.',
      resultHint: 'Discuss space complexity O(capacity) and how to write automated test invariants.'
    }
  },
  {
    id: 'q-prod-1',
    category: 'Product Strategy',
    difficulty: 'Senior',
    question: 'Imagine you are launching an AI-powered code completion feature in our developer IDE. What core metrics would you track, and how would you price or package it?',
    context: 'Tests product intuition, North Star metrics, developer experience empathy, cost vs pricing margins, and rollout guardrails.',
    keySignals: ['Acceptance rate of suggestions', 'Latency p95 (<150ms)', 'Daily active retention', 'Token cost unit economics'],
    sampleFollowUps: [
      'If acceptance rate is high but developers report more subtle bugs in PRs, how would you triage that?',
      'How would you design the tiered pricing model between free and enterprise tiers?'
    ],
    starGuide: {
      situationHint: 'Identify the target developer persona and core pain points (friction, repetitive boilerplate).',
      taskHint: 'Define the primary goal: developer flow-state without distracting hallucinated suggestions.',
      actionHint: 'Structure the metric framework: Input metrics (latency, context window) -> Output metrics (acceptance %, churn).',
      resultHint: 'Outline the phased rollout and canary evaluation strategy.'
    }
  },
  {
    id: 'q-star-2',
    category: 'Behavioral & STAR',
    difficulty: 'Mid',
    question: 'Can you share an experience where you made a mistake or caused a production outage? What did you learn and implement to ensure it never happens again?',
    context: 'Evaluates blameless post-mortem mindset, accountability, rapid incident remediation, and systematic guardrails.',
    keySignals: ['Immediate transparency', 'Swift triage', 'Root cause discovery', 'Automated safeguards & regression tests'],
    sampleFollowUps: [
      'How did you communicate with impacted customers or internal executives during the incident?',
      'What automated test or lint check did you introduce into the CI/CD pipeline afterwards?'
    ],
    starGuide: {
      situationHint: 'Be honest and specific about the trigger: a missing database migration, unhandled null, or config typo.',
      taskHint: 'Your immediate duty during Sev-1 to restore service before assigning blame.',
      actionHint: 'How you rolled back or hotfixed, followed by leading the blameless post-mortem.',
      resultHint: 'Long-term impact: zero repeat incidents in that subsystem and updated runbooks.'
    }
  }
];
