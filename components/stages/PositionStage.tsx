import React from 'react';
import { BrandProject } from '@/lib/types';
import { IconPosition, IconWand, IconBrain } from '@/components/Icons';

interface PositionStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
}

export function PositionStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
}: PositionStageProps) {
  const positioning = project.positioning || {};
  const understanding = project.understanding || {};

  const handleChange = (field: string, value: string) => {
    updateProject({
      positioning: {
        ...positioning,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconPosition className="w-4 h-4" />
            <span>Stage 2: Market Differentiation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Define Strategic Positioning</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pinpoint market category, unique differentiator, value proposition, and competitive moat.
          </p>
        </div>
        <button
          onClick={onRunAi}
          disabled={isAiLoading}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-300 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Synthesizing...' : 'Generate AI Positioning'}</span>
        </button>
      </div>

      {/* Context Viewer (Read-only) */}
      <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/80 space-y-3">
        <h3 className="text-sm font-bold text-slate-300 flex items-center space-x-2">
          <IconBrain className="w-4 h-4 text-slate-500" />
          <span>Foundation Context (from Stage 1)</span>
        </h3>
        <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto whitespace-pre-wrap leading-relaxed p-3 bg-slate-950 rounded border border-slate-800/50">
          {JSON.stringify({ understanding }, null, 2)}
        </pre>
      </div>

      {/* Grid Inputs for Positioning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Market Category
          </label>
          <p className="text-[11px] text-slate-400">Where does this product naturally fit?</p>
          <input
            type="text"
            value={positioning.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g. AI Brand Architecture Platform"
            className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Core Differentiator */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Core Differentiator
          </label>
          <p className="text-[11px] text-slate-400">What makes this impossible to copy overnight?</p>
          <input
            type="text"
            value={positioning.differentiator || ''}
            onChange={(e) => handleChange('differentiator', e.target.value)}
            placeholder="e.g. Built-in red-teaming critique & conflict audit"
            className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Differentiator Justification */}
        <div className="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20 space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-indigo-300">
            Differentiator Justification (Reasoning Trail)
          </label>
          <p className="text-[11px] text-indigo-400/70">How does the differentiator explicitly solve the Core Problem for the Target User?</p>
          <textarea
            value={positioning.differentiatorJustification || ''}
            onChange={(e) => handleChange('differentiatorJustification', e.target.value)}
            rows={2}
            placeholder="e.g. By actively critiquing output, founders ensure they solve their core problem of poor positioning without hiring an expensive agency."
            className="w-full px-3 py-2.5 text-xs bg-slate-950/80 border border-indigo-500/30 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-all"
          />
        </div>

        {/* Value Proposition */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-200">
            Primary Value Proposition
          </label>
          <p className="text-[11px] text-slate-400">The core promise made to every customer (One sentence)</p>
          <textarea
            value={positioning.valueProp || ''}
            onChange={(e) => handleChange('valueProp', e.target.value)}
            rows={2}
            placeholder="e.g. Turn raw product ideas into battle-tested positioning, visual rules, and launch collateral in under 5 minutes."
            className="w-full px-3 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Competitive Angle */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
          <label className="block text-xs font-semibold text-slate-200">
            Competitive Angle & Framing
          </label>
          <p className="text-[11px] text-slate-400">How we frame ourselves against incumbents</p>
          <textarea
            value={positioning.competitiveAngle || ''}
            onChange={(e) => handleChange('competitiveAngle', e.target.value)}
            rows={2}
            placeholder="e.g. Unlike generic AI copy tools, BrandForge stress-tests ideas and eliminates marketing fluff."
            className="w-full px-3 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
