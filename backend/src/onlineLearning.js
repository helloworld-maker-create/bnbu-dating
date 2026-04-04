import {
  DEFAULT_OPTIONS,
  NEGATIVE_ACTION_WEIGHTS,
  POSITIVE_ACTION_WEIGHTS,
} from "./config.js";
import {
  careerCluster,
  gradGoalCluster,
  intersectLists,
  majorCluster,
  normalizeProfile,
  parseGpaValue,
} from "./normalization.js";
import { resolveWeightConfig } from "./weightProfiles.js";

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
  const timeDecayOptions = {
    ...DEFAULT_OPTIONS.timeDecay,
    ...(options.timeDecay ?? {}),
  };

  if (!timeDecayOptions.enabled) {
    return { multiplier: 1, ageDays: null };
  }

  const interactionTime = parseInteractionTime(interaction);
  if (!interactionTime) {
    return { multiplier: 1, ageDays: null };
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

function addWeight(bucket, key, weight) {
  if (!key || weight <= 0) return;
  bucket.set(key, Number(((bucket.get(key) ?? 0) + weight).toFixed(4)));
}

function topBucketEntry(bucket) {
  return [...bucket.entries()].sort((left, right) => right[1] - left[1])[0] ?? null;
}

function topBucketEntries(bucket, limit) {
  return [...bucket.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([value, weight]) => ({ value, weight: Number(weight.toFixed(4)) }));
}

function normalizeWeights(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (total <= 0) {
    return weights;
  }

  return Object.fromEntries(
    entries.map(([key, value]) => [key, Number((value / total).toFixed(4))])
  );
}

function preferenceStrength(bucket) {
  const total = [...bucket.values()].reduce((sum, value) => sum + value, 0);
  if (total <= 0) return 0;

  const top = topBucketEntry(bucket);
  return Number(((top?.[1] ?? 0) / total).toFixed(4));
}

function getPositiveHistory(options) {
  const onlineLearningOptions = {
    ...DEFAULT_OPTIONS.onlineLearning,
    ...(options.onlineLearning ?? {}),
  };

  return (options.interactionHistory ?? [])
    .filter((interaction) => {
      const action = String(interaction?.action ?? "").toLowerCase();
      return action in POSITIVE_ACTION_WEIGHTS && interaction.profile;
    })
    .map((interaction) => {
      const action = String(interaction.action).toLowerCase();
      const baseWeight = POSITIVE_ACTION_WEIGHTS[action] ?? 0;
      const timeDecay = calculateTimeDecay(interaction, options);

      return {
        action,
        baseWeight,
        timeDecayMultiplier: timeDecay.multiplier,
        ageDays: timeDecay.ageDays,
        weight: Number((baseWeight * timeDecay.multiplier).toFixed(4)),
        profile: normalizeProfile(interaction.profile),
      };
    })
    .sort((left, right) => {
      const leftAge = left.ageDays ?? Number.POSITIVE_INFINITY;
      const rightAge = right.ageDays ?? Number.POSITIVE_INFINITY;
      return leftAge - rightAge;
    })
    .slice(0, onlineLearningOptions.recentWindow);
}

function getNegativeHistory(options) {
  const onlineLearningOptions = {
    ...DEFAULT_OPTIONS.onlineLearning,
    ...(options.onlineLearning ?? {}),
  };

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
    })
    .sort((left, right) => {
      const leftAge = left.ageDays ?? Number.POSITIVE_INFINITY;
      const rightAge = right.ageDays ?? Number.POSITIVE_INFINITY;
      return leftAge - rightAge;
    })
    .slice(0, onlineLearningOptions.recentWindow);
}

function buildTraitBuckets(history) {
  const majorBucket = new Map();
  const careerBucket = new Map();
  const gradGoalBucket = new Map();
  const tagBucket = new Map();
  const gpaValues = [];

  for (const interaction of history) {
    const profile = interaction.profile;
    const weight = interaction.weight;

    addWeight(majorBucket, majorCluster(profile.major), weight);
    addWeight(careerBucket, careerCluster(profile.careerDirection), weight);
    addWeight(gradGoalBucket, gradGoalCluster(profile.gradSchoolGoal), weight);

    for (const tag of [...profile.academicTags, ...profile.hobbies]) {
      addWeight(tagBucket, tag, weight);
    }

    const gpaValue = parseGpaValue(profile.gpaGoal);
    if (gpaValue != null) {
      gpaValues.push({ value: gpaValue, weight });
    }
  }

  return {
    majorBucket,
    careerBucket,
    gradGoalBucket,
    tagBucket,
    gpaValues,
  };
}

function counterBucket(positiveBucket, negativeBucket, hedgeStrength) {
  const combinedKeys = new Set([
    ...positiveBucket.keys(),
    ...negativeBucket.keys(),
  ]);
  const result = new Map();

  for (const key of combinedKeys) {
    const positiveValue = positiveBucket.get(key) ?? 0;
    const negativeValue = negativeBucket.get(key) ?? 0;
    const netValue = Math.max(0, positiveValue - negativeValue * hedgeStrength);

    if (netValue > 0) {
      result.set(key, Number(netValue.toFixed(4)));
    }
  }

  return result;
}

function averageWeightedGpa(values) {
  const totalWeight = values.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return null;

  return Number(
    (
      values.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight
    ).toFixed(2)
  );
}

function gpaPreferenceStrength(values) {
  if (values.length >= 2) {
    return Number(
      Math.max(
        0,
        1 -
          (Math.max(...values.map((item) => item.value)) -
            Math.min(...values.map((item) => item.value))) /
            4
      ).toFixed(4)
    );
  }

  return values.length === 1 ? 0.7 : 0;
}

function buildAdaptiveWeights(baseWeights, preferenceStrengths, confidence, dynamicWeightStrength) {
  return normalizeWeights({
    major:
      baseWeights.major * (1 + dynamicWeightStrength * preferenceStrengths.major * confidence),
    gpaGoal:
      baseWeights.gpaGoal * (1 + dynamicWeightStrength * preferenceStrengths.gpaGoal * confidence),
    gradSchoolGoal:
      baseWeights.gradSchoolGoal *
      (1 + dynamicWeightStrength * preferenceStrengths.gradSchoolGoal * confidence),
    careerDirection:
      baseWeights.careerDirection *
      (1 + dynamicWeightStrength * preferenceStrengths.careerDirection * confidence),
    tags: baseWeights.tags * (1 + dynamicWeightStrength * preferenceStrengths.tags * confidence),
  });
}

export function buildOnlineLearningModel(options = {}) {
  const onlineLearningOptions = {
    ...DEFAULT_OPTIONS.onlineLearning,
    ...(options.onlineLearning ?? {}),
  };
  const baseWeightConfig = resolveWeightConfig({
    weightProfile: options.weightProfile,
    weights: options.weights,
  });

  if (!onlineLearningOptions.enabled) {
    return {
      enabled: false,
      isActive: false,
      sampleSize: 0,
      confidence: 0,
      adaptiveWeights: baseWeightConfig.weights,
      preferredTraits: null,
      preferenceStrengths: null,
      options: onlineLearningOptions,
    };
  }

  const positiveHistory = getPositiveHistory(options);
  const negativeHistory = getNegativeHistory(options);
  const weightedSampleSize = positiveHistory.reduce((sum, item) => sum + item.weight, 0);
  const confidence = Number(
    Math.min(1, weightedSampleSize / Math.max(1, onlineLearningOptions.minPositiveSignals))
      .toFixed(4)
  );

  if (positiveHistory.length < onlineLearningOptions.minPositiveSignals || confidence <= 0) {
    return {
      enabled: true,
      isActive: false,
      sampleSize: positiveHistory.length,
      confidence,
      adaptiveWeights: baseWeightConfig.weights,
      preferredTraits: null,
      preferenceStrengths: null,
      options: onlineLearningOptions,
    };
  }

  const positiveTraits = buildTraitBuckets(positiveHistory);
  const negativeTraits = buildTraitBuckets(negativeHistory);
  const hedgeStrength = onlineLearningOptions.negativeHedgeStrength;
  const majorBucket = counterBucket(
    positiveTraits.majorBucket,
    negativeTraits.majorBucket,
    hedgeStrength
  );
  const careerBucket = counterBucket(
    positiveTraits.careerBucket,
    negativeTraits.careerBucket,
    hedgeStrength
  );
  const gradGoalBucket = counterBucket(
    positiveTraits.gradGoalBucket,
    negativeTraits.gradGoalBucket,
    hedgeStrength
  );
  const tagBucket = counterBucket(
    positiveTraits.tagBucket,
    negativeTraits.tagBucket,
    hedgeStrength
  );
  const positivePreferredGpa = averageWeightedGpa(positiveTraits.gpaValues);
  const negativePreferredGpa = averageWeightedGpa(negativeTraits.gpaValues);
  const preferredGpa =
    positivePreferredGpa == null
      ? null
      : negativePreferredGpa == null
        ? positivePreferredGpa
        : Number(
            (
              positivePreferredGpa -
              (negativePreferredGpa - positivePreferredGpa) * hedgeStrength * 0.15
            ).toFixed(2)
          );

  const preferenceStrengths = {
    major: preferenceStrength(majorBucket),
    careerDirection: preferenceStrength(careerBucket),
    gradSchoolGoal: preferenceStrength(gradGoalBucket),
    tags: preferenceStrength(tagBucket),
    gpaGoal: Math.max(
      0,
      Number(
        (
          gpaPreferenceStrength(positiveTraits.gpaValues) -
          gpaPreferenceStrength(negativeTraits.gpaValues) * hedgeStrength * 0.5
        ).toFixed(4)
      )
    ),
  };

  return {
    enabled: true,
    isActive: true,
    sampleSize: positiveHistory.length,
    negativeSampleSize: negativeHistory.length,
    confidence,
    adaptiveWeights: buildAdaptiveWeights(
      baseWeightConfig.weights,
      preferenceStrengths,
      confidence,
      onlineLearningOptions.dynamicWeightStrength
    ),
    preferredTraits: {
      majorCluster: topBucketEntry(majorBucket)?.[0] ?? null,
      careerCluster: topBucketEntry(careerBucket)?.[0] ?? null,
      gradGoalCluster: topBucketEntry(gradGoalBucket)?.[0] ?? null,
      tags: topBucketEntries(tagBucket, onlineLearningOptions.preferredTagLimit),
      preferredGpa,
    },
    avoidedTraits: {
      majorCluster: topBucketEntry(negativeTraits.majorBucket)?.[0] ?? null,
      careerCluster: topBucketEntry(negativeTraits.careerBucket)?.[0] ?? null,
      gradGoalCluster: topBucketEntry(negativeTraits.gradGoalBucket)?.[0] ?? null,
      tags: topBucketEntries(negativeTraits.tagBucket, onlineLearningOptions.preferredTagLimit),
      dislikedGpa: negativePreferredGpa,
    },
    preferenceStrengths,
    options: onlineLearningOptions,
  };
}

export function summarizeOnlineLearningModel(model) {
  return {
    enabled: model.enabled,
    isActive: model.isActive,
    sampleSize: model.sampleSize,
    negativeSampleSize: model.negativeSampleSize,
    confidence: model.confidence,
    adaptiveWeights: model.adaptiveWeights,
    preferenceStrengths: model.preferenceStrengths,
    preferredTraits: model.preferredTraits,
    avoidedTraits: model.avoidedTraits,
  };
}

export function calculateOnlineLearningBoost(candidateProfile, model, options = {}) {
  if (!model?.enabled || !model?.isActive) {
    return {
      totalBoost: 0,
      exploitationBoost: 0,
      explorationBoost: 0,
      hedgePenalty: 0,
      reasons: [],
      confidence: model?.confidence ?? 0,
    };
  }

  const candidate = normalizeProfile(candidateProfile);
  const exploitReasons = [];
  const explorationReasons = [];
  const hedgeReasons = [];
  let rawExploitBoost = 0;
  const maxBoost = model.options.maxBoost;
  const explorationBalance = Math.min(
    1,
    Math.max(0, Number(model.options.explorationBalance ?? 0.28))
  );

  const candidateMajorCluster = majorCluster(candidate.major);
  if (
    model.preferredTraits.majorCluster &&
    candidateMajorCluster === model.preferredTraits.majorCluster
  ) {
    const value = maxBoost * 0.28 * model.preferenceStrengths.major * model.confidence;
    rawExploitBoost += value;
    exploitReasons.push({
      type: "preferred_major_cluster",
      boost: Number(value.toFixed(2)),
      matchedValue: model.preferredTraits.majorCluster,
    });
  }

  const candidateCareerCluster = careerCluster(candidate.careerDirection);
  if (
    model.preferredTraits.careerCluster &&
    candidateCareerCluster === model.preferredTraits.careerCluster
  ) {
    const value =
      maxBoost * 0.22 * model.preferenceStrengths.careerDirection * model.confidence;
    rawExploitBoost += value;
    exploitReasons.push({
      type: "preferred_career_cluster",
      boost: Number(value.toFixed(2)),
      matchedValue: model.preferredTraits.careerCluster,
    });
  }

  const candidateGradGoalCluster = gradGoalCluster(candidate.gradSchoolGoal);
  if (
    model.preferredTraits.gradGoalCluster &&
    candidateGradGoalCluster === model.preferredTraits.gradGoalCluster
  ) {
    const value =
      maxBoost * 0.18 * model.preferenceStrengths.gradSchoolGoal * model.confidence;
    rawExploitBoost += value;
    exploitReasons.push({
      type: "preferred_grad_goal_cluster",
      boost: Number(value.toFixed(2)),
      matchedValue: model.preferredTraits.gradGoalCluster,
    });
  }

  const preferredTags = model.preferredTraits.tags.map((item) => item.value);
  const sharedPreferredTags = intersectLists(
    [...candidate.academicTags, ...candidate.hobbies],
    preferredTags
  );

  if (sharedPreferredTags.length > 0) {
    const value = Math.min(
      maxBoost * 0.22,
      sharedPreferredTags.length * 1.2 * model.confidence
    );
    rawExploitBoost += value;
    exploitReasons.push({
      type: "preferred_tags",
      boost: Number(value.toFixed(2)),
      matchedTags: sharedPreferredTags,
    });
  }

  const candidateGpa = parseGpaValue(candidate.gpaGoal);
  if (model.preferredTraits.preferredGpa != null && candidateGpa != null) {
    const gpaDifference = Math.abs(candidateGpa - model.preferredTraits.preferredGpa);
    const closeness = Math.max(0, 1 - gpaDifference / 1.2);

    if (closeness > 0) {
      const value = maxBoost * 0.1 * closeness * model.confidence;
      rawExploitBoost += value;
      exploitReasons.push({
        type: "preferred_gpa_band",
        boost: Number(value.toFixed(2)),
        preferredGpa: model.preferredTraits.preferredGpa,
        candidateGpa,
      });
    }
  }

  const exploitationBoost = Number((rawExploitBoost * (1 - explorationBalance)).toFixed(2));

  let hedgePenalty = 0;
  const maxNegativeHedgePenalty = model.options.maxNegativeHedgePenalty;
  const negativeHedgeStrength = model.options.negativeHedgeStrength;
  const avoidedMajorCluster = model.avoidedTraits?.majorCluster;
  if (avoidedMajorCluster && candidateMajorCluster === avoidedMajorCluster) {
    const value = maxNegativeHedgePenalty * 0.3 * negativeHedgeStrength * model.confidence;
    hedgePenalty += value;
    hedgeReasons.push({
      type: "avoided_major_cluster",
      penalty: Number(value.toFixed(2)),
      matchedValue: avoidedMajorCluster,
    });
  }

  const avoidedCareerCluster = model.avoidedTraits?.careerCluster;
  if (avoidedCareerCluster && candidateCareerCluster === avoidedCareerCluster) {
    const value = maxNegativeHedgePenalty * 0.25 * negativeHedgeStrength * model.confidence;
    hedgePenalty += value;
    hedgeReasons.push({
      type: "avoided_career_cluster",
      penalty: Number(value.toFixed(2)),
      matchedValue: avoidedCareerCluster,
    });
  }

  const avoidedGradGoalCluster = model.avoidedTraits?.gradGoalCluster;
  if (avoidedGradGoalCluster && candidateGradGoalCluster === avoidedGradGoalCluster) {
    const value = maxNegativeHedgePenalty * 0.18 * negativeHedgeStrength * model.confidence;
    hedgePenalty += value;
    hedgeReasons.push({
      type: "avoided_grad_goal_cluster",
      penalty: Number(value.toFixed(2)),
      matchedValue: avoidedGradGoalCluster,
    });
  }

  const avoidedTags = model.avoidedTraits?.tags?.map((item) => item.value) ?? [];
  const sharedAvoidedTags = intersectLists(
    [...candidate.academicTags, ...candidate.hobbies],
    avoidedTags
  );
  if (sharedAvoidedTags.length > 0) {
    const value = Math.min(
      maxNegativeHedgePenalty * 0.22,
      sharedAvoidedTags.length * 0.9 * negativeHedgeStrength * model.confidence
    );
    hedgePenalty += value;
    hedgeReasons.push({
      type: "avoided_tags",
      penalty: Number(value.toFixed(2)),
      matchedTags: sharedAvoidedTags,
    });
  }

  const dislikedGpa = model.avoidedTraits?.dislikedGpa;
  if (dislikedGpa != null && candidateGpa != null) {
    const difference = Math.abs(candidateGpa - dislikedGpa);
    const closeness = Math.max(0, 1 - difference / 1.2);
    if (closeness > 0) {
      const value =
        maxNegativeHedgePenalty * 0.1 * closeness * negativeHedgeStrength * model.confidence;
      hedgePenalty += value;
      hedgeReasons.push({
        type: "avoided_gpa_band",
        penalty: Number(value.toFixed(2)),
        dislikedGpa,
        candidateGpa,
      });
    }
  }

  const candidateId = String(candidateProfile.id);
  const exposureCount = Number(options.candidateStats?.[candidateId]?.exposureCount ?? 0);
  const noveltySignals = [
    !avoidedMajorCluster && !model.preferredTraits.majorCluster
      ? 0
      : candidateMajorCluster && candidateMajorCluster !== model.preferredTraits.majorCluster
        ? 0.35
        : 0,
    candidateCareerCluster && candidateCareerCluster !== model.preferredTraits.careerCluster
      ? 0.25
      : 0,
    sharedPreferredTags.length === 0 ? 0.2 : 0,
  ];
  const noveltyScore = Math.min(1, noveltySignals.reduce((sum, value) => sum + value, 0));
  const explorationExposureThreshold = Math.max(
    1,
    Number(model.options.explorationExposureThreshold ?? 8)
  );
  const exposureFactor = Math.max(
    0,
    (explorationExposureThreshold - exposureCount) / explorationExposureThreshold
  );
  const explorationBoost = Number(
    Math.min(
      model.options.maxExplorationBoost,
      model.options.maxExplorationBoost *
        explorationBalance *
        noveltyScore *
        exposureFactor *
        model.confidence
    ).toFixed(2)
  );

  if (explorationBoost > 0) {
    explorationReasons.push({
      type: "exploration_balance",
      boost: explorationBoost,
      noveltyScore: Number(noveltyScore.toFixed(2)),
      exposureCount,
    });
  }

  const totalBoost = Number(
    Math.max(0, exploitationBoost + explorationBoost - Math.min(maxNegativeHedgePenalty, hedgePenalty)).toFixed(2)
  );

  return {
    totalBoost,
    exploitationBoost,
    explorationBoost,
    hedgePenalty: Number(Math.min(maxNegativeHedgePenalty, hedgePenalty).toFixed(2)),
    reasons: [...exploitReasons, ...explorationReasons, ...hedgeReasons].slice(0, 6),
    exploitationReasons: exploitReasons.slice(0, 4),
    explorationReasons: explorationReasons.slice(0, 2),
    hedgeReasons: hedgeReasons.slice(0, 4),
    confidence: model.confidence,
    adaptiveWeights: model.adaptiveWeights,
  };
}
