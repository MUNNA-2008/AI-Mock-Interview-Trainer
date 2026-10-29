import React, { useState } from 'react';
import { Play, Sparkles, Building2, Briefcase, UserCheck, ShieldAlert, FileText, Clock, ArrowRight } from 'lucide-react';
import { InterviewConfig, FullEvaluationReport } from '../utils/interviewRules';
import { INTERVIEWER_PERSONAS, InterviewerPersona } from '../data/questionBank';

interface SetupViewProps {
  onStartInterview: (config: InterviewConfig) => void;
  isLoading: boolean;
  pastReports: FullEvaluationReport[];
  onViewReport: (report: FullEvaluationReport) => void;
}

const COMMON_ROLES = [
  'Senior Full-Stack Engineer',
  'Distributed Systems Architect',
  'Staff Backend Engineer',
  'Lead Product Manager',
  'Engineering Manager (EM)',
  'Data & ML Infrastructure Engineer'
];

export const SetupView: React.FC<SetupViewProps> = ({
  onStartInterview,
  isLoading,
  pastReports,
  onViewReport,
}) => {
  const [role, setRole] = useState('Senior Full-Stack Engineer');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [level, setLevel] = useState<InterviewConfig['level']>('Senior');
  const [companyType, setCompanyType] = useState<InterviewConfig['companyType']>('FAANG / Tier-1 Tech');
  const [format, setFormat] = useState<InterviewConfig['format']>('Behavioral & Leadership');
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('sarah-director');
  const [resumeSnippet, setResumeSnippet] = useState('');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = role === 'Custom' ? customRoleInput || 'Software Engineer' : role;
    onStartInterview({
      role: finalRole,
      level,
      companyType,
      format,
      interviewerId: selectedInterviewerId,
      resumeSnippet: resumeSnippet.trim() || undefined,
      targetJobDescription: targetJobDescription.trim() || undefined,
      durationMinutes,
    });
  };

  const handleQuickDemo = (demoType: 'swe' | 'sysdesign' | 'manager') => {
    if (demoType === 'swe') {
      setRole('Senior Full-Stack Engineer');
      setLevel('Senior');
      setCompanyType('FAANG / Tier-1 Tech');
      setFormat('Behavioral & Leadership');
      setSelectedInterviewerId('sarah-director');
      setResumeSnippet('Lead engineer on microservices decomposition, reduced p99 latency by 45%, managed 6-person sprint team, migrated MySQL to CockroachDB.');
    } else if (demoType === 'sysdesign') {
      setRole('Distributed Systems Architect');
      setLevel('Staff / Principal');
      setCompanyType('FAANG / Tier-1 Tech');
      setFormat('System Design & Architecture');
      setSelectedInterviewerId('sarah-director');
      setResumeSnippet('Architected global multi-region active-active pub/sub broker handling 1.2M events/sec, Kafka, Redis, gRPC.');
    } else {
      setRole('Lead Product Manager');
      setLevel('Senior');
      setCompanyType('High-Growth Startup');
      setFormat('Product Sense & Execution');
      setSelectedInterviewerId('marcus-vp');
      setResumeSnippet('Shipped AI developer autocomplete plugin from 0 to 180k WAU, managed $1.2M annual API spend, defined pricing tiers.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner with Generated Background Artwork */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-indigo-400">
              <span className="text-slate-400">Simulation Studio</span>
              <span aria-hidden="true">·</span>
              <span>Bar-Raiser Calibrated</span>
              <span aria-hidden="true">·</span>
              <span>Vocal & Text Interaction</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ textWrap: 'balance' }}>
              Master high-stakes tech & leadership interviews.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl">
              Conduct live, realistic mock interviews with conversational AI bar-raisers. Receive real-time speech feedback, STAR structure coaching, and comprehensive hiring committee scorecards.
            </p>

            {/* Quick Demo Presets */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">Instant Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickDemo('swe')}
                className="rounded-md bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700/60"
              >
                Senior SWE (STAR)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('sysdesign')}
                className="rounded-md bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700/60"
              >
                Staff Architect (System Design)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('manager')}
                className="rounded-md bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700/60"
              >
                Lead PM (Product Sense)
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl">
              <img
                src="/src/assets/images/hero_interview_workspace_1793272148282.jpg"
                alt="Modern professional mock interview studio"
                referrerPolicy="no-referrer"
                className="h-64 w-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                <span>Studio Audio & Video Simulation</span>
                <span className="font-mono tabular-nums text-indigo-300">Gemini 3.8 Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Configuration Form */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-1">Interview Parameters</h2>
            <p className="text-sm text-slate-400 mb-6">
              Customize the hiring bar, technical stack, and question style to mirror your upcoming real interview.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Target Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                      }}
                      className={`text-left px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                        role === r
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Custom')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      role === 'Custom'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Custom Role
                  </button>
                  {role === 'Custom' && (
                    <input
                      type="text"
                      placeholder="e.g. Chief of Staff, iOS Engineer, Quant Researcher..."
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Two Column: Seniority & Company Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Seniority Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Entry / Junior">Entry / Junior (1-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                    <option value="Senior">Senior (5-8 yrs)</option>
                    <option value="Staff / Principal">Staff / Principal (8+ yrs)</option>
                    <option value="Engineering Manager / Director">Engineering Manager / Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Company Culture & Bar
                  </label>
                  <select
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="FAANG / Tier-1 Tech">FAANG / Tier-1 Tech (Meta, Google, Amazon)</option>
                    <option value="High-Growth Startup">High-Growth Startup (Stripe, OpenAI, Vercel)</option>
                    <option value="FinTech / High-Frequency">FinTech & Trading (Citadel, Jane Street)</option>
                    <option value="Consulting & Strategy">Consulting & Strategy (McKinsey, BCG)</option>
                    <option value="Enterprise Corp">Enterprise Corp (Microsoft, Salesforce)</option>
                  </select>
                </div>
              </div>

              {/* Interview Format */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Interview Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Behavioral & Leadership',
                      'System Design & Architecture',
                      'Technical & Coding Logic',
                      'Product Sense & Execution',
                      'Full Loop Simulation',
                    ] as const
                  ).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                        format === fmt
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewer Persona Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Select Lead Interviewer
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INTERVIEWER_PERSONAS.map((persona) => {
                    const isSelected = selectedInterviewerId === persona.id;
                    return (
                      <button
                        type="button"
                        key={persona.id}
                        onClick={() => setSelectedInterviewerId(persona.id)}
                        className={`text-left rounded-xl border p-4 transition-all flex gap-3.5 items-start ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={persona.avatarUrl}
                          alt={persona.name}
                          referrerPolicy="no-referrer"
                          className="h-14 w-14 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-white truncate">{persona.name}</h4>
                            <span className="text-[11px] font-mono text-indigo-400">Voice: {persona.voiceName}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{persona.title}</p>
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {persona.styleDescription}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Collapsible: Resume & Job Description */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>{showAdvancedInputs ? 'Hide Resume & Job Description match' : '+ Tailor with your Resume & Target Job Description'}</span>
                </button>

                {showAdvancedInputs && (
                  <div className="mt-4 space-y-4 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Resume Highlights / Past Projects (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={resumeSnippet}
                        onChange={(e) => setResumeSnippet(e.target.value)}
                        placeholder="Paste bullet points from your resume: e.g. Lead author on distributed event pipeline, migrated Redis to DynamoDB, cut monthly infrastructure bill by $30k..."
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Target Job Description / Key Responsibilities (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={targetJobDescription}
                        onChange={(e) => setTargetJobDescription(e.target.value)}
                        placeholder="Paste key requirements from the job posting: e.g. Looking for experience with Kubernetes, gRPC, multi-tenant database isolation, cross-team technical leadership..."
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  <span>Questions calibrated:</span> <span className="font-mono text-slate-200">4 Core Turns</span>
                  <span className="mx-2">·</span>
                  <span>Audio/Speech Enabled</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Calibrating Interview...</span>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-white" />
                      <span>Start Live Interview</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel: Past Sessions & Readiness Dashboard */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Guidance Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>How To Ace Your Session</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">1.</span>
                <span><strong>Think out loud:</strong> Interviewers value thought process and trade-off justification over rushed answers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">2.</span>
                <span><strong>Use the STAR Method:</strong> Detail the Situation, Task, your specific Action, and quantifiable Result.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">3.</span>
                <span><strong>Ask Clarifications:</strong> Use the "Ask Clarification" button when requirements are intentionally ambiguous.</span>
              </li>
            </ul>
          </div>

          {/* Past Sessions List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-3">Recent Performance Scorecards</h3>
            {pastReports.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg">
                <Clock className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No mock sessions completed yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">Start your first simulation to generate your score report.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastReports.slice(0, 3).map((report) => (
                  <button
                    type="button"
                    key={report.id}
                    onClick={() => onViewReport(report)}
                    className="w-full text-left rounded-lg border border-slate-800/80 bg-slate-950/70 p-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white truncate max-w-[150px]">{report.roleTitle}</span>
                      <span className="font-mono text-indigo-400 font-bold">{report.overallScore}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{report.hireDecision}</span>
                      <span className="flex items-center gap-1 text-slate-400 hover:text-indigo-300">
                        Review <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
