# Local Service Usage

Start the local service:

```bash
npm start
```

Default address:

```text
http://localhost:4010
```

## Health check

```bash
curl http://localhost:4010/health
```

## Score a pair of users

```bash
curl -X POST http://localhost:4010/score \
  -H 'Content-Type: application/json' \
  -d '{
    "sourceProfile": {
      "id": "u1001",
      "realName": "Alice",
      "major": "Computer Science",
      "gpaGoal": "3.8/4.0",
      "gradSchoolGoal": "MS in AI in the US",
      "careerDirection": "AI Engineer",
      "academicTags": ["machine learning", "research"],
      "hobbies": ["guitar"],
      "isVerified": true
    },
    "candidateProfile": {
      "id": "u1002",
      "realName": "Brian",
      "major": "Data Science",
      "gpaGoal": "3.7/4.0",
      "gradSchoolGoal": "MS in the US",
      "careerDirection": "ML Engineer",
      "academicTags": ["machine learning", "python"],
      "hobbies": ["badminton"],
      "isVerified": true
    },
    "options": {
      "weightProfile": "academic_strict",
      "sourceInteractionCount": 3
    }
  }'
```

## Rank multiple users

```bash
curl -X POST http://localhost:4010/recommend \
  -H 'Content-Type: application/json' \
  -d '{
    "sourceProfile": {
      "id": "u1001",
      "realName": "Alice",
      "major": "Computer Science",
      "gpaGoal": "3.8/4.0",
      "gradSchoolGoal": "MS in AI in the US",
      "careerDirection": "AI Engineer",
      "academicTags": ["machine learning", "research"],
      "hobbies": ["guitar"],
      "isVerified": true
    },
    "candidateProfiles": [],
    "options": {
      "weightProfile": "social_balanced",
      "limit": 10,
      "minScore": 35,
      "excludeSeen": true,
      "timeDecay": {
        "enabled": true,
        "halfLifeDays": 30
      },
      "onlineLearning": {
        "enabled": true,
        "recentWindow": 12
      },
      "frequencyControl": {
        "enabled": true,
        "excludeSessionSeen": true
      },
      "diversity": {
        "enabled": true
      },
      "sessionHistory": [
        {
          "candidateId": "shown-1",
          "profile": {
            "id": "shown-1",
            "major": "Software Engineering",
            "careerDirection": "ML Engineer",
            "gradSchoolGoal": "MS in AI in the US",
            "academicTags": ["research"],
            "hobbies": ["guitar"]
          }
        }
      ],
      "seenCandidateIds": ["u1009"],
      "sourceInteractionCount": 2,
      "interactionHistory": [
        {
          "action": "super_like",
          "timestamp": "2026-03-28T12:00:00.000Z",
          "profile": {
            "id": "past-pos-1",
            "major": "Software Engineering",
            "gradSchoolGoal": "MS in AI in the US",
            "careerDirection": "ML Engineer",
            "academicTags": ["research", "hackathon"],
            "hobbies": ["guitar"]
          }
        },
        {
          "action": "left",
          "timestamp": "2026-02-20T12:00:00.000Z",
          "profile": {
            "id": "past-1",
            "major": "Finance",
            "gradSchoolGoal": "Job after graduation",
            "careerDirection": "Investment Banking",
            "academicTags": ["finance"],
            "hobbies": ["travel"]
          }
        }
      ],
      "candidateStats": {
        "u1002": { "exposureCount": 3 }
      }
    }
  }'
```

## Notes

- `weightProfile` can be overridden with custom `weights`.
- The service uses only local files in `bnbu-dating-algorithms`.
- It is meant for development and algorithm integration, not production deployment.
