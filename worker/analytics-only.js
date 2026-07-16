import { handleAnalyticsRequest } from "./analytics.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/analytics") {
      return handleAnalyticsRequest(request, env);
    }

    return new Response("Not found", {
      status: 404,
      headers: { "cache-control": "no-store" },
    });
  },
};
