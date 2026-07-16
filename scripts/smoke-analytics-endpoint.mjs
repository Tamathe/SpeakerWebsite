const baseUrl = new URL(process.argv[2] || "http://127.0.0.1:4175/");
const endpoint = new URL(process.argv[3] || "/api/analytics", baseUrl);
const body = JSON.stringify({
  version: 1,
  event: "page_view",
  path: "/",
  pageViewId: "6c65b4a8-4dc7-41b3-8762-54db70de36bd",
  utmSource: "linkedin",
  utmMedium: "post",
  utmCampaign: "site-launch",
});

function post(origin, fetchSite) {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "text/plain;charset=UTF-8",
      origin,
      "sec-fetch-site": fetchSite,
      "sec-fetch-dest": "empty",
    },
    body,
  });
}

const [valid, crossOrigin, wrongMethod, home] = await Promise.all([
  post(baseUrl.origin, endpoint.origin === baseUrl.origin ? "same-origin" : "same-site"),
  post("https://attacker.example", "cross-site"),
  fetch(endpoint),
  fetch(new URL("/?analytics_debug=1&utm_source=linkedin&utm_campaign=site-launch", baseUrl)),
]);

const result = {
  validPost: valid.status,
  crossOrigin: crossOrigin.status,
  wrongMethod: wrongMethod.status,
  home: home.status,
};

const expected = {
  validPost: 204,
  crossOrigin: 403,
  wrongMethod: 405,
  home: 200,
};

if (JSON.stringify(result) !== JSON.stringify(expected)) {
  throw new Error(`Analytics endpoint smoke test failed: ${JSON.stringify(result)}`);
}

process.stdout.write(`${JSON.stringify(result)}\n`);
