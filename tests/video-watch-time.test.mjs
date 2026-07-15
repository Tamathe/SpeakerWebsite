import assert from "node:assert/strict";
import test from "node:test";

import {
  boundedWatchSeconds,
  MAX_VIDEO_WATCH_GAP_MS,
  VIDEO_WATCH_FLUSH_INTERVAL_MS,
} from "../src/videoWatchTime.ts";

test("periodic flushes preserve continuous watch time beyond 30 seconds", () => {
  let watchedSeconds = 0;

  for (
    let endedAt = VIDEO_WATCH_FLUSH_INTERVAL_MS;
    endedAt <= 120_000;
    endedAt += VIDEO_WATCH_FLUSH_INTERVAL_MS
  ) {
    watchedSeconds += boundedWatchSeconds(
      endedAt - VIDEO_WATCH_FLUSH_INTERVAL_MS,
      endedAt,
    );
  }

  assert.equal(watchedSeconds, 120);
});

test("an unexpectedly delayed timing gap is bounded", () => {
  assert.equal(
    boundedWatchSeconds(0, 5 * 60_000),
    MAX_VIDEO_WATCH_GAP_MS / 1000,
  );
});
