import React, { useState } from 'react';
import { BrandProject } from '@/lib/types';
import { IconBrain, IconWand, IconCheck, IconRocket } from '@/components/Icons';

interface UnderstandStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
}

export function UnderstandStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
}: UnderstandStageProps) {
  const understanding = project.understanding || {};
  const openQuestions = understanding.openQuestions || [];
  const qaHistory = understanding.qaHistory || [];

  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleRawIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProject({ rawIdea: e.target.value });
  };

  const handleAnswerChange = (index: number, val: string) => {
    setAnswers((prev) => ({ ...prev, [index]: val }));
  };

  const submitAnswers = async () => {
    const newQAs = openQuestions.map((q, idx) => ({
      question: q,
      answer: answers[idx] || 'Not answered.',
    }));

    // Update QA History and clear open questions temporarily so we can re-run AI
    updateProject({
      understanding: {
        ...understanding,
        qaHistory: [...qaHistory, ...newQAs],
        openQuestions: [], // clear them out before the next run
      },
    });

    // Wait a brief moment for state to settle then run AI
    setTimeout(() => {
      onRunAi();
      setAnswers({}); // clear local answers
    }, 100);
  };

  const isCompleted = understanding.targetUser && understanding.coreProblem && openQuestions.length === 0 && project.rawIdea.trim().length > 0;
  
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconBrain className="w-4 h-4" />
            <span>Stage 1: Foundational Context</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Diagnose the Core Idea</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Provide your raw product idea. The AI Brand Strategist will analyze it and ask clarifying questions if needed.
          </p>
        </div>
        <button
          onClick={onRunAi}
          disabled={isAiLoading || !project.rawIdea}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Analyzing...' : 'Generate AI Analysis'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Raw Idea Input */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-200">
            Raw Product Idea
          </label>
          <p className="text-[11px] text-slate-400">Describe what you are building in your own words.</p>
          <textarea
            value={project.rawIdea || ''}
            onChange={handleRawIdeaChange}
            rows={3}
            placeholder="e.g. An AI tool that helps indie hackers generate their brand identity automatically."
            className="w-full px-3 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>

        {/* AI Output Panels - only show if there is some understanding data */}
        {understanding.targetUser && (
          <>
            <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Identified Target User
              </label>
              <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                {understanding.targetUser}
              </p>
            </div>

            <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                Core Problem
              </label>
              <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                {understanding.coreProblem}
              </p>
            </div>
            
            {understanding.constraints && (
               <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
                <label className="block text-xs font-semibold text-slate-200">
                  Identified Constraints
                </label>
                <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                  {understanding.constraints}
                </p>
              </div>
            )}
          </>
        )}

        {/* AI Clarifying Questions Loop */}
        {openQuestions.length > 0 && (
          <div className="bg-amber-500/10 p-5 rounded-xl border border-amber-500/30 space-y-4 md:col-span-2 shadow-lg shadow-amber-500/5">
            <div>
              <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <IconBrain className="w-4 h-4" />
                <span>The Strategist Needs Clarification</span>
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Please answer these questions so the AI can finalize the core understanding.
              </p>
            </div>

            <div className="space-y-4">
              {openQuestions.map((q, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="block text-[13px] font-medium text-amber-100">
                    {idx + 1}. {q}
                  </label>
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Your answer..."
                    className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-amber-500/30 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={submitAnswers}
                disabled={isAiLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-2 transition-all"
              >
                <IconRocket className="w-3.5 h-3.5" />
                <span>Submit Answers to AI</span>
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
           <div className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/30 flex items-center space-x-4 md:col-span-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/30">
                <IconCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-sm">Diagnostic Complete</h3>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  The foundational understanding is solidified. Stage 2 (Position) is now unlocked.
                </p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
