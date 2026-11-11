# Leaderboard setup

The site submits scores to the LEADR client API and refreshes the board every
five seconds. The API host, game ID, and board UUID are configured in
`src/lib/leaderboard.js`. The integration creates a client session, obtains a
single-use nonce before each score submission, and refreshes expired sessions.

No LEADR admin API key belongs in browser code or a `VITE_` variable. Browser
bundles are public. If the client API requires admin credentials, use a
server-side proxy with credentials stored in the hosting provider's secret
environment variables.

The score form only reports success after LEADR accepts the submission. A
failed request stays visible on the game-over screen, and leaderboard load
errors are shown on the leaderboard page.
