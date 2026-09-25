import React from 'react';
import { BrandProject } from '@/lib/types';
import { IconShieldAlert as IconShield, IconWand, IconCheck, IconTrash, IconCode } from '@/components/Icons';

interface ChallengeStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
}

export function ChallengeStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
}: ChallengeStageProps) {
  const challengeLog = project.challengeLog || [];

  // Helper to extract nested value for the "Before" view
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || 'Unknown';
  };

  // Deep update helper to safely apply fixes to project state
  const handleApplyFix = (index: number) => {
    const challenge = challengeLog[index];
    if (!challenge) return;

    // 1. Mark challenge as applied
    const updatedLog = [...challengeLog];
    updatedLog[index] = { ...challenge, status: 'applied' };

    // 2. Build the nested update object
    const parts = challenge.fieldToUpdate.split('.');
    
    // We create a deep clone of the project state purely for the path update
    const newProjectData = JSON.parse(JSON.stringify(project));
    let current = newProjectData;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = challenge.suggestedValue;

    // Finally apply both the log update and the specific field update
    updateProject({
      ...newProjectData,
      challengeLog: updatedLog
    });
  };

  const handleDismiss = (index: number) => {
    const updatedLog = [...challengeLog];
    updatedLog[index] = { ...updatedLog[index], status: 'dismissed' };
    updateProject({ challengeLog: updatedLog });
  };

  const allResolved = challengeLog.length > 0 && challengeLog.every(c => c.status === 'applied' || c.status === 'dismissed');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconShield className="w-4 h-4" />
            <span>Stage 4: AI Red-Teaming</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">The Skeptical Creative Director</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            The AI acts as an aggressive auditor, scanning your brand architecture for startup clichés, generic fluff, and audience mismatches.
          </p>
        </div>
        <button
          onClick={onRunAi}
          disabled={isAiLoading || challengeLog.some(c => c.status === 'pending')}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-slate-100 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-rose-600/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Auditing...' : 'Run Audit'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {challengeLog.length === 0 && !isAiLoading && (
           <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 border-dashed">
              <IconShield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Run the audit to uncover weaknesses in your positioning.</p>
           </div>
        )}

        {challengeLog.map((challenge, idx) => {
          const isPending = challenge.status === 'pending';
          const isApplied = challenge.status === 'applied';
          const isDismissed = challenge.status === 'dismissed';
          const currentValue = getNestedValue(project, challenge.fieldToUpdate);

          return (
            <div 
              key={idx} 
              className={`p-5 rounded-xl border transition-all ${
                isPending ? 'bg-slate-900/80 border-rose-500/30 shadow-lg shadow-rose-900/10' : 
                isApplied ? 'bg-emerald-950/20 border-emerald-900/50' : 
                'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isPending ? 'bg-rose-500/20 text-rose-400' :
                      isApplied ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {isPending ? 'Flagged Issue' : isApplied ? 'Fixed' : 'Dismissed'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {challenge.fieldToUpdate}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-200 text-sm">{challenge.issue}</h3>
                  <p className="text-xs text-rose-300/80 mt-1 leading-relaxed max-w-3xl">
                    {challenge.why}
                  </p>
                </div>
              </div>

              {/* Before / After visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                    <IconTrash className="w-3 h-3 mr-1" /> Original Text
                  </div>
                  <div className={`text-xs ${isApplied ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                    {isApplied ? '— replaced —' : currentValue}
                  </div>
                </div>
                <div className="bg-indigo-950/30 p-3 rounded-lg border border-indigo-900/50">
                  <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-2 flex items-center">
                    <IconCheck className="w-3 h-3 mr-1" /> Suggested Alternative
                  </div>
                  <div className="text-xs text-indigo-200">
                    {challenge.suggestedValue}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {isPending && (
                <div className="flex items-center space-x-3 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleApplyFix(idx)}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all flex items-center"
                  >
                    <IconCheck className="w-3.5 h-3.5 mr-1.5" />
                    Apply Fix
                  </button>
                  <button
                    onClick={() => handleDismiss(idx)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-all"
                  >
                    Keep Original
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {allResolved && (
           <div className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/30 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/30">
                <IconCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-sm">Audit Complete</h3>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  All flagged issues have been reviewed. The brand architecture is now battle-tested.
                </p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
