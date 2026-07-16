import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createReadStream } from "node:fs";
import { access, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const mediaRoot = path.resolve(process.argv[2] || path.join(repoRoot, "Media"));
const jsonPath = path.resolve(process.argv[3] || path.join(repoRoot, "docs", "media", "media-log.json"));
const markdownPath = path.resolve(process.argv[4] || path.join(repoRoot, "docs", "media", "MEDIA_LOG.md"));

const VIDEO_OVERRIDES = {
  "AAMC-AI-for-Assessment-and-Evaluation-in-Medical-Education-2025": {
    series: "AI for Medical Educators",
    publisher: "AAMC"
  },
  "AAMC-Personalizing-Learning-with-AI-2025": {
    series: "AI for Medical Educators",
    publisher: "AAMC"
  },
  "AI-OSCE-Grader": {
    title: "AI OSCE Grader",
    publisher: "User-provided recording",
    platform: "local_file",
    notes: "Copied from the user-provided local master; its former Downloads path is intentionally omitted."
  },
  "Kentucky-Legislature-AI-at-UK-2025": {
    title: "Artificial Intelligence Task Force 2025 - AI at UK section",
    series: "Kentucky Artificial Intelligence Task Force",
    publisher: "Kentucky Legislative Research Commission",
    notes: "The archived file is a selected section of the longer source recording."
  },
  "SAEM-The-Dawn-of-AI-in-Medical-Education-2025": {
    series: "SAEM",
    publisher: "SAEM"
  },
  "Tama-The_NICE-2026": {
    title: "Tama The - The NICE 2026",
    series: "The NICE",
    publisher: "Frame.io delivery",
    platform: "frame.io",
    publishedDate: "2026",
    notes: "Archived from a delivered Frame.io master; expiring signed delivery URL intentionally omitted."
  },
  "UK-x-Microsoft-CATS-AI-in-Action-2026": {
    series: "CATS AI in Action",
    publisher: "University of Kentucky"
  },
  "WKYT-UK-Partners-with-Microsoft-First-AI-Conference-2026": {
    publisher: "WKYT",
    platform: "wkyt_arc_publishing",
    canonicalUrl: "https://www.wkyt.com/video/2026/02/27/uk-partners-with-microsoft-first-ai-conference-campus/",
    notes: "Source metadata duration differs from the downloaded news clip; local technical facts describe the archived file."
  }
};

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function sha256(filePath) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
  return hash.digest("hex").toUpperCase();
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function isoDate(uploadDate) {
  if (!/^\d{8}$/.test(uploadDate || "")) return null;
  return `${uploadDate.slice(0, 4)}-${uploadDate.slice(4, 6)}-${uploadDate.slice(6, 8)}`;
}

function platformFromMetadata(metadata) {
  if (metadata?.extractor === "youtube") return "youtube";
  if (metadata?.extractor === "vimeo") return "vimeo";
  if (metadata?.extractor === "ArcPublishing") return "arc_publishing";
  return metadata?.extractor || "unknown";
}

function probe(filePath) {
  const payload = JSON.parse(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,format_name,bit_rate",
    "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels",
    "-of", "json",
    filePath
  ], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024, windowsHide: true }));
  const video = payload.streams?.find((stream) => stream.codec_type === "video") || null;
  const audio = payload.streams?.find((stream) => stream.codec_type === "audio") || null;
  let fps = null;
  if (video?.r_frame_rate?.includes("/")) {
    const [numerator, denominator] = video.r_frame_rate.split("/").map(Number);
    if (denominator) fps = Number((numerator / denominator).toFixed(3));
  }
  return {
    durationSeconds: Number(Number(payload.format?.duration || 0).toFixed(3)),
    width: video?.width || null,
    height: video?.height || null,
    resolution: video?.width && video?.height ? `${video.width}x${video.height}` : null,
    container: payload.format?.format_name || null,
    videoCodec: video?.codec_name || null,
    audioCodec: audio?.codec_name || null,
    fps,
    bitRate: payload.format?.bit_rate ? Number(payload.format.bit_rate) : null,
    sampleRate: audio?.sample_rate ? Number(audio.sample_rate) : null,
    channels: audio?.channels || null
  };
}

async function derivative(filePath, role, extras = {}) {
  const info = await stat(filePath);
  return {
    role,
    path: relative(filePath),
    bytes: info.size,
    sha256: await sha256(filePath),
    ...extras
  };
}

function durationClock(totalSeconds) {
  const seconds = Math.round(totalSeconds || 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function markdownEscape(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function videoItems() {
  const names = (await readdir(mediaRoot)).filter((name) => name.toLowerCase().endsWith(".mp4")).sort();
  const items = [];

  for (const name of names) {
    const mediaPath = path.join(mediaRoot, name);
    const base = path.basename(name, path.extname(name));
    const override = VIDEO_OVERRIDES[base] || {};
    const metadataPath = path.join(mediaRoot, `${base}.info.json`);
    const metadata = await exists(metadataPath) ? await readJson(metadataPath) : null;
    const mediaInfo = await stat(mediaPath);
    const technical = probe(mediaPath);
    const derivatives = [];

    if (metadata) {
      derivatives.push(await derivative(metadataPath, "source_metadata", {
        format: "json",
        origin: "download_tool",
        status: "archived"
      }));
    }

    const siblingNames = await readdir(mediaRoot);
    for (const sibling of siblingNames.filter((candidate) => candidate.startsWith(`${base}.`) && candidate.toLowerCase().endsWith(".vtt")).sort()) {
      const languageMatch = sibling.match(/\.([a-z]{2}(?:-[a-z0-9-]+)?)\.vtt$/i);
      derivatives.push(await derivative(path.join(mediaRoot, sibling), "captions", {
        language: languageMatch?.[1] || null,
        format: "webvtt",
        origin: "source_platform",
        status: "archived_unreviewed"
      }));
    }

    const transcriptPath = path.join(mediaRoot, `${base}.txt`);
    const receiptPath = path.join(mediaRoot, "_Codex", "receipts", `${base}.receipt.json`);
    if (await exists(transcriptPath)) {
      derivatives.push(await derivative(transcriptPath, "transcript", {
        language: "en",
        format: "text",
        origin: "project_transcription_pipeline",
        status: await exists(receiptPath) ? "hash_verified_unreviewed" : "unverified"
      }));
    }
    if (await exists(receiptPath)) {
      derivatives.push(await derivative(receiptPath, "transcription_receipt", {
        format: "json",
        origin: "project_transcription_pipeline",
        status: "hash_verified"
      }));
    }

    const title = override.title || metadata?.title || base.replaceAll("-", " ");
    const platform = override.platform || platformFromMetadata(metadata);
    const sourceUrl = override.canonicalUrl || (metadata?.webpage_url?.startsWith("http") ? metadata.webpage_url : null);
    const hasTranscript = derivatives.some((entry) => entry.role === "transcript");
    const hasCaptions = derivatives.some((entry) => entry.role === "captions");

    items.push({
      id: `video-${metadata?.id || base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      type: "video",
      title,
      series: override.series || null,
      publisher: override.publisher || metadata?.uploader || metadata?.channel || null,
      publishedDate: override.publishedDate || isoDate(metadata?.upload_date),
      source: {
        inputUrl: sourceUrl,
        canonicalUrl: sourceUrl,
        platform,
        sourceId: metadata?.id || null,
        retrievedAt: mediaInfo.birthtime.toISOString(),
        sourceDurationSeconds: metadata?.duration ?? null,
        notes: override.notes || null
      },
      archive: {
        mediaPath: relative(mediaPath),
        metadataPath: metadata ? relative(metadataPath) : null,
        bytes: mediaInfo.size,
        sha256: await sha256(mediaPath),
        acquiredAt: mediaInfo.birthtime.toISOString()
      },
      technical,
      derivatives,
      processing: {
        downloadStatus: "complete",
        integrityStatus: "verified_by_hash_and_probe",
        transcriptionStatus: hasTranscript ? "complete" : hasCaptions ? "caption_sidecar_only" : "not_started",
        captionStatus: hasCaptions ? "archived_unreviewed" : "none",
        processedAt: new Date().toISOString(),
        notes: metadata?.duration && Math.abs(Number(metadata.duration) - technical.durationSeconds) > 2
          ? `Source metadata reports ${metadata.duration} seconds; archived file probes at ${technical.durationSeconds} seconds.`
          : null
      },
      rights: {
        reuseStatus: "not_assessed",
        notes: "Confirm publication and participant permissions before reuse."
      }
    });
  }
  return items;
}

async function mdmItems() {
  const showRoot = path.join(mediaRoot, "The MDM");
  const manifestPath = path.join(showRoot, "The-MDM.show.json");
  if (!(await exists(manifestPath))) return [];
  const show = await readJson(manifestPath);
  const items = [];

  for (const episode of show.episodes) {
    const audioPath = path.join(showRoot, episode.audioFile);
    const base = path.basename(episode.audioFile, path.extname(episode.audioFile));
    const metadataPath = path.join(showRoot, episode.metadataFile);
    const metadata = await readJson(metadataPath);
    const transcriptPath = path.join(showRoot, `${base}.txt`);
    const receiptPath = path.join(showRoot, "_Codex", "receipts", `${base}.receipt.json`);
    const derivatives = [
      await derivative(metadataPath, "source_metadata", {
        format: "json",
        origin: "rss_archive",
        status: "archived"
      })
    ];

    if (episode.artworkFile) {
      derivatives.push(await derivative(path.join(showRoot, episode.artworkFile), "artwork", {
        format: "jpeg",
        origin: "publisher",
        status: "archived"
      }));
    }
    if (episode.publisherTranscriptTextFile) {
      derivatives.push(await derivative(path.join(showRoot, episode.publisherTranscriptTextFile), "publisher_transcript", {
        language: "en",
        format: "text",
        origin: "publisher",
        status: "archived_unreviewed"
      }));
      const htmlPath = path.join(showRoot, `${base}.publisher-transcript.html`);
      if (await exists(htmlPath)) {
        derivatives.push(await derivative(htmlPath, "publisher_transcript_source", {
          language: "en",
          format: "html",
          origin: "publisher",
          status: "archived"
        }));
      }
    }
    if (await exists(transcriptPath)) {
      derivatives.push(await derivative(transcriptPath, "transcript", {
        language: "en",
        format: "text",
        origin: "project_transcription_pipeline",
        status: await exists(receiptPath) ? "hash_verified_unreviewed" : "unverified"
      }));
    }
    if (await exists(receiptPath)) {
      derivatives.push(await derivative(receiptPath, "transcription_receipt", {
        format: "json",
        origin: "project_transcription_pipeline",
        status: "hash_verified"
      }));
    }

    const audioInfo = await stat(audioPath);
    const hasTranscript = derivatives.some((entry) => entry.role === "transcript");
    items.push({
      id: `buzzsprout-${episode.id}`,
      type: "audio",
      title: episode.title,
      series: show.title,
      publisher: show.author,
      publishedDate: episode.publishedAt.slice(0, 10),
      episode: {
        season: episode.season,
        number: episode.episode,
        guid: episode.guid
      },
      source: {
        inputUrl: show.spotifyShowUrl,
        canonicalUrl: episode.pageUrl,
        mediaUrl: episode.enclosureUrl,
        platform: "buzzsprout_rss",
        sourceId: episode.id,
        retrievedAt: metadata.source.retrievedAt,
        sourceDurationSeconds: metadata.episode.feedDurationSeconds,
        notes: null
      },
      archive: {
        mediaPath: relative(audioPath),
        metadataPath: relative(metadataPath),
        bytes: audioInfo.size,
        sha256: episode.audioSha256,
        acquiredAt: metadata.source.retrievedAt
      },
      technical: {
        durationSeconds: metadata.technical.durationSeconds,
        width: null,
        height: null,
        resolution: null,
        container: metadata.technical.format,
        videoCodec: null,
        audioCodec: metadata.technical.audioCodec,
        fps: null,
        bitRate: metadata.technical.bitRate,
        sampleRate: metadata.technical.sampleRate,
        channels: metadata.technical.channels
      },
      derivatives,
      processing: {
        downloadStatus: "complete",
        integrityStatus: "verified_by_feed_length_hash_and_probe",
        transcriptionStatus: hasTranscript ? "complete" : "in_progress",
        captionStatus: "not_applicable",
        processedAt: new Date().toISOString(),
        notes: episode.publisherTranscriptTextFile
          ? "Publisher transcript preserved in addition to the project transcript."
          : null
      },
      rights: {
        reuseStatus: "not_assessed",
        notes: "Publicly distributed podcast; confirm any downstream reuse beyond private archival and research."
      }
    });
  }
  return items;
}

await mkdir(path.dirname(jsonPath), { recursive: true });
const items = [...await videoItems(), ...await mdmItems()]
  .sort((left, right) => (right.publishedDate || "").localeCompare(left.publishedDate || "") || left.title.localeCompare(right.title));

const summary = {
  primaryItems: items.length,
  videos: items.filter((item) => item.type === "video").length,
  audioEpisodes: items.filter((item) => item.type === "audio").length,
  primaryBytes: items.reduce((sum, item) => sum + item.archive.bytes, 0),
  totalDurationSeconds: Number(items.reduce((sum, item) => sum + item.technical.durationSeconds, 0).toFixed(3)),
  completeTranscripts: items.filter((item) => item.processing.transcriptionStatus === "complete").length,
  captionSidecarsOnly: items.filter((item) => item.processing.transcriptionStatus === "caption_sidecar_only").length,
  withoutTranscriptOrCaptions: items.filter((item) => item.processing.transcriptionStatus === "not_started").length
};

const updatedAt = new Date().toISOString();
const log = {
  version: 1,
  updatedAt,
  archiveRoot: "Media",
  scope: "Primary audio and video masters held in the project Media archive. Artwork, captions, transcripts, metadata, and receipts are derivatives of those primary items.",
  storage: {
    mediaArchiveTrackedByGit: false,
    catalogTrackedByGit: true,
    pathPolicy: "Repository-relative paths only; private absolute paths and expiring signed URLs are omitted."
  },
  transcriptPolicy: "Project transcripts are machine-generated and hash-verified, not human-certified. Verify quotations, names, and publication captions against the audio.",
  collections: [
    {
      id: "the-mdm",
      title: "The MDM",
      type: "podcast",
      spotifyUrl: "https://open.spotify.com/show/1wTFtEIvYvBS8uJJ8nryC8",
      canonicalUrl: "https://themdm.buzzsprout.com/",
      rssUrl: "https://rss.buzzsprout.com/2371946.rss",
      archiveManifestPath: "Media/The MDM/The-MDM.show.json"
    }
  ],
  relatedCollections: [
    {
      id: "sony-camera-collection",
      title: "Sony camera collection",
      status: "referenced_external_collection_currently_offline",
      itemCount: 23,
      sourceRootAlias: "camera_clip_root",
      curatedIndexPath: "docs/media/curated-index.json",
      notes: "Editorial curation exists, but the separate source volume and private generated inventory were unavailable when this log was generated."
    }
  ],
  summary,
  items
};

await writeFile(jsonPath, `${JSON.stringify(log, null, 2)}\n`, "utf8");

const rows = items.map((item) => {
  const transcript = item.processing.transcriptionStatus === "complete"
    ? "Transcript complete"
    : item.processing.transcriptionStatus === "caption_sidecar_only"
      ? "Source captions only"
      : item.processing.transcriptionStatus === "in_progress"
        ? "Transcribing"
        : "None";
  return `| ${markdownEscape(item.publishedDate || "Unknown")} | ${item.type} | ${markdownEscape(item.series || item.publisher || "-")} | ${markdownEscape(item.title)} | ${durationClock(item.technical.durationSeconds)} | \`${markdownEscape(item.archive.mediaPath)}\` | ${transcript} |`;
});

const markdown = [
  "# Media archive log",
  "",
  `Updated: ${updatedAt.slice(0, 10)}`,
  "",
  "This is the human-readable view of the project-wide source-media catalog. The canonical machine-readable record is `docs/media/media-log.json`.",
  "",
  "## What it tracks",
  "",
  "- Primary audio and video masters stored under the local `Media/` archive.",
  "- Where each item came from, where it lives, and its locally verified technical facts and SHA-256 hash.",
  "- Available metadata, artwork, captions, transcripts, and transcription receipts.",
  "- Processing and rights-review status without storing private absolute paths or expiring signed URLs.",
  "- Machine transcripts are hash-verified but not human-certified; verify quotations, names, and publication captions against the audio.",
  "",
  "The `Media/` folder itself is intentionally excluded from Git because it contains large files. This catalog is versioned in Git. The older `docs/media/curated-index.json` remains a separate editorial index for the external Sony camera collection.",
  "",
  "## Current holdings",
  "",
  `- ${summary.primaryItems} primary recordings: ${summary.videos} videos and ${summary.audioEpisodes} podcast episodes`,
  `- ${durationClock(summary.totalDurationSeconds)} total running time`,
  `- ${(summary.primaryBytes / (1024 ** 3)).toFixed(2)} GiB of primary media`,
  `- ${summary.completeTranscripts} complete project transcripts, ${summary.captionSidecarsOnly} items with source captions only, and ${summary.withoutTranscriptOrCaptions} with neither`,
  "",
  "## Inventory",
  "",
  "| Date | Type | Series / publisher | Title | Duration | Archive path | Text status |",
  "| --- | --- | --- | --- | ---: | --- | --- |",
  ...rows,
  "",
  "## Related collection",
  "",
  "The 23-item Sony camera collection remains documented in `docs/media/curated-index.json`. Its external source volume and private generated inventory were offline during this update, so those individual camera clips are not duplicated here as locally verified archive items.",
  ""
].join("\n");

await writeFile(markdownPath, markdown, "utf8");

console.log(JSON.stringify({ jsonPath, markdownPath, summary }, null, 2));
