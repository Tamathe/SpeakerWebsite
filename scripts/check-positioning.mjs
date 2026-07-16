import { readFileSync } from "node:fs";

const source = [
  readFileSync("index.html", "utf8"),
  readFileSync("src/siteContent.ts", "utf8"),
  readFileSync("src/siteManifest.ts", "utf8"),
  readFileSync("src/components/SiteShell.tsx", "utf8"),
  readFileSync("src/components/AmbientSpeakerVideo.tsx", "utf8"),
  readFileSync("src/pages/SpeakingPage.tsx", "utf8"),
].join("\n");

const requiredSignals = [
  "Tama Thé",
  "Making AI useful means connecting information to action.",
  "speaker-compilation-loop.mp4",
  "video-led-hero",
  "Watch the argument",
  "The output is not the outcome.",
  "Connect the signal to the next step.",
  "mission-case-visual",
  "/images/studio/ai-for-ky.png",
  "KY-AHEAD",
  "Rural Diabetic Retinopathy Screening",
  "Whole-Blood Drone Delivery",
  "AI Incubator",
  "People need practice turning AI output into a decision.",
  "Speaking",
  "Start with the problem that crosses the lines.",
];

const rejectedSignals = [
  "Academic AI Speaker",
  "Watch featured talk",
  "Invite Tama to speak",
  "Proof points",
  "Invite Dr.",
  "paid keynote work",
  "generic AI",
  "The strongest reel belongs here.",
  "mission-last-mile",
  "mission-infrastructure",
  "service-layer",
  "Ã",
  "Â",
  "â€",
];

const missingSignals = requiredSignals.filter((signal) => !source.includes(signal));
const presentRejectedSignals = rejectedSignals.filter((signal) =>
  source.includes(signal),
);

if (missingSignals.length > 0 || presentRejectedSignals.length > 0) {
  console.error("Positioning check failed.");

  if (missingSignals.length > 0) {
    console.error("Missing required signals:");
    for (const signal of missingSignals) {
      console.error(`- ${signal}`);
    }
  }

  if (presentRejectedSignals.length > 0) {
    console.error("Contains rejected or corrupted signals:");
    for (const signal of presentRejectedSignals) {
      console.error(`- ${signal}`);
    }
  }

  process.exit(1);
}

console.log("Positioning check passed.");
