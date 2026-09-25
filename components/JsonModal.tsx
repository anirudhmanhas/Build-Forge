import React, { useState } from 'react';
import { BrandProject } from '@/lib/types';
import { IconCode, IconCopy, IconCheck } from '@/components/Icons';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BrandProject;
  onImportJson: (json: BrandProject) => void;
}

export function JsonModal({ isOpen, onClose, project, onImportJson }: JsonModalProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rawText, setRawText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(project, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-project-${project.id || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartImport = () => {
    setRawText(jsonString);
    setIsEditing(true);
    setErrorMsg(null);
  };

  const handleSaveImport = () => {
    try {
      const parsed = JSON.parse(rawText);
      if (!parsed.id || !parsed.rawIdea) {
        throw new Error('Imported JSON must contain at least "id" and "rawIdea" fields.');
      }
      onImportJson(parsed);
      setIsEditing(false);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <IconCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100">BrandProject JSON State Inspector</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg font-bold px-2 py-0.5 rounded-lg hover:bg-slate-800"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs">
          {isEditing ? (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-400 font-sans">
                Paste or edit custom BrandProject JSON structure below:
              </p>
              {errorMsg && (
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-sans rounded-md">
                  {errorMsg}
                </div>
              )}
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={18}
                className="w-full p-3 bg-slate-950 text-amber-300 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500/50 text-[11px]"
              />
            </div>
          ) : (
            <pre className="p-4 bg-slate-950 text-amber-300/90 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
              {jsonString}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <div className="flex space-x-2">
            {isEditing ? (
              <button
                onClick={handleSaveImport}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Apply JSON State
              </button>
            ) : (
              <button
                onClick={handleStartImport}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs border border-slate-700"
              >
                Edit / Import JSON
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs flex items-center space-x-1.5 border border-slate-700"
            >
              {copied ? <IconCheck className="w-3.5 h-3.5 text-emerald-400" /> : <IconCopy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-500/20"
            >
              Download .json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
