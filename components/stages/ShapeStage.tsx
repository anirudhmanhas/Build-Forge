import React, { useState } from 'react';
import { BrandProject } from '@/lib/types';
import { IconSparkles, IconWand, IconCheck, IconTrash, IconPlus, IconBrain } from '@/components/Icons';

interface ShapeStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
}

export function ShapeStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
}: ShapeStageProps) {
  const personality = project.personality || {};
  const traits = personality.traits || [];
  const traitsToAvoid = personality.traitsToAvoid || [];
  const namingDirections = project.namingDirections || [];

  const [newTagline, setNewTagline] = useState('');
  const [newPitch, setNewPitch] = useState('');

  const handleSelectDirection = (index: number) => {
    const updated = namingDirections.map((dir, i) => ({
      ...dir,
      selected: i === index,
    }));
    updateProject({ namingDirections: updated });
  };

  const updateTagline = (val: string) => updateProject({ tagline: val });
  const updatePitch = (val: string) => updateProject({ onePitchLine: val });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconSparkles className="w-4 h-4" />
            <span>Stage 3: Voice & Naming</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Shape Brand Personality</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Establish personality traits, naming directions, tagline, and elevator pitch.
          </p>
        </div>
        <button
          onClick={onRunAi}
          disabled={isAiLoading}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Synthesizing...' : 'Generate AI Personality'}</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personality Traits */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              Core Personality Traits
            </label>
            <p className="text-[11px] text-slate-400">Defined traits and why they matter</p>
          </div>

          <div className="space-y-2">
            {traits.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No traits generated yet.</p>
            ) : (
              traits.map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <div className="text-xs font-bold text-amber-300 mb-1">{t.trait}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{t.justification}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Traits to Avoid */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              Anti-Personality (What to avoid)
            </label>
            <p className="text-[11px] text-slate-400">Traits that would harm the brand</p>
          </div>

          <div className="space-y-2">
            {traitsToAvoid.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No anti-traits generated yet.</p>
            ) : (
              traitsToAvoid.map((t, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 rounded-lg border border-rose-900/30">
                  <div className="text-xs font-bold text-rose-400 mb-1">{t.trait}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{t.why}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Naming Directions */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4 md:col-span-2">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              Brand Naming Directions
            </label>
            <p className="text-[11px] text-slate-400">Select the territory you want to pursue for your final name.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {namingDirections.length === 0 ? (
              <p className="text-xs text-slate-500 italic md:col-span-3">No naming directions generated yet.</p>
            ) : (
              namingDirections.map((dir, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDirection(idx)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    dir.selected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-bold text-sm ${dir.selected ? 'text-amber-400' : 'text-slate-200'}`}>
                      {dir.direction}
                    </h4>
                    {dir.selected && <IconCheck className="w-4 h-4 text-amber-500" />}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="block text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Examples</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dir.examples.map((ex, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 bg-slate-800 rounded text-[11px] text-slate-300">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-wider">Rationale</span>
                      <p className="text-[11px] text-slate-400 leading-snug">{dir.rationale}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Tagline */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Brand Tagline
          </label>
          <input
            type="text"
            value={project.tagline || ''}
            onChange={(e) => updateTagline(e.target.value)}
            placeholder="e.g. Forge your identity before launch."
            className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* One Pitch Line */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            One-Sentence Elevator Pitch
          </label>
          <textarea
            value={project.onePitchLine || ''}
            onChange={(e) => updatePitch(e.target.value)}
            rows={2}
            placeholder="e.g. An AI brand co-pilot that builds positioning and design rules in 5 minutes."
            className="w-full px-3 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>
    </div>
  );
}
