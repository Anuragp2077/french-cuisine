# Leaderboard setup

The site submits scores to the LEADR client API and refreshes the board every
five seconds. The game ID and board short code are configured in
`src/lib/leaderboard.js`; the integration creates a client session and obtains
a nonce before each score submission.

No LEADR admin API key belongs in browser code or a `VITE_` variable. Browser
bundles are public. If the client API requires admin credentials, use a
server-side proxy with credentials stored in the hosting provider's secret
environment variables.

The score form only reports success after LEADR accepts the submission. A
failed request stays visible on the game-over screen, and leaderboard load
errors are shown on the leaderboard page.
