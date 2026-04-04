# Recommendation Contract

This file defines the current handoff contract for the algorithm module.

## Input profile

```json
{
  "id": "u1001",
  "realName": "Alice",
  "major": "Computer Science",
  "gpaGoal": "3.8/4.0",
  "gradSchoolGoal": "MS in AI in the US",
  "careerDirection": "AI Engineer",
  "academicTags": ["machine learning", "research"],
  "hobbies": ["badminton", "guitar"],
  "isVerified": true
}
```

## Score output

```json
{
  "score": 82,
  "label": "Strong Fit",
  "tier": "A",
  "weightProfile": "academic_strict",
  "highlights": [
    "similar academic background",
    "aligned graduate school plans"
  ],
  "cautions": [],
  "breakdown": {
    "major": {
      "score": 78,
      "weight": 0.32,
      "weightedContribution": 24.96,
      "signal": "strong",
      "reason": "Same semantic cluster",
      "detail": "computing"
    }
  },
  "sharedTraits": {
    "academicTags": ["machine learning"],
    "hobbies": ["guitar"],
    "sameMajorCluster": true,
    "sameCareerCluster": true,
    "sameGradGoalCluster": true
  },
  "coverage": {
    "availableDimensions": 5,
    "totalDimensions": 5,
    "ratio": 1
  },
  "sourceId": "u1001",
  "candidateId": "u1002",
  "isCandidateVerified": true
}
```

## Recommendation payload

Use `buildRecommendationPayload(sourceProfile, candidateProfiles, options)` when the app needs a full ranked response.

```json
{
  "sourceUserId": "u1001",
  "generatedAt": "2026-03-30T00:00:00.000Z",
  "filters": {
    "verifiedOnly": true,
    "minScore": 20,
    "limit": 10,
    "weightProfile": "social_balanced",
    "excludeSeen": true,
    "onlineLearningEnabled": true,
    "timeDecayEnabled": true,
    "frequencyControlEnabled": true,
    "diversityEnabled": true
  },
  "onlineLearning": {
    "enabled": true,
    "isActive": true,
    "sampleSize": 4,
    "confidence": 0.92,
    "adaptiveWeights": {},
    "preferenceStrengths": {},
    "preferredTraits": {}
  },
  "totalCandidatesConsidered": 50,
  "totalMatchesReturned": 10,
  "matches": [
    {
      "rank": 1,
      "candidateId": "u1002",
      "finalScore": 78.5,
      "profilePreview": {
        "realName": "Brian",
        "major": "Data Science",
        "careerDirection": "ML Engineer",
        "academicTags": ["machine learning", "research"],
        "hobbies": ["badminton"]
      },
      "chemistry": {},
      "reranking": {
        "preDiversityScore": 82,
        "adjustedScore": 78.5,
        "deltaFromChemistry": -3.5,
        "negativeFeedbackPenalty": {},
        "onlineLearningBoost": {},
        "coldStartBoost": {},
        "sessionFrequencyPenalty": {},
        "diversityPenalty": {},
        "explanation": []
      }
    }
  ]
}
```

## Integration notes

- `verifiedOnly` defaults to `true`.
- `limit` is optional.
- `weightProfile` defaults to `academic_strict`.
- `excludeSeen` defaults to `true`.
- `timeDecay.enabled` defaults to `true`.
- `timeDecay.halfLifeDays` defaults to `30`.
- `onlineLearning.enabled` defaults to `true`.
- positive actions currently include `right`, `like`, `super_like`, `match`.
- `onlineLearning.adaptiveWeights` reflects weight shifts learned from recent positive feedback.
- `onlineLearning.explorationBalance` controls how much novelty is protected against over-exploitation.
- `onlineLearning.negativeHedgeStrength` lets recent dislikes counteract positive preference drift.
- `frequencyControl.enabled` defaults to `true`.
- `sessionHistory` can contain recently shown candidates from the current feed session.
- `debugLog` contains per-candidate score deltas and reason traces for debugging.
- `diversity.enabled` defaults to `true`.
- `interactionHistory` can include `{ action, candidateId }` or `{ action, profile }`.
- `interactionHistory` may include `timestamp`, `createdAt`, `swipedAt`, or `occurredAt`.
- negative actions currently include `left`, `pass`, `dislike`, `report`, `block`.
- `finalScore` is the score after penalties and cold-start boosts.
- `score` is always `0-100`.
- Missing profile fields reduce `coverage` and may lower explanation quality.
