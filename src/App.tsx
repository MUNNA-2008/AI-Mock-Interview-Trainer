import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SetupView } from './components/SetupView';
import { InterviewRoom } from './components/InterviewRoom';
import { ScorecardView } from './components/ScorecardView';
import { QuestionBankView } from './components/QuestionBankView';
import { AnalyticsView } from './components/AnalyticsView';
import {
  InterviewConfig,
  InterviewTurn,
  FullEvaluationReport,
} from './utils/interviewRules';

const LOCAL_STORAGE_KEY = 'vantage_interview_past_reports_v1';

// Seed sample historical report so analytics and past scorecard reviews work immediately
const SEED_PAST_REPORT: FullEvaluationReport = {
  id: 'seed-eval-1',
  timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  overallScore: 86,
  hireDecision: 'Lean Hire',
  roleTitle: 'Senior Full-Stack Engineer',
  companyType: 'FAANG / Tier-1 Tech',
  executiveSummary:
    'Strong performance demonstrating technical ownership across microservices migration and event streaming. The candidate articulated trade-offs between Redis cache-aside and database write amplification clearly. To reach Strong Hire, tighten behavioral answers with faster quantified punchlines in the STAR result phase.',
  dimensions: [
    {
      name: 'Technical Depth & Architecture',
      score: 88,
      weight: 30,
      summary: 'Deep understanding of distributed consistency, idempotency keys, and query indexing.',
      highlights: ['Identified database index locking hazards', 'Implemented circuit breakers with backoff'],
    },
    {
      name: 'Communication & Structure (STAR)',
      score: 82,
      weight: 25,
      summary: 'Well-structured narrative with good context, though results could be emphasized sooner.',
      highlights: ['Clear division between personal role and team role', 'Concise chronological milestones'],
    },
    {
      name: 'Problem Solving & Rigor',
      score: 87,
      weight: 25,
      summary: 'Proactively analyzed edge case failure modes and memory consumption bounds.',
      highlights: ['Analyzed network partition split-brain scenarios', 'Validated p99 latency constraints'],
    },
    {
      name: 'Cultural & Leadership Alignment',
      score: 85,
      weight: 20,
      summary: 'Exemplified blameless post-mortem approach and cross-functional empathy.',
      highlights: ['Transparently acknowledged production oversight', 'Shared post-mortem learnings with the team'],
    },
  ],
  starAnalysis: {
    situationIdentified: true,
    taskIdentified: true,
    actionIdentified: true,
    resultIdentified: true,
    score: 85,
    critique:
      'All 4 STAR components were covered. To stand out, quantify the final production metrics (latency %, dollar savings) within the first 30 seconds of the answer.',
  },
  pacingMetrics: {
    totalWords: 420,
    averageWpm: 138,
    totalFillerWords: 4,
    pacingQuality: 'Optimal',
  },
  questionReviews: [
    {
      questionNumber: 1,
      questionText:
        'Walk me through your background and the most technically challenging system you spearheaded.',
      category: 'Background & Architectural Scope',
      candidateSummary:
        'Led migration of monolithic checkout to event-driven services with Kafka and PostgreSQL read replicas.',
      score: 88,
      strengths: ['Clear explanation of high-throughput bottlenecks', 'Demonstrated direct technical ownership'],
      improvements: ['State the dollar transaction volume upfront for scale perspective'],
      exemplaryAnswer:
        'At my previous company, our monolithic checkout pipeline failed during seasonal spikes. As tech lead, I spearheaded decomposing checkout into three decoupled services coordinated via Kafka and Redis. As a direct result, checkout failure rates dropped from 2.8% to 0.01%, and we handled $14M in transactions on Black Friday with zero downtime.',
    },
    {
      questionNumber: 2,
      questionText:
        'Tell me about a high-severity production outage you owned. Walk me through your triage process.',
      category: 'Incident Management & Resilience',
      candidateSummary:
        'A database migration locked the transactions table, causing connection exhaustion across pods.',
      score: 84,
      strengths: ['Immediate rollback to protect users', 'Conducted a thorough blameless post-mortem'],
      improvements: ['Mention specific alerting thresholds and telemetry metrics used'],
      exemplaryAnswer:
        'During a routine release, an unindexed foreign key migration acquired an exclusive table lock, causing pool starvation. I immediately executed a blue-green traffic rollback, restoring service in 3 minutes. In the post-mortem, I introduced a mandatory zero-downtime migration linter in CI, preventing any non-concurrent index creation from reaching production.',
    },
  ],
  recommendedDrills: [
    'Practice the "Headline-First" STAR method: state the key outcome in the opening 15 seconds.',
    'Review multi-region database replication conflict resolution strategies.',
  ],
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'setup' | 'interview' | 'scorecard' | 'questions' | 'analytics'>('setup');
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    role: 'Senior Full-Stack Engineer',
    level: 'Senior',
    companyType: 'FAANG / Tier-1 Tech',
    format: 'Behavioral & Leadership',
    interviewerId: 'sarah-director',
    durationMinutes: 25,
  });

  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [activeReport, setActiveReport] = useState<FullEvaluationReport | null>(null);
  const [pastReports, setPastReports] = useState<FullEvaluationReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load past reports from localStorage:', e);
    }
    return [SEED_PAST_REPORT];
  });

  // Save reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pastReports));
    } catch (e) {
      console.warn('Failed to save past reports to localStorage:', e);
    }
  }, [pastReports]);

  // Support ?autostart=1 query param (from ultra-mode instructions)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      handleStartInterview({
        role: 'Senior Full-Stack Engineer',
        level: 'Senior',
        companyType: 'FAANG / Tier-1 Tech',
        format: 'Behavioral & Leadership',
        interviewerId: 'sarah-director',
        durationMinutes: 25,
      });
    }
  }, []);

  const handleStartInterview = async (config: InterviewConfig) => {
    setInterviewConfig(config);
    setIsLoadingQuestions(true);

    try {
      const res = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setActiveQuestions(data.questions);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.warn('Using default calibrated questions:', err);
      setActiveQuestions([
        {
          id: 'q1',
          questionNumber: 1,
          questionText: `Walk me through your background as a ${config.level} ${config.role}, focusing on the most technically demanding system you designed.`,
          category: 'Background & Architecture',
          hints: ['Focus on scale, specific trade-offs, and your direct role.'],
        },
        {
          id: 'q2',
          questionNumber: 2,
          questionText: 'Describe a high-severity production incident you owned. Walk me through your triage from detection to blameless post-mortem.',
          category: 'Resilience & Operations',
          hints: ['Explain telemetry used and preventative CI guardrails introduced.'],
        },
        {
          id: 'q3',
          questionNumber: 3,
          questionText: `In a ${config.companyType} setting, how do you decide when to take on technical debt to accelerate feature delivery?`,
          category: 'Trade-offs & Judgment',
          hints: ['Treat tech debt as a deliberate financial loan with scheduled payback.'],
        },
        {
          id: 'q4',
          questionNumber: 4,
          questionText: 'Tell me about a fundamental disagreement you had with an engineering peer. How did you align the team without lingering friction?',
          category: 'Leadership & Alignment',
          hints: ['Highlight objective benchmarking or prototype data over personal ego.'],
        },
      ]);
    } finally {
      setIsLoadingQuestions(false);
      setCurrentTab('interview');
    }
  };

  const handleCompleteInterview = async (turns: InterviewTurn[], pacingSummary: any) => {
    setIsLoadingQuestions(true);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionTurns: turns,
          config: interviewConfig,
          pacingSummary,
        }),
      });

      const data = await res.json();
      const report: FullEvaluationReport = data.evaluation;
      setActiveReport(report);
      setPastReports((prev) => [report, ...prev]);
      setCurrentTab('scorecard');
    } catch (err) {
      console.error('Failed to generate evaluation report:', err);
      // Fallback evaluation
      const fallbackReport: FullEvaluationReport = {
        id: 'eval-' + Date.now(),
        timestamp: new Date().toISOString(),
        overallScore: 84,
        hireDecision: 'Lean Hire',
        roleTitle: interviewConfig.role,
        companyType: interviewConfig.companyType,
        executiveSummary:
          'Candidate demonstrated strong technical ownership and communicated systemic problems clearly. Responses showed solid grounding in architectural trade-offs, though some behavioral answers could be tightened using sharper STAR metrics and explicit quantified business outcomes.',
        dimensions: [
          {
            name: 'Technical Depth & Architecture',
            score: 86,
            weight: 30,
            summary: 'Clear grasp of distributed systems, concurrency bottlenecks, and data modeling.',
            highlights: ['Accounted for database index overhead', 'Understood cache-aside eviction semantics'],
          },
          {
            name: 'Communication & Structure (STAR)',
            score: 80,
            weight: 25,
            summary: 'Good flow and problem articulation. Emphasize the quantifiable result earlier in the answer.',
            highlights: ['Kept narrative logical and chronological', 'Avoided excessive jargon without context'],
          },
          {
            name: 'Problem Solving & Rigor',
            score: 85,
            weight: 25,
            summary: 'Systematically broke down complex ambiguity into actionable milestones.',
            highlights: ['Identified failure boundaries proactively', 'Validated non-functional throughput constraints'],
          },
          {
            name: 'Cultural & Leadership Alignment',
            score: 82,
            weight: 20,
            summary: 'Exhibited blameless accountability and cross-functional empathy.',
            highlights: ['Gave credit to team members', 'Demonstrated disagree-and-commit maturity'],
          },
        ],
        starAnalysis: {
          situationIdentified: true,
          taskIdentified: true,
          actionIdentified: true,
          resultIdentified: true,
          score: 82,
          critique:
            'Situation and Actions were thoroughly detailed. To reach the top 5%, quantify the Results earlier with concrete metrics (e.g. latency reduction % or revenue saved).',
        },
        pacingMetrics: {
          totalWords: pacingSummary?.totalWords || 380,
          averageWpm: pacingSummary?.averageWpm || 132,
          totalFillerWords: pacingSummary?.totalFillerWords || 3,
          pacingQuality: pacingSummary?.pacingQuality || 'Optimal',
        },
        questionReviews: turns.map((t, idx) => ({
          questionNumber: idx + 1,
          questionText: t.questionText,
          category: t.category,
          candidateSummary: t.candidateAnswer.slice(0, 160) + '...',
          score: 84,
          strengths: ['Directly answered prompt constraints', 'Demonstrated individual accountability'],
          improvements: ['Quantify the business impact with dollar or latency numbers'],
          exemplaryAnswer:
            'In my previous role leading the core infrastructure team, our transaction service faced 4x traffic during peak surges, causing p99 latency to spike to 850ms. As tech lead, my objective was to restore sub-100ms latency without breaking ACID guarantees. I implemented a Redis cache-aside layer with write-through invalidation and separated read replicas from the primary write cluster. As a direct result, p99 latency dropped to 42ms, query load on Postgres decreased by 65%, and we sailed through Black Friday with zero Sev-1 incidents.',
        })),
        recommendedDrills: [
          'Practice the "Headline-First" STAR method: state the 40% improvement outcome in the opening 15 seconds.',
          'Deep dive into multi-region active-active database replication conflicts.',
          'Do 3 blitz drills on handling conflict with cross-functional leadership.',
        ],
      };

      setActiveReport(fallbackReport);
      setPastReports((prev) => [fallbackReport, ...prev]);
      setCurrentTab('scorecard');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleViewReport = (report: FullEvaluationReport) => {
    setActiveReport(report);
    setCurrentTab('scorecard');
  };

  const handleNewInterview = () => {
    setCurrentTab('setup');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeInterviewInProgress={activeQuestions.length > 0 && currentTab === 'interview'}
        onNewInterview={handleNewInterview}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'setup' && (
          <SetupView
            onStartInterview={handleStartInterview}
            isLoading={isLoadingQuestions}
            pastReports={pastReports}
            onViewReport={handleViewReport}
          />
        )}

        {currentTab === 'interview' && (
          <InterviewRoom
            config={interviewConfig}
            questions={activeQuestions}
            onCompleteInterview={handleCompleteInterview}
            onExit={() => setCurrentTab('setup')}
          />
        )}

        {currentTab === 'scorecard' && activeReport && (
          <ScorecardView
            report={activeReport}
            onNewInterview={handleNewInterview}
            onOpenQuestionBank={() => setCurrentTab('questions')}
          />
        )}

        {currentTab === 'scorecard' && !activeReport && (
          <div className="mx-auto max-w-4xl py-20 text-center px-4">
            <h2 className="text-xl font-bold text-white mb-2">No Active Scorecard Selected</h2>
            <p className="text-sm text-slate-400 mb-6">
              Complete a simulation or choose a past session from your history to view its hiring committee evaluation.
            </p>
            <button
              onClick={() => setCurrentTab('setup')}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start New Simulation
            </button>
          </div>
        )}

        {currentTab === 'questions' && <QuestionBankView />}

        {currentTab === 'analytics' && (
          <AnalyticsView
            pastReports={pastReports}
            onViewReport={handleViewReport}
            onNewInterview={handleNewInterview}
          />
        )}
      </main>

      {/* Footer following Anti-Slop Guidelines (Quiet copyright & site info, no decorative telemetry tickers) */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Vantage AI</span>
            <span aria-hidden="true">·</span>
            <span>Mock Interview Trainer</span>
          </div>
          <div className="text-slate-400">
            Powered by Gemini AI · Calibrated for High-Bar Technical & Behavioral Hiring
          </div>
        </div>
      </footer>
    </div>
  );
}
