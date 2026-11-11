# Leaderboard setup (shared class leaderboard)

The game submits scores and the `/leaderboard` page reads them. To make the
leaderboard shared across the whole class, deploy a tiny Google Apps Script
web app in front of the Google Sheet:

`https://docs.google.com/spreadsheets/d/1TQ5UlLTWea62oMb0VBWNzOFIvrl_V8t0E_2TIRHqwx4`

## 1. Prepare the sheet

In the first row put these headers (column A..G):

```
timestamp | name | difficulty | score | distance | food | stars
```

## 2. Create the Apps Script

Open the sheet → **Extensions → Apps Script**, delete the default code and paste:

```javascript
const SHEET_NAME = "Sheet1";

function doGet(e) {
  const action = (e.parameter.action || "list").toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (action === "list") {
    const values = sheet.getDataRange().getValues();
    const header = values.shift() || [];
    const idx = (name) => header.indexOf(name);
    const rows = values
      .filter((r) => r.length && r[idx("name")])
      .map((r) => ({
        ts: Number(r[idx("timestamp")]) || Date.now(),
        name: String(r[idx("name")]),
        difficulty: String(r[idx("difficulty")]),
        score: Number(r[idx("score")]) || 0,
        distance: Number(r[idx("distance")]) || 0,
        food: Number(r[idx("food")]) || 0,
        stars: Number(r[idx("stars")]) || 0,
      }))
      .sort((a, b) => b.score - a.score || a.ts - b.ts);
    return ContentService.createTextOutput(JSON.stringify({ rows }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents || "{}");
  } catch (err) {
    body = e.parameter || {};
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    Date.now(),
    String(body.name || "Anonyme").slice(0, 24),
    String(body.difficulty || "lunch"),
    Number(body.score) || 0,
    Number(body.distance) || 0,
    Number(body.food) || 0,
    Number(body.stars) || 0,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy

1. Click **Deploy → New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone** (so students' browsers can reach it).
5. Click **Deploy**, authorize, copy the **Web app URL**.

## 4. Wire it into the site

Create a `.env.local` (or set in your host) with:

```
VITE_LEADERBOARD_URL=https://script.google.com/macros/s/XXXX/exec
```

Rebuild / restart dev server. The `/leaderboard` page will now poll the sheet
every 5 seconds and show the shared ranking. Scores submitted from the game
appear within ~5s.

## Notes

- Without `VITE_LEADERBOARD_URL`, the site uses a localStorage demo leaderboard
  (per device only) so the UI still works offline.
- Apps Script has a ~20 concurrent execution limit; for a 70-student class
  polling every 5s this is fine in practice.
- The sheet is the source of truth — you can edit/delete rows directly.
EOF
echo done