# BNBU Dating Algorithms

This folder is the standalone workspace for the algorithm side of the BNBU campus social app.

## Current scope

- Chemistry score calculation
- Candidate ranking
- API-ready recommendation payload
- Configurable weight profiles
- Lightweight local HTTP service
- Seen-profile deduplication
- Negative feedback penalty
- Online learning from recent positive interactions
- Time decay for older interaction history
- Cold-start exploration boost
- Session-level deduplication and frequency control
- Structured recommendation debug logs
- Sample input data
- Local tests that do not touch `bnbu-dating-main`

## Data shape

The current matcher works with lightweight profile objects like this:

```js
{
  id: "u1001",
  realName: "Alice",
  major: "Computer Science",
  gpaGoal: "3.8/4.0",
  gradSchoolGoal: "MS in AI in the US",
  careerDirection: "AI Engineer",
  academicTags: ["machine learning", "hackathon", "research"],
  hobbies: ["badminton", "guitar"],
  isVerified: true
}
```

## Scripts

```bash
npm test
npm run demo
npm start
```

## Matching logic

The score is a weighted average across:

- major similarity
- GPA goal similarity
- grad school goal similarity
- career direction similarity
- academic and hobby tag overlap

The current weighting is intentionally biased toward academic alignment because that matches the project PRD:

- `major`: 32%
- `gradSchoolGoal`: 24%
- `gpaGoal`: 18%
- `tags`: 14%
- `careerDirection`: 12%

By default, unverified profiles are filtered out during ranking.

Available weight profiles:

- `academic_strict`
- `social_balanced`
- `career_focused`
- `grad_school_focused`

## Recommendation policy layer

On top of base chemistry scoring, ranking now supports:

- `excludeSeen`: filter out profiles the user has already swiped on
- `interactionHistory`: apply negative-feedback penalties from `left`, `pass`, `report`, `block`
- `onlineLearning`: learn recent positive preferences from `right`, `like`, `super_like`, `match`
- `onlineLearning.explorationBalance`: reserve some traffic for novel candidates instead of only exploiting learned preferences
- `onlineLearning.negativeHedgeStrength`: use recent negative patterns to counterbalance positive preference learning
- `timeDecay`: reduce the weight of older negative interactions over time
- `sourceInteractionCount`: detect cold-start users
- `candidateStats[profileId].exposureCount`: add exploration boost for low-exposure profiles
- `sessionHistory`: recent candidates already shown in the current session
- `frequencyControl`: penalize same-type profiles that appear too often in the same session
- `diversity`: diversify top results so they are not all from the same major cluster or career type
- `observability`: emit structured per-candidate debug logs for analysis and demos

Each ranked result includes:

- `chemistry.score`: base compatibility score
- `finalScore`: reranked score after penalties and boosts
- `reranking.negativeFeedbackPenalty`
- `reranking.onlineLearningBoost`
- `reranking.onlineLearningBoost.explorationBoost`
- `reranking.onlineLearningBoost.hedgePenalty`
- `reranking.negativeFeedbackPenalty.reasons[].decayMultiplier`
- `reranking.coldStartBoost`
- `reranking.sessionFrequencyPenalty`
- `reranking.diversityPenalty`

For team demos or writeups, use:

- `buildRecommendationDebugLog(...)`
- `writeRecommendationDebugLog(filePath, debugLog)`

## Output shape

`calculateChemistryScore()` now returns:

- numeric `score`
- human-readable `label` and `tier`
- `highlights` and `cautions`
- weighted `breakdown`
- `sharedTraits`
- `coverage`

For backend or frontend integration, use `buildRecommendationPayload()`.

## Local service

Running `npm start` launches a small local server on `http://localhost:4010`.

Routes:

- `GET /health`
- `GET /profiles/sample`
- `POST /score`
- `POST /recommend`
