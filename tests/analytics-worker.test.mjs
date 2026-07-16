import assert from "node:assert/strict";
import test from "node:test";
import { handleAnalyticsRequest } from "../worker/analytics.js";

const validPayload = {
  version: 1,
  event: "video_progress",
  path: "/?private=query",
  pageViewId: "6c65b4a8-4dc7-41b3-8762-54db70de36bd",
  section: "Featured Talk",
  content: "nbme-video",
  videoId: "nbme-excerpt",
  provider: "native",
  referrerHost: "www.linkedin.com",
  utmSource: "LinkedIn",
  utmCampaign: "Site Launch",
  milestone: 50,
  duration: 83.4,
  currentTime: 42,
};

function makeRequest({
  method = "POST",
  payload = validPayload,
  headers = {},
  cf = { country: "US", regionCode: "KY" },
} = {}) {
  const request = new Request("https://analytics.tamathe.com/api/analytics", {
    method,
    headers: {
      "content-type": "text/plain;charset=UTF-8",
      origin: "https://tamathe.com",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      ...headers,
    },
    body: method === "POST" ? JSON.stringify(payload) : undefined,
  });
  Object.defineProperty(request, "cf", { value: cf });
  return request;
}

function captureEnvironment() {
  const points = [];
  return {
    points,
    env: {
      SITE_ANALYTICS: {
        writeDataPoint(point) {
          points.push(point);
        },
      },
    },
  };
}

test("accepts a valid same-origin event and writes a privacy-minimized row", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(makeRequest(), env);

  assert.equal(response.status, 204);
  assert.equal(points.length, 1);
  const [point] = points;
  assert.equal(point.blobs[0], "video_progress");
  assert.equal(point.blobs[1], "/");
  assert.equal(point.blobs[2], "featured-talk");
  assert.equal(point.blobs[7], "linkedin");
  assert.equal(point.blobs[8], "linkedin");
  assert.equal(point.blobs[10], "site-launch");
  assert.equal(point.blobs[12], "US");
  assert.equal(point.blobs[13], "KY");
  assert.equal(point.blobs[14], "desktop");
  assert.equal(point.doubles[0], 50);
  assert.equal(point.doubles[2], 83.4);
  assert.doesNotMatch(
    JSON.stringify(point),
    /private=query|Mozilla\/5\.0|www\.linkedin\.com/,
  );
});

test("collapses personalized campaign values instead of retaining them", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({
      payload: {
        ...validPayload,
        utmCampaign: "jane@example.com",
        utmContent: "Jane Smith",
      },
    }),
    env,
  );

  assert.equal(response.status, 204);
  assert.equal(points.length, 1);
  assert.equal(points[0].blobs[10], "other");
  assert.equal(points[0].blobs[11], "other");
  assert.doesNotMatch(JSON.stringify(points[0]), /jane|example\.com|smith/i);
});

test("rejects methods other than POST", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(makeRequest({ method: "GET" }), env);

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
  assert.equal(points.length, 0);
});

test("rejects cross-origin browser submissions", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({
      headers: {
        origin: "https://attacker.example",
        "sec-fetch-site": "cross-site",
      },
    }),
    env,
  );

  assert.equal(response.status, 403);
  assert.equal(points.length, 0);
});

test("rejects submissions without a production Origin header", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({ headers: { origin: "" } }),
    env,
  );

  assert.equal(response.status, 403);
  assert.equal(points.length, 0);
});

test("accepts the www production origin", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({ headers: { origin: "https://www.tamathe.com" } }),
    env,
  );

  assert.equal(response.status, 204);
  assert.equal(points.length, 1);
});

test("rejects unknown events and invalid page-view identifiers", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({
      payload: { ...validPayload, event: "capture_everything", pageViewId: "visitor-1" },
    }),
    env,
  );

  assert.equal(response.status, 400);
  assert.equal(points.length, 0);
});

test("rejects unknown fields instead of silently accepting personal data", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({ payload: { ...validPayload, email: "person@example.com" } }),
    env,
  );

  assert.equal(response.status, 400);
  assert.equal(points.length, 0);
});

test("rejects video events for the ambient autoplay reel", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({
      payload: {
        ...validPayload,
        event: "video_start",
        videoId: "speaker-compilation-loop",
      },
    }),
    env,
  );

  assert.equal(response.status, 400);
  assert.equal(points.length, 0);
});

test("honors browser privacy signals without recording an event", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({ headers: { "sec-gpc": "1" } }),
    env,
  );

  assert.equal(response.status, 204);
  assert.equal(points.length, 0);
});

test("silently drops known crawler traffic", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({ headers: { "user-agent": "LinkedInBot/1.0" } }),
    env,
  );

  assert.equal(response.status, 204);
  assert.equal(points.length, 0);
});

test("stores no city, ASN, coordinates, or raw network metadata", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({
      cf: {
        country: "US",
        regionCode: "KY",
        city: "Lexington",
        asn: 64512,
        asOrganization: "Example University",
        latitude: "38.04",
        longitude: "-84.50",
      },
    }),
    env,
  );

  assert.equal(response.status, 204);
  assert.equal(points.length, 1);
  assert.doesNotMatch(
    JSON.stringify(points[0]),
    /Lexington|64512|Example University|38\.04|-84\.50/,
  );
});

test("analytics binding failures remain invisible to visitors", async () => {
  const response = await handleAnalyticsRequest(makeRequest(), {
    SITE_ANALYTICS: {
      writeDataPoint() {
        throw new Error("simulated binding failure");
      },
    },
  });

  assert.equal(response.status, 204);
  assert.equal(await response.text(), "");
});

test("rejects oversized payloads", async () => {
  const { env, points } = captureEnvironment();
  const response = await handleAnalyticsRequest(
    makeRequest({
      payload: { ...validPayload, content: "x".repeat(5000) },
    }),
    env,
  );

  assert.equal(response.status, 413);
  assert.equal(points.length, 0);
});
