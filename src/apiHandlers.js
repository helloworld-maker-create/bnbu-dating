import sampleUsers from "../data/sampleUsers.json" with { type: "json" };
import { calculateChemistryScore } from "./chemistryScore.js";
import { buildRecommendationPayload } from "./recommendationPayload.js";
import { listWeightProfiles } from "./weightProfiles.js";

function ok(data, status = 200) {
  return {
    status,
    body: {
      ok: true,
      data,
    },
  };
}

function fail(message, status = 400, details = null) {
  return {
    status,
    body: {
      ok: false,
      error: message,
      details,
    },
  };
}

export function handleHealthRequest() {
  return ok({
    service: "bnbu-dating-algorithms",
    status: "healthy",
    availableProfiles: listWeightProfiles(),
  });
}

export function handleSampleProfilesRequest() {
  return ok({
    count: sampleUsers.length,
    profiles: sampleUsers,
  });
}

export function handleScoreRequest(payload = {}) {
  if (!payload.sourceProfile || !payload.candidateProfile) {
    return fail("sourceProfile and candidateProfile are required");
  }

  return ok({
    chemistry: calculateChemistryScore(
      payload.sourceProfile,
      payload.candidateProfile,
      payload.options ?? {}
    ),
  });
}

export function handleRecommendRequest(payload = {}) {
  if (!payload.sourceProfile || !Array.isArray(payload.candidateProfiles)) {
    return fail("sourceProfile and candidateProfiles are required");
  }

  return ok(
    buildRecommendationPayload(
      payload.sourceProfile,
      payload.candidateProfiles,
      payload.options ?? {}
    )
  );
}
