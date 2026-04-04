import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

import sampleUsers from "../data/sampleUsers.json" with { type: "json" };
import {
  buildRecommendationPayload,
  buildRecommendationDebugLog,
  buildOnlineLearningModel,
  calculateChemistryScore,
  calculateOnlineLearningBoost,
  handleHealthRequest,
  handleRecommendRequest,
  handleScoreRequest,
  listWeightProfiles,
  rankCandidates,
  writeRecommendationDebugLog,
} from "../src/index.js";

test("similar profiles should score higher than distant profiles", () => {
  const [alice, brian, carol] = sampleUsers;

  const closeMatch = calculateChemistryScore(alice, brian);
  const weakMatch = calculateChemistryScore(alice, carol);

  assert.ok(closeMatch.score > weakMatch.score);
  assert.ok(closeMatch.score >= 60);
});

test("ranking should exclude unverified profiles by default", () => {
  const [alice, ...candidates] = sampleUsers;
  const ranked = rankCandidates(alice, candidates);

  assert.equal(ranked.some((result) => result.profile.id === "u1005"), false);
});

test("ranking should sort by score and keep distant profiles near the bottom", () => {
  const [alice, ...candidates] = sampleUsers;
  const ranked = rankCandidates(alice, candidates);

  assert.ok(ranked[0].chemistry.score >= ranked[1].chemistry.score);
  assert.equal(ranked[ranked.length - 1].profile.id, "u1003");
});

test("chemistry score should include explanation metadata", () => {
  const [alice, brian] = sampleUsers;
  const result = calculateChemistryScore(alice, brian);

  assert.equal(typeof result.label, "string");
  assert.equal(typeof result.tier, "string");
  assert.equal(result.weightProfile, "academic_strict");
  assert.ok(Array.isArray(result.highlights));
  assert.ok(result.breakdown.major);
  assert.equal(result.coverage.totalDimensions, 5);
});

test("recommendation payload should honor ranking filters and shape", () => {
  const [alice, ...candidates] = sampleUsers;
  const payload = buildRecommendationPayload(alice, candidates, {
    minScore: 40,
    limit: 2,
  });

  assert.equal(payload.sourceUserId, "u1001");
  assert.equal(payload.matches.length, 2);
  assert.equal(payload.filters.limit, 2);
  assert.equal(payload.filters.weightProfile, "academic_strict");
  assert.equal(payload.filters.onlineLearningEnabled, true);
  assert.equal(payload.filters.frequencyControlEnabled, true);
  assert.ok(payload.onlineLearning);
  assert.ok(payload.debugLog);
  assert.ok(payload.matches[0].finalScore >= payload.matches[1].finalScore);
  assert.ok(payload.matches[0].reranking);
});

test("different weight profiles should be discoverable and usable", () => {
  const [alice, brian] = sampleUsers;
  const profiles = listWeightProfiles();
  const academicResult = calculateChemistryScore(alice, brian, {
    weightProfile: "academic_strict",
  });
  const socialResult = calculateChemistryScore(alice, brian, {
    weightProfile: "social_balanced",
  });

  assert.ok(profiles.includes("academic_strict"));
  assert.ok(profiles.includes("social_balanced"));
  assert.equal(socialResult.weightProfile, "social_balanced");
  assert.notEqual(academicResult.score, socialResult.score);
});

test("api handlers should return development-friendly response payloads", () => {
  const [alice, ...candidates] = sampleUsers;
  const health = handleHealthRequest();
  const score = handleScoreRequest({
    sourceProfile: alice,
    candidateProfile: candidates[0],
    options: { weightProfile: "career_focused" },
  });
  const recommend = handleRecommendRequest({
    sourceProfile: alice,
    candidateProfiles: candidates,
    options: { limit: 2 },
  });

  assert.equal(health.status, 200);
  assert.equal(score.status, 200);
  assert.equal(score.body.data.chemistry.weightProfile, "career_focused");
  assert.equal(recommend.status, 200);
  assert.equal(recommend.body.data.matches.length, 2);
});

test("seen candidates should be filtered out by default", () => {
  const [alice, ...candidates] = sampleUsers;
  const ranked = rankCandidates(alice, candidates, {
    seenCandidateIds: ["u1004"],
  });

  assert.equal(ranked.some((result) => result.profile.id === "u1004"), false);
});

test("session history should dedupe exact candidates and frequency-control similar recent types", () => {
  const source = {
    id: "s-session",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const candidates = [
    {
      id: "same-session-candidate",
      realName: "Already Shown",
      major: "Software Engineering",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "ML Engineer",
      academicTags: ["research"],
      hobbies: ["guitar"],
      isVerified: true,
    },
    {
      id: "similar-tech-candidate",
      realName: "Similar Tech",
      major: "Data Science",
      gpaGoal: "3.3/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "Software Engineer",
      academicTags: ["machine learning"],
      hobbies: ["chess"],
      isVerified: true,
    },
    {
      id: "different-candidate",
      realName: "Different",
      major: "Finance",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "Financial Analyst",
      academicTags: ["presentation"],
      hobbies: ["travel"],
      isVerified: true,
    },
  ];

  const withoutFrequencyControl = rankCandidates(source, candidates, {
    excludeSeen: false,
    sourceInteractionCount: 20,
    sessionHistory: [
      {
        candidateId: "same-session-candidate",
        profile: {
          id: "same-session-candidate",
          major: "Software Engineering",
          gradSchoolGoal: "MS in the US",
          careerDirection: "ML Engineer",
          academicTags: ["research"],
          hobbies: ["guitar"],
        },
      },
      {
        candidateId: "recent-tech",
        profile: {
          id: "recent-tech",
          major: "Computer Science",
          gradSchoolGoal: "MS in the US",
          careerDirection: "Software Engineer",
          academicTags: ["machine learning"],
          hobbies: ["guitar"],
        },
      },
    ],
    frequencyControl: {
      enabled: false,
      excludeSessionSeen: true,
    },
    diversity: { enabled: false },
    onlineLearning: { enabled: false },
  });

  const ranked = rankCandidates(source, candidates, {
    excludeSeen: false,
    sourceInteractionCount: 20,
    sessionHistory: [
      {
        candidateId: "same-session-candidate",
        profile: {
          id: "same-session-candidate",
          major: "Software Engineering",
          gradSchoolGoal: "MS in the US",
          careerDirection: "ML Engineer",
          academicTags: ["research"],
          hobbies: ["guitar"],
        },
      },
      {
        candidateId: "recent-tech",
        profile: {
          id: "recent-tech",
          major: "Computer Science",
          gradSchoolGoal: "MS in the US",
          careerDirection: "Software Engineer",
          academicTags: ["machine learning"],
          hobbies: ["guitar"],
        },
      },
    ],
    frequencyControl: {
      enabled: true,
      excludeSessionSeen: true,
      exactMajorPenalty: 10,
      majorClusterPenalty: 8,
      careerClusterPenalty: 6,
      maxPenalty: 20,
    },
    diversity: { enabled: false },
    onlineLearning: { enabled: false },
  });

  assert.equal(ranked.some((result) => result.profile.id === "same-session-candidate"), false);
  const similarTech = ranked.find((result) => result.profile.id === "similar-tech-candidate");
  const similarTechWithoutFrequency = withoutFrequencyControl.find(
    (result) => result.profile.id === "similar-tech-candidate"
  );
  assert.ok(similarTech.reranking.sessionFrequencyPenalty.totalPenalty > 0);
  assert.ok(similarTech.finalScore < similarTechWithoutFrequency.finalScore);
});

test("negative feedback should penalize candidates similar to disliked profiles", () => {
  const source = {
    id: "s1",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const dislikedFinanceProfile = {
    id: "past-finance",
    major: "Finance",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "Job after graduation",
    careerDirection: "Investment Banking",
    academicTags: ["finance", "case competition"],
    hobbies: ["travel"],
    isVerified: true,
  };

  const candidates = [
    {
      id: "finance-now",
      realName: "Finance Candidate",
      major: "Finance",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "Job after graduation",
      careerDirection: "Investment Banking",
      academicTags: ["finance"],
      hobbies: ["travel"],
      isVerified: true,
    },
    {
      id: "cs-now",
      realName: "CS Candidate",
      major: "Computer Science",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "AI Engineer",
      academicTags: ["machine learning"],
      hobbies: ["guitar"],
      isVerified: true,
    },
  ];

  const ranked = rankCandidates(source, candidates, {
    interactionHistory: [
      {
        action: "left",
        profile: dislikedFinanceProfile,
      },
    ],
    excludeSeen: false,
  });

  const penalizedCandidate = ranked.find((result) => result.profile.id === "finance-now");
  const unaffectedCandidate = ranked.find((result) => result.profile.id === "cs-now");

  assert.ok(penalizedCandidate.reranking.negativeFeedbackPenalty.totalPenalty > 0);
  assert.ok(
    penalizedCandidate.finalScore < penalizedCandidate.chemistry.score
  );
  assert.ok(
    penalizedCandidate.finalScore < unaffectedCandidate.finalScore
  );
});

test("online learning should learn recent positive preferences and boost matching candidates", () => {
  const source = {
    id: "s-online",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const candidates = [
    {
      id: "tech-candidate",
      realName: "Tech Candidate",
      major: "Software Engineering",
      gpaGoal: "3.2/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "Product Designer",
      academicTags: ["robotics"],
      hobbies: ["basketball"],
      isVerified: true,
    },
    {
      id: "finance-candidate",
      realName: "Finance Candidate",
      major: "Finance",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "Financial Analyst",
      academicTags: ["case competition", "presentation"],
      hobbies: ["travel", "guitar"],
      isVerified: true,
    },
  ];

  const withoutLearning = rankCandidates(source, candidates, {
    excludeSeen: false,
    sourceInteractionCount: 20,
    onlineLearning: {
      enabled: false,
    },
    diversity: { enabled: false },
  });

  const withLearning = rankCandidates(source, candidates, {
    excludeSeen: false,
    sourceInteractionCount: 20,
    interactionHistory: [
      {
        action: "super_like",
        timestamp: "2026-03-29T00:00:00.000Z",
        profile: {
          id: "liked-1",
          major: "Finance",
          gpaGoal: "3.8/4.0",
          gradSchoolGoal: "MS in the US",
          careerDirection: "Financial Analyst",
          academicTags: ["case competition", "presentation"],
          hobbies: ["travel"],
          isVerified: true,
        },
      },
      {
        action: "like",
        timestamp: "2026-03-28T00:00:00.000Z",
        profile: {
          id: "liked-2",
          major: "Economics",
          gpaGoal: "3.7/4.0",
          gradSchoolGoal: "MS in the US",
          careerDirection: "Financial Analyst",
          academicTags: ["presentation", "finance"],
          hobbies: ["travel"],
          isVerified: true,
        },
      },
    ],
    onlineLearning: {
      enabled: true,
      maxBoost: 20,
      minPositiveSignals: 2,
    },
    diversity: { enabled: false },
    timeDecay: {
      enabled: true,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  });

  assert.equal(withoutLearning[0].profile.id, "tech-candidate");
  assert.equal(withLearning[0].profile.id, "finance-candidate");
  assert.ok(withLearning[0].reranking.onlineLearningBoost.totalBoost > 0);
});

test("online learning model should expose adaptive weights and preferred traits", () => {
  const model = buildOnlineLearningModel({
    weightProfile: "academic_strict",
    interactionHistory: [
      {
        action: "super_like",
        timestamp: "2026-03-29T00:00:00.000Z",
        profile: {
          id: "liked-1",
          major: "Software Engineering",
          gpaGoal: "3.8/4.0",
          gradSchoolGoal: "MS in AI in the US",
          careerDirection: "ML Engineer",
          academicTags: ["research", "hackathon"],
          hobbies: ["guitar"],
        },
      },
      {
        action: "right",
        timestamp: "2026-03-27T00:00:00.000Z",
        profile: {
          id: "liked-2",
          major: "Data Science",
          gpaGoal: "3.7/4.0",
          gradSchoolGoal: "MS in the US",
          careerDirection: "Software Engineer",
          academicTags: ["research", "machine learning"],
          hobbies: ["badminton"],
        },
      },
    ],
    timeDecay: {
      enabled: true,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  });

  const boost = calculateOnlineLearningBoost(
    {
      id: "candidate",
      major: "Software Engineering",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in AI in the US",
      careerDirection: "ML Engineer",
      academicTags: ["research"],
      hobbies: ["guitar"],
      isVerified: true,
    },
    model
  );

  assert.equal(model.isActive, true);
  assert.ok(model.confidence > 0);
  assert.ok(model.adaptiveWeights.major > 0);
  assert.ok(model.preferredTraits.majorCluster);
  assert.ok(boost.totalBoost > 0);
});

test("exploration balance should keep some room for novel low-exposure candidates", () => {
  const model = buildOnlineLearningModel({
    interactionHistory: [
      {
        action: "super_like",
        timestamp: "2026-03-29T00:00:00.000Z",
        profile: {
          id: "liked-1",
          major: "Software Engineering",
          gpaGoal: "3.8/4.0",
          gradSchoolGoal: "MS in AI in the US",
          careerDirection: "ML Engineer",
          academicTags: ["research", "hackathon"],
          hobbies: ["guitar"],
        },
      },
      {
        action: "like",
        timestamp: "2026-03-28T00:00:00.000Z",
        profile: {
          id: "liked-2",
          major: "Data Science",
          gpaGoal: "3.7/4.0",
          gradSchoolGoal: "MS in the US",
          careerDirection: "Software Engineer",
          academicTags: ["machine learning", "research"],
          hobbies: ["badminton"],
        },
      },
    ],
    onlineLearning: {
      enabled: true,
      explorationBalance: 0.8,
      maxExplorationBoost: 8,
    },
    timeDecay: {
      enabled: true,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  });

  const familiarCandidate = calculateOnlineLearningBoost(
    {
      id: "familiar",
      major: "Software Engineering",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in AI in the US",
      careerDirection: "ML Engineer",
      academicTags: ["research"],
      hobbies: ["guitar"],
      isVerified: true,
    },
    model,
    {
      candidateStats: {
        familiar: { exposureCount: 12 },
      },
    }
  );

  const novelCandidate = calculateOnlineLearningBoost(
    {
      id: "novel",
      major: "Finance",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the UK",
      careerDirection: "Financial Analyst",
      academicTags: ["presentation"],
      hobbies: ["travel"],
      isVerified: true,
    },
    model,
    {
      candidateStats: {
        novel: { exposureCount: 1 },
      },
    }
  );

  assert.ok(novelCandidate.explorationBoost > 0);
  assert.ok(novelCandidate.explorationBoost > familiarCandidate.explorationBoost);
});

test("negative hedge should reduce online learning boost for recently disliked traits", () => {
  const candidate = {
    id: "finance-candidate",
    major: "Finance",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "Financial Analyst",
    academicTags: ["case competition", "presentation"],
    hobbies: ["travel", "guitar"],
    isVerified: true,
  };

  const positiveOnlyModel = buildOnlineLearningModel({
    interactionHistory: [
      {
        action: "super_like",
        timestamp: "2026-03-29T00:00:00.000Z",
        profile: candidate,
      },
      {
        action: "like",
        timestamp: "2026-03-28T00:00:00.000Z",
        profile: {
          ...candidate,
          id: "finance-candidate-2",
          major: "Economics",
        },
      },
    ],
    timeDecay: {
      enabled: true,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  });

  const hedgedModel = buildOnlineLearningModel({
    interactionHistory: [
      {
        action: "super_like",
        timestamp: "2026-03-29T00:00:00.000Z",
        profile: candidate,
      },
      {
        action: "like",
        timestamp: "2026-03-28T00:00:00.000Z",
        profile: {
          ...candidate,
          id: "finance-candidate-2",
          major: "Economics",
        },
      },
      {
        action: "left",
        timestamp: "2026-03-30T00:00:00.000Z",
        profile: candidate,
      },
    ],
    onlineLearning: {
      enabled: true,
      negativeHedgeStrength: 1,
      maxNegativeHedgePenalty: 10,
    },
    timeDecay: {
      enabled: true,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  });

  const positiveOnlyBoost = calculateOnlineLearningBoost(candidate, positiveOnlyModel, {
    candidateStats: {
      "finance-candidate": { exposureCount: 2 },
    },
  });
  const hedgedBoost = calculateOnlineLearningBoost(candidate, hedgedModel, {
    candidateStats: {
      "finance-candidate": { exposureCount: 2 },
    },
  });

  assert.ok(hedgedBoost.hedgePenalty > 0);
  assert.ok(hedgedBoost.totalBoost < positiveOnlyBoost.totalBoost);
});

test("observability debug log should capture score deltas and be writable", async () => {
  const [alice, ...candidates] = sampleUsers;
  const ranked = rankCandidates(alice, candidates, {
    limit: 2,
  });
  const debugLog = buildRecommendationDebugLog(alice, ranked, {
    observability: {
      enabled: true,
      includePerCandidate: true,
      maxCandidateLogs: 5,
    },
  }, {
    totalCandidatesConsidered: candidates.length,
  });

  assert.ok(debugLog);
  assert.equal(debugLog.summary.consideredCandidates, candidates.length);
  assert.ok(debugLog.candidates.length > 0);
  assert.ok("negativeFeedback" in debugLog.candidates[0].deltas);
  assert.ok("sessionFrequency" in debugLog.candidates[0].deltas);

  const targetPath = path.join(
    "/Users/labyr1nth/Desktop/bnbu-dating/bnbu-dating-algorithms",
    "tmp",
    "recommendation-debug-log.json"
  );
  await writeRecommendationDebugLog(targetPath, debugLog);
  const saved = JSON.parse(await readFile(targetPath, "utf8"));

  assert.equal(saved.sourceUserId, debugLog.sourceUserId);
  assert.equal(saved.candidates.length, debugLog.candidates.length);
});

test("older negative feedback should decay and penalize less than recent feedback", () => {
  const source = {
    id: "s-decay",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const candidate = {
    id: "finance-target",
    realName: "Finance Target",
    major: "Finance",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "Job after graduation",
    careerDirection: "Investment Banking",
    academicTags: ["finance"],
    hobbies: ["travel"],
    isVerified: true,
  };

  const oldPenalty = rankCandidates(source, [candidate], {
    excludeSeen: false,
    interactionHistory: [
      {
        action: "left",
        timestamp: "2025-01-01T00:00:00.000Z",
        profile: candidate,
      },
    ],
    timeDecay: {
      enabled: true,
      halfLifeDays: 30,
      minMultiplier: 0.2,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  })[0];

  const recentPenalty = rankCandidates(source, [candidate], {
    excludeSeen: false,
    interactionHistory: [
      {
        action: "left",
        timestamp: "2026-03-25T00:00:00.000Z",
        profile: candidate,
      },
    ],
    timeDecay: {
      enabled: true,
      halfLifeDays: 30,
      minMultiplier: 0.2,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  })[0];

  assert.ok(
    oldPenalty.reranking.negativeFeedbackPenalty.totalPenalty <
      recentPenalty.reranking.negativeFeedbackPenalty.totalPenalty
  );
  assert.ok(
    oldPenalty.reranking.negativeFeedbackPenalty.reasons[0].decayMultiplier <
      recentPenalty.reranking.negativeFeedbackPenalty.reasons[0].decayMultiplier
  );
});

test("time decay can be disabled for full historical penalty strength", () => {
  const source = {
    id: "s-nodecay",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const candidate = {
    id: "finance-target",
    realName: "Finance Target",
    major: "Finance",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "Job after graduation",
    careerDirection: "Investment Banking",
    academicTags: ["finance"],
    hobbies: ["travel"],
    isVerified: true,
  };

  const decayed = rankCandidates(source, [candidate], {
    excludeSeen: false,
    interactionHistory: [
      {
        action: "left",
        timestamp: "2025-01-01T00:00:00.000Z",
        profile: candidate,
      },
    ],
    timeDecay: {
      enabled: true,
      halfLifeDays: 30,
      minMultiplier: 0.2,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  })[0];

  const fullPenalty = rankCandidates(source, [candidate], {
    excludeSeen: false,
    interactionHistory: [
      {
        action: "left",
        timestamp: "2025-01-01T00:00:00.000Z",
        profile: candidate,
      },
    ],
    timeDecay: {
      enabled: false,
      referenceTime: "2026-03-30T00:00:00.000Z",
    },
  })[0];

  assert.ok(
    decayed.reranking.negativeFeedbackPenalty.totalPenalty <
      fullPenalty.reranking.negativeFeedbackPenalty.totalPenalty
  );
  assert.equal(fullPenalty.reranking.negativeFeedbackPenalty.reasons[0].decayMultiplier, 1);
});

test("cold-start boost should reward complete and low-exposure profiles", () => {
  const source = {
    id: "s1",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const candidates = [
    {
      id: "high-complete",
      realName: "High Complete",
      major: "Data Science",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "ML Engineer",
      academicTags: ["machine learning", "research"],
      hobbies: ["guitar", "badminton"],
      isVerified: true,
    },
    {
      id: "sparse-profile",
      realName: "Sparse",
      major: "",
      gpaGoal: "",
      gradSchoolGoal: "",
      careerDirection: "",
      academicTags: [],
      hobbies: [],
      isVerified: true,
    },
  ];

  const ranked = rankCandidates(source, candidates, {
    sourceInteractionCount: 1,
    candidateStats: {
      "high-complete": { exposureCount: 1 },
      "sparse-profile": { exposureCount: 20 },
    },
    excludeSeen: false,
  });

  const boostedCandidate = ranked.find((result) => result.profile.id === "high-complete");
  const sparseCandidate = ranked.find((result) => result.profile.id === "sparse-profile");

  assert.ok(boostedCandidate.reranking.coldStartBoost.totalBoost > 0);
  assert.ok(boostedCandidate.finalScore > boostedCandidate.chemistry.score);
  assert.ok(
    boostedCandidate.reranking.coldStartBoost.totalBoost >
      sparseCandidate.reranking.coldStartBoost.totalBoost
  );
});

test("diversity constraint should avoid stacking the top results with the same type", () => {
  const source = {
    id: "src-diversity",
    realName: "Source",
    major: "Computer Science",
    gpaGoal: "3.8/4.0",
    gradSchoolGoal: "MS in the US",
    careerDirection: "AI Engineer",
    academicTags: ["machine learning", "research"],
    hobbies: ["guitar"],
    isVerified: true,
  };

  const candidates = [
    {
      id: "c1",
      realName: "Candidate 1",
      major: "Software Engineering",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "ML Engineer",
      academicTags: ["machine learning", "research"],
      hobbies: ["guitar"],
      isVerified: true,
    },
    {
      id: "c2",
      realName: "Candidate 2",
      major: "Data Science",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "Software Engineer",
      academicTags: ["machine learning"],
      hobbies: ["guitar"],
      isVerified: true,
    },
    {
      id: "c3",
      realName: "Candidate 3",
      major: "Finance",
      gpaGoal: "3.8/4.0",
      gradSchoolGoal: "MS in the US",
      careerDirection: "Financial Analyst",
      academicTags: ["machine learning", "research"],
      hobbies: ["guitar"],
      isVerified: true,
    },
  ];

  const withoutDiversity = rankCandidates(source, candidates, {
    excludeSeen: false,
    diversity: { enabled: false },
  });
  const withDiversity = rankCandidates(source, candidates, {
    excludeSeen: false,
    diversity: {
      enabled: true,
      exactMajorPenalty: 10,
      majorClusterPenalty: 10,
      careerClusterPenalty: 8,
      gradGoalPenalty: 0,
      maxPenalty: 20,
    },
  });

  assert.equal(withoutDiversity[0].profile.id, "c1");
  assert.equal(withoutDiversity[1].profile.id, "c2");
  assert.equal(withDiversity[0].profile.id, "c1");
  assert.equal(withDiversity[1].profile.id, "c3");
  assert.ok(withDiversity[1].reranking.diversityPenalty.totalPenalty > 0 || withDiversity[2].reranking.diversityPenalty.totalPenalty > 0);
});
