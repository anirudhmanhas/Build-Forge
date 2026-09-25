export interface BrandProject {
  id: string;
  rawIdea: string;
  understanding?: {
    targetUser?: string;
    coreProblem?: string;
    constraints?: string;
    openQuestions?: string[];
    qaHistory?: { question: string; answer: string }[];
  };
  positioning?: {
    category?: string;
    differentiator?: string;
    differentiatorJustification?: string;
    valueProp?: string;
    competitiveAngle?: string;
  };
  personality?: {
    traits?: { trait: string; justification: string }[];
    traitsToAvoid?: { trait: string; why: string }[];
  };
  namingDirections?: {
    direction: string;
    examples: string[];
    rationale: string;
    selected?: boolean;
  }[];
  tagline?: string;
  onePitchLine?: string;
  challengeLog?: {
    issue: string;
    why: string;
    betterAlternative: string;
    fieldToUpdate: string; // e.g. 'tagline', 'positioning.valueProp'
    suggestedValue: string; // the exact new string to apply
    status?: 'pending' | 'applied' | 'dismissed';
  }[];
  visualDirection?: {
    typographyStyle?: string;
    recommendedGoogleFont?: string; // e.g. "Inter", "Space Grotesk"
    colorMood?: { hex: string; name: string; rationale: string }[];
    imageryStyle?: string;
    symbolicMotifs?: string;
    shapesToAvoid?: string;
  };
  consistencyReport?: {
    conflicts: { field: string; issue: string }[];
    resolved: boolean;
  };
  launchAssets?: {
    landingHeadline?: string;
    landingSubhead?: string;
    onePagePitch?: {
      problem: string;
      solution: string;
      whyNow: string;
      personalityOneLiner: string;
    };
    socialPost?: string;
  };
}

export type StageId = 
  | 'understand'
  | 'position'
  | 'shape'
  | 'challenge'
  | 'visualize'
  | 'consistency'
  | 'launch';

export type StageStatus = 'not_started' | 'in_progress' | 'done';

export interface StageInfo {
  id: StageId;
  name: string;
  description: string;
  stepNumber: number;
}
