import { readFileSync } from "node:fs";

const source = [
  readFileSync("index.html", "utf8"),
  readFileSync("src/siteContent.ts", "utf8"),
  readFileSync("src/siteManifest.ts", "utf8"),
  readFileSync("src/components/SiteShell.tsx", "utf8"),
  readFileSync("src/pages/HomePage.tsx", "utf8"),
  readFileSync("src/pages/HealthcarePage.tsx", "utf8"),
  readFileSync("src/pages/MedicalEducationPage.tsx", "utf8"),
  readFileSync("src/pages/IncubatorPage.tsx", "utf8"),
  readFileSync("src/pages/AiLiteracyPage.tsx", "utf8"),
  readFileSync("src/pages/SpeakingPage.tsx", "utf8"),
].join("\n");

const requiredSignals = [
  "Tama Thé",
  "Build the connections that turn information into care.",
  "Finding risk earlier is not enough.",
  "The last mile is the whole point.",
  "KY-AHEAD",
  "Rural Diabetic Retinopathy Screening",
  "Whole-Blood Drone Delivery",
  "Entrustable Professional AI",
  "AI Incubator",
  "People need practice, not another AI webinar.",
  "Speaking",
  "Bring me the messy version.",
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
