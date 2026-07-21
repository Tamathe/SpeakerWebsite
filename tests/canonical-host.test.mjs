import assert from "node:assert/strict";
import test from "node:test";

import siteWorker from "../worker/index.js";

test("www requests redirect to the canonical apex host", async () => {
  const response = await siteWorker.fetch(
    new Request(
      "https://www.tamathe.com/?utm_source=linkedin&utm_medium=profile&utm_campaign=site-launch#contact",
    ),
    {},
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://tamathe.com/?utm_source=linkedin&utm_medium=profile&utm_campaign=site-launch#contact",
  );
});
