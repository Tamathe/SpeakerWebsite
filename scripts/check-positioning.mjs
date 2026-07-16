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
  "Solving problems with data-driven precision.",
  "Making AI useful means connecting data to action.",
  "speaker-compilation-loop.mp4",
  "video-led-hero",
  "View current work",
  "Connecting healthcare information across Kentucky.",
  "A shared statewide data infrastructure will identify patients at",
  "NBME Invitational Conference for Educators (NICE) - June 2026",
  "tek100-tama-excerpt.mp4",
  "Current work in healthcare.",
  "AI literacy at the University of Kentucky.",
  "KY-AHEAD",
  "Rural Diabetic Retinopathy Screening",
  "Whole-Blood Drone Delivery",
  "AI Incubator",
  "Selected talks and public presentations.",
  "Speaking",
  "Questions about the work?",
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
  "The throughline",
  "See the throughline",
  "The output is not the outcome.",
  "Start with the problem that crosses the lines.",
  "Take the hard part into the room.",
  "Give unfinished ideas a path to action.",
  "Put ideas to work",
  "Build shared direction",
  "Build the judgment",
  "Making AI useful means connecting information to action.",
  "Kentucky risks repeating the fragmented rollout of electronic",
  "NBME NICE 2026 · Presentation excerpt",
  "tek100-tech-agnostic-excerpt.mp4",
  "hero-facts proof-strip",
  "className=\"page-kicker\"",
  "className=\"section-index\"",
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
