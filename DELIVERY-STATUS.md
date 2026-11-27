# Kotoba Study delivery status

Status: local candidate ready for owner review; no GitHub repository was created and no public deployment was attempted.

- Path: `/Users/effyzheng/Desktop/projects/japanese-learning-log-web`
- Local preview: `http://127.0.0.1:8799/`
- Evidence: `/Users/effyzheng/Desktop/projects/japanese-learning-log-web-evidence/`
- Original private local application: `/Users/effyzheng/Desktop/projects/japanese-learning-log`
- Existing public portfolio exercise: `https://effyzhg.github.io/play/japanese-review/` (synthetic browser exercise; not this product)

The browser app is an independent static implementation. It uses 16 self-contained starter examples and user-entered/imported cards, browser-local SM-2-style schedules, and manual JSON export/import. The original local data, progress records, daily logs, and Git auto-backup behavior were not copied. This is not a synced service, a comprehensive JLPT deck, or an official assessment.

Validated in Chrome: review prompt/reveal/rating, keyboard rating, touch start/reveal/rating, persisted due date and settings after reload, add card, backup import/export, denied localStorage fallback, JavaScript-disabled preview, reduced motion, and 320/390/768/1440 px no-overflow checks. Twelve Node tests pass. See README and ARCHITECTURE for commands and boundaries.

Deployment remains unapproved. Required external action: create a dedicated `effyzhg` repository for this static product and enable Pages from its root. Keep the existing original repository private; do not transfer or publish its study records or third-party-derived vocabulary corpus. The current public `effyzhg.github.io` portfolio remains stable and its Japanese link still opens the clearly labeled synthetic review exercise until a separate product release has been approved and verified.
