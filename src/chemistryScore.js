import { DEFAULT_WEIGHTS, SCORE_BANDS } from "./config.js";
import {
  careerCluster,
  gradGoalCluster,
  intersectLists,
  majorCluster,
  normalizeProfile,
  parseGpaValue,
} from "./normalization.js";
import { resolveWeightConfig } from "./weightProfiles.js";

function describeSignal(score) {
  if (score == null) return "missing";
  if (score >= 85) return "very_strong";
  if (score >= 70) return "strong";
  if (score >= 50) return "medium";
  return "weak";
}

function scoreExactOrCluster(key, valueA, valueB, clusterResolver) {
  if (!valueA || !valueB) {
    return {
      key,
      score: null,
      reason: "Missing data on one or both profiles",
      detail: null,
      shared: false,
    };
  }

  if (valueA === valueB) {
    return {
      key,
      score: 100,
      reason: "Exact match",
      detail: valueA,
      shared: true,
    };
  }

  const clusterA = clusterResolver(valueA);
  const clusterB = clusterResolver(valueB);

  if (clusterA && clusterA === clusterB) {
    return {
      key,
      score: 78,
      reason: "Same semantic cluster",
      detail: clusterA,
      shared: true,
    };
  }

  return {
    key,
    score: 30,
    reason: "Different direction",
    detail: null,
    shared: false,
  };
}

function scoreGpa(goalA, goalB) {
  if (!goalA || !goalB) {
    return {
      key: "gpaGoal",
      score: null,
      reason: "Missing GPA target on one or both profiles",
      detail: null,
      shared: false,
    };
  }

  if (goalA === goalB) {
    return {
      key: "gpaGoal",
      score: 100,
      reason: "Exact academic target match",
      detail: goalA,
      shared: true,
    };
  }

  const gpaA = parseGpaValue(goalA);
  const gpaB = parseGpaValue(goalB);

  if (gpaA == null || gpaB == null) {
    return {
      key: "gpaGoal",
      score: 45,
      reason: "Targets are present but only loosely comparable",
      detail: null,
      shared: false,
    };
  }

  const difference = Math.abs(gpaA - gpaB);
  const score = Math.max(0, Math.round(100 - difference * 40));

  return {
    key: "gpaGoal",
    score,
    reason:
      difference <= 0.15
        ? "Very close academic expectations"
        : difference <= 0.4
          ? "Moderately aligned academic expectations"
          : "Academic expectations are fairly different",
    detail: { sourceGpa: gpaA, candidateGpa: gpaB, difference: Number(difference.toFixed(2)) },
    shared: difference <= 0.4,
  };
}

function scoreTags(tagsA, tagsB, hobbiesA, hobbiesB) {
  const overlappingAcademicTags = intersectLists(tagsA, tagsB);
  const overlappingHobbies = intersectLists(hobbiesA, hobbiesB);
  const mergedA = [...new Set([...tagsA, ...hobbiesA])];
  const mergedB = [...new Set([...tagsB, ...hobbiesB])];

  if (!mergedA.length || !mergedB.length) {
    return {
      key: "tags",
      score: null,
      reason: "Missing tags or hobbies on one or both profiles",
      detail: { sharedAcademicTags: [], sharedHobbies: [] },
      shared: false,
    };
  }

  const setA = new Set(mergedA);
  const setB = new Set(mergedB);
  const overlap = [...setA].filter((item) => setB.has(item));
  const union = new Set([...setA, ...setB]);

  if (!union.size) {
    return {
      key: "tags",
      score: null,
      reason: "No comparable interest data",
      detail: { sharedAcademicTags: [], sharedHobbies: [] },
      shared: false,
    };
  }

  const score = Math.round((overlap.length / union.size) * 100);

  return {
    key: "tags",
    score,
    reason:
      overlap.length >= 3
        ? "Strong overlap in tags and hobbies"
        : overlap.length >= 1
          ? "Some shared interests"
          : "Very little shared interests",
    detail: {
      sharedAcademicTags: overlappingAcademicTags,
      sharedHobbies: overlappingHobbies,
      overlapCount: overlap.length,
      unionCount: union.size,
    },
    shared: overlap.length > 0,
  };
}

function buildHighlights(dimensions) {
  return Object.values(dimensions)
    .filter((dimension) => dimension.score != null && dimension.score >= 70)
    .sort((left, right) => right.score - left.score)
    .map((dimension) => {
      switch (dimension.key) {
        case "major":
          return "similar academic background";
        case "gpaGoal":
          return "close academic expectations";
        case "gradSchoolGoal":
          return "aligned graduate school plans";
        case "careerDirection":
          return "similar career direction";
        case "tags":
          return "overlapping interests and tags";
        default:
          return null;
      }
    })
    .filter(Boolean)
    .slice(0, 3);
}

function buildCautions(dimensions) {
  return Object.values(dimensions)
    .filter((dimension) => dimension.score == null || dimension.score < 45)
    .map((dimension) => {
      if (dimension.score == null) {
        return `limited data for ${dimension.key}`;
      }

      switch (dimension.key) {
        case "major":
          return "academic background is quite different";
        case "gradSchoolGoal":
          return "graduate school plans are far apart";
        case "careerDirection":
          return "career direction is not very aligned";
        case "tags":
          return "shared interests are limited";
        case "gpaGoal":
          return "academic expectations differ noticeably";
        default:
          return `${dimension.key} is weakly aligned`;
      }
    })
    .slice(0, 3);
}

function scoreBand(score) {
  return SCORE_BANDS.find((band) => score >= band.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

function toPublicBreakdown(dimensions, weights) {
  return Object.fromEntries(
    Object.entries(dimensions).map(([key, dimension]) => [
      key,
      {
        score: dimension.score,
        weight: weights[key],
        weightedContribution:
          dimension.score == null ? 0 : Number((dimension.score * weights[key]).toFixed(2)),
        signal: describeSignal(dimension.score),
        reason: dimension.reason,
        detail: dimension.detail,
      },
    ])
  );
}

export function calculateChemistryScore(sourceProfile, candidateProfile, customWeights = {}) {
  const { weights, profileName } = resolveWeightConfig(customWeights);
  const source = normalizeProfile(sourceProfile);
  const candidate = normalizeProfile(candidateProfile);

  const dimensions = {
    major: scoreExactOrCluster("major", source.major, candidate.major, majorCluster),
    gpaGoal: scoreGpa(source.gpaGoal, candidate.gpaGoal),
    gradSchoolGoal: scoreExactOrCluster(
      "gradSchoolGoal",
      source.gradSchoolGoal,
      candidate.gradSchoolGoal,
      gradGoalCluster
    ),
    careerDirection: scoreExactOrCluster(
      "careerDirection",
      source.careerDirection,
      candidate.careerDirection,
      careerCluster
    ),
    tags: scoreTags(
      source.academicTags,
      candidate.academicTags,
      source.hobbies,
      candidate.hobbies
    ),
  };

  let weightedTotal = 0;
  let totalWeight = 0;

  for (const [key, dimension] of Object.entries(dimensions)) {
    if (dimension.score == null) continue;
    weightedTotal += dimension.score * weights[key];
    totalWeight += weights[key];
  }

  const rawScore = totalWeight > 0 ? weightedTotal / totalWeight : 0;
  const score = Math.round(rawScore);
  const band = scoreBand(score);
  const highlights = buildHighlights(dimensions);
  const cautions = buildCautions(dimensions);
  const sharedTraits = {
    academicTags: dimensions.tags.detail?.sharedAcademicTags ?? [],
    hobbies: dimensions.tags.detail?.sharedHobbies ?? [],
    sameMajorCluster: dimensions.major.shared,
    sameCareerCluster: dimensions.careerDirection.shared,
    sameGradGoalCluster: dimensions.gradSchoolGoal.shared,
  };
  const availableDimensions = Object.values(dimensions).filter(
    (dimension) => dimension.score != null
  ).length;

  return {
    score,
    label: band.label,
    tier: band.tier,
    weightProfile: profileName,
    highlights,
    cautions,
    breakdown: toPublicBreakdown(dimensions, weights),
    sharedTraits,
    coverage: {
      availableDimensions,
      totalDimensions: Object.keys(dimensions).length,
      ratio: Number((availableDimensions / Object.keys(dimensions).length).toFixed(2)),
    },
    sourceId: source.id,
    candidateId: candidate.id,
    isCandidateVerified: candidate.isVerified,
  };
}
