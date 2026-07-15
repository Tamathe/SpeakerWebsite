export const VIDEO_WATCH_FLUSH_INTERVAL_MS = 15_000;
export const MAX_VIDEO_WATCH_GAP_MS = 30_000;

export function boundedWatchSeconds(startedAtMs: number, endedAtMs: number) {
  if (!Number.isFinite(startedAtMs) || !Number.isFinite(endedAtMs)) return 0;

  const elapsedMs = Math.max(0, endedAtMs - startedAtMs);
  return Math.min(elapsedMs, MAX_VIDEO_WATCH_GAP_MS) / 1000;
}
