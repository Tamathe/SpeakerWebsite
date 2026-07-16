import assert from "node:assert/strict";
import test from "node:test";

import analyticsWorker from "../worker/analytics-only.js";

test("the analytics-only Worker serves no site content", async () => {
  const response = await analyticsWorker.fetch(
    new Request("https://tamathe.com/"),
    {},
  );

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("the analytics-only Worker accepts the allowlisted endpoint", async () => {
  const points = [];
  const response = await analyticsWorker.fetch(
    new Request("https://analytics.tamathe.com/api/analytics", {
      method: "POST",
      headers: {
        "content-type": "text/plain;charset=UTF-8",
        origin: "https://tamathe.com",
        "sec-fetch-site": "same-site",
      },
      body: JSON.stringify({
        version: 1,
        event: "page_view",
        path: "/",
        pageViewId: "6c65b4a8-4dc7-41b3-8762-54db70de36bd",
      }),
    }),
    {
      SITE_ANALYTICS: {
        writeDataPoint(point) {
          points.push(point);
        },
      },
    },
  );

  assert.equal(response.status, 204);
  assert.equal(points.length, 1);
});
