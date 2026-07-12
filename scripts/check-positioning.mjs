import { readFileSync } from "node:fs";

const source = [
  readFileSync("index.html", "utf8"),
  readFileSync("src/content.ts", "utf8"),
  readFileSync("src/App.tsx", "utf8"),
].join("\n");

const requiredSignals = [
  "Tama Thé",
  "Making AI useful in healthcare.",
  "Physician · Educator · AI builder",
  "Cancer screening",
  "Diabetic retinopathy",
  "Kentucky CHFS",
  "AI Incubator",
  "Completed NBME AI Research Fellowship",
  "June 2026",
  "Dreams of Data",
  "Precision Medicine 2.0",
  "Ask about my work",
  "The model is usually the easy part.",
  "HAVE A PRACTICAL AI PROBLEM?",
  "Let's talk.",
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
