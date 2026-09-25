import React from 'react';
import { BrandProject, StageId } from '@/lib/types';
import { IconCheckCircle, IconShieldAlert, IconWand, IconRefresh } from '@/components/Icons';

interface ConsistencyStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
  setCurrentStage?: (stage: StageId) => void;
}

export function ConsistencyStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
  setCurrentStage,
}: ConsistencyStageProps) {
  const consistencyReport = project.consistencyReport;
  const conflicts = consistencyReport?.conflicts || [];
  const resolved = consistencyReport?.resolved || false;

  // Simple mapping to guess which stage a field belongs to for jumping
  const getStageForField = (field: string): StageId => {
    if (field.includes('visualDirection')) return 'visualize';
    if (field.includes('positioning')) return 'position';
    if (field.includes('personality') || field.includes('tagline') || field.includes('naming')) return 'shape';
    if (field.includes('target') || field.includes('problem')) return 'understand';
    return 'shape'; // fallback
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconCheckCircle className="w-4 h-4" />
            <span>Stage 6: Final Cohesion</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Consistency Audit</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            The architect reviews the entire brand system to ensure all decisions cohere into a unified identity.
          </p>
        </div>
        <button
          onClick={onRunAi}
          disabled={isAiLoading}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-100 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Auditing System...' : 'Run Consistency Check'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {!consistencyReport && !isAiLoading && (
           <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 border-dashed">
              <IconCheckCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Run the audit to verify all brand elements are in sync.</p>
           </div>
        )}

        {consistencyReport && resolved && (
           <div className="bg-emerald-500/10 p-8 rounded-xl border border-emerald-500/30 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
                <IconCheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-xl">Perfect Cohesion</h3>
                <p className="text-sm text-emerald-200/70 mt-2 max-w-lg mx-auto">
                  The brand system is structurally sound. Your positioning, voice, naming, and visual direction all align perfectly without contradiction.
                </p>
              </div>
           </div>
        )}

        {consistencyReport && !resolved && conflicts.length > 0 && (
           <div className="bg-rose-950/20 p-6 rounded-xl border border-rose-900/50 space-y-5">
              <div className="flex items-center space-x-3 pb-4 border-b border-rose-900/50">
                 <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                   <IconShieldAlert className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="font-bold text-rose-400 text-lg">System Conflicts Detected</h3>
                   <p className="text-xs text-rose-300/70">The architect found contradictions in your brand system.</p>
                 </div>
              </div>

              <div className="grid gap-4">
                {conflicts.map((c, idx) => {
                  const targetStage = getStageForField(c.field);
                  return (
                    <div key={idx} className="bg-slate-900/60 p-4 rounded-lg border border-slate-800/80 flex items-start justify-between group">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 mb-2 inline-block">
                          {c.field}
                        </span>
                        <p className="text-sm text-slate-300">{c.issue}</p>
                      </div>
                      
                      {setCurrentStage && (
                        <button
                          onClick={() => setCurrentStage(targetStage)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded transition-colors shrink-0 flex items-center ml-4"
                        >
                          <IconRefresh className="w-3 h-3 mr-1.5" />
                          Fix in {targetStage}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
