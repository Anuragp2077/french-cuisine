// Leaderboard client.
//
// The leaderboard is backed by a Google Sheet. Because browsers cannot write to
// a sheet directly, a tiny Google Apps Script web app sits in front of it:
//
//   GET  {ENDPOINT}?action=list            -> { rows: [...] }
//   POST {ENDPOINT}  body { name, difficulty, score, distance, food, stars }
//                                         -> { ok: true }
//
// Set VITE_LEADERBOARD_URL in .env (or .env.local) to that web app URL.
// If it is not set, the module falls back to a localStorage demo so the UI
// still works offline.

const STORAGE_KEY = "french-cuisine-leaderboard-demo";
const POLL_MS = 5000;

export const LEADERBOARD_ENDPOINT =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_LEADERBOARD_URL) ||
  "";

export const LEADERBOARD_SHEET_ID = "1TQ5UlLTWea62oMb0VBWNzOFIvrl_V8t0E_2TIRHqwx4";

export function isRemote() {
  return Boolean(LEADERBOARD_ENDPOINT);
}

export function loadDemo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDemo(rows) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

export async function fetchLeaderboard() {
  if (isRemote()) {
    const url = `${LEADERBOARD_ENDPOINT}?action=list&t=${Date.now()}`;
    const res = await fetch(url, { method: "GET", mode: "cors" });
    if (!res.ok) throw new Error(`leaderboard fetch failed: ${res.status}`);
    const data = await res.json();
    return normalizeRows(data?.rows ?? data ?? []);
  }
  return normalizeRows(loadDemo());
}

export async function submitScore(entry) {
  const row = normalizeEntry(entry);
  if (isRemote()) {
    const res = await fetch(LEADERBOARD_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "submit", ...row }),
    });
    if (!res.ok) throw new Error(`leaderboard submit failed: ${res.status}`);
    return row;
  }
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
    .map((r) => ({
      name: String(r.name ?? r.Name ?? r.username ?? "").trim() || "Anonyme",
      difficulty: String(r.difficulty ?? r.Difficulty ?? "lunch"),
      score: Number(r.score ?? r.Score ?? 0) || 0,
      distance: Number(r.distance ?? r.Distance ?? 0) || 0,
      food: Number(r.food ?? r.Food ?? r.plats ?? 0) || 0,
      stars: Number(r.stars ?? r.Stars ?? 0) || 0,
      ts: Number(r.ts ?? r.timestamp ?? r.Timestamp ?? Date.now()) || Date.now(),
    }))
    .sort((a, b) => b.score - a.score || a.ts - b.ts);
}

export { POLL_MS };
