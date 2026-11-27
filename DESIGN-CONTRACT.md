# Product and design contract

## User and task

For a Japanese learner who wants a short, repeatable vocabulary practice session without creating an account or sending learning history to a service. The user can practise the starter words, create a personal deck, import/export a backup, and return to cards when their local schedule says they are due.

## Direction

“A small practice, kept close”: a quiet language-learning notebook, not a dashboard and not a clone of the portfolio. Deep botanical green marks action and recall; chalk paper and ink support reading; one large Japanese word anchors the practice moment. The display type uses the system sans stack and Japanese system fonts, avoiding downloaded assets. The title’s bold sans treatment intentionally differs from the old local tool’s compact settings-heavy interface.

## Hierarchy and responsive behavior

The introduction explains the habit and storage model. The left rail selects a deck and sets the new-card cap; the main area holds the next task and session feedback. The personal library follows practice so its add/import/export tools remain easy to find without competing with the primary practice action. On narrow screens the deck selector becomes a two-column chooser, settings stack above the practice area, rating buttons become a two-column set, and the library form stacks. The document remains naturally scrollable.

## States and recovery

- Ready: selected deck and due/new counts, an invitation to begin.
- Prompt: one Japanese word; keyboard Space or the reveal button shows its reading and meaning.
- Revealed: four ratings, each showing the computed next interval; focus moves to Again.
- Completed/empty: session summary or a clear no-cards state.
- Add/remove: validation feedback, explicit confirmation before removal.
- Storage unavailable: app remains usable in memory and announces that progress will not persist.
- Import error: current state remains unchanged; successful import replaces the local state and is stated clearly.
- Reduced motion: movement and entry animation collapse to near-instant state changes.
- No JavaScript: portfolio-like intro and a bilingual static example remain; interactive controls are hidden.

## Acceptance checks

- 320, 390, 768, 1440 px widths have no horizontal overflow.
- Mouse, keyboard and touch can complete a review.
- Rating changes an actual due date; reload restores schedule, language and theme.
- Storage denial leaves the task usable and warns about non-persistence.
- JSON import rejects malformed or oversized files without replacing current data.
- Reduced-motion removes visible travel; no-JavaScript content remains understandable.
- Browser render has no uncaught errors or failed local assets.
