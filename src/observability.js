import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_OPTIONS } from "./config.js";

function candidateLogEntry(result) {
  return {
    rank: result.rank ?? null,
    candidateId: String(result.profile.id),
    candidateName: result.profile.realName ?? null,
    scores: {
      chemistry: result.chemistry.score,
      preDiversity: result.reranking.preDiversityScore,
      final: result.finalScore,
    },
    deltas: {
      negativeFeedback: Number((-result.reranking.negativeFeedbackPenalty.totalPenalty).toFixed(2)),
      onlineLearning: Number(result.reranking.onlineLearningBoost.totalBoost.toFixed(2)),
      coldStart: Number(result.reranking.coldStartBoost.totalBoost.toFixed(2)),
      sessionFrequency: Number(
        (-(result.reranking.sessionFrequencyPenalty?.totalPenalty ?? 0)).toFixed(2)
      ),
      diversity: Number((-(result.reranking.diversityPenalty?.totalPenalty ?? 0)).toFixed(2)),
    },
    labels: {
      chemistryLabel: result.chemistry.label,
      tier: result.chemistry.tier,
    },
    reasons: {
      highlights: result.chemistry.highlights,
      cautions: result.chemistry.cautions,
      reranking: result.reranking.explanation,
    },
    traces: {
      negativeFeedback: result.reranking.negativeFeedbackPenalty.reasons,
      onlineLearning: {
        exploitation: result.reranking.onlineLearningBoost.exploitationReasons ?? [],
        exploration: result.reranking.onlineLearningBoost.explorationReasons ?? [],
        hedge: result.reranking.onlineLearningBoost.hedgeReasons ?? [],
      },
      coldStart: result.reranking.coldStartBoost.reasons,
      sessionFrequency: result.reranking.sessionFrequencyPenalty?.reasons ?? [],
      diversity: result.reranking.diversityPenalty?.reasons ?? [],
    },
  };
}

export function buildRecommendationDebugLog(sourceProfile, rankedResults, options = {}, metadata = {}) {
  const observabilityOptions = {
    ...DEFAULT_OPTIONS.observability,
    ...(options.observability ?? {}),
  };

  if (!observabilityOptions.enabled) {
    return null;
  }

  const candidateLogs = observabilityOptions.includePerCandidate
    ? rankedResults
        .slice(0, observabilityOptions.maxCandidateLogs)
        .map((result, index) => candidateLogEntry({ ...result, rank: index + 1 }))
    : [];

  return {
    generatedAt: new Date().toISOString(),
    sourceUserId: sourceProfile.id,
    summary: {
      consideredCandidates: metadata.totalCandidatesConsidered ?? rankedResults.length,
      returnedCandidates: rankedResults.length,
      sessionHistorySize: (options.sessionHistory ?? []).length,
      interactionHistorySize: (options.interactionHistory ?? []).length,
    },
    config: {
      weightProfile: options.weightProfile ?? DEFAULT_OPTIONS.weightProfile,
      onlineLearning: {
        enabled: options.onlineLearning?.enabled ?? DEFAULT_OPTIONS.onlineLearning.enabled,
        explorationBalance:
          options.onlineLearning?.explorationBalance ??
          DEFAULT_OPTIONS.onlineLearning.explorationBalance,
        negativeHedgeStrength:
          options.onlineLearning?.negativeHedgeStrength ??
          DEFAULT_OPTIONS.onlineLearning.negativeHedgeStrength,
      },
      timeDecay: {
        enabled: options.timeDecay?.enabled ?? DEFAULT_OPTIONS.timeDecay.enabled,
        halfLifeDays:
          options.timeDecay?.halfLifeDays ?? DEFAULT_OPTIONS.timeDecay.halfLifeDays,
      },
      frequencyControl: {
        enabled: options.frequencyControl?.enabled ?? DEFAULT_OPTIONS.frequencyControl.enabled,
        recentWindow:
          options.frequencyControl?.recentWindow ?? DEFAULT_OPTIONS.frequencyControl.recentWindow,
        excludeSessionSeen:
          options.frequencyControl?.excludeSessionSeen ??
          DEFAULT_OPTIONS.frequencyControl.excludeSessionSeen,
      },
      diversity: {
        enabled: options.diversity?.enabled ?? DEFAULT_OPTIONS.diversity.enabled,
      },
    },
    candidates: candidateLogs,
  };
}

export async function writeRecommendationDebugLog(filePath, debugLog) {
  if (!debugLog) {
    return null;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(debugLog, null, 2), "utf8");
  return filePath;
}
