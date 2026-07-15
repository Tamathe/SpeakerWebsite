import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const dataset = "speaker_site_events_v1";
const requestedDays = Number(process.argv[process.argv.indexOf("--days") + 1] || 30);
const days = Number.isInteger(requestedDays)
  ? Math.min(90, Math.max(1, requestedDays))
  : 30;

if (!accountId || !apiToken) {
  throw new Error(
    "Set CLOUDFLARE_ACCOUNT_ID and a read-only CLOUDFLARE_API_TOKEN before generating the analytics report.",
  );
}

const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;
const since = `timestamp >= NOW() - INTERVAL '${days}' DAY`;

async function query(sql) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiToken}`,
      "content-type": "text/plain",
    },
    body: sql,
  });

  const result = await response.json();
  if (!response.ok || result.errors?.length) {
    const message = result.errors?.map((error) => error.message).join("; ");
    throw new Error(message || `Cloudflare query failed with ${response.status}.`);
  }
  return Array.isArray(result.data) ? result.data : [];
}

const queries = {
  events: `
    SELECT blob1 AS event, SUM(_sample_interval) AS total
    FROM ${dataset}
    WHERE ${since}
    GROUP BY event
    ORDER BY total DESC`,
  sources: `
    SELECT blob9 AS utm_source, blob8 AS referrer_host,
      SUM(_sample_interval) AS page_views
    FROM ${dataset}
    WHERE ${since} AND blob1 = 'page_view'
    GROUP BY utm_source, referrer_host
    ORDER BY page_views DESC
    LIMIT 25`,
  geography: `
    SELECT blob13 AS country, blob14 AS region,
      SUM(_sample_interval) AS page_views
    FROM ${dataset}
    WHERE ${since} AND blob1 = 'page_view'
    GROUP BY country, region
    ORDER BY page_views DESC
    LIMIT 25`,
  sections: `
    SELECT blob3 AS section, SUM(_sample_interval) AS views
    FROM ${dataset}
    WHERE ${since} AND blob1 = 'section_view'
    GROUP BY section
    ORDER BY views DESC`,
  clicks: `
    SELECT blob1 AS event, blob4 AS content, blob5 AS target_host,
      SUM(_sample_interval) AS clicks
    FROM ${dataset}
    WHERE ${since}
      AND blob1 IN ('contact_click', 'outbound_click', 'download_click')
    GROUP BY event, content, target_host
    ORDER BY clicks DESC
    LIMIT 40`,
  videos: `
    SELECT blob6 AS video_id, blob1 AS event, double1 AS milestone,
      SUM(_sample_interval) AS events,
      SUM(_sample_interval * double2) AS watched_seconds
    FROM ${dataset}
    WHERE ${since}
      AND blob1 IN (
        'video_start', 'video_progress', 'video_watch', 'video_complete',
        'video_replay', 'video_error', 'youtube_play_intent'
      )
    GROUP BY video_id, event, milestone
    ORDER BY video_id, event, milestone`,
};

const entries = await Promise.all(
  Object.entries(queries).map(async ([name, sql]) => [name, await query(sql)]),
);
const data = Object.fromEntries(entries);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayValue(value) {
  if (value === "" || value === null || value === undefined) return "—";
  const number = Number(value);
  if (typeof value === "number" || (typeof value === "string" && value.trim() && Number.isFinite(number))) {
    return Number.isInteger(number)
      ? number.toLocaleString()
      : number.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }
  return value;
}

function table(title, rows) {
  if (!rows.length) {
    return `<section><h2>${escapeHtml(title)}</h2><p class="empty">No data yet.</p></section>`;
  }

  const columns = Object.keys(rows[0]);
  const header = columns.map((column) => `<th>${escapeHtml(column.replaceAll("_", " "))}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${escapeHtml(displayValue(row[column]))}</td>`)
          .join("")}</tr>`,
    )
    .join("");
  return `<section><h2>${escapeHtml(title)}</h2><div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div></section>`;
}

function totalFor(event) {
  const row = data.events.find((candidate) => candidate.event === event);
  return Number(row?.total || 0);
}

const generatedAt = new Date();
const cards = [
  ["Page views", totalFor("page_view")],
  ["Engaged 30s", totalFor("engaged_30s")],
  ["Contact clicks", totalFor("contact_click")],
  ["Video starts", totalFor("video_start")],
  ["Video completions", totalFor("video_complete")],
  ["YouTube play intent", totalFor("youtube_play_intent")],
];

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Speaker site analytics — ${days} days</title>
  <style>
    :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #090a0b; color: #f5f5f2; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px; }
    main { width: min(1180px, 100%); margin: 0 auto; }
    header { padding: 28px 0 36px; border-bottom: 1px solid #303337; }
    h1 { margin: 0 0 10px; font-size: clamp(32px, 5vw, 58px); letter-spacing: -0.04em; }
    header p, .empty { color: #a9adb2; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 28px 0 40px; }
    .card { padding: 18px; border: 1px solid #303337; background: #111315; }
    .card span { display: block; color: #9ca1a7; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
    .card strong { display: block; margin-top: 8px; font-size: 32px; }
    section { margin: 38px 0; }
    h2 { font-size: 20px; }
    .table-wrap { overflow-x: auto; border: 1px solid #303337; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 11px 13px; border-bottom: 1px solid #25282b; text-align: left; white-space: nowrap; }
    th { color: #a9adb2; font-size: 10px; text-transform: uppercase; letter-spacing: .08em; background: #111315; }
    tbody tr:last-child td { border-bottom: 0; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Speaker site analytics</h1>
      <p>Last ${days} days · Generated ${escapeHtml(generatedAt.toLocaleString())} · Aggregate, cookie-free events</p>
    </header>
    <div class="cards">${cards
      .map(([label, value]) => `<div class="card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(displayValue(value))}</strong></div>`)
      .join("")}</div>
    ${table("Traffic sources", data.sources)}
    ${table("Geography", data.geography)}
    ${table("Sections viewed", data.sections)}
    ${table("High-value clicks", data.clicks)}
    ${table("Video engagement", data.videos)}
    ${table("All event totals", data.events)}
  </main>
</body>
</html>`;

const outputDirectory = path.resolve("outputs", "analytics");
const outputPath = path.join(outputDirectory, "speaker-site-analytics.html");
await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, html, "utf8");
process.stdout.write(`${outputPath}\n`);
