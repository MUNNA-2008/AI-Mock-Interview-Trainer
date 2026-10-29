export interface InterviewConfig {
  role: string;
  level: 'Entry / Junior' | 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Engineering Manager / Director';
  companyType: 'FAANG / Tier-1 Tech' | 'High-Growth Startup' | 'FinTech / High-Frequency' | 'Consulting & Strategy' | 'Enterprise Corp';
  format: 'Behavioral & Leadership' | 'System Design & Architecture' | 'Technical & Coding Logic' | 'Product Sense & Execution' | 'Full Loop Simulation';
  interviewerId: string;
  resumeSnippet?: string;
  targetJobDescription?: string;
  durationMinutes: number;
}

export interface InterviewTurn {
  id: string;
  questionNumber: number;
  questionText: string;
  category: string;
  candidateAnswer: string;
  feedbackPreview?: string;
  followUpQuestion?: string;
  followUpAnswer?: string;
  hintsUsed: number;
  durationSeconds: number;
  completedAt?: string;
}

export type HireDecision = 'Strong Hire' | 'Lean Hire' | 'Lean No Hire' | 'No Hire';

export interface DimensionScore {
  name: string;
  score: number; // 0-100
  weight: number;
  summary: string;
  highlights: string[];
}

export interface StarAnalysis {
  situationIdentified: boolean;
  taskIdentified: boolean;
  actionIdentified: boolean;
  resultIdentified: boolean;
  score: number;
  critique: string;
}

export interface QuestionReview {
  questionNumber: number;
  questionText: string;
  category: string;
  candidateSummary: string;
  score: number;
  strengths: string[];
  improvements: string[];
  exemplaryAnswer: string;
}

export interface FullEvaluationReport {
  id: string;
  timestamp: string;
  overallScore: number; // 0-100
  hireDecision: HireDecision;
  executiveSummary: string;
  dimensions: DimensionScore[];
  starAnalysis: StarAnalysis;
  pacingMetrics: {
    totalWords: number;
    averageWpm: number;
    totalFillerWords: number;
    pacingQuality: 'Optimal' | 'Too Fast' | 'Too Slow';
  };
  questionReviews: QuestionReview[];
  recommendedDrills: string[];
  roleTitle: string;
  companyType: string;
}

const COMMON_FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally',
  'sort of', 'kind of', 'i mean', 'right', 'honestly'
];

/**
 * Derives calibration hire decision from 0-100 score
 */
export function computeHireDecision(overallScore: number): HireDecision {
  if (overallScore >= 88) return 'Strong Hire';
  if (overallScore >= 72) return 'Lean Hire';
  if (overallScore >= 58) return 'Lean No Hire';
  return 'No Hire';
}

/**
 * Calculates candidate speech/text pacing and filler word statistics
 */
export function calculatePacingMetrics(text: string, durationSeconds: number) {
  const clean = text.trim();
  if (!clean || durationSeconds <= 0) {
    return {
      wordCount: 0,
      wpm: 0,
      fillerWordCount: 0,
      fillerRatePercent: 0,
      fillerWordsFound: [],
      pacingQuality: 'Too Slow' as const,
    };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = durationSeconds / 60;
  const wpm = Math.round(wordCount / (minutes || 1));

  const lower = clean.toLowerCase();
  const foundFillers: string[] = [];
  let fillerCount = 0;

  for (const filler of COMMON_FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      fillerCount += matches.length;
      if (!foundFillers.includes(filler)) {
        foundFillers.push(filler);
      }
    }
  }

  const fillerRatePercent = wordCount > 0 ? Math.round((fillerCount / wordCount) * 100) : 0;

  let pacingQuality: 'Optimal' | 'Too Fast' | 'Too Slow' = 'Optimal';
  if (wpm < 90) {
    pacingQuality = 'Too Slow';
  } else if (wpm > 175) {
    pacingQuality = 'Too Fast';
  }

  return {
    wordCount,
    wpm,
    fillerWordCount: fillerCount,
    fillerRatePercent,
    fillerWordsFound: foundFillers,
    pacingQuality,
  };
}

/**
 * Computes weighted aggregate score across rubric dimensions
 */
export function computeAggregatedScore(dimensions: { score: number; weight: number }[]): number {
  if (!dimensions || dimensions.length === 0) return 0;
  let totalWeight = 0;
  let weightedSum = 0;
  for (const dim of dimensions) {
    const weight = dim.weight > 0 ? dim.weight : 1;
    totalWeight += weight;
    weightedSum += Math.max(0, Math.min(100, dim.score)) * weight;
  }
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Checks presence of STAR method structural elements in behavioral response
 */
export function evaluateStarCoverage(answerText: string): {
  situation: boolean;
  task: boolean;
  action: boolean;
  result: boolean;
  missingComponents: string[];
  score: number;
} {
  const text = answerText.toLowerCase();

  // Pattern detection for S-T-A-R elements
  const situationMarkers = ['when i was', 'at my previous', 'we were facing', 'the situation was', 'in my role as', 'our team was', 'the problem was', 'project where', 'context was'];
  const taskMarkers = ['my responsibility was', 'i was tasked with', 'my goal was', 'the objective was', 'i needed to', 'the challenge was to', 'my assignment was', 'we had to achieve'];
  const actionMarkers = ['i decided to', 'i implemented', 'i designed', 'i spearheaded', 'i proposed', 'i built', 'i coordinated', 'first i', 'then i', 'i took the lead'];
  const resultMarkers = ['as a result', 'the outcome was', 'increased by', 'reduced by', 'improved', 'successfully delivered', 'metric', 'percent', 'saved', 'ultimately'];

  const hasSituation = situationMarkers.some((m) => text.includes(m)) || text.length > 80;
  const hasTask = taskMarkers.some((m) => text.includes(m));
  const hasAction = actionMarkers.some((m) => text.includes(m));
  const hasResult = resultMarkers.some((m) => text.includes(m));

  const missing: string[] = [];
  if (!hasSituation) missing.push('Situation (Context)');
  if (!hasTask) missing.push('Task (Your Specific Responsibility)');
  if (!hasAction) missing.push('Action (Concrete Steps You Took)');
  if (!hasResult) missing.push('Result (Quantified Outcome & Learning)');

  const hits = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const score = Math.round((hits / 4) * 100);

  return {
    situation: hasSituation,
    task: hasTask,
    action: hasAction,
    result: hasResult,
    missingComponents: missing,
    score,
  };
}

/**
 * Converts elapsed seconds into mm:ss format
 */
export function formatSeconds(totalSeconds: number): string {
  const mins = Math.floor(Math.max(0, totalSeconds) / 60);
  const secs = Math.floor(Math.max(0, totalSeconds) % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generates actionable targeted training drills based on weak dimensions
 */
export function generatePracticeRoadmap(weakDimensions: string[]): string[] {
  const drillMap: Record<string, string> = {
    'STAR Methodology': 'Practice 2-minute STAR behavioral drills focusing on quantifying the Result first.',
    'System Architecture': 'Trace latency, throughput, and single-point-of-failure trade-offs on high-scale distributed queues.',
    'Communication & Conciseness': 'Answer the "Headline First" drill: summarize your solution in one sentence before diving into details.',
    'Problem Solving & Rigor': 'Explicitly list edge cases and boundary failure scenarios before writing or describing algorithm logic.',
    'Cultural & Leadership Alignment': 'Articulate difficult stakeholder tradeoffs without deflecting blame; practice cross-functional alignment stories.'
  };

  const results: string[] = [];
  for (const dim of weakDimensions) {
    if (drillMap[dim]) {
      results.push(drillMap[dim]);
    }
  }

  if (results.length === 0) {
    results.push('Fine-tune executive presence: focus on strategic business impact and architectural leverage.');
    results.push('Continue rapid 1-question blitz practice to maintain peak confidence and instant articulation.');
  }

  return results;
}
