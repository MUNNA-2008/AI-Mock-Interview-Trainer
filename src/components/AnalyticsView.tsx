import React from 'react';
import { BarChart3, TrendingUp, Award, Calendar, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FullEvaluationReport } from '../utils/interviewRules';

interface AnalyticsViewProps {
  pastReports: FullEvaluationReport[];
  onViewReport: (report: FullEvaluationReport) => void;
  onNewInterview: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  pastReports,
  onViewReport,
  onNewInterview,
}) => {
  const totalSessions = pastReports.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          pastReports.reduce((acc, curr) => acc + curr.overallScore, 0) / totalSessions
        )
      : 0;

  const strongHires = pastReports.filter((r) => r.hireDecision === 'Strong Hire').length;
  const leanHires = pastReports.filter((r) => r.hireDecision === 'Lean Hire').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
          <span>Performance Analytics</span>
          <span aria-hidden="true">·</span>
          <span>Interview Readiness Index</span>
          <span aria-hidden="true">·</span>
          <span>Bar-Raiser Calibration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Candidate Readiness & Progress Tracking
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
          Track your interview performance trajectory, calibration decisions, and dimensional growth across full mock simulations.
        </p>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Completed Simulations
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalSessions}
            </span>
            <span className="text-xs text-slate-500">sessions</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Average Bar-Raiser Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
              {avgScore || '--'}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Positive Hiring Decisions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              {strongHires + leanHires}
            </span>
            <span className="text-xs text-slate-500">hire decisions</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Readiness Status
          </span>
          <div className="text-sm font-bold text-white mt-1">
            {avgScore >= 80 ? 'Interview Ready' : avgScore >= 65 ? 'Approaching Benchmark' : 'Needs Practice'}
          </div>
          <span className="text-[11px] text-slate-400">Based on Tier-1 calibration</span>
        </div>
      </div>

      {/* Historical Sessions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Interview Session History</h2>

        {pastReports.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <Calendar className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">No completed interview sessions yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Complete your first mock interview simulation to populate historical trends and scorecards.
            </p>
            <button
              onClick={onNewInterview}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Start First Simulation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Role & Calibration</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Hiring Verdict</th>
                  <th className="pb-3">Pacing</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pastReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-white">
                      <div>{report.roleTitle}</div>
                      <div className="text-[11px] text-slate-400">{report.companyType}</div>
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 font-mono text-sm font-bold text-indigo-400 tabular-nums">
                      {report.overallScore}/100
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                          report.hireDecision === 'Strong Hire'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : report.hireDecision === 'Lean Hire'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {report.hireDecision}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-300 font-mono">
                      {report.pacingMetrics.averageWpm} wpm
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => onViewReport(report)}
                        className="inline-flex items-center gap-1 rounded bg-slate-800 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <span>Scorecard</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pre-Interview Day Readiness Checklist */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Real-World Interview Day Checklist</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Core habits practiced by candidates who consistently receive Strong Hire calibrations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Lead with the Headline Result</span>
              <p className="text-slate-400 mt-0.5">
                Don’t save the punchline for minute 5. State the 35% latency drop or $200k saved up front.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">State Trade-Offs Explicitly</span>
              <p className="text-slate-400 mt-0.5">
                Every architectural decision has a drawback. Voluntarily explain what you sacrificed (e.g. consistency for availability).
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Clarify Ambiguity Before Coding</span>
              <p className="text-slate-400 mt-0.5">
                Ask 1-2 sharp questions about throughput, data freshness, and read/write ratios before building.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Eliminate Speculative Fillers</span>
              <p className="text-slate-400 mt-0.5">
                Pause in silence instead of using "um", "like", or "basically". Silence projects executive composure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
