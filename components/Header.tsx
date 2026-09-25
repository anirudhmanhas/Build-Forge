import React from 'react';
import { StageId, StageInfo, StageStatus } from '@/lib/types';
import { STAGES } from '@/components/Sidebar';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconWand } from '@/components/Icons';

interface HeaderProps {
  currentStage: StageId;
  setCurrentStage: (stage: StageId) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
  onResetProject: () => void;
  stageStatuses: Record<StageId, StageStatus>;
}

export function Header({
  currentStage,
  setCurrentStage,
  onRunAi,
  isAiLoading,
  onResetProject,
  stageStatuses,
}: HeaderProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const currentStageInfo = STAGES[currentIndex] || STAGES[0];

  const prevStage = STAGES[currentIndex - 1];
  const nextStage = STAGES[currentIndex + 1];

  const isNextLocked = nextStage && nextStage.id !== 'understand' && stageStatuses['understand'] !== 'done';

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/40 px-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
      {/* Breadcrumb Info */}
      <div className="flex items-center space-x-3">
        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 font-mono text-[11px] font-bold border border-slate-700">
          Stage {currentStageInfo.stepNumber} / {STAGES.length}
        </span>
        <h2 className="font-bold text-sm text-slate-100">{currentStageInfo.name}</h2>
        <span className="text-slate-600 font-mono">/</span>
        <span className="text-xs text-slate-400 hidden md:inline">{currentStageInfo.description}</span>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center space-x-3">
        {/* Reset button */}
        <button
          onClick={onResetProject}
          title="Reset project state to default"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700"
        >
          <IconRefresh className="w-4 h-4" />
        </button>

        {/* AI Action */}
        <button
          onClick={onRunAi}
          disabled={isAiLoading}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-xs flex items-center space-x-1.5 border border-slate-700/80 shadow-sm transition-all"
        >
          <IconWand className={`w-3.5 h-3.5 text-amber-400 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Generating...' : 'AI Insights'}</span>
        </button>

        {/* Prev / Next buttons */}
        <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
          <button
            onClick={() => prevStage && setCurrentStage(prevStage.id)}
            disabled={!prevStage}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg border border-slate-700 transition-all"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => nextStage && !isNextLocked && setCurrentStage(nextStage.id)}
            disabled={!nextStage || isNextLocked}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-500/20"
          >
            <span>Next</span>
            <IconChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
