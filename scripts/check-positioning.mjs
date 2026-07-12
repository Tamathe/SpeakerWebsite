import { readFileSync } from "node:fs";

const source = [
  readFileSync("index.html", "utf8"),
  readFileSync("src/content.ts", "utf8"),
  readFileSync("src/App.tsx", "utf8"),
  readFileSync("src/components/WorkWall.tsx", "utf8"),
  readFileSync("src/wallContent.ts", "utf8"),
].join("\n");

const requiredSignals = [
  "TAMA THÉ",
  "PHYSICIAN · EDUCATOR · BUILDER",
  "The promise of AI for Kentucky healthcare",
  "Kentucky is not a clean diagram.",
  "The model is usually the easy part.",
  "People need practice, not another AI webinar.",
  "Screening creates a connection problem.",
  "AI for assessment and evaluation",
  "Personalizing Learning with AI",
  "Precision Medicine 2.0",
  "Bring me the messy version.",
  "FIND SOMETHING",
];

const rejectedSignals = [
  "Academic medicine | Higher education | AI",
  "Work, talks, and writing on AI in academic medicine and higher education.",
  "Teaching, writing, and institutional work",
  "Clinical and academic context",
  "Watch featured talk",
  "The strongest reel belongs here.",
  "Proof points",
  "Invite Dr.",
  "paid keynote work",
  "Academic AI Speaker",
  "AI in Academic Medicine and Higher Education",
  "Current focus",
  "generic AI",
  "source-grounded semantic atlas",
  "Building the connective tissue",
  "Judgment is the infrastructure",
  "No project lives alone",
  "Built with AI. Grounded by humans.",
];

const missingSignals = requiredSignals.filter((signal) => !source.includes(signal));
const presentRejectedSignals = rejectedSignals.filter((signal) =>
  source.includes(signal),
);

if (missingSignals.length > 0 || presentRejectedSignals.length > 0) {
  console.error("Positioning check failed.");

  if (missingSignals.length > 0) {
    console.error("Missing public-professional signals:");
    for (const signal of missingSignals) {
      console.error(`- ${signal}`);
    }
  }

  if (presentRejectedSignals.length > 0) {
    console.error("Still contains speaker-sales signals:");
    for (const signal of presentRejectedSignals) {
      console.error(`- ${signal}`);
    }
  }

  process.exit(1);
}

console.log("Positioning check passed.");
