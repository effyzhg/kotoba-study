# Architecture notes

Kotoba Study is a static single-page application with no server-side state.

```text
starter.json ─────┐
                  ├── app.js ── scheduler.js
user cards ───────┘       │
                           ├── storage.js ── browser localStorage
                           └── browser speech synthesis (optional)
```

## Data boundary

Each browser origin has its own local state. There is no registration, shared profile, sync, analytics, upload, or remote API. The backup JSON is the only supported cross-device transfer path. Backups are unencrypted files and should be stored as carefully as any personal learning record.

## Review model

Each card has `repetitions`, `easeFactor`, `intervalDays`, `dueDate`, `reviews`, and `lastReviewed`. Ratings map to SM-2 quality values: Again 0, Hard 3, Good 4, Easy 5. Failed recall resets the repetition count and schedules the next attempt for one day later. Successful recall advances through one day, six days, then the prior interval multiplied by the updated ease factor; Easy applies a modest 1.3 interval bonus. This is a deliberately small educational scheduler and is not a claim of formal SM-2 conformance or learning efficacy.

The new-card limit is counted by distinct cards reviewed for the first time on the local calendar day. Due reviews are always ahead of unseen cards. The session does not repeat a failed card in the same queue.

## Security and reliability

- No credentials or backend secrets exist in the app.
- Imported JSON is limited to 5 MB, validated for schema and field bounds, and shown through escaped text.
- A malformed or denied localStorage entry falls back to in-memory operation and a visible warning.
- Browser-local data is not encrypted by the application. Users should export and retain backups safely.
- The site is usable as a static product; a small no-script preview remains visible if JavaScript is disabled.

## Hosting

The app is compatible with static GitHub Pages hosting at a project root. Before publishing it to a new dedicated repository, the origin name, repository privacy, data-license decisions and final product URL must be reviewed. No remote repository or deployment was created as part of this local candidate.
