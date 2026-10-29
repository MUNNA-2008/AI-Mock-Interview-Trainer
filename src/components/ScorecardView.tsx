import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Copy,
  Printer,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { FullEvaluationReport } from '../utils/interviewRules';

interface ScorecardViewProps {
  report: FullEvaluationReport;
  onNewInterview: () => void;
  onOpenQuestionBank: () => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({
  report,
  onNewInterview,
  onOpenQuestionBank,
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);
  const [copied, setCopied] = useState(false);

  const getDecisionTheme = (decision: string) => {
    switch (decision) {
      case 'Strong Hire':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-500 text-slate-950 font-bold',
        };
      case 'Lean Hire':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          badge: 'bg-indigo-500 text-white font-bold',
        };
      case 'Lean No Hire':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badge: 'bg-amber-500 text-slate-950 font-bold',
        };
      default:
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          badge: 'bg-rose-500 text-white font-bold',
        };
    }
  };

  const theme = getDecisionTheme(report.hireDecision);

  const handleCopyReport = () => {
    const markdown = `# Vantage AI Interview Scorecard
Role: ${report.roleTitle} | Company Bar: ${report.companyType}
Overall Score: ${report.overallScore}/100
Calibration: ${report.hireDecision}
Date: ${new Date(report.timestamp).toLocaleDateString()}

## Executive Summary
${report.executiveSummary}

## Competency Dimensions
${report.dimensions.map((d) => `- **${d.name}**: ${d.score}/100\n  ${d.summary}`).join('\n')}

## STAR Method Assessment
Score: ${report.starAnalysis.score}/100
Critique: ${report.starAnalysis.critique}

## Targeted Drills
${report.recommendedDrills.map((drill) => `- ${drill}`).join('\n')}
`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Scorecard Debrief</span>
            <span aria-hidden="true">·</span>
            <span>{report.roleTitle}</span>
            <span aria-hidden="true">·</span>
            <span>{report.companyType}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Hiring Committee Evaluation
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied Markdown!' : 'Copy Report'}</span>
          </button>

          <button
            onClick={onNewInterview}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Start Another Simulation</span>
          </button>
        </div>
      </div>

      {/* Hero Score & Decision Strip */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Scorecard Hero Box */}
        <div className="md:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Calibration Decision
            </span>
            <div className="mt-2 flex items-center gap-3">
              <span className={`rounded-md px-3 py-1 text-sm ${theme.badge}`}>
                {report.hireDecision}
              </span>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-6xl font-extrabold text-white font-mono tabular-nums">
                {report.overallScore}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
            <div className="flex justify-between py-1">
              <span>Speech Pace</span>
              <span className="font-mono font-semibold text-white tabular-nums">
                {report.pacingMetrics.averageWpm} WPM ({report.pacingMetrics.pacingQuality})
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Filler Words Used</span>
              <span className="font-mono font-semibold text-slate-300 tabular-nums">
                {report.pacingMetrics.totalFillerWords} detected
              </span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="md:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>Bar-Raiser Executive Summary</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {report.executiveSummary}
            </p>
          </div>

          {/* STAR Methodology Quick Indicator */}
          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>STAR Method Execution</span>
              <span className="font-mono text-indigo-400 font-bold">{report.starAnalysis.score}% Coverage</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2 rounded-lg border ${report.starAnalysis.situationIdentified ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                Situation
              </div>
              <div className={`p-2 rounded-lg border ${report.starAnalysis.taskIdentified ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                Task
              </div>
              <div className={`p-2 rounded-lg border ${report.starAnalysis.actionIdentified ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                Action
              </div>
              <div className={`p-2 rounded-lg border ${report.starAnalysis.resultIdentified ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                Result
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">{report.starAnalysis.critique}</p>
          </div>
        </div>
      </div>

      {/* 4 Rubric Competency Dimensions */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-4">Competency Rubric Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {report.dimensions.map((dim, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-slate-200">{dim.name}</h3>
                  <span className="font-mono text-sm font-bold text-indigo-400 tabular-nums">
                    {dim.score}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-800 mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {dim.summary}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Key Signals:</span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {dim.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question-By-Question Deep Dive with Exemplary Answer */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-white mb-2">Question-by-Question Deep Dive</h2>
        <p className="text-xs text-slate-400 mb-4">
          Inspect your actual responses alongside strengths, missed opportunities, and golden exemplary answers.
        </p>

        <div className="space-y-4">
          {report.questionReviews.map((q) => {
            const isExpanded = expandedQuestion === q.questionNumber;
            return (
              <div
                key={q.questionNumber}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-all"
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedQuestion(isExpanded ? null : q.questionNumber)
                  }
                  className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-mono font-bold shrink-0">
                      0{q.questionNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white leading-snug">
                        {q.questionText}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>{q.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-indigo-400 font-semibold">
                          Score: {q.score}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 p-5 space-y-5 bg-slate-950/40">
                    {/* Candidate Transcript Summary */}
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Candidate Answer Summary
                      </span>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200 leading-relaxed font-normal">
                        {q.candidateSummary}
                      </div>
                    </div>

                    {/* Strengths & Improvements 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Identified Strengths</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {q.strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400">·</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Missed Opportunities & Nuances</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {q.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400">·</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Gold Standard Model Exemplary Answer */}
                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
                        <Lightbulb className="h-4 w-4 text-indigo-400" />
                        <span>Top 1% Candidate Exemplary Answer (Gold Standard)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                        {q.exemplaryAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Targeted Improvement Drills & Footer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          <span>Targeted Actionable Drills</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Recommended focus areas to boost your score to the Strong Hire band.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {report.recommendedDrills.map((drill, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
            >
              <span className="font-mono font-bold text-indigo-400">{idx + 1}.</span>
              <span>{drill}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Ready to drill specific high-yield questions?
          </span>

          <button
            onClick={onOpenQuestionBank}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Open Practice Question Bank & Blitz Drills</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
