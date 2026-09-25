'use client';

import React, { useState, useEffect } from 'react';
import { BrandProject, StageId, StageStatus } from '@/lib/types';
import { Sidebar, STAGES } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { UnderstandStage } from '@/components/stages/UnderstandStage';
import { PositionStage } from '@/components/stages/PositionStage';
import { ShapeStage } from '@/components/stages/ShapeStage';
import { ChallengeStage } from '@/components/stages/ChallengeStage';
import { VisualizeStage } from '@/components/stages/VisualizeStage';
import { ConsistencyStage } from '@/components/stages/ConsistencyStage';
import { LaunchStage } from '@/components/stages/LaunchStage';
import { JsonModal } from '@/components/JsonModal';

const DEFAULT_PROJECT: BrandProject = {
  id: 'proj_init_01',
  rawIdea: '',
};

export default function Home() {
  const [project, setProject] = useState<BrandProject>(DEFAULT_PROJECT);
  const [currentStage, setCurrentStage] = useState<StageId>('understand');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Compute stage statuses automatically from local project state
  const computeStageStatuses = (): Record<StageId, StageStatus> => {
    const statuses: Record<StageId, StageStatus> = {
      understand: 'not_started',
      position: 'not_started',
      shape: 'not_started',
      challenge: 'not_started',
      visualize: 'not_started',
      consistency: 'not_started',
      launch: 'not_started',
    };

    // Understand status
    const hasOpenQuestions = (project.understanding?.openQuestions?.length || 0) > 0;
    if (project.understanding?.targetUser && project.understanding?.coreProblem && !hasOpenQuestions) {
      statuses.understand = 'done';
    } else if (project.understanding?.targetUser || project.understanding?.coreProblem) {
      statuses.understand = 'in_progress';
    }

    // Position status
    if (project.positioning?.category && project.positioning?.valueProp) {
      statuses.position = 'done';
    } else if (project.positioning?.category || project.positioning?.valueProp) {
      statuses.position = 'in_progress';
    }

    // Shape status
    const hasTraits = (project.personality?.traits?.length || 0) > 0;
    const hasSelectedDirection = project.namingDirections?.some(d => d.selected);
    
    if (hasTraits && project.tagline && hasSelectedDirection) {
      statuses.shape = 'done';
    } else if (hasTraits || project.tagline) {
      statuses.shape = 'in_progress';
    }

    // Challenge status
    if (project.challengeLog !== undefined) {
      const allResolved = project.challengeLog.every(c => c.status !== 'pending');
      if (allResolved) {
        statuses.challenge = 'done';
      } else {
        statuses.challenge = 'in_progress';
      }
    }

    // Visualize status
    const hasVisualTypography = !!project.visualDirection?.typographyStyle;
    const hasColors = (project.visualDirection?.colorMood?.length || 0) > 0;
    
    if (hasVisualTypography && hasColors) {
      statuses.visualize = 'done';
    } else if (hasVisualTypography || hasColors) {
      statuses.visualize = 'in_progress';
    }

    // Consistency status
    if (project.consistencyReport?.resolved) {
      statuses.consistency = 'done';
    } else if (project.consistencyReport) {
      statuses.consistency = 'in_progress';
    }

    // Launch status
    if (project.launchAssets?.landingHeadline) {
      statuses.launch = 'done';
    } else if (project.launchAssets) {
      statuses.launch = 'in_progress';
    }

    return statuses;
  };

  const updateProject = (data: Partial<BrandProject>) => {
    setProject((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRunAi = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: currentStage,
          context: project,
          project,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        updateProject(resData.data);
        showNotification(`✨ AI synthesized insights for Stage: ${currentStage.toUpperCase()}!`);
      } else {
        showNotification(`⚠️ Failed to generate AI content: ${resData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      showNotification(`⚠️ Network error generating AI insights: ${err?.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetProject = () => {
    if (confirm('Reset project to default initial state?')) {
      setProject({
        id: 'proj_' + Math.random().toString(36).substring(2, 9),
        rawIdea: 'AI-Powered Developer Tools',
      });
      setCurrentStage('understand');
      showNotification('Project reset successfully.');
    }
  };

  const stageStatuses = computeStageStatuses();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl border border-amber-400 animate-fadeIn flex items-center space-x-2">
          <span>{notification}</span>
        </div>
      )}

      {/* Left Sidebar Shell */}
      <Sidebar
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        project={project}
        stageStatuses={stageStatuses}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onRawIdeaChange={(idea) => updateProject({ rawIdea: idea })}
      />

      {/* Main Right Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
          onRunAi={handleRunAi}
          isAiLoading={isAiLoading}
          onResetProject={handleResetProject}
          stageStatuses={stageStatuses}
        />

        {/* Stage Content Render Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
          {currentStage === 'understand' && (
            <UnderstandStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
              setCurrentStage={setCurrentStage}
            />
          )}

          {currentStage === 'position' && (
            <PositionStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
            />
          )}

          {currentStage === 'shape' && (
            <ShapeStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
            />
          )}

          {currentStage === 'challenge' && (
            <ChallengeStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
            />
          )}

          {currentStage === 'visualize' && (
            <VisualizeStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
            />
          )}

          {currentStage === 'consistency' && (
            <ConsistencyStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
              setCurrentStage={setCurrentStage}
            />
          )}

          {currentStage === 'launch' && (
            <LaunchStage
              project={project}
              updateProject={updateProject}
              onRunAi={handleRunAi}
              isAiLoading={isAiLoading}
            />
          )}
        </main>
      </div>

      {/* JSON Inspector Modal */}
      <JsonModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        project={project}
        onImportJson={(imported) => {
          setProject(imported);
          showNotification('Imported JSON state applied!');
        }}
      />
    </div>
  );
}
