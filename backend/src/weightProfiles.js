import { DEFAULT_OPTIONS, DEFAULT_WEIGHTS, WEIGHT_PROFILES } from "./config.js";

function normalizeWeights(weights) {
  const entries = Object.entries(weights ?? {}).filter(([, value]) => typeof value === "number");
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (!entries.length || total <= 0) {
    return { ...DEFAULT_WEIGHTS };
  }

  return Object.fromEntries(
    entries.map(([key, value]) => [key, Number((value / total).toFixed(4))])
  );
}

export function listWeightProfiles() {
  return Object.keys(WEIGHT_PROFILES);
}

export function resolveWeightProfile(profileName = DEFAULT_OPTIONS.weightProfile) {
  const selectedProfile = WEIGHT_PROFILES[profileName] ?? DEFAULT_WEIGHTS;
  return {
    profileName: WEIGHT_PROFILES[profileName] ? profileName : DEFAULT_OPTIONS.weightProfile,
    weights: normalizeWeights(selectedProfile),
  };
}

export function resolveWeightConfig(optionsOrWeights = {}) {
  const looksLikeDirectWeights = ["major", "gpaGoal", "gradSchoolGoal", "careerDirection", "tags"]
    .some((key) => key in (optionsOrWeights ?? {}));

  if (looksLikeDirectWeights && !("weightProfile" in optionsOrWeights) && !("weights" in optionsOrWeights)) {
    return {
      profileName: "custom",
      weights: normalizeWeights(optionsOrWeights),
    };
  }

  const base = resolveWeightProfile(optionsOrWeights.weightProfile);
  const overrideWeights = optionsOrWeights.weights ?? {};

  if (!Object.keys(overrideWeights).length) {
    return base;
  }

  return {
    profileName: base.profileName === DEFAULT_OPTIONS.weightProfile ? "custom" : `${base.profileName}+custom`,
    weights: normalizeWeights({ ...base.weights, ...overrideWeights }),
  };
}
