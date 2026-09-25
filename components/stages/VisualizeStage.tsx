import React from 'react';
import { BrandProject } from '@/lib/types';
import { IconPalette, IconWand, IconCheck, IconShieldAlert as IconWarning } from '@/components/Icons';

interface VisualizeStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
}

export function VisualizeStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
}: VisualizeStageProps) {
  const visualDirection = project.visualDirection || {};
  const colors = visualDirection.colorMood || [];
  
  // Extract a mock name from Stage 3 selections or fallback
  const selectedDirection = project.namingDirections?.find(d => d.selected);
  const mockWordmark = selectedDirection?.examples[0] || 'BrandForge';
  
  // Google Font parsing (basic encoding for the CSS import)
  const fontName = visualDirection.recommendedGoogleFont || 'Inter';
  const encodedFont = fontName.replace(/\s+/g, '+');
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@400;700;800&display=swap`;

  return (
    <div className="space-y-6">
      {/* Dynamic Font Import */}
      {fontName && (
        <style dangerouslySetInnerHTML={{ __html: `@import url('${googleFontUrl}');` }} />
      )}

      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-fuchsia-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconPalette className="w-4 h-4" />
            <span>Stage 5: Visual Translation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Design the Visual Direction</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Establish color palettes, typography, and visual rules driven by the brand's core strategy.
          </p>
        </div>
        <button
          onClick={onRunAi}
          disabled={isAiLoading}
          className="px-4 py-2.5 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-slate-100 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-fuchsia-600/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Designing...' : 'Generate AI Visuals'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Mock Wordmark & Typography */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4 md:col-span-2">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              Mock Wordmark & Typography
            </label>
            <p className="text-[11px] text-slate-400">Live preview using the recommended Google Font: <strong className="text-fuchsia-300">{fontName}</strong></p>
          </div>
          
          <div className="p-8 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-center overflow-hidden relative group">
            {/* Background grid effect for presentation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold tracking-tight text-white relative z-10 transition-all"
              style={{ fontFamily: `'${fontName}', sans-serif` }}
            >
              {mockWordmark}
            </h1>
          </div>
          
          <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
             <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Typography Rationale</div>
             <p className="text-xs text-slate-300">{visualDirection.typographyStyle || 'Run AI to generate typography rules.'}</p>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4 md:col-span-2">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              Brand Color Mood
            </label>
            <p className="text-[11px] text-slate-400">Color swatches and psychological rationale</p>
          </div>

          {colors.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No colors generated yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {colors.map((color, idx) => (
                <div key={idx} className="group rounded-xl border border-slate-800/80 bg-slate-950/50 overflow-hidden hover:border-slate-600 transition-colors">
                  <div 
                    className="h-24 w-full relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/20 flex items-center justify-center backdrop-blur-[2px] transition-all">
                      <span className="text-white text-xs font-mono font-bold px-2 py-1 bg-black/40 rounded">{color.hex}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-slate-200">{color.name}</div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{color.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Imagery Style & Motifs */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200">
              Imagery Style & Motifs
            </label>
            <p className="text-[11px] text-slate-400">Guidelines for photography, 3D, or illustration.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
               <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                 <IconCheck className="w-3 h-3 mr-1 text-emerald-500" /> Imagery Direction
               </div>
               <p className="text-xs text-slate-300 leading-relaxed">{visualDirection.imageryStyle || 'Pending...'}</p>
            </div>
            
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
               <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                 <IconCheck className="w-3 h-3 mr-1 text-emerald-500" /> Symbolic Motifs
               </div>
               <p className="text-xs text-slate-300 leading-relaxed">{visualDirection.symbolicMotifs || 'Pending...'}</p>
            </div>
          </div>
        </div>

        {/* Shapes to Avoid */}
        <div className="bg-slate-900/40 p-5 rounded-xl border border-rose-900/20 border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-rose-300">
              Visual Anti-Patterns
            </label>
            <p className="text-[11px] text-rose-400/60">Shapes and styles that damage the positioning.</p>
          </div>

          <div className="bg-rose-950/30 p-4 rounded-lg border border-rose-900/50 h-full">
             <div className="text-[10px] font-mono text-rose-500 uppercase tracking-wider mb-2 flex items-center">
               <IconWarning className="w-3 h-3 mr-1" /> Shapes & Styles to Avoid
             </div>
             <p className="text-xs text-rose-200/80 leading-relaxed">{visualDirection.shapesToAvoid || 'Pending...'}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
