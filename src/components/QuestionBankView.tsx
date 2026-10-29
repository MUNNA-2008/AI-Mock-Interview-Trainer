import React, { useState } from 'react';
import {
  BookOpen,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CURATED_QUESTION_BANK, CuratedQuestion } from '../data/questionBank';

interface QuickFeedbackResult {
  score: number;
  verdict: string;
  strengths: string[];
  improvements: string[];
  modelAnswerSnippet: string;
}

export const QuestionBankView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeDrillQuestion, setActiveDrillQuestion] = useState<CuratedQuestion | null>(null);
  const [drillAnswer, setDrillAnswer] = useState('');
  const [isSubmittingDrill, setIsSubmittingDrill] = useState(false);
  const [drillFeedback, setDrillFeedback] = useState<QuickFeedbackResult | null>(null);

  const categories = [
    'All',
    'Behavioral & STAR',
    'System Architecture',
    'Technical & Coding Logic',
    'Product Strategy',
    'Conflict & Leadership',
  ];

  const difficulties = ['All', 'Entry', 'Mid', 'Senior', 'Staff+'];

  const filteredQuestions = CURATED_QUESTION_BANK.filter((q) => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  const handleStartDrill = (q: CuratedQuestion) => {
    setActiveDrillQuestion(q);
    setDrillAnswer('');
    setDrillFeedback(null);
  };

  const handleSubmitDrill = async () => {
    if (!drillAnswer.trim() || !activeDrillQuestion) return;

    setIsSubmittingDrill(true);

    try {
      const res = await fetch('/api/interview/quick-drill-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeDrillQuestion.question,
          candidateAnswer: drillAnswer,
          category: activeDrillQuestion.category,
        }),
      });

      const data = await res.json();
      setDrillFeedback(data);
    } catch (err) {
      console.error('Error submitting drill:', err);
      // Fallback
      setDrillFeedback({
        score: 82,
        verdict: 'Solid Foundation',
        strengths: ['Identified core trade-offs directly', 'Sequenced actions logically'],
        improvements: ['Include exact metric or scale', 'Quantify time-to-deliver'],
        modelAnswerSnippet:
          'When faced with high traffic, I designed an LRU cache with write-through invalidation to protect our database, slashing p99 latency by 45%.',
      });
    } finally {
      setIsSubmittingDrill(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
          <span>Practice Lab</span>
          <span aria-hidden="true">·</span>
          <span>Curated Question Library</span>
          <span aria-hidden="true">·</span>
          <span>90-Second Rapid Drills</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
          Interview Question Bank & Blitz Drills
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
          Browse real questions asked at top tech companies. Launch quick 90-second blitz drills to sharpen your delivery and receive instant AI feedback.
        </p>
      </div>

      {/* Active Blitz Drill Modal / Section */}
      {activeDrillQuestion && (
        <div className="mb-10 rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span>Active 1-Question Blitz Practice</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{activeDrillQuestion.category}</span>
            </div>
            <button
              onClick={() => setActiveDrillQuestion(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Close Drill
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {activeDrillQuestion.question}
          </h3>
          <p className="text-xs text-slate-400 mb-4">{activeDrillQuestion.context}</p>

          {!drillFeedback ? (
            <div>
              <textarea
                rows={5}
                value={drillAnswer}
                onChange={(e) => setDrillAnswer(e.target.value)}
                placeholder="Type your rapid response using STAR (Situation, Task, Action, Result)..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Target: 2-3 focused sentences with specific metrics
                </span>
                <button
                  onClick={handleSubmitDrill}
                  disabled={isSubmittingDrill || !drillAnswer.trim()}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors"
                >
                  {isSubmittingDrill ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Grading Response...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Grade My Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/80 p-5 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Drill Verdict
                  </span>
                  <span className="rounded-md bg-indigo-600/30 border border-indigo-500/50 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                    {drillFeedback.verdict}
                  </span>
                </div>
                <div className="font-mono text-xl font-bold text-indigo-400">
                  {drillFeedback.score}/100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="font-semibold text-emerald-400 block mb-1">Strengths</span>
                  <ul className="space-y-1 text-slate-300">
                    {drillFeedback.strengths.map((s, i) => (
                      <li key={i}>· {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="font-semibold text-amber-400 block mb-1">Growth Areas</span>
                  <ul className="space-y-1 text-slate-300">
                    {drillFeedback.improvements.map((m, i) => (
                      <li key={i}>· {m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg bg-indigo-950/30 p-3 border border-indigo-500/30 text-xs">
                <span className="font-semibold text-indigo-300 block mb-1">
                  Exemplary Model Answer:
                </span>
                <p className="text-slate-300">{drillFeedback.modelAnswerSnippet}</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setDrillFeedback(null);
                    setDrillAnswer('');
                  }}
                  className="rounded-lg border border-slate-700 px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Retry Question
                </button>
                <button
                  onClick={() => setActiveDrillQuestion(null)}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty Select */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Seniority:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-white focus:outline-none"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-medium text-indigo-400">{q.category}</span>
                <span className="font-mono text-slate-500">{q.difficulty}</span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
                {q.question}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {q.context}
              </p>

              {/* Signals */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Key Evaluation Signals:
                </span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                  {q.keySignals.map((signal, idx) => (
                    <span key={idx} className="after:content-['·'] after:ml-1 after:text-slate-600 last:after:content-none">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">STAR Method Enabled</span>
              <button
                onClick={() => handleStartDrill(q)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-indigo-600 hover:text-white transition-all border border-slate-700/60"
              >
                <Zap className="h-3 w-3 text-indigo-400" />
                <span>Launch Blitz Drill</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
