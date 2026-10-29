import React from 'react';
import { Sparkles, Terminal, BookOpen, BarChart3, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: 'setup' | 'interview' | 'scorecard' | 'questions' | 'analytics';
  onSelectTab: (tab: 'setup' | 'interview' | 'scorecard' | 'questions' | 'analytics') => void;
  activeInterviewInProgress: boolean;
  onNewInterview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeInterviewInProgress,
  onNewInterview,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('setup')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-slate-100">Vantage AI</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('setup')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'setup'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Studio
          </button>

          {activeInterviewInProgress && (
            <button
              onClick={() => onSelectTab('interview')}
              className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentTab === 'interview'
                  ? 'text-indigo-400 border-b-2 border-indigo-500 font-semibold'
                  : 'text-indigo-300 hover:text-indigo-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              <span>Live Room</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('questions')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'questions'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Question Bank</span>
          </button>

          <button
            onClick={() => onSelectTab('scorecard')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'scorecard'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <span>Scorecards</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'analytics'
                ? 'text-white border-b-2 border-indigo-500 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Performance</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewInterview}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Simulation</span>
          </button>
        </div>
      </div>
    </header>
  );
};
