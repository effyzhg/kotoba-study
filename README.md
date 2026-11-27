# Kotoba Study

A static, browser-based Japanese vocabulary practice tool. It is an independent modernization of ideas from the private local Japanese Learning Log; it does not bundle that repository's vocabulary corpus, study records, account, or Git backup workflow.

## Run locally

Requires Python 3 and a modern browser. No packages, build step, account, API key, network service, or database are required.

```sh
cd ~/Desktop/projects/japanese-learning-log-web
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. Stop the local server with `Ctrl+C`.

Run the logic tests with Node.js 18 or later:

```sh
cd ~/Desktop/projects/japanese-learning-log-web
npm test
```

## Use

1. Choose **Everyday words** or **My words**.
2. Set the number of new cards to introduce in a day. Cards already due are included first.
3. Start a session, recall the word, reveal the reading and meaning, then rate recall from Again to Easy.
4. Add your own cards in the word library. Export a JSON backup before moving to another browser or device; importing a backup replaces the current local data.

Space reveals an answer; keys `1` to `4` select Again, Hard, Good and Easy. Japanese speech uses the browser's built-in speech synthesis when available.

## Scheduling and data

The scheduler uses a small SM-2-style interval calculation. It is a learning aid, not a validated measure of retention. The included 16-word starter set is a small set of common examples, not an official JLPT list or complete course.

Cards, settings and review history are saved in the current browser's `localStorage`. They do not synchronize between devices and are not sent to a server. Clearing browser site data removes them. Use **Export backup** to keep a portable JSON copy. If storage is blocked, the current session still works in memory and the page shows a warning.

The static no-JavaScript view contains an example card and an explanation; interactive review needs JavaScript.

## Architecture

- `data/starter.json`: synthetic starter examples, separate from personal coursework datasets.
- `src/scheduler.js`: pure SM-2-style scheduling and due-first queue construction.
- `src/storage.js`: versioned browser state, import validation, and persistence fallback.
- `src/app.js`: accessible browser interaction, rendering, language/theme state, speech and data export/import.
- `style.css`: responsive product interface and reduced-motion behavior.

The app uses no external requests or dependencies. User-provided text is rendered as text or HTML-escaped before display. Imported backups are size-limited and schema-validated.

## AI assistance

This independent browser implementation was developed with AI assistance and reviewed against its local automated and browser checks. It is separate from the 2025 coursework repository; it does not imply that the coursework implementation included these browser-only capabilities.
