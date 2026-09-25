import React from 'react';
import { BrandProject, StageId, StageInfo } from '@/lib/types';
import {
  IconBrain,
  IconPosition,
  IconSparkles,
  IconShieldAlert,
  IconPalette,
  IconCheckCircle,
  IconFlame,
  IconCode,
  IconCheck
} from '@/components/Icons';

export const STAGES: StageInfo[] = [
  { id: 'understand', name: 'Understand', description: 'Target user & core problem', stepNumber: 1 },
  { id: 'position', name: 'Position', description: 'Category & value prop', stepNumber: 2 },
  { id: 'shape', name: 'Shape', description: 'Personality, names & tagline', stepNumber: 3 },
  { id: 'challenge', name: 'Challenge', description: 'Red-team & critique log', stepNumber: 4 },
  { id: 'visualize', name: 'Visualize', description: 'Typography & color mood', stepNumber: 5 },
  { id: 'consistency', name: 'Consistency', description: 'Final cohesion audit', stepNumber: 6 },
  { id: 'launch', name: 'Deliver & Launch', description: 'Brand Kit & Export', stepNumber: 7 },
];

interface SidebarProps {
  currentStage: StageId;
  setCurrentStage: (stage: StageId) => void;
  project: BrandProject;
  stageStatuses: Record<StageId, 'not_started' | 'in_progress' | 'done'>;
  onOpenJsonModal: () => void;
  onRawIdeaChange: (idea: string) => void;
}

export function Sidebar({
  currentStage,
  setCurrentStage,
  project,
  stageStatuses,
  onOpenJsonModal,
  onRawIdeaChange,
}: SidebarProps) {
  const completedCount = Object.values(stageStatuses).filter((s) => s === 'done').length;
  const progressPercent = Math.round((completedCount / STAGES.length) * 100);

  const getStageIcon = (id: StageId) => {
    switch (id) {
      case 'understand': return <IconBrain className="w-4 h-4" />;
      case 'position': return <IconPosition className="w-4 h-4" />;
      case 'shape': return <IconSparkles className="w-4 h-4" />;
      case 'challenge': return <IconShieldAlert className="w-4 h-4" />;
      case 'visualize': return <IconPalette className="w-4 h-4" />;
      case 'consistency': return <IconCheckCircle className="w-4 h-4" />;
      case 'launch': return <IconFlame className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-80 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen shrink-0 sticky top-0 backdrop-blur-md">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <IconFlame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              BrandForge
              <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">AI Brand Identity Architecture</p>
          </div>
        </div>

        {/* Idea Prompt Input */}
        <div className="mt-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Raw Project Concept
          </label>
          <input
            type="text"
            value={project.rawIdea}
            onChange={(e) => onRawIdeaChange(e.target.value)}
            placeholder="e.g. AI co-pilot for indie dev branding"
            className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-slate-400 font-medium">Brand Completion</span>
          <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 6 Stages Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1 font-semibold">
          Architecture Stages (6)
        </div>
        {STAGES.map((stage) => {
          const isActive = currentStage === stage.id;
          const status = stageStatuses[stage.id] || 'not_started';
          
          // Lock logic: Stage 2+ are locked if Understand isn't done.
          const isUnderstandDone = stageStatuses['understand'] === 'done';
          const isLocked = stage.id !== 'understand' && !isUnderstandDone;

          return (
            <button
              key={stage.id}
              onClick={() => {
                if (!isLocked) setCurrentStage(stage.id);
              }}
              disabled={isLocked}
              className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                isActive
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm'
                  : isLocked
                  ? 'opacity-40 cursor-not-allowed border border-transparent text-slate-500'
                  : 'hover:bg-slate-800/50 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : status === 'done'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isLocked
                      ? 'bg-slate-800/50 text-slate-600'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {stage.stepNumber}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                    <span className={isActive ? 'text-amber-200' : isLocked ? 'text-slate-500' : 'text-slate-200 group-hover:text-amber-200'}>
                      {stage.name}
                    </span>
                    {isLocked && <IconCode className="w-3 h-3 text-slate-600" /> /* Fallback for lock icon */}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{stage.description}</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="ml-2 shrink-0">
                {status === 'done' && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <IconCheck className="w-3 h-3" />
                  </span>
                )}
                {status === 'in_progress' && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
                {status === 'not_started' && !isLocked && (
                  <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer JSON Inspector Trigger */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={onOpenJsonModal}
          className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-center space-x-2 transition-all group shadow-sm"
        >
          <IconCode className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>View Brand JSON</span>
        </button>
      </div>
    </aside>
  );
}
