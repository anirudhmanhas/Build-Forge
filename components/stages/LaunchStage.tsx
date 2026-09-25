import React from 'react';
import { BrandProject } from '@/lib/types';
import { IconFlame, IconWand, IconCode, IconSparkles } from '@/components/Icons';

interface LaunchStageProps {
  project: BrandProject;
  updateProject: (data: Partial<BrandProject>) => void;
  onRunAi: () => Promise<void>;
  isAiLoading: boolean;
}

export function LaunchStage({
  project,
  updateProject,
  onRunAi,
  isAiLoading,
}: LaunchStageProps) {
  const assets = project.launchAssets;
  
  // Brand summary data
  const nameDirection = project.namingDirections?.find(d => d.selected);
  const brandName = nameDirection?.examples[0] || 'Brand Name';
  const tagline = project.tagline || 'Tagline goes here';
  const colors = project.visualDirection?.colorMood || [];
  const fontName = project.visualDirection?.recommendedGoogleFont || 'Inter';

  // Export as JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `brandforge-${project.id}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Export as HTML
  const handleExportHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${brandName} - Brand Kit</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700;800&display=swap');
          body { font-family: '${fontName}', sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 3rem; margin-bottom: 0.2em; }
          .tagline { font-size: 1.5rem; color: #94a3b8; margin-top: 0; }
          .section { margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e293b; }
          .colors { display: flex; gap: 10px; margin-top: 10px; }
          .color { width: 80px; height: 80px; border-radius: 8px; }
          .card { background: #1e293b; padding: 20px; border-radius: 8px; margin-top: 15px; }
          h2 { color: #38bdf8; }
        </style>
      </head>
      <body>
        <h1>${brandName}</h1>
        <p class="tagline">${tagline}</p>

        <div class="section">
          <h2>Brand Positioning</h2>
          <p><strong>Category:</strong> ${project.positioning?.category}</p>
          <p><strong>Differentiator:</strong> ${project.positioning?.differentiator}</p>
          <p><strong>Value Prop:</strong> ${project.positioning?.valueProp}</p>
        </div>

        <div class="section">
          <h2>Visual Direction</h2>
          <p><strong>Font:</strong> ${fontName}</p>
          <div class="colors">
            ${colors.map(c => `<div class="color" style="background: ${c.hex};" title="${c.name}"></div>`).join('')}
          </div>
        </div>

        <div class="section">
          <h2>Launch Copy</h2>
          <div class="card">
            <h3>Landing Page</h3>
            <p><strong>Headline:</strong> ${assets?.landingHeadline || ''}</p>
            <p><strong>Subhead:</strong> ${assets?.landingSubhead || ''}</p>
          </div>
          <div class="card">
            <h3>One Page Pitch</h3>
            <p><strong>Problem:</strong> ${assets?.onePagePitch?.problem || ''}</p>
            <p><strong>Solution:</strong> ${assets?.onePagePitch?.solution || ''}</p>
            <p><strong>Why Now:</strong> ${assets?.onePagePitch?.whyNow || ''}</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Font Import */}
      {fontName && (
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700;800&display=swap');` }} />
      )}

      {/* Header Banner */}
      <div className="flex items-start justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-semibold uppercase mb-1">
            <IconFlame className="w-4 h-4" />
            <span>Stage 7: Launch</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">The Brand Kit</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generate your final launch copy and export your comprehensive brand system.
          </p>
        </div>
        <div className="flex space-x-3">
          {assets && (
            <div className="flex space-x-2 mr-4">
              <button onClick={handleExportHtml} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all">
                HTML View
              </button>
              <button onClick={handleExportJson} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center transition-all">
                <IconCode className="w-3.5 h-3.5 mr-1.5" /> JSON
              </button>
            </div>
          )}
          <button
            onClick={onRunAi}
            disabled={isAiLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-100 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-600/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <IconWand className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Writing Copy...' : 'Generate Assets'}</span>
          </button>
        </div>
      </div>

      {!assets && !isAiLoading && (
        <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 border-dashed">
          <IconFlame className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Generate launch copy to complete your brand kit.</p>
        </div>
      )}

      {assets && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Identity Preview Block */}
          <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center text-center">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-fuchsia-500/5 z-0" />
             <div className="relative z-10 space-y-4">
               <h1 style={{ fontFamily: `'${fontName}', sans-serif` }} className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                 {brandName}
               </h1>
               <p className="text-xl md:text-2xl font-light text-slate-400 max-w-2xl mx-auto">
                 {tagline}
               </p>
             </div>
             
             <div className="flex gap-3 mt-8 relative z-10">
               {colors.map((c, i) => (
                 <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 shadow-lg" style={{ backgroundColor: c.hex }} title={c.name} />
               ))}
             </div>
          </div>

          {/* Launch Copy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4 h-full">
              <h3 className="font-bold text-amber-400 flex items-center text-sm">
                <IconSparkles className="w-4 h-4 mr-2" /> Landing Page Header
              </h3>
              <div className="bg-slate-950/50 p-5 rounded-lg border border-slate-800/80">
                 <h2 className="text-2xl font-bold text-slate-100 leading-tight mb-3">
                   {assets.landingHeadline}
                 </h2>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   {assets.landingSubhead}
                 </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <h3 className="font-bold text-amber-400 flex items-center text-sm mb-3">
                  <IconFlame className="w-4 h-4 mr-2" /> Social Announcement
                </h3>
                <div className="bg-indigo-950/20 p-4 rounded-lg border border-indigo-900/30 text-sm text-indigo-200/90 whitespace-pre-wrap">
                  {assets.socialPost}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-amber-400 flex items-center text-sm">
                <IconSparkles className="w-4 h-4 mr-2" /> One-Page Pitch
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">The Problem</div>
                  <p className="text-sm text-slate-300">{assets.onePagePitch?.problem}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">The Solution</div>
                  <p className="text-sm text-slate-300">{assets.onePagePitch?.solution}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Why Now?</div>
                  <p className="text-sm text-slate-300">{assets.onePagePitch?.whyNow}</p>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 mt-2">
                  <div className="text-[10px] font-mono text-amber-500/70 uppercase tracking-wider mb-1">Vibe Check</div>
                  <p className="text-xs text-amber-200/90 italic">"{assets.onePagePitch?.personalityOneLiner}"</p>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      )}
    </div>
  );
}
