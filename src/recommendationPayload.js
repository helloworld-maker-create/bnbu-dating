import { buildRecommendationDebugLog } from "./observability.js";
import { buildOnlineLearningModel, summarizeOnlineLearningModel } from "./onlineLearning.js";
import { rankCandidates } from "./rankCandidates.js";

export function buildRecommendationPayload(sourceProfile, candidateProfiles, options = {}) {
  const onlineLearningModel = buildOnlineLearningModel(options);
  const ranked = rankCandidates(sourceProfile, candidateProfiles, options);
  const debugLog = buildRecommendationDebugLog(sourceProfile, ranked, options, {
    totalCandidatesConsidered: candidateProfiles.length,
  });

  return {
    sourceUserId: sourceProfile.id,
    generatedAt: new Date().toISOString(),
    filters: {
      verifiedOnly: options.verifiedOnly ?? true,
      minScore: options.minScore ?? 0,
      limit: options.limit ?? null,
      weightProfile: options.weightProfile ?? "academic_strict",
      excludeSeen: options.excludeSeen ?? true,
      onlineLearningEnabled: options.onlineLearning?.enabled ?? true,
      timeDecayEnabled: options.timeDecay?.enabled ?? true,
      frequencyControlEnabled: options.frequencyControl?.enabled ?? true,
      diversityEnabled: options.diversity?.enabled ?? true,
    },
    onlineLearning: summarizeOnlineLearningModel(onlineLearningModel),
    debugLog,
    totalCandidatesConsidered: candidateProfiles.length,
    totalMatchesReturned: ranked.length,
    matches: ranked.map((result, index) => ({
      rank: index + 1,
      candidateId: result.profile.id,
      finalScore: result.finalScore,
      profilePreview: {
        realName: result.profile.realName,
        major: result.profile.major,
        careerDirection: result.profile.careerDirection,
        academicTags: result.profile.academicTags,
        hobbies: result.profile.hobbies,
      },
      chemistry: result.chemistry,
      reranking: result.reranking,
    })),
  };
}
