# Speaker site analytics

The site now has a free, cookie-free analytics layer built on the existing
Cloudflare Worker. It records aggregate traffic and behavior without building
a persistent visitor profile.

## What is measured

- Page loads and visits that remain visible for at least 30 seconds
- Referral category and the allowlisted `utm_source`, `utm_medium`,
  `utm_campaign`, and `utm_content` values
- One-time views of the featured talk, Incubator, TEK 100, legislature, topics,
  engagements, and contact sections
- Contact, download, navigation, and external-link clicks
- Intentional starts, watched-time deltas, 25/50/75/90% progress, completion,
  replay, and playback errors for the three self-hosted videos
- Click-to-play intent for the Kentucky Legislature YouTube recording
- Approximate country, state or region, and coarse mobile/desktop device class

The ambient speaking reel is deliberately excluded. It autoplays without a
visitor decision and would inflate video engagement.

## What is not measured

- Names, email addresses, email contents, or employers
- Raw IP addresses, city, postal code, coordinates, or network organization
- Full referring URLs, full query strings, or search terms
- Cookies, browser fingerprinting, session replay, or a returning-visitor ID

Each page load receives a new random identifier. It connects events within that
page load but is never reused or read back by the browser, so it cannot recognize
a returning visitor. The event rows, including that page-specific grouping
identifier, are retained for up to three months. Browser Do Not Track and Global
Privacy Control signals disable custom event collection.

## Free Cloudflare services

The custom events are written to the `speaker_site_events_v1` Workers Analytics
Engine dataset. Cloudflare currently includes 100,000 writes and 10,000 read
queries per day on the Workers Free plan. Analytics Engine retains these events
for three months. See Cloudflare's current [pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/)
and [limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/)
before making a future cost assumption.

Cloudflare Web Analytics should also be enabled for the public hostname. It adds
the free dashboard for visits, page views, referrer hosts, country, browser,
operating system, device type, page-load time, and Core Web Vitals. It does not
support custom events or UTM parameters, which is why the first-party event
collector remains necessary.

## Account-side setup

These steps require the Cloudflare account that owns the public deployment:

1. Deploy the analytics-only Worker with `npm run deploy:analytics`. The public
   site remains hosted by Sites; privacy-minimized events are sent to
   `analytics.tamathe.com/api/analytics`. The Analytics Engine dataset is
   created automatically when the first production event is written.
2. In Cloudflare, open **Analytics & Logs → Web Analytics**, add or select the
   public hostname, and enable automatic setup. A hostname proxied through
   Cloudflare does not require a beacon token in this repository.
3. Enable the free weekly Web Analytics summary if it is useful.
4. For the custom report, create an API token limited to **Account → Account
   Analytics → Read** for the relevant account. Give it a short expiration when
   practical.

Never put the read token in client code, a `VITE_*` variable, Git, or a public
dashboard. The browser event endpoint is write-only.

## Generate the private report

Set `CLOUDFLARE_ACCOUNT_ID` and the read-only `CLOUDFLARE_API_TOKEN` for the
current process, then run:

```powershell
npm run analytics:report -- --days 30
```

The command writes a private local dashboard to:

```text
outputs/analytics/speaker-site-analytics.html
```

That folder is ignored by Git. The report includes traffic sources, geography,
sections viewed, high-value clicks, video engagement, and event totals. Every
query uses Cloudflare's `_sample_interval` weighting so totals remain valid if
high-volume data is sampled.

## Launch links

Use stable campaign tags rather than changing names from post to post:

```text
https://PUBLIC-HOST/?utm_source=linkedin&utm_medium=profile&utm_campaign=site-launch
https://PUBLIC-HOST/?utm_source=linkedin&utm_medium=post&utm_campaign=site-launch&utm_content=launch-video
https://PUBLIC-HOST/?utm_source=qr&utm_medium=qr&utm_campaign=event&utm_content=event-qr
```

The custom collector reads only those four campaign fields and collapses unknown
values to `other`; it never stores the rest of the query string. The current
exact campaign allowlist is `site-launch` or `event`, with content values
`launch-video` or `event-qr`. Add a new non-personal value to the sets in
`worker/analytics.js` before using it in a public link.

## Event dictionary

| Event | Meaning |
|---|---|
| `page_view` | One browser page load; not a named or durable unique person |
| `engaged_30s` | The page remained visible for 30 seconds |
| `section_view` | An identified section remained in the central viewport for 750 ms |
| `navigation_click` | An internal or same-page link was selected |
| `outbound_click` | A link to another site was selected |
| `contact_click` | An email link was selected; this does not prove an email was sent |
| `download_click` | The headshot download was selected; this does not prove completion |
| `video_start` | A controlled self-hosted video began playback |
| `video_progress` | The playhead first reached 25, 50, 75, or 90% |
| `video_watch` | Visible, non-buffering watched time since the prior flush |
| `video_complete` | A controlled self-hosted video reached its end |
| `video_replay` | A completed self-hosted video was started again |
| `video_error` | A controlled self-hosted video reported a playback error |
| `youtube_play_intent` | The visitor clicked the privacy-preserving YouTube poster |

YouTube watch duration is not claimed. Accurate progress inside that iframe
would require the YouTube IFrame Player API; the current event records only the
visitor's decision to load it.
