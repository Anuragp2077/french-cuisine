# Leaderboard integration

The shared leaderboard is connected directly through LEADR's client API.
Configuration is in `src/lib/leaderboard.js`:

- Game ID: the public game ID shown in the LEADR dashboard.
- Board UUID: the board ID shown in LEADR. The code uses the UUID for score
  queries and submissions.

The browser creates a client session with LEADR Cloud, requests a single-use
nonce, and sends the score with that nonce. Session tokens refresh
automatically. Do not put an admin API key in the frontend or in a `VITE_`
environment variable; Vite embeds those values in publicly served JavaScript.

The score form displays an error instead of reporting success when LEADR
rejects a score. The leaderboard also reports load errors rather than silently
showing local-only scores.
