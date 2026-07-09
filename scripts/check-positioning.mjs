import { readFileSync } from "node:fs";

const source = [
  readFileSync("index.html", "utf8"),
  readFileSync("src/content.ts", "utf8"),
  readFileSync("src/App.tsx", "utf8"),
].join("\n");

const requiredSignals = [
  "Work, talks, and writing on AI in academic medicine and higher education.",
  "Explore the work",
  "Teaching, writing, and institutional work",
  "For invitations and collaborations",
  "Clinical and academic context",
  "AI in Academic Medicine and Higher Education",
];

const rejectedSignals = [
  "Watch featured talk",
  "The strongest reel belongs here.",
  "Proof points",
  "Invite Dr.",
  "paid keynote work",
  "Academic AI Speaker",
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
