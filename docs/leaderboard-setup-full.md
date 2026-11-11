# Working Leaderboard: Google Sheets + Vite (step-by-step)

Your sheet: `https://docs.google.com/spreadsheets/d/1TQ5UlLTWea62oMb0VBWNzOFIvrl_V8t0E_2TIRHqwx4`

## 1. Prepare the Google Sheet

Open the sheet → **File → Make a copy** (so you own it and can add-ons).

In cell **A1**, type exactly these headers (press Tab between each):

```
timestamp	name	difficulty	score	distance	food	stars
```

The sheet must have this exact header row for the Apps Script to read/write correctly.

## 2. Create the Apps Script web app

1. In your copied sheet, click **Extensions → Apps Script**.
2. Delete any starter code and paste this entire script:

```javascript
const SHEET_NAME = "Sheet1";

// ----- GET: list scores -----
function doGet(e) {
  const action = (e.parameter.action || "list").toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (action === "list") {
    const values = sheet.getDataRange().getValues();
    const header = values[0] || [];
    const idx = (name) => header.indexOf(name);

    const rows = values
      .slice(1) // skip header
      .filter((r) => r.length >= 7 && r[idx("name")])
      .map((r) => ({
        ts: Number(r[idx("timestamp")]) || 0,
        name: String(r[idx("name")]).trim() || "Anonyme",
        difficulty: String(r[idx("difficulty")]) || "lunch",
        score: Number(r[idx("score")]) || 0,
        distance: Number(r[idx("distance")]) || 0,
        food: Number(r[idx("food")]) || 0,
        stars: Number(r[idx("stars")]) || 0,
      }))
      .sort((a, b) => b.score - a.score || a.ts - b.ts);

    return ContentService.createTextOutput(JSON.stringify({ rows }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ----- POST: submit a score -----
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ----- POST handler for score submission -----
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

3. Click the **disk icon** → **Save project**, name it "Leaderboard Gateway".

## 3. Deploy the web app

1. Click **Deploy → New deployment**.
2. **Select type**: Web app.
3. **Execute as**: Me.
4. **Who has access**: Anyone (this is required so the browser can POST from any domain).
5. Click **Deploy**.

6. A dialog will ask you to authorize. Click **Continue**, select your Google account, and accept the prompts.
7. After authorization, copy the **Web app URL** — it will look like:
   `https://script.google.com/macros/s/EXECUTEAHASH/exec`

## 4 Wire it into the Vite site

Create (or edit) a file named `.env.local` in the project root (`french-cuisine/.env.local`) and add:

```
VITE_LEADERBOARD_URL=https://script.google.com/macros/s/EXECUTEAHASH/exec
```

Replace `https://script.google.com/macros/s/EXECUTEAHASH/exec` with the exact URL you copied.

**Then rebuild and restart:**

```bash
npm run build
# stop the dev server (Ctrl+C) and restart:
npm run dev -- --port 5178 --host 127.0.0.1
```

## 5. Verify it works

Open the game, play a run, submit a name after completion. The score should appear on the `/leaderboard` page within ~5 seconds. The page will auto-refresh every 5 seconds to show the latest ranking.

If you see "Load error" or scores don't appear:

- Check the **Browser console** (F12) for any red errors.
- Make sure the `.env.local` line has no spaces around the `=` sign.
- Make sure the dev server was restarted after adding the env var.
- In the Google Sheet, check that rows are being appended (the script writes to the bottom).

## Notes

- The sheet is the source of truth. You can edit or delete rows directly in Google Sheets.
- Apps Script has a ~20 concurrent execution limit — for a 70-student class polling every 5s this is fine in practice.
- Without `VITE_LEADERBOARD_URL`, the site uses localStorage demo (scores stay on that device only).
- To reset the leaderboard, delete all rows in the sheet below the header row, or redeploy the script.