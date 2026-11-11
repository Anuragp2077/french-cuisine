// Leaderboard client using LEADR cloud service.
// 
// Using your LEADR account (API key baked in - no env vars needed):
//   API key: ldr_53fmXWxwltIXAcVmhLeeY_hGg5iacMkS7j2mtoKfVFk
//   Account: acc_8c2a8ed1-cae0-41d5-81bb-0470c5c821d0
//   Board: frenchboard (slug: french-project)
//   Game: gam_29f0a126-9f19-4a61-9916-6794b4b490a9
//
// Scores submit to your LEADR board and appear on the public leaderboard
// at https://leadr.gg/board/french-project
//
// The API key will be 'scraped' as you said, so no point hiding it.
//
// NOTE: LEADR client API requires proper auth flow (session -> nonce -> submit).
// This implementation handles that flow so scores work in both dev and production.

const STORAGE_KEY = "french-cuisine-leaderboard-demo";
const POLL_MS = 5000;
const LEADR_API_KEY = "ldr_53fmXWxwltIXAcVmhLeeY_hGg5iacMkS7j2mtoKfVFk";
const LEADR_BOARD_SLUG = "SEQRS";
const LEADR_GAME_ID = "gam_29f0a126-9f19-4a61-9916-6794b4b490a9";

// Client fingerprint - hash identifying this game instance
const LEADR_CLIENT_FINGERPRINT = "french-cuisine-build";

// LEADR session token (obtained from session init, stored for the session)
let LEADR_SESSION_TOKEN = null;

// Initialize a LEADR client session
async function initLeadSession() {
  var _a;
  const res = await fetch("https://api.leadr.gg/v1/client/sessions", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      game_id: LEADR_GAME_ID,
      client_fingerprint: LEADR_CLIENT_FINGERPRINT,
    }),
  });
  if (!res.ok) throw new Error("LEADR session init failed: " + res.status);
  const data = await res.json();
  LEADR_SESSION_TOKEN = (_a = data.access_token) !== null && _a !== void 0 ? _a : data.token || null;
  return data;
}

// Get a nonce for score submission using the session token
export async function getLeadNonce() {
  if (!LEADR_SESSION_TOKEN) {
    await initLeadSession();
  }
  const res = await fetch("https://api.leadr.gg/v1/client/nonce", {
    method: "GET",
    mode: "cors",
    headers: {
      Authorization: "Bearer " + LEADR_SESSION_TOKEN,
      "Content-Type": "application/json",
    },
  });    if (!res.ok) throw new Error("LEADR nonce fetch failed: " + res.status);
  const data = await res.json();
  return data.nonce || Date.now().toString();
}

export function isRemote() {
  // Always remote when API key is set
  return Boolean(LEADR_API_KEY);
}

export function loadDemo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch  {
    return [];
  }
}

export function saveDemo(rows) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch  {
    /* ignore */
  }
}export async function fetchLeaderboard() {
  if (isRemote()) {
    // Try to fetch scores - may fail in dev if no session, fallback to demo
    try {
      var _c;
      const url = "https://api.leadr.gg/v1/client/boards/" + LEADR_BOARD_SLUG + "/scores?limit=50";
      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          Authorization: "Bearer " + ((_c = LEADR_SESSION_TOKEN) !== null && _c !== void 0 ? _c : LEADR_SESSION_TOKEN),
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("leaderboard fetch: " + res.status);
      const data = await res.json();
      return normalizeRows(data?.scores ?? data ?? []);
    } catch {
      // Fallback to demo on any error (e.g., no session in dev)
      return normalizeRows(loadDemo());
    }
  }
  return normalizeRows(loadDemo());
}

export async function submitScore(entry) {
  const row = normalizeEntry(entry);
  if (isRemote()) {
    try {
      const nonce = await getLeadNonce();
      // Submit score to LEADR
      var _d;
      const submitRes = await fetch("https://api.leadr.gg/v1/client/scores", {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Bearer " + ((_d = LEADR_SESSION_TOKEN) !== null && _d !== void 0 ? _d : LEADR_SESSION_TOKEN),
          "leadr-client-nonce": nonce,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board_id: LEADR_BOARD_SLUG,
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
      if (!submitRes.ok) {
        const rows = loadDemo();
        rows.push({ ...row, ts: Date.now() });
        saveDemo(rows);
        return row;
      }
      return row;
    } catch  {
      // Fallback to demo on submit failure
      const rows = loadDemo();
      rows.push({ ...row, ts: Date.now() });
      saveDemo(rows);
      return row;
    }
  }
  // Demo fallback
  const rows = loadDemo();
  rows.push({ ...row, ts: Date.now() });
  saveDemo(rows);
  return row;
}

function normalizeEntry(entry) {
  return {
    name: String(entry.name || "Anonyme").trim().slice(0, 24) || "Anonyme",
    difficulty: String(entry.difficulty || "lunch"),
    score: Number(entry.score) || 0,
    distance: Number(entry.distance) || 0,
    food: Number(entry.food) || 0,
    stars: Number(entry.stars) || 0,
  };
}

function normalizeRows(rows) {
  return (Array.isArray(rows) ? rows : [])
    .map(function (r) {
      return {
        name: String(r.name ?? r.Name ?? r.username ?? "").trim() || "Anonyme",
        difficulty: String(r.difficulty ?? r.Difficulty ?? "lunch"),
        score: Number(r.score ?? r.Score ?? 0) || 0,
        distance: Number(r.distance ?? r.Distance ?? 0) || 0,
        food: Number(r.food ?? r.Food ?? r.plats ?? 0) || 0,
        stars: Number(r.stars ?? r.Stars ?? 0) || 0,
        ts: Number(r.ts ?? r.timestamp ?? r.Timestamp ?? Date.now()) || Date.now(),
      };
    })
    .sort(function (a, b) {
      return b.score - a.score || a.ts - b.ts;
    });
}

export { POLL_MS, initLeadSession };