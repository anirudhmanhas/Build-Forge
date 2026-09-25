export interface BrandProject {
  id: string;
  rawIdea: string;
  understanding?: {
    targetUser?: string;
    coreProblem?: string;
    constraints?: string;
    openQuestions?: string[];
  };
  positioning?: {
    category?: string;
    differentiator?: string;
    valueProp?: string;
    competitiveAngle?: string;
  };
  personality?: {
    traits?: string[]; // 3-5 traits
    traitsToAvoid?: string[];
    justification?: string;
  };
  namingDirections?: {
    name: string;
    rationale: string;
  }[];
  tagline?: string;
  onePitchLine?: string;
  challengeLog?: {
    issue: string;
    why: string;
    betterAlternative: string;
  }[];
  visualDirection?: {
    typographyStyle?: string;
    colorMood?: string;
    imageryStyle?: string;
    shapesToAvoid?: string;
  };
  consistencyReport?: {
    conflicts?: string[];
    resolved?: boolean;
  };
  launchAssets?: {
    landingHeadline?: string;
    onePagePitch?: string;
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
