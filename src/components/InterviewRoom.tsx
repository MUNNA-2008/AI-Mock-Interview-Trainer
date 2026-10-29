import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  CheckCircle,
  HelpCircle,
  Edit3,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { InterviewConfig, InterviewTurn, calculatePacingMetrics, formatSeconds } from '../utils/interviewRules';
import { INTERVIEWER_PERSONAS, InterviewerPersona } from '../data/questionBank';

interface GeneratedQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  category: string;
  context?: string;
  keySignals?: string[];
  sampleFollowUp?: string;
  hints?: string[];
}

interface InterviewRoomProps {
  config: InterviewConfig;
  questions: GeneratedQuestion[];
  onCompleteInterview: (turns: InterviewTurn[], pacingSummary: any) => void;
  onExit: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  config,
  questions,
  onCompleteInterview,
  onExit,
}) => {
  const persona: InterviewerPersona =
    INTERVIEWER_PERSONAS.find((p) => p.id === config.interviewerId) || INTERVIEWER_PERSONAS[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // Follow-up interaction state
  const [activeFollowUpQuestion, setActiveFollowUpQuestion] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [activeClarification, setActiveClarification] = useState<string | null>(null);

  // Scratchpad toggle
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');

  // Timing
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  // Completed turns history
  const [turns, setTurns] = useState<InterviewTurn[]>([]);

  // Speech Recognition reference
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const currentQ = questions[currentIndex] || {
    id: 'default',
    questionNumber: 1,
    questionText: 'Walk me through your background and the most complex architecture you designed.',
    category: 'Architecture',
    hints: ['Focus on scale, specific trade-offs, and your direct role.'],
  };

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((s) => s + 1);
      setQuestionSeconds((q) => q + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech API initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (activeFollowUpQuestion) {
          setFollowUpAnswer((prev) => (prev ? prev + ' ' : '') + transcript);
        } else {
          setCurrentAnswer((prev) => (prev ? prev + ' ' : '') + transcript);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
      setSpeechSupported(false);
    }
  }, [activeFollowUpQuestion]);

  // Play interviewer speech on question mount
  useEffect(() => {
    playInterviewerVoice(currentQ.questionText);
    setQuestionSeconds(0);
    setCurrentAnswer('');
    setActiveFollowUpQuestion(null);
    setFollowUpAnswer('');
    setActiveClarification(null);
    setHintsRevealed(0);
  }, [currentIndex]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone start error:', err);
      }
    }
  };

  const playInterviewerVoice = async (text: string) => {
    if (audioMuted) return;
    setIsInterviewerSpeaking(true);

    try {
      const res = await fetch('/api/interview/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: persona.voiceName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          audioPlayerRef.current = audio;
          audio.onended = () => setIsInterviewerSpeaking(false);
          audio.onerror = () => setIsInterviewerSpeaking(false);
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('TTS request fallback to browser synthesis:', e);
    }

    // Browser Speech Synthesis fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsInterviewerSpeaking(false);
      utterance.onerror = () => setIsInterviewerSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsInterviewerSpeaking(false), 2000);
    }
  };

  const handleRequestClarification = () => {
    const hint =
      currentQ.hints && currentQ.hints[hintsRevealed]
        ? currentQ.hints[hintsRevealed]
        : `Clarification from ${persona.name}: Feel free to assume a typical cloud environment with multiple availability zones, 99.99% SLA requirements, and focus on the primary read/write bottlenecks.`;

    setActiveClarification(hint);
    setHintsRevealed((prev) => prev + 1);
    playInterviewerVoice(hint);
  };

  // Submit answer turn
  const handleSubmitTurn = async () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const answerToEvaluate = activeFollowUpQuestion ? followUpAnswer : currentAnswer;
    if (!answerToEvaluate.trim()) return;

    setIsSubmitting(true);

    try {
      const isFinal = currentIndex >= questions.length - 1;
      const isFollowUpMode = !!activeFollowUpQuestion;

      const res = await fetch('/api/interview/interviewer-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerName: persona.name,
          interviewerStyle: persona.styleDescription,
          currentQuestion: isFollowUpMode ? activeFollowUpQuestion : currentQ.questionText,
          candidateAnswer: answerToEvaluate,
          conversationHistory: turns.map((t) => ({
            q: t.questionText,
            a: t.candidateAnswer,
            fu: t.followUpQuestion,
            fa: t.followUpAnswer,
          })),
          isFinalQuestion: isFinal,
          isFollowUpMode,
        }),
      });

      const turnData = await res.json();
      setIsSubmitting(false);

      if (!isFollowUpMode && turnData.suggestedFollowUp && !turnData.shouldAdvanceQuestion) {
        // Interviewer asks a probing follow-up!
        setActiveFollowUpQuestion(turnData.suggestedFollowUp);
        playInterviewerVoice(turnData.interviewerSpeech);
      } else {
        // Complete current question turn
        const newTurn: InterviewTurn = {
          id: 'turn-' + Date.now(),
          questionNumber: currentIndex + 1,
          questionText: currentQ.questionText,
          category: currentQ.category,
          candidateAnswer: currentAnswer,
          followUpQuestion: activeFollowUpQuestion || undefined,
          followUpAnswer: followUpAnswer || undefined,
          feedbackPreview: turnData.interviewerSpeech,
          hintsUsed: hintsRevealed,
          durationSeconds: questionSeconds,
          completedAt: new Date().toISOString(),
        };

        const updatedTurns = [...turns, newTurn];
        setTurns(updatedTurns);

        if (currentIndex < questions.length - 1) {
          setCurrentIndex((idx) => idx + 1);
        } else {
          // All questions finished! Finish and generate scorecard!
          handleFinishSession(updatedTurns);
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setIsSubmitting(false);

      // Fallback turn completion
      const fallbackTurn: InterviewTurn = {
        id: 'turn-' + Date.now(),
        questionNumber: currentIndex + 1,
        questionText: currentQ.questionText,
        category: currentQ.category,
        candidateAnswer: currentAnswer,
        followUpQuestion: activeFollowUpQuestion || undefined,
        followUpAnswer: followUpAnswer || undefined,
        hintsUsed: hintsRevealed,
        durationSeconds: questionSeconds,
        completedAt: new Date().toISOString(),
      };
      const updated = [...turns, fallbackTurn];
      setTurns(updated);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((idx) => idx + 1);
      } else {
        handleFinishSession(updated);
      }
    }
  };

  const handleFinishSession = (completedTurns = turns) => {
    // Calculate aggregate pacing
    const allAnswers = completedTurns
      .map((t) => `${t.candidateAnswer} ${t.followUpAnswer || ''}`)
      .join(' ');
    const pacing = calculatePacingMetrics(allAnswers, sessionSeconds);

    onCompleteInterview(completedTurns, {
      totalWords: pacing.wordCount,
      averageWpm: pacing.wpm,
      totalFillerWords: pacing.fillerWordCount,
      pacingQuality: pacing.pacingQuality,
    });
  };

  const liveText = activeFollowUpQuestion ? followUpAnswer : currentAnswer;
  const currentPacing = calculatePacingMetrics(liveText, questionSeconds);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Exit Studio
          </button>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-300">
            <span className="text-slate-500">Target Role:</span>{' '}
            <span className="font-semibold text-white">{config.role}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-indigo-400 font-medium">{config.level}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span className="tabular-nums font-semibold">{formatSeconds(sessionSeconds)}</span>
          </div>

          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className="flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-800/60 px-2.5 py-1 text-slate-300 hover:text-white transition-colors"
            title={audioMuted ? 'Unmute Interviewer Voice' : 'Mute Interviewer Voice'}
          >
            {audioMuted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{audioMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          <button
            onClick={() => handleFinishSession()}
            className="rounded-md border border-slate-700/80 bg-slate-800/80 px-3 py-1 font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Finish & Review Scorecard
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interviewer Video Stage & Active Prompt */}
        <div className="lg:col-span-5 space-y-5">
          {/* Interviewer Virtual Avatar Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={persona.avatarUrl}
                alt={persona.name}
                referrerPolicy="no-referrer"
                className={`h-full w-full object-cover transition-transform duration-700 ${
                  isInterviewerSpeaking ? 'scale-105 brightness-105' : 'scale-100 brightness-95'
                }`}
              />

              {/* Speaking Wave Overlay */}
              {isInterviewerSpeaking && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent py-4">
                  <div className="h-4 w-1 animate-pulse rounded-full bg-indigo-400" style={{ animationDelay: '0ms' }} />
                  <div className="h-7 w-1 animate-pulse rounded-full bg-indigo-300" style={{ animationDelay: '150ms' }} />
                  <div className="h-5 w-1 animate-pulse rounded-full bg-indigo-400" style={{ animationDelay: '300ms' }} />
                  <div className="h-8 w-1 animate-pulse rounded-full bg-indigo-200" style={{ animationDelay: '450ms' }} />
                  <div className="h-4 w-1 animate-pulse rounded-full bg-indigo-400" style={{ animationDelay: '600ms' }} />
                </div>
              )}

              {/* Live Status Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-2 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] backdrop-blur-sm border border-slate-800">
                <span className="font-semibold text-white">{persona.name}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono text-[10px]">{persona.title}</span>
              </div>

              {/* Replay Voice CTA */}
              <div className="absolute bottom-3 right-3">
                <button
                  type="button"
                  onClick={() =>
                    playInterviewerVoice(
                      activeFollowUpQuestion || currentQ.questionText
                    )
                  }
                  className="flex items-center gap-1 rounded-md bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Replay Voice</span>
                </button>
              </div>
            </div>

            {/* Current Question Narrative Box */}
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                  <span className="font-mono font-bold">
                    Turn {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{currentQ.category}</span>
                </div>
                <span className="font-mono text-slate-400 tabular-nums">
                  {formatSeconds(questionSeconds)}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-white leading-snug">
                {currentQ.questionText}
              </h2>

              {/* Probing Follow-Up Callout if active */}
              {activeFollowUpQuestion && (
                <div className="mt-4 rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
                    <AlertCircle className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Follow-Up Probe from {persona.name}:</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                    {activeFollowUpQuestion}
                  </p>
                </div>
              )}

              {/* Active Clarification / Hint Box */}
              {activeClarification && (
                <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-300">
                  <div className="font-semibold text-slate-200 mb-1">Clarification Context:</div>
                  <p>{activeClarification}</p>
                </div>
              )}

              {/* Clarification Button */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleRequestClarification}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  <span>Ask Clarification / Hint ({hintsRevealed}/2 used)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{showScratchpad ? 'Hide Scratchpad' : 'Architecture Scratchpad'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Optional Scratchpad Drawer */}
          {showScratchpad && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Candidate Architecture Scratchpad</span>
                <span className="text-[11px] text-slate-500">Not shared with interviewer</span>
              </div>
              <textarea
                rows={5}
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Jot down bullet points, STAR outline (S, T, A, R), or system components (Client -> Load Balancer -> Cache -> DB)..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Right Column: Candidate Speaking & Interactive Answering Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Your Response Console</h3>
                <p className="text-xs text-slate-400">
                  {activeFollowUpQuestion
                    ? 'Respond directly to the interviewer follow-up probe.'
                    : 'Speak via microphone or type your response using the STAR framework.'}
                </p>
              </div>

              {/* Live Pacing & Filler Word Bar */}
              <div className="flex items-center gap-3 text-xs">
                <div className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1">
                  <span className="text-slate-500">Words: </span>
                  <span className="font-mono font-semibold text-slate-200 tabular-nums">
                    {currentPacing.wordCount}
                  </span>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950 px-2.5 py-1">
                  <span className="text-slate-500">Pace: </span>
                  <span className="font-mono font-semibold text-indigo-400 tabular-nums">
                    {currentPacing.wpm} wpm
                  </span>
                </div>
                {currentPacing.fillerWordCount > 0 && (
                  <div className="rounded-md border border-amber-900/60 bg-amber-950/30 px-2.5 py-1 text-amber-300">
                    <span className="text-[11px]">Fillers: {currentPacing.fillerWordCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Textarea with Live Microphone transcription */}
            <div className="relative">
              <textarea
                rows={9}
                value={activeFollowUpQuestion ? followUpAnswer : currentAnswer}
                onChange={(e) => {
                  if (activeFollowUpQuestion) {
                    setFollowUpAnswer(e.target.value);
                  } else {
                    setCurrentAnswer(e.target.value);
                  }
                }}
                placeholder={
                  activeFollowUpQuestion
                    ? 'Address the interviewer follow-up: e.g. "To handle that cache stampede, we used a mutex lease in Redis so only one worker computed the miss while others served stale data for 2 seconds..."'
                    : 'Speak or type your structured response: "In my previous role at [Company], the situation was that our batch ingestion was failing the SLA. My objective was to reduce runtime by 50%. I redesigned the partitioning logic in Spark, and as a result, we slashed processing time from 4 hours to 45 minutes..."'
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs sm:text-sm text-slate-100 leading-relaxed placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* Recording Indicator Pill */}
              {isRecording && (
                <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs text-rose-300 font-medium animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Listening live...</span>
                </div>
              )}
            </div>

            {/* Controls Toolbar: Mic Toggle + Submit Button */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-3">
                {speechSupported ? (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      isRecording
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 animate-pulse'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-indigo-400" />}
                    <span>{isRecording ? 'Stop Recording' : 'Start Voice Input'}</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">
                    Microphone Web Speech API not supported in this browser; typing enabled.
                  </span>
                )}

                <span className="text-xs text-slate-500 hidden sm:inline">
                  {isRecording ? 'Speech will transcribe automatically' : 'Click to talk or type'}
                </span>
              </div>

              <button
                type="button"
                disabled={isSubmitting || (!currentAnswer.trim() && !followUpAnswer.trim())}
                onClick={handleSubmitTurn}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Response...</span>
                  </>
                ) : (
                  <>
                    <span>{activeFollowUpQuestion ? 'Submit Follow-Up & Next' : 'Submit Response'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* STAR Framework Guidance Strip */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div className="text-xs font-semibold text-slate-300 mb-2">Live STAR Method Rubric Checklist</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5">
                <span className="font-semibold text-indigo-300">Situation</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Context, company stakes & team scale</p>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5">
                <span className="font-semibold text-indigo-300">Task</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Your specific technical mandate & goal</p>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5">
                <span className="font-semibold text-indigo-300">Action</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Exact architectural & code steps you led</p>
              </div>
              <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5">
                <span className="font-semibold text-indigo-300">Result</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Quantifiable metrics (latency %, $ saved)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
