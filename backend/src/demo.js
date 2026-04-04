import sampleUsers from "../data/sampleUsers.json" with { type: "json" };
import { buildRecommendationPayload } from "./recommendationPayload.js";

const [currentUser, ...candidates] = sampleUsers;
const payload = buildRecommendationPayload(currentUser, candidates, {
  minScore: 20,
  limit: 3,
  weightProfile: "academic_strict",
  sourceInteractionCount: 2,
  candidateStats: {
    u1002: { exposureCount: 12 },
    u1003: { exposureCount: 4 },
    u1004: { exposureCount: 1 },
  },
  interactionHistory: [
    {
      action: "super_like",
      timestamp: "2026-03-29T10:00:00.000Z",
      profile: {
        id: "u3001",
        major: "Software Engineering",
        gpaGoal: "3.7/4.0",
        gradSchoolGoal: "MS in AI in the US",
        careerDirection: "ML Engineer",
        academicTags: ["research", "hackathon"],
        hobbies: ["guitar"],
      },
    },
    {
      action: "right",
      timestamp: "2026-03-27T10:00:00.000Z",
      profile: {
        id: "u3002",
        major: "Data Science",
        gpaGoal: "3.8/4.0",
        gradSchoolGoal: "MS in the US",
        careerDirection: "Software Engineer",
        academicTags: ["machine learning", "research"],
        hobbies: ["badminton"],
      },
    },
    {
      action: "left",
      timestamp: "2026-03-20T10:00:00.000Z",
      profile: {
        id: "u2001",
        major: "Finance",
        gradSchoolGoal: "Job after graduation",
        careerDirection: "Investment Banking",
        academicTags: ["finance", "presentation"],
        hobbies: ["travel"],
      },
    },
  ],
  onlineLearning: {
    enabled: true,
    maxBoost: 10,
  },
  sessionHistory: [
    {
      candidateId: "shown-1",
      profile: {
        id: "shown-1",
        major: "Software Engineering",
        gradSchoolGoal: "MS in AI in the US",
        careerDirection: "ML Engineer",
        academicTags: ["research"],
        hobbies: ["guitar"],
      },
    },
  ],
  timeDecay: {
    enabled: true,
    halfLifeDays: 21,
  },
});

console.log(`Current user: ${currentUser.realName}`);
console.log("Top matches:");
console.log(`Weight profile: ${payload.filters.weightProfile}`);
console.log(`Debug log entries: ${payload.debugLog?.candidates?.length ?? 0}`);

for (const result of payload.matches) {
  console.log(
    `- ${result.profilePreview.realName}: chemistry=${result.chemistry.score}, final=${result.finalScore}, online=${result.reranking.onlineLearningBoost.totalBoost}, session=${result.reranking.sessionFrequencyPenalty.totalPenalty} (${result.chemistry.highlights.join(", ") || "general fit"})`
  );
}
