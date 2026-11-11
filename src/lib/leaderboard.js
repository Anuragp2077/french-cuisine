const POLL_MS = 5000;
const LEADR_API_BASE = "https://api.leadr.gg/v1/client";
const LEADR_BOARD_CODE = "SEQRS";
const LEADR_GAME_ID = "gam_29f0a126-9f19-4a61-9916-6794b4b490a9";

let leadrSessionToken = null;
let leadrSessionPromise = null;

async function initLeadSession() {
  if (leadrSessionPromise) return leadrSessionPromise;

  leadrSessionPromise = (async () => {
    const response = await fetch(`${LEADR_API_BASE}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: LEADR_GAME_ID,
        client_fingerprint: "french-cuisine-build",
      }),
    });

    if (!response.ok) {
      throw new Error(`LEADR session initialization failed (${response.status})`);
    }

    const data = await response.json();
    leadrSessionToken = data.access_token ?? data.token;
    if (!leadrSessionToken) {
      throw new Error("LEADR session response did not include an access token");
    }

    return leadrSessionToken;
  })();

  try {
    return await leadrSessionPromise;
  } catch (error) {
    leadrSessionPromise = null;
    throw error;
  }
}

export async function getLeadNonce() {
  const token = leadrSessionToken || (await initLeadSession());
  const response = await fetch(`${LEADR_API_BASE}/nonce`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`LEADR nonce request failed (${response.status})`);
  }

  const data = await response.json();
  if (!data.nonce) {
    throw new Error("LEADR nonce response did not include a nonce");
  }

  return data.nonce;
}

export async function fetchLeaderboard() {
  const token = leadrSessionToken || (await initLeadSession());
  const response = await fetch(
    `${LEADR_API_BASE}/boards/${encodeURIComponent(LEADR_BOARD_CODE)}/scores?limit=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!response.ok) {
    throw new Error(`LEADR leaderboard request failed (${response.status})`);
  }

  const data = await response.json();
  return normalizeRows(data?.scores ?? data?.rows ?? data);
}

export async function submitScore(entry) {
  const row = normalizeEntry(entry);
  const nonce = await getLeadNonce();
  const response = await fetch(`${LEADR_API_BASE}/scores`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${leadrSessionToken}`,
      "leadr-client-nonce": nonce,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      board_id: LEADR_BOARD_CODE,
      player_name: row.name,
      value: row.score,
      value_display: row.score,
      metadata: {
        difficulty: row.difficulty,
        distance: row.distance,
        food: row.food,
        stars: row.stars,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`LEADR score submission failed (${response.status})`);
  }

  return row;
}

function normalizeEntry(entry) {
  return {
    name: String(entry.name || "Anonyme").trim().slice(0, 24) || "Anonyme",
    difficulty: String(entry.difficulty || "lunch"),
    score: finiteNumber(entry.score),
    distance: finiteNumber(entry.distance),
    food: finiteNumber(entry.food),
    stars: finiteNumber(entry.stars),
  };
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => {
      const metadata = row.metadata ?? row.Metadata ?? {};
      const timestamp = row.ts ?? row.timestamp ?? row.Timestamp ?? row.created_at;
      const numericTimestamp = Number(timestamp);

      return {
        name: String(
          row.name ?? row.Name ?? row.username ?? row.player_name ?? ""
        ).trim() || "Anonyme",
        difficulty: String(
          row.difficulty ?? row.Difficulty ?? metadata.difficulty ?? "lunch"
        ),
        score: finiteNumber(row.score ?? row.Score ?? row.value ?? row.Value),
        distance: finiteNumber(row.distance ?? row.Distance ?? metadata.distance),
        food: finiteNumber(
          row.food ?? row.Food ?? row.plats ?? metadata.food
        ),
        stars: finiteNumber(row.stars ?? row.Stars ?? metadata.stars),
        ts: Number.isFinite(numericTimestamp)
          ? numericTimestamp
          : Date.parse(timestamp) || Date.now(),
      };
    })
    .sort((a, b) => b.score - a.score || a.ts - b.ts);
}

export { POLL_MS, initLeadSession };
