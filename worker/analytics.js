const ALLOWED_EVENTS = new Set([
  "page_view",
  "section_view",
  "engaged_30s",
  "navigation_click",
  "outbound_click",
  "contact_click",
  "download_click",
  "video_start",
  "video_progress",
  "video_watch",
  "video_complete",
  "video_replay",
  "video_error",
  "youtube_play_intent",
]);

const ALLOWED_KEYS = new Set([
  "version",
  "event",
  "path",
  "pageViewId",
  "section",
  "content",
  "targetHost",
  "videoId",
  "provider",
  "referrerHost",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "milestone",
  "watchedSeconds",
  "duration",
  "currentTime",
]);

const SECTIONS = new Set([
  "featured-talk",
  "incubator",
  "tek100",
  "legislature",
  "topics",
  "engagements",
  "contact",
]);

const NATIVE_VIDEOS = new Set([
  "nbme-excerpt",
  "incubator-film",
  "tek100-excerpt",
]);

const NAVIGATION_CONTENT = new Set([
  "site-brand",
  "skip-to-main-content",
  "nav-featured",
  "nav-incubator",
  "nav-tek-100",
  "nav-talks",
  "nav-contact",
  "hero-watch-featured",
]);

const CONTACT_CONTENT = new Set([
  "hero-invite-email",
  "speaker-kit-email",
  "footer-email",
]);

const OUTBOUND_CONTENT = new Set([
  "nbme-full-presentation",
  "incubator-site",
  "legislature-official-recording",
  "engagement-medicolegal-symposium",
  "engagement-louisville-ai-week",
  "engagement-aamc-emerging-technologies",
  "engagement-dreams-of-data",
  "engagement-kentucky-legislature-ai",
  "engagement-old-dominion-grand-rounds",
  "engagement-dawn-of-ai",
  "engagement-new-mexico-grand-rounds",
  "engagement-kentucky-future",
  "engagement-precision-medicine",
  "engagement-assessment",
  "engagement-personalizing-learning",
]);

const SOURCE_CATEGORIES = new Set([
  "direct",
  "linkedin",
  "google",
  "bing",
  "email",
  "qr",
  "youtube",
  "facebook",
  "x",
  "event",
  "website",
]);

const MEDIUM_CATEGORIES = new Set([
  "social",
  "profile",
  "post",
  "organic",
  "email",
  "qr",
  "referral",
  "video",
  "event",
]);

const CAMPAIGN_CATEGORIES = new Set(["site-launch", "event"]);

const CONTENT_CATEGORIES = new Set(["launch-video", "event-qr"]);

const OUTBOUND_HOSTS = new Set([
  "f.io",
  "aiincubator-uky.vercel.app",
  "www.youtube.com",
  "youtube.com",
  "www.kentuckyrec.com",
  "kentuckyrec.com",
  "www.saem.org",
  "saem.org",
  "cme.cecentral.com",
  "cassyni.com",
]);

const MAX_BODY_BYTES = 2048;
const NO_STORE_HEADERS = { "cache-control": "no-store" };
const BOT_USER_AGENT =
  /(?:bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|whatsapp)/i;

function emptyResponse(status = 204, extraHeaders = {}) {
  return new Response(null, {
    status,
    headers: { ...NO_STORE_HEADERS, ...extraHeaders },
  });
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function cleanToken(value, maxLength = 120) {
  return cleanText(value, maxLength)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

function cleanHost(value) {
  const host = cleanText(value, 160).toLowerCase();
  return /^[a-z0-9.-]+(?::\d{1,5})?$/.test(host) ? host : "";
}

function cleanPageViewId(value) {
  const id = cleanText(value, 64).toLowerCase();
  return /^[a-f0-9-]{16,64}$/.test(id) ? id : "";
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function numberInRange(value, minimum, maximum) {
  const number = finiteNumber(value);
  return number !== null && number >= minimum && number <= maximum;
}

function rounded(value) {
  const number = finiteNumber(value);
  return number === null ? 0 : Math.round(number * 10) / 10;
}

function coarseDevice(request) {
  const mobileHint = request.headers.get("sec-ch-ua-mobile");
  const userAgent = request.headers.get("user-agent") || "";
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (mobileHint === "?1" || /mobile|android|iphone|ipod/i.test(userAgent)) {
    return "mobile";
  }
  if (mobileHint === "?0" || userAgent) return "desktop";
  return "unknown";
}

function requestIsSameOrigin(request, url) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }

  const fetchDestination = request.headers.get("sec-fetch-dest");
  if (fetchDestination && fetchDestination !== "empty") return false;

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === url.origin;
  } catch {
    return false;
  }
}

function privacySignalEnabled(request) {
  return (
    request.headers.get("sec-gpc") === "1" ||
    request.headers.get("dnt") === "1"
  );
}

function requestIsBot(request) {
  const botManagement = request.cf?.botManagement;
  if (botManagement?.verifiedBot) return true;
  return BOT_USER_AGENT.test(request.headers.get("user-agent") || "");
}

function referrerCategory(value) {
  const host = cleanHost(value);
  if (!host) return "direct";
  if (host.endsWith("linkedin.com") || host === "lnkd.in") return "linkedin";
  if (host.endsWith("google.com")) return "google";
  if (host.endsWith("bing.com")) return "bing";
  if (host.endsWith("youtube.com") || host === "youtu.be") return "youtube";
  if (host.endsWith("facebook.com")) return "facebook";
  if (host === "x.com" || host.endsWith("twitter.com")) return "x";
  return "other";
}

function attributionCategory(value, allowed) {
  const token = cleanToken(value, 80);
  if (!token) return "none";
  return allowed.has(token) ? token : "other";
}

function outboundHostCategory(value) {
  const host = cleanHost(value);
  return OUTBOUND_HOSTS.has(host) ? host : "other";
}

function eventContractIsValid(payload, event) {
  const section = cleanToken(payload.section);
  const content = cleanToken(payload.content);
  const videoId = cleanToken(payload.videoId);

  if (event === "page_view") return true;
  if (event === "engaged_30s") {
    return section === "page" && payload.milestone === 30;
  }
  if (event === "section_view") {
    return SECTIONS.has(section) && content === section;
  }
  if (event === "navigation_click") {
    return NAVIGATION_CONTENT.has(content);
  }
  if (event === "contact_click") {
    return CONTACT_CONTENT.has(content);
  }
  if (event === "download_click") {
    return content === "speaker-headshot-download";
  }
  if (event === "outbound_click") {
    return OUTBOUND_CONTENT.has(content);
  }
  if (event === "youtube_play_intent") {
    return (
      content === "legislature-poster-play" &&
      videoId === "kentucky-legislature" &&
      payload.provider === "youtube" &&
      numberInRange(payload.currentTime, 4664, 4664)
    );
  }

  if (!NATIVE_VIDEOS.has(videoId) || payload.provider !== "native") return false;
  if (event === "video_progress") {
    return [25, 50, 75, 90].includes(payload.milestone);
  }
  if (event === "video_complete") return payload.milestone === 100;
  if (event === "video_watch") {
    return (
      numberInRange(payload.watchedSeconds, 0.1, 300) &&
      numberInRange(payload.duration, 0, 14400) &&
      numberInRange(payload.currentTime, 0, 14400) &&
      numberInRange(payload.milestone, 0, 100)
    );
  }
  return ["video_start", "video_replay", "video_error"].includes(event);
}

async function readPayload(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return { error: 413 };

  const contentEncoding = request.headers.get("content-encoding");
  if (contentEncoding && contentEncoding !== "identity") return { error: 415 };

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("application/json")) return { error: 415 };

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return { error: 413 };
  }

  try {
    const payload = JSON.parse(text);
    if (!payload || Array.isArray(payload) || typeof payload !== "object") {
      return { error: 400 };
    }
    if (Object.keys(payload).some((key) => !ALLOWED_KEYS.has(key))) {
      return { error: 400 };
    }
    return { payload };
  } catch {
    return { error: 400 };
  }
}

export async function handleAnalyticsRequest(request, env) {
  if (request.method !== "POST") {
    return emptyResponse(405, { allow: "POST" });
  }

  const url = new URL(request.url);
  if (!requestIsSameOrigin(request, url)) return emptyResponse(403);
  if (privacySignalEnabled(request) || requestIsBot(request)) {
    return emptyResponse();
  }

  const result = await readPayload(request);
  if (result.error) return emptyResponse(result.error);

  const payload = result.payload;
  const event = cleanToken(payload.event, 40);
  const pageViewId = cleanPageViewId(payload.pageViewId);
  if (
    payload.version !== 1 ||
    !ALLOWED_EVENTS.has(event) ||
    !pageViewId ||
    !eventContractIsValid(payload, event)
  ) {
    return emptyResponse(400);
  }

  const cf = request.cf || {};
  const country = /^[A-Z]{2}$/.test(cf.country || "") ? cf.country : "";
  const region =
    country === "US" ? cleanToken(cf.regionCode || "", 12).toUpperCase() : "";
  const videoId = cleanToken(payload.videoId);
  const provider = videoId === "kentucky-legislature" ? "youtube" : videoId ? "native" : "";
  const content = cleanToken(payload.content);
  const section = cleanToken(payload.section);
  const page = cleanText(payload.path, 180).split(/[?#]/, 1)[0] === "/" ? "/" : "/404";

  let targetHost = "none";
  if (event === "contact_click") targetHost = "email";
  if (event === "download_click" || event === "navigation_click") targetHost = "internal";
  if (event === "outbound_click") targetHost = outboundHostCategory(payload.targetHost);

  try {
    env.SITE_ANALYTICS?.writeDataPoint({
      indexes: [`v1:${pageViewId}`],
      blobs: [
        event,
        page,
        section || "none",
        content || "none",
        targetHost,
        videoId || "none",
        provider || "none",
        referrerCategory(payload.referrerHost),
        attributionCategory(payload.utmSource, SOURCE_CATEGORIES),
        attributionCategory(payload.utmMedium, MEDIUM_CATEGORIES),
        attributionCategory(payload.utmCampaign, CAMPAIGN_CATEGORIES),
        attributionCategory(payload.utmContent, CONTENT_CATEGORIES),
        country || "unknown",
        region || "unknown",
        coarseDevice(request),
        pageViewId,
        "1",
      ],
      doubles: [
        rounded(payload.milestone),
        rounded(payload.watchedSeconds),
        rounded(payload.duration),
        rounded(payload.currentTime),
      ],
    });
  } catch {
    // Analytics failure must never affect the public site.
  }

  return emptyResponse();
}
