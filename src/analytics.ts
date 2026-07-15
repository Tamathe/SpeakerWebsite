export type AnalyticsEventName =
  | "page_view"
  | "section_view"
  | "engaged_30s"
  | "navigation_click"
  | "outbound_click"
  | "contact_click"
  | "download_click"
  | "video_start"
  | "video_progress"
  | "video_watch"
  | "video_complete"
  | "video_replay"
  | "video_error"
  | "youtube_play_intent";

export type AnalyticsDetails = {
  section?: string;
  content?: string;
  targetHost?: string;
  videoId?: string;
  provider?: "native" | "youtube";
  milestone?: number;
  watchedSeconds?: number;
  duration?: number;
  currentTime?: number;
};

type AnalyticsOptions = {
  onceKey?: string;
};

type PrivacyNavigator = Navigator & {
  globalPrivacyControl?: boolean;
};

type PrivacyWindow = Window & {
  doNotTrack?: string;
};

const ANALYTICS_ENDPOINT = "/api/analytics";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const sentOnce = new Set<string>();

function createPageViewId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

function initialReferrerHost() {
  if (!document.referrer) return "";

  try {
    const referrer = new URL(document.referrer);
    return referrer.host === window.location.host ? "" : referrer.host;
  } catch {
    return "";
  }
}

const initialUrl = new URL(window.location.href);
const pageViewId = createPageViewId();
const referrerHost = initialReferrerHost();
const campaign = {
  utmSource: initialUrl.searchParams.get("utm_source") ?? "",
  utmMedium: initialUrl.searchParams.get("utm_medium") ?? "",
  utmCampaign: initialUrl.searchParams.get("utm_campaign") ?? "",
  utmContent: initialUrl.searchParams.get("utm_content") ?? "",
};

function analyticsEnabled() {
  const navigatorWithPrivacy = navigator as PrivacyNavigator;
  const windowWithPrivacy = window as PrivacyWindow;
  const honorsPrivacySignal =
    navigatorWithPrivacy.globalPrivacyControl === true ||
    navigator.doNotTrack === "1" ||
    windowWithPrivacy.doNotTrack === "1";

  if (honorsPrivacySignal) return false;

  const isLocal = LOCAL_HOSTS.has(window.location.hostname);
  const localDebugEnabled = initialUrl.searchParams.get("analytics_debug") === "1";
  return !isLocal || localDebugEnabled;
}

function finiteNumber(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function trackAnalytics(
  event: AnalyticsEventName,
  details: AnalyticsDetails = {},
  options: AnalyticsOptions = {},
) {
  if (!analyticsEnabled()) return;

  if (options.onceKey) {
    if (sentOnce.has(options.onceKey)) return;
    sentOnce.add(options.onceKey);
  }

  const payload: Record<string, string | number> = {
    version: 1,
    event,
    path: window.location.pathname || "/",
    pageViewId,
  };

  const strings = {
    section: details.section,
    content: details.content,
    targetHost: details.targetHost,
    videoId: details.videoId,
    provider: details.provider,
    referrerHost,
    ...campaign,
  };

  for (const [key, value] of Object.entries(strings)) {
    if (value) payload[key] = value;
  }

  const numbers = {
    milestone: finiteNumber(details.milestone),
    watchedSeconds: finiteNumber(details.watchedSeconds),
    duration: finiteNumber(details.duration),
    currentTime: finiteNumber(details.currentTime),
  };

  for (const [key, value] of Object.entries(numbers)) {
    if (value !== undefined) payload[key] = value;
  }

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(
        ANALYTICS_ENDPOINT,
        new Blob([body], { type: "application/json" }),
      );
      if (queued) return;
    }

    void fetch(ANALYTICS_ENDPOINT, {
      method: "POST",
      body,
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics must never interfere with the site experience.
  }
}
