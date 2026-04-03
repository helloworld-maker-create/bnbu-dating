import { DEFAULT_OPTIONS } from "./config.js";
import { calculateChemistryScore } from "./chemistryScore.js";
import { buildOnlineLearningModel } from "./onlineLearning.js";
import { applyRecommendationPolicies } from "./reranking.js";

export function rankCandidates(sourceProfile, candidateProfiles, options = {}) {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    onlineLearning: {
      ...DEFAULT_OPTIONS.onlineLearning,
      ...(options.onlineLearning ?? {}),
    },
    frequencyControl: {
      ...DEFAULT_OPTIONS.frequencyControl,
      ...(options.frequencyControl ?? {}),
    },
    observability: {
      ...DEFAULT_OPTIONS.observability,
      ...(options.observability ?? {}),
    },
    timeDecay: {
      ...DEFAULT_OPTIONS.timeDecay,
      ...(options.timeDecay ?? {}),
    },
    diversity: {
      ...DEFAULT_OPTIONS.diversity,
      ...(options.diversity ?? {}),
    },
  };
  const onlineLearningModel = buildOnlineLearningModel(mergedOptions);

  const scored = candidateProfiles
    .filter((candidate) => {
      if (!candidate) return false;
      if (candidate.id === sourceProfile.id) return false;
      if (mergedOptions.verifiedOnly && !candidate.isVerified) return false;
      return true;
    })
    .map((candidate) => ({
      profile: candidate,
      chemistry: calculateChemistryScore(sourceProfile, candidate, {
        weightProfile: mergedOptions.weightProfile,
        weights: onlineLearningModel.isActive
          ? onlineLearningModel.adaptiveWeights
          : mergedOptions.weights,
      }),
    }))
    .filter((result) => result.chemistry.score >= mergedOptions.minScore);

  const ranked = applyRecommendationPolicies(scored, {
    ...mergedOptions,
    onlineLearningModel,
  });

  if (typeof mergedOptions.limit === "number") {
    return ranked.slice(0, Math.max(0, mergedOptions.limit));
  }

  return ranked;
}
