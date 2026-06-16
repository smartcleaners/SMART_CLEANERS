/**
 * MBA Elite Weekend 2026 — Google Calendar Sync
 * ------------------------------------------------
 * Adds all CAT course classes (VARC, Quant, LRDI) to your Google Calendar
 * with a 2-hour reminder before each session.
 *
 * SETUP (one-time, ~10 mins):
 *   See SETUP.md for step-by-step instructions.
 *
 * RUN:
 *   node index.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");
const events = require("./events");

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json"); // downloaded from Google Cloud
const TOKEN_PATH = path.join(__dirname, "token.json");             // auto-created on first run
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const TIMEZONE = "Asia/Kolkata";
const REMINDER_MINUTES = 120; // 2 hours before

// Color IDs for Google Calendar (per subject)
const SUBJECT_COLORS = {
  VARC:  "9",  // Blueberry
  Quant: "6",  // Tangerine
  LRDI:  "2",  // Sage
};

// ─── AUTH ────────────────────────────────────────────────────────────────────

function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("\n❌  credentials.json not found!");
    console.error("    Please follow SETUP.md to download it from Google Cloud Console.\n");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
}

async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    return oAuth2Client;
  }

  return getNewToken(oAuth2Client);
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: "offline", scope: SCOPES });
  console.log("\n🔗  Open this URL in your browser and authorize the app:\n");
  console.log("   ", authUrl);
  console.log();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve, reject) => {
    rl.question("📋  Paste the authorization code here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code.trim(), (err, token) => {
        if (err) return reject(new Error("Error retrieving access token: " + err));
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log("\n✅  Token saved to token.json — you won't need to authorize again.\n");
        resolve(oAuth2Client);
      });
    });
  });
}

// ─── CALENDAR ────────────────────────────────────────────────────────────────

function buildEventPayload(ev) {
  const [year, month, day] = ev.date.split("-").map(Number);
  const [startH, startM] = ev.start.split(":").map(Number);
  const [endH, endM] = ev.end.split(":").map(Number);

  const pad = (n) => String(n).padStart(2, "0");
  const dateStr = `${year}-${pad(month)}-${pad(day)}`;

  return {
    summary: `[${ev.subject}] ${ev.topic}`,
    description: `Faculty: ${ev.faculty}\nSubject: ${ev.subject}\nTopic: ${ev.topic}\n\n📚 MBA Elite Weekend 2026 (CAT + OMETs)`,
    start: { dateTime: `${dateStr}T${pad(startH)}:${pad(startM)}:00`, timeZone: TIMEZONE },
    end:   { dateTime: `${dateStr}T${pad(endH)}:${pad(endM)}:00`,   timeZone: TIMEZONE },
    colorId: SUBJECT_COLORS[ev.subject] || "1",
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup",  minutes: REMINDER_MINUTES },
        { method: "email",  minutes: REMINDER_MINUTES },
      ],
    },
  };
}

async function insertEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  let success = 0;
  let failed = 0;

  console.log(`\n📅  Adding ${events.length} classes to Google Calendar...\n`);

  for (const ev of events) {
    const payload = buildEventPayload(ev);
    try {
      await calendar.events.insert({ calendarId: "primary", requestBody: payload });
      console.log(`  ✅  ${ev.date}  ${ev.start}  [${ev.subject}] ${ev.topic}`);
      success++;
    } catch (err) {
      console.error(`  ❌  Failed: [${ev.subject}] ${ev.topic} — ${err.message}`);
      failed++;
    }

    // Small delay to respect API rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n🎉  Done! ${success} events added, ${failed} failed.`);
  console.log(`    You'll get a popup + email reminder 2 hours before every class.\n`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    const credentials = loadCredentials();
    const auth = await authorize(credentials);
    await insertEvents(auth);
  } catch (err) {
    console.error("\n❌  Error:", err.message);
    process.exit(1);
  }
})();