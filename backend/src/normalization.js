const MAJOR_CLUSTERS = {
  computing: [
    "computer science",
    "software engineering",
    "data science",
    "artificial intelligence",
    "information engineering",
    "cyber security",
    "informatics",
  ],
  business: [
    "finance",
    "accounting",
    "economics",
    "business",
    "marketing",
    "management",
  ],
  engineering: [
    "electrical engineering",
    "mechanical engineering",
    "civil engineering",
    "materials engineering",
    "automation",
    "industrial engineering",
  ],
  natural_science: [
    "mathematics",
    "physics",
    "chemistry",
    "statistics",
    "biology",
  ],
  social_science: [
    "psychology",
    "education",
    "law",
    "public policy",
    "sociology",
    "politics",
  ],
  arts_media: [
    "design",
    "media",
    "journalism",
    "film",
    "music",
    "fine arts",
  ],
  language_humanities: [
    "english",
    "literature",
    "history",
    "philosophy",
    "linguistics",
    "translation",
  ],
};

const CAREER_CLUSTERS = {
  tech: [
    "software engineer",
    "ai engineer",
    "data scientist",
    "product manager",
    "ml engineer",
    "developer",
  ],
  finance: [
    "investment banking",
    "consulting",
    "financial analyst",
    "asset management",
    "auditor",
  ],
  academia: [
    "researcher",
    "phd",
    "professor",
    "academic",
    "scientist",
  ],
  public_service: [
    "civil servant",
    "public service",
    "ngo",
    "policy analyst",
    "teacher",
  ],
  creative: [
    "designer",
    "content creator",
    "journalist",
    "producer",
    "artist",
  ],
};

const GRAD_GOAL_CLUSTERS = {
  research_us: [
    "phd in the us",
    "ms in the us",
    "research in the us",
    "us graduate school",
  ],
  research_uk: [
    "phd in the uk",
    "ms in the uk",
    "research in the uk",
    "uk graduate school",
  ],
  domestic_grad: [
    "domestic graduate school",
    "master in china",
    "phd in china",
    "postgraduate exam",
  ],
  direct_work: [
    "job after graduation",
    "direct employment",
    "work first",
    "industry after college",
  ],
};

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function normalizeTextValue(value) {
  return normalizeText(value);
}

export function normalizeList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.map(normalizeText).filter(Boolean))];
}

export function normalizeProfile(profile) {
  return {
    id: String(profile.id ?? ""),
    realName: String(profile.realName ?? ""),
    major: normalizeText(profile.major),
    gpaGoal: normalizeText(profile.gpaGoal),
    gradSchoolGoal: normalizeText(profile.gradSchoolGoal),
    careerDirection: normalizeText(profile.careerDirection),
    academicTags: normalizeList(profile.academicTags),
    hobbies: normalizeList(profile.hobbies),
    isVerified: Boolean(profile.isVerified),
  };
}

function findCluster(value, clusters) {
  if (!value) return null;

  for (const [clusterName, entries] of Object.entries(clusters)) {
    if (entries.some((entry) => value.includes(entry) || entry.includes(value))) {
      return clusterName;
    }
  }

  return null;
}

export function majorCluster(value) {
  return findCluster(normalizeText(value), MAJOR_CLUSTERS);
}

export function careerCluster(value) {
  return findCluster(normalizeText(value), CAREER_CLUSTERS);
}

export function gradGoalCluster(value) {
  return findCluster(normalizeText(value), GRAD_GOAL_CLUSTERS);
}

export function parseGpaValue(value) {
  const text = normalizeText(value);
  if (!text) return null;

  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*[-~]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return (Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2;
  }

  const overFourMatch = text.match(/(\d+(?:\.\d+)?)\s*\/\s*4(?:\.0)?/);
  if (overFourMatch) {
    return Number(overFourMatch[1]);
  }

  const simpleMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (!simpleMatch) return null;

  const numericValue = Number(simpleMatch[1]);

  if (text.includes("%") || numericValue > 4.5) {
    return Math.min(4, numericValue / 25);
  }

  return Math.min(4, numericValue);
}

export function intersectLists(left, right) {
  const leftSet = new Set(normalizeList(left));
  const rightSet = new Set(normalizeList(right));

  return [...leftSet].filter((item) => rightSet.has(item));
}
