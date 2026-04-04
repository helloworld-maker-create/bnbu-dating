import {
  COLD_START_CONFIG,
  DEFAULT_OPTIONS,
  NEGATIVE_ACTION_WEIGHTS,
} from "./config.js";
import {
  buildOnlineLearningModel,
  calculateOnlineLearningBoost,
} from "./onlineLearning.js";
import {
  careerCluster,
  gradGoalCluster,
  intersectLists,
  majorCluster,
  normalizeProfile,
} from "./normalization.js";

function getInteractionCandidateId(interaction) {
  if (interaction == null) return null;
  if (interaction.candidateId != null) return String(interaction.candidateId);
  if (interaction.profile?.id != null) return String(interaction.profile.id);
  return null;
}

function buildSeenCandidateSet(options) {
  const seenIds = new Set((options.seenCandidateIds ?? []).map((value) => String(value)));

  for (const interaction of options.interactionHistory ?? []) {
    const candidateId = getInteractionCandidateId(interaction);
    if (candidateId) {
      seenIds.add(candidateId);
    }
  }

  if (options.frequencyControl?.excludeSessionSeen) {
    for (const entry of options.sessionHistory ?? []) {
      const candidateId = getInteractionCandidateId(entry);
      if (candidateId) {
        seenIds.add(candidateId);
      }
    }
  }

  return seenIds;
}

function profileCompleteness(profile) {
  const normalized = normalizeProfile(profile);
  const fields = [
    normalized.major,
    normalized.gpaGoal,
    normalized.gradSchoolGoal,
    normalized.careerDirection,
    normalized.academicTags.length > 0,
    normalized.hobbies.length > 0,
  ];

  const filledCount = fields.filter(Boolean).length;
  return Number((filledCount / fields.length).toFixed(2));
}

function parseInteractionTime(interaction) {
  const rawValue =
    interaction?.timestamp ??
    interaction?.createdAt ??
    interaction?.swipedAt ??
    interaction?.occurredAt ??
    null;

  if (!rawValue) return null;

  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function resolveReferenceTime(options) {
  const configuredTime = options.timeDecay?.referenceTime;
  if (configuredTime) {
    const parsed = new Date(configuredTime);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function calculateTimeDecay(interaction, options) {
  const timeDecayOptions = options.timeDecay ?? {};
  if (!timeDecayOptions.enabled) {
    return {
      multiplier: 1,
      ageDays: null,
    };
  }

  const interactionTime = parseInteractionTime(interaction);
  if (!interactionTime) {
    return {
      multiplier: 1,
      ageDays: null,
    };
  }

  const referenceTime = resolveReferenceTime(options);
  const diffMs = Math.max(0, referenceTime.getTime() - interactionTime.getTime());
  const ageDays = diffMs / (1000 * 60 * 60 * 24);
  const halfLifeDays = Math.max(1, Number(timeDecayOptions.halfLifeDays ?? 30));
  const minMultiplier = Math.min(1, Math.max(0, Number(timeDecayOptions.minMultiplier ?? 0.2)));
  const decayMultiplier = Math.max(minMultiplier, Math.pow(0.5, ageDays / halfLifeDays));

  return {
    multiplier: Number(decayMultiplier.toFixed(4)),
    ageDays: Number(ageDays.toFixed(2)),
  };
}

function getNegativeHistory(options) {
  return (options.interactionHistory ?? [])
    .filter((interaction) => {
      const action = String(interaction?.action ?? "").toLowerCase();
      return action in NEGATIVE_ACTION_WEIGHTS && interaction.profile;
    })
    .map((interaction) => {
      const action = String(interaction.action).toLowerCase();
      const baseWeight = NEGATIVE_ACTION_WEIGHTS[action] ?? 0;
      const timeDecay = calculateTimeDecay(interaction, options);

      return {
        action,
        baseWeight,
        timeDecayMultiplier: timeDecay.multiplier,
        ageDays: timeDecay.ageDays,
        weight: Number((baseWeight * timeDecay.multiplier).toFixed(4)),
        profile: normalizeProfile(interaction.profile),
      };
    });
}

function calculateNegativePenalty(candidateProfile, negativeHistory) {
  if (!negativeHistory.length) {
    return {
      totalPenalty: 0,
      reasons: [],
    };
  }

  const candidate = normalizeProfile(candidateProfile);
  const candidateMajorCluster = majorCluster(candidate.major);
  const candidateCareerCluster = careerCluster(candidate.careerDirection);
  const candidateGradGoalCluster = gradGoalCluster(candidate.gradSchoolGoal);

  let totalPenalty = 0;
  const reasons = [];

  for (const interaction of negativeHistory) {
    let penalty = 0;
    const matchedTraits = [];
    const profile = interaction.profile;

    if (candidate.major && profile.major && candidate.major === profile.major) {
      penalty += 8 * interaction.weight;
      matchedTraits.push("same major");
    } else if (
      candidateMajorCluster &&
      profile.major &&
      candidateMajorCluster === majorCluster(profile.major)
    ) {
      penalty += 5 * interaction.weight;
      matchedTraits.push("same major cluster");
    }

    if (
      candidateGradGoalCluster &&
      profile.gradSchoolGoal &&
      candidateGradGoalCluster === gradGoalCluster(profile.gradSchoolGoal)
    ) {
      penalty += 4 * interaction.weight;
      matchedTraits.push("same grad goal cluster");
    }

    if (
      candidateCareerCluster &&
      profile.careerDirection &&
      candidateCareerCluster === careerCluster(profile.careerDirection)
    ) {
      penalty += 3 * interaction.weight;
      matchedTraits.push("same career cluster");
    }

    const sharedAcademicTags = intersectLists(candidate.academicTags, profile.academicTags);
    const sharedHobbies = intersectLists(candidate.hobbies, profile.hobbies);
    const sharedInterestsCount = sharedAcademicTags.length + sharedHobbies.length;

    if (sharedInterestsCount > 0) {
      penalty += Math.min(5, sharedInterestsCount * 1.5) * interaction.weight;
      matchedTraits.push(`shared ${sharedInterestsCount} disliked interests`);
    }

    if (penalty > 0) {
      const roundedPenalty = Number(penalty.toFixed(2));
      totalPenalty += roundedPenalty;
      reasons.push({
        action: interaction.action,
        baseWeight: interaction.baseWeight,
        decayMultiplier: interaction.timeDecayMultiplier,
        ageDays: interaction.ageDays,
        penalty: roundedPenalty,
        matchedTraits,
        referenceProfileId: profile.id,
      });
    }
  }

  return {
    totalPenalty: Number(Math.min(25, totalPenalty).toFixed(2)),
    reasons: reasons.slice(0, 3),
  };
}

function calculateColdStartBoost(candidateProfile, options) {
  const interactionCount = Number(options.sourceInteractionCount ?? 0);
  if (interactionCount >= COLD_START_CONFIG.threshold) {
    return {
      totalBoost: 0,
      reasons: [],
    };
  }

  const ramp = 1 - interactionCount / COLD_START_CONFIG.threshold;
  const candidateId = String(candidateProfile.id);
  const stats = options.candidateStats?.[candidateId] ?? {};
  const exposureCount = Number(stats.exposureCount ?? 0);
  const candidateCompleteness = profileCompleteness(candidateProfile);

  let boost = 0;
  const reasons = [];

  if (candidateProfile.isVerified) {
    const value = 3 * ramp;
    boost += value;
    reasons.push({
      type: "verified_profile",
      boost: Number(value.toFixed(2)),
    });
  }

  if (candidateCompleteness >= 0.83) {
    const value = 5 * candidateCompleteness * ramp;
    boost += value;
    reasons.push({
      type: "high_profile_completeness",
      boost: Number(value.toFixed(2)),
      completeness: candidateCompleteness,
    });
  }

  if (exposureCount <= COLD_START_CONFIG.lowExposureThreshold) {
    const value =
      ((COLD_START_CONFIG.lowExposureThreshold - exposureCount) /
        COLD_START_CONFIG.lowExposureThreshold) *
      4 *
      ramp;
    boost += value;
    reasons.push({
      type: "low_exposure_exploration",
      boost: Number(value.toFixed(2)),
      exposureCount,
    });
  }

  return {
    totalBoost: Number(Math.min(COLD_START_CONFIG.maxBoost, boost).toFixed(2)),
    reasons: reasons.slice(0, 3),
  };
}

function normalizeSessionHistoryEntry(entry) {
  const profile = entry?.profile ?? entry;
  const normalizedProfile = normalizeProfile(profile);

  return {
    candidateId: getInteractionCandidateId(entry),
    profile: normalizedProfile,
  };
}

function calculateSessionFrequencyPenalty(candidateProfile, options) {
  const frequencyOptions = options.frequencyControl ?? {};
  if (!frequencyOptions.enabled) {
    return {
      totalPenalty: 0,
      reasons: [],
    };
  }

  const sessionEntries = (options.sessionHistory ?? [])
    .slice(-frequencyOptions.recentWindow)
    .map(normalizeSessionHistoryEntry);

  if (!sessionEntries.length) {
    return {
      totalPenalty: 0,
      reasons: [],
    };
  }

  const candidate = normalizeProfile(candidateProfile);
  const candidateMajorCluster = majorCluster(candidate.major);
  const candidateCareerCluster = careerCluster(candidate.careerDirection);
  const candidateGradGoalCluster = gradGoalCluster(candidate.gradSchoolGoal);

  let totalPenalty = 0;
  const reasons = [];

  for (const entry of sessionEntries) {
    const matchedTraits = [];
    let penalty = 0;
    const profile = entry.profile;

    if (candidate.major && profile.major && candidate.major === profile.major) {
      penalty += frequencyOptions.exactMajorPenalty;
      matchedTraits.push("same exact major as recent session result");
    } else if (
      candidateMajorCluster &&
      profile.major &&
      candidateMajorCluster === majorCluster(profile.major)
    ) {
      penalty += frequencyOptions.majorClusterPenalty;
      matchedTraits.push("same major cluster as recent session result");
    }

    if (
      candidateCareerCluster &&
      profile.careerDirection &&
      candidateCareerCluster === careerCluster(profile.careerDirection)
    ) {
      penalty += frequencyOptions.careerClusterPenalty;
      matchedTraits.push("same career cluster as recent session result");
    }

    if (
      candidateGradGoalCluster &&
      profile.gradSchoolGoal &&
      candidateGradGoalCluster === gradGoalCluster(profile.gradSchoolGoal)
    ) {
      penalty += frequencyOptions.gradGoalPenalty;
      matchedTraits.push("same grad goal cluster as recent session result");
    }

    const sharedTagsCount =
      intersectLists(candidate.academicTags, profile.academicTags).length +
      intersectLists(candidate.hobbies, profile.hobbies).length;

    if (sharedTagsCount > 0) {
      penalty += Math.min(3, sharedTagsCount * frequencyOptions.sharedTagPenalty);
      matchedTraits.push(`shared ${sharedTagsCount} recent-session tags`);
    }

    if (penalty > 0) {
      const roundedPenalty = Number(penalty.toFixed(2));
      totalPenalty += roundedPenalty;
      reasons.push({
        penalty: roundedPenalty,
        matchedTraits,
        recentCandidateId: entry.candidateId ?? profile.id,
      });
    }
  }

  return {
    totalPenalty: Number(Math.min(frequencyOptions.maxPenalty, totalPenalty).toFixed(2)),
    reasons: reasons.slice(0, 4),
  };
}

function toRerankingSummary(
  result,
  baseScore,
  negativePenalty,
  onlineLearningBoost,
  coldStartBoost,
  sessionFrequencyPenalty
) {
  const adjustedScore = Number(
    Math.max(
      0,
      Math.min(
        100,
        baseScore -
          negativePenalty.totalPenalty +
          onlineLearningBoost.totalBoost +
          coldStartBoost.totalBoost -
          sessionFrequencyPenalty.totalPenalty
      )
    ).toFixed(2)
  );

  return {
    preDiversityScore: adjustedScore,
    adjustedScore,
    deltaFromChemistry: Number((adjustedScore - baseScore).toFixed(2)),
    negativeFeedbackPenalty: negativePenalty,
    onlineLearningBoost,
    coldStartBoost,
    sessionFrequencyPenalty,
    diversityPenalty: {
      totalPenalty: 0,
      reasons: [],
    },
    explanation: [
      ...(negativePenalty.totalPenalty > 0 ? ["penalized by negative feedback history"] : []),
      ...(onlineLearningBoost.exploitationBoost > 0
        ? ["boosted by recent positive preference signals"]
        : []),
      ...(onlineLearningBoost.explorationBoost > 0
        ? ["kept broader by exploration-exploitation balancing"]
        : []),
      ...(onlineLearningBoost.hedgePenalty > 0
        ? ["hedged by recent negative preference signals"]
        : []),
      ...(coldStartBoost.totalBoost > 0 ? ["boosted for cold-start exploration"] : []),
      ...(sessionFrequencyPenalty.totalPenalty > 0
        ? ["downranked to avoid same-type repetition in current session"]
        : []),
    ],
  };
}

function calculateDiversityPenalty(candidateProfile, selectedResults, diversityOptions) {
  if (!diversityOptions.enabled || !selectedResults.length) {
    return {
      totalPenalty: 0,
      reasons: [],
    };
  }

  const candidate = normalizeProfile(candidateProfile);
  const relevantSelected = selectedResults.slice(0, diversityOptions.topWindow);

  let totalPenalty = 0;
  const reasons = [];

  for (const selected of relevantSelected) {
    const selectedProfile = normalizeProfile(selected.profile);
    const matchedTraits = [];
    let penalty = 0;

    if (candidate.major && selectedProfile.major && candidate.major === selectedProfile.major) {
      penalty += diversityOptions.exactMajorPenalty;
      matchedTraits.push("same exact major");
    } else if (
      candidate.major &&
      selectedProfile.major &&
      majorCluster(candidate.major) &&
      majorCluster(candidate.major) === majorCluster(selectedProfile.major)
    ) {
      penalty += diversityOptions.majorClusterPenalty;
      matchedTraits.push("same major cluster");
    }

    if (
      candidate.careerDirection &&
      selectedProfile.careerDirection &&
      careerCluster(candidate.careerDirection) &&
      careerCluster(candidate.careerDirection) === careerCluster(selectedProfile.careerDirection)
    ) {
      penalty += diversityOptions.careerClusterPenalty;
      matchedTraits.push("same career cluster");
    }

    if (
      candidate.gradSchoolGoal &&
      selectedProfile.gradSchoolGoal &&
      gradGoalCluster(candidate.gradSchoolGoal) &&
      gradGoalCluster(candidate.gradSchoolGoal) === gradGoalCluster(selectedProfile.gradSchoolGoal)
    ) {
      penalty += diversityOptions.gradGoalPenalty;
      matchedTraits.push("same grad goal cluster");
    }

    if (penalty > 0) {
      const roundedPenalty = Number(penalty.toFixed(2));
      totalPenalty += roundedPenalty;
      reasons.push({
        penalty: roundedPenalty,
        matchedTraits,
        comparedAgainstCandidateId: String(selected.profile.id),
      });
    }
  }

  return {
    totalPenalty: Number(Math.min(diversityOptions.maxPenalty, totalPenalty).toFixed(2)),
    reasons: reasons.slice(0, 3),
  };
}

function applyDiversityReranking(results, mergedOptions) {
  const diversityOptions = mergedOptions.diversity;

  if (!diversityOptions.enabled) {
    return results
      .slice()
      .sort((left, right) => right.finalScore - left.finalScore)
      .map((result) => ({
        ...result,
        reranking: {
          ...result.reranking,
          adjustedScore: result.finalScore,
        },
      }));
  }

  const remaining = results.slice().sort((left, right) => right.finalScore - left.finalScore);
  const selected = [];

  while (remaining.length) {
    const rescoredCandidates = remaining
      .map((candidate) => {
        const diversityPenalty = calculateDiversityPenalty(
          candidate.profile,
          selected,
          diversityOptions
        );
        const diversifiedScore = Number(
          Math.max(0, candidate.finalScore - diversityPenalty.totalPenalty).toFixed(2)
        );

        return {
          ...candidate,
          diversifiedScore,
          reranking: {
            ...candidate.reranking,
            diversityPenalty,
            adjustedScore: diversifiedScore,
            explanation: [
              ...candidate.reranking.explanation,
              ...(diversityPenalty.totalPenalty > 0
                ? ["diversified to reduce same-type clustering in top results"]
                : []),
            ],
          },
        };
      })
      .sort((left, right) => {
        if (right.diversifiedScore !== left.diversifiedScore) {
          return right.diversifiedScore - left.diversifiedScore;
        }
        return right.finalScore - left.finalScore;
      });

    const chosen = rescoredCandidates[0];
    selected.push({
      ...chosen,
      finalScore: chosen.diversifiedScore,
    });

    const chosenId = String(chosen.profile.id);
    const nextRemaining = remaining.filter((candidate) => String(candidate.profile.id) !== chosenId);
    remaining.splice(0, remaining.length, ...nextRemaining);
  }

  return selected;
}

export function applyRecommendationPolicies(results, options = {}) {
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
    timeDecay: {
      ...DEFAULT_OPTIONS.timeDecay,
      ...(options.timeDecay ?? {}),
    },
    diversity: {
      ...DEFAULT_OPTIONS.diversity,
      ...(options.diversity ?? {}),
    },
  };
  const seenCandidateIds = buildSeenCandidateSet(mergedOptions);
  const sessionSeenIds = new Set(
    (mergedOptions.sessionHistory ?? [])
      .map((entry) => getInteractionCandidateId(entry))
      .filter(Boolean)
  );
  const negativeHistory = getNegativeHistory(mergedOptions);
  const onlineLearningModel =
    mergedOptions.onlineLearningModel ?? buildOnlineLearningModel(mergedOptions);

  const filteredResults = results.filter((result) => {
    const candidateId = String(result.profile.id);
    if (
      mergedOptions.frequencyControl?.excludeSessionSeen &&
      sessionSeenIds.has(candidateId)
    ) {
      return false;
    }
    if (mergedOptions.excludeSeen && seenCandidateIds.has(candidateId)) {
      return false;
    }
    return true;
  });

  const reranked = filteredResults
    .map((result) => {
      const negativePenalty = calculateNegativePenalty(result.profile, negativeHistory);
      const onlineLearningBoost = calculateOnlineLearningBoost(
        result.profile,
        onlineLearningModel,
        mergedOptions
      );
      const coldStartBoost = calculateColdStartBoost(result.profile, mergedOptions);
      const sessionFrequencyPenalty = calculateSessionFrequencyPenalty(
        result.profile,
        mergedOptions
      );
      const reranking = toRerankingSummary(
        result,
        result.chemistry.score,
        negativePenalty,
        onlineLearningBoost,
        coldStartBoost,
        sessionFrequencyPenalty
      );

      return {
        ...result,
        reranking,
        finalScore: reranking.adjustedScore,
      };
    })
    .sort((left, right) => right.finalScore - left.finalScore);

  return applyDiversityReranking(reranked, mergedOptions);
}
