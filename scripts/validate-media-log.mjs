import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const logPath = path.resolve(process.argv[2] || path.join(repoRoot, "docs", "media", "media-log.json"));
const log = JSON.parse(await readFile(logPath, "utf8"));
const errors = [];
const seenIds = new Set();
const seenMediaPaths = new Set();

async function sha256(filePath) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
  return hash.digest("hex").toUpperCase();
}

function resolveRepositoryPath(recordedPath) {
  if (!recordedPath || path.isAbsolute(recordedPath)) {
    throw new Error(`Path must be repository-relative: ${recordedPath}`);
  }
  const resolved = path.resolve(repoRoot, recordedPath);
  if (!resolved.toLowerCase().startsWith(`${repoRoot.toLowerCase()}${path.sep}`)) {
    throw new Error(`Path escapes repository: ${recordedPath}`);
  }
  return resolved;
}

async function validateFile(recordedPath, expectedBytes, expectedHash, label) {
  try {
    const filePath = resolveRepositoryPath(recordedPath);
    const info = await stat(filePath);
    if (!info.isFile()) errors.push(`${label}: not a file (${recordedPath})`);
    if (info.size !== expectedBytes) errors.push(`${label}: byte length mismatch (${recordedPath})`);
    const actualHash = await sha256(filePath);
    if (actualHash !== expectedHash) errors.push(`${label}: SHA-256 mismatch (${recordedPath})`);
  } catch (error) {
    errors.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const item of log.items || []) {
  if (seenIds.has(item.id)) errors.push(`Duplicate item id: ${item.id}`);
  seenIds.add(item.id);
  if (seenMediaPaths.has(item.archive?.mediaPath)) errors.push(`Duplicate media path: ${item.archive?.mediaPath}`);
  seenMediaPaths.add(item.archive?.mediaPath);

  await validateFile(item.archive?.mediaPath, item.archive?.bytes, item.archive?.sha256, `${item.id} primary`);
  for (const entry of item.derivatives || []) {
    await validateFile(entry.path, entry.bytes, entry.sha256, `${item.id} ${entry.role}`);
  }
}

const computed = {
  primaryItems: log.items.length,
  videos: log.items.filter((item) => item.type === "video").length,
  audioEpisodes: log.items.filter((item) => item.type === "audio").length,
  primaryBytes: log.items.reduce((sum, item) => sum + item.archive.bytes, 0),
  totalDurationSeconds: Number(log.items.reduce((sum, item) => sum + item.technical.durationSeconds, 0).toFixed(3)),
  completeTranscripts: log.items.filter((item) => item.processing.transcriptionStatus === "complete").length,
  captionSidecarsOnly: log.items.filter((item) => item.processing.transcriptionStatus === "caption_sidecar_only").length,
  withoutTranscriptOrCaptions: log.items.filter((item) => item.processing.transcriptionStatus === "not_started").length
};

for (const [name, value] of Object.entries(computed)) {
  if (log.summary?.[name] !== value) errors.push(`Summary mismatch for ${name}: expected ${value}, recorded ${log.summary?.[name]}`);
}

const serialized = JSON.stringify(log);
if (/x-amz-|signature=|key-pair-id=/i.test(serialized)) {
  errors.push("Catalog appears to contain an expiring signed URL.");
}

console.log(JSON.stringify({ logPath, validatedItems: log.items.length, computed, errors }, null, 2));
if (errors.length) process.exitCode = 1;
