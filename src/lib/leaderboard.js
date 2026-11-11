const POLL_MS = 5000;
const LEADR_API_BASE = "https://api.leadrcloud.com/v1/client";
const LEADR_BOARD_ID = "brd_eb487f50-3ea0-4b4f-9c9f-b4cec920488a";
const LEADR_GAME_ID = "gam_3ba60faa-5634-4a28-af80-fcf3a1efa126";
const DEVICE_ID_KEY = "french-cuisine-leadr-device-id";

let leadrSession = null;
let leadrSessionPromise = null;
let leadrRefreshPromise = null;
let fingerprintPromise = null;

async function getClientFingerprint() {
  if (!fingerprintPromise) {
    fingerprintPromise = (async () => {
      let deviceId;
      try {
        deviceId = localStorage.getItem(DEVICE_ID_KEY);
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
      } catch {
        deviceId = crypto.randomUUID();
      }

      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(deviceId)
      );
      return Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, "0")
      ).join("");
    })();
  }

  return fingerprintPromise;
}

function storeSession(data) {
  if (!data.access_token || !data.refresh_token) {
    throw new Error("LEADR session response did not include both session tokens");
  }

  leadrSession = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 900) * 1000,
  };
}

async function initLeadSession() {
  if (leadrSessionPromise) return leadrSessionPromise;

  leadrSessionPromise = (async () => {
    const fingerprint = await getClientFingerprint();
    const response = await fetch(`${LEADR_API_BASE}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: LEADR_GAME_ID,
        client_fingerprint: fingerprint,
        platform: "web",
      }),
    });

    if (!response.ok) {
      throw new Error(`LEADR session initialization failed (${response.status})`);
    }

    const data = await response.json();
    storeSession(data);
    return leadrSession;
  })();

  try {
    return await leadrSessionPromise;
  } catch (error) {
    leadrSessionPromise = null;
    throw error;
  }
}

async function refreshLeadSession() {
  if (leadrRefreshPromise) return leadrRefreshPromise;

  leadrRefreshPromise = (async () => {
    if (!leadrSession) return initLeadSession();

    const response = await fetch(`${LEADR_API_BASE}/sessions/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${leadrSession.refreshToken}` },
    });

    if (!response.ok) {
      leadrSession = null;
      leadrSessionPromise = null;
      return initLeadSession();
    }

    const data = await response.json();
    storeSession(data);
    return leadrSession;
  })();

  try {
    return await leadrRefreshPromise;
  } finally {
    leadrRefreshPromise = null;
  }
}

async function getLeadSession() {
  if (!leadrSession || Date.now() >= leadrSession.expiresAt - 30_000) {
    return leadrSession ? refreshLeadSession() : initLeadSession();
  }

  return leadrSession;
}

export async function getLeadNonce() {
  let session = await getLeadSession();
  let response = await fetch(`${LEADR_API_BASE}/nonce`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (response.status === 401) {
    session = await refreshLeadSession();
    response = await fetch(`${LEADR_API_BASE}/nonce`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
  }

  if (!response.ok) {
    throw new Error(`LEADR nonce request failed (${response.status})`);
  }

  const data = await response.json();
  if (!data.nonce_value) {
    throw new Error("LEADR nonce response did not include a nonce value");
  }

  return data.nonce_value;
}

export async function fetchLeaderboard() {
  let session = await getLeadSession();
  const rows = [];
  let cursor = null;

  do {
    const params = new URLSearchParams({
      board_id: LEADR_BOARD_ID,
      limit: "100",
      sort: "value:desc,created_at:asc",
    });
    if (cursor) params.set("cursor", cursor);

    let response = await fetch(`${LEADR_API_BASE}/scores?${params}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (response.status === 401) {
      session = await refreshLeadSession();
      response = await fetch(`${LEADR_API_BASE}/scores?${params}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
    }

    if (!response.ok) {
      throw new Error(`LEADR leaderboard request failed (${response.status})`);
    }

    const data = await response.json();
    rows.push(...(Array.isArray(data?.data) ? data.data : []));
    cursor = data?.pagination?.has_next
      ? data.pagination.next_cursor
      : null;
  } while (cursor);

  return normalizeRows(rows);
}

export async function submitScore(entry) {
  const row = normalizeEntry(entry);
  let session = await getLeadSession();
  let nonce = await getLeadNonce();
  const body = JSON.stringify({
    board_id: LEADR_BOARD_ID,
    player_name: row.name,
    value: row.score,
    value_display: String(row.score),
    metadata: {
      difficulty: row.difficulty,
      distance: row.distance,
      food: row.food,
      stars: row.stars,
    },
  });

  let response = await fetch(`${LEADR_API_BASE}/scores`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "leadr-client-nonce": nonce,
      "Content-Type": "application/json",
    },
    body,
  });

  if (response.status === 401) {
    session = await refreshLeadSession();
    nonce = await getLeadNonce();
    response = await fetch(`${LEADR_API_BASE}/scores`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "leadr-client-nonce": nonce,
        "Content-Type": "application/json",
      },
      body,
    });
  }

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
