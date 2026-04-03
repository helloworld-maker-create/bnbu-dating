export const DEFAULT_WEIGHTS = {
  major: 0.32,
  gpaGoal: 0.18,
  gradSchoolGoal: 0.24,
  careerDirection: 0.12,
  tags: 0.14,
};

export const WEIGHT_PROFILES = {
  academic_strict: DEFAULT_WEIGHTS,
  social_balanced: {
    major: 0.24,
    gpaGoal: 0.12,
    gradSchoolGoal: 0.2,
    careerDirection: 0.12,
    tags: 0.32,
  },
  career_focused: {
    major: 0.22,
    gpaGoal: 0.12,
    gradSchoolGoal: 0.18,
    careerDirection: 0.3,
    tags: 0.18,
  },
  grad_school_focused: {
    major: 0.22,
    gpaGoal: 0.18,
    gradSchoolGoal: 0.34,
    careerDirection: 0.1,
    tags: 0.16,
  },
};

export const DEFAULT_OPTIONS = {
  verifiedOnly: true,
  minScore: 0,
  limit: null,
  weightProfile: "academic_strict",
  excludeSeen: true,
  interactionHistory: [],
  seenCandidateIds: [],
  sessionHistory: [],
  sourceInteractionCount: 0,
  candidateStats: {},
  onlineLearning: {
    enabled: true,
    recentWindow: 12,
    minPositiveSignals: 2,
    dynamicWeightStrength: 0.45,
    maxBoost: 12,
    preferredTagLimit: 5,
    explorationBalance: 0.28,
    explorationExposureThreshold: 8,
    maxExplorationBoost: 4,
    negativeHedgeStrength: 0.7,
    maxNegativeHedgePenalty: 8,
  },
  frequencyControl: {
    enabled: true,
    recentWindow: 8,
    excludeSessionSeen: true,
    exactMajorPenalty: 5,
    majorClusterPenalty: 3,
    careerClusterPenalty: 2,
    gradGoalPenalty: 0.5,
    sharedTagPenalty: 1,
    maxPenalty: 10,
  },
  observability: {
    enabled: true,
    includePerCandidate: true,
    maxCandidateLogs: 20,
  },
  timeDecay: {
    enabled: true,
    halfLifeDays: 30,
    minMultiplier: 0.2,
    referenceTime: null,
  },
  diversity: {
    enabled: true,
    topWindow: 5,
    exactMajorPenalty: 7,
    majorClusterPenalty: 4,
    careerClusterPenalty: 2.5,
    gradGoalPenalty: 0,
    maxPenalty: 12,
  },
};

export const SCORE_BANDS = [
  { min: 85, label: "Exceptional Fit", tier: "S" },
  { min: 75, label: "Strong Fit", tier: "A" },
  { min: 60, label: "Promising Fit", tier: "B" },
  { min: 45, label: "Moderate Fit", tier: "C" },
  { min: 0, label: "Low Fit", tier: "D" },
];

export const NEGATIVE_ACTION_WEIGHTS = {
  left: 0.7,
  pass: 0.7,
  dislike: 0.8,
  report: 1.2,
  block: 1.4,
};

export const POSITIVE_ACTION_WEIGHTS = {
  right: 0.9,
  like: 1,
  super_like: 1.3,
  match: 1.4,
};

export const COLD_START_CONFIG = {
  threshold: 12,
  maxBoost: 12,
  lowExposureThreshold: 8,
};
