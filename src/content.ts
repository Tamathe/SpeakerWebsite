import type {
  BriefingPreset,
  CredentialItem,
  FieldNote,
  SignalNode,
  SystemLayer,
  TalkItem,
} from "./types";

export const signalNodes: SignalNode[] = [
  {
    id: "screening",
    index: "01",
    title: "Cancer screening",
    shortTitle: "Screening",
    color: "chartreuse",
    position: { x: 18, y: 22 },
    thesis: "Find the gap. Make the next step accountable.",
    problem:
      "People who are overdue for high-impact cancer prevention are often invisible to any one part of the care system.",
    aiRole:
      "Connect risk signals, public-health data, tailored outreach, and a navigable next action.",
    humanGuardrail:
      "Outreach is only useful when responsibility for scheduling, explanation, and follow-through is explicit.",
    evidence:
      "AHEAD is a state-funded Kentucky CHFS partnership focused on closing cancer-screening gaps.",
    sourceLabel: "AHEAD project record",
    keywords: [
      "cancer",
      "screening",
      "prevention",
      "public health",
      "outreach",
      "chfs",
      "population",
      "kentucky",
    ],
  },
  {
    id: "retina",
    index: "02",
    title: "Diabetic retinopathy",
    shortTitle: "Retinopathy",
    color: "cyan",
    position: { x: 77, y: 18 },
    thesis: "Move detection closer to where patients already are.",
    problem:
      "A proven model still fails if screening is difficult to reach or the result never becomes a completed handoff.",
    aiRole:
      "Support image-based screening in primary care so earlier detection can happen outside a specialty clinic.",
    humanGuardrail:
      "The clinical value depends on referral ownership, understandable results, and a reliable path to follow-up.",
    evidence:
      "Current work explores AI-supported screening, clearer handoffs, and practical patient navigation.",
    sourceLabel: "Diabetic-retinopathy project record",
    keywords: [
      "diabetes",
      "retina",
      "retinopathy",
      "vision",
      "screening",
      "primary care",
      "follow-up",
      "detection",
    ],
  },
  {
    id: "infrastructure",
    index: "03",
    title: "Rural access + infrastructure",
    shortTitle: "Access",
    color: "orange",
    position: { x: 83, y: 71 },
    thesis: "Build for the whole route, not the cleanest zip code.",
    problem:
      "Rural distance, fragmented systems, and uneven access can turn a technically good idea into an unusable service.",
    aiRole:
      "Help coordinate statewide signals and adapt communication to the people and places a system is meant to serve.",
    humanGuardrail:
      "Local workflow, access, language, trust, and ownership have to shape the technology—not arrive after it.",
    evidence:
      "Kentucky healthcare work links screening, public-health infrastructure, and practical implementation across the Commonwealth.",
    sourceLabel: "Dreams of Data",
    sourceHref: "https://www.kentuckyrec.com/2025-annual-conference/",
    keywords: [
      "rural",
      "access",
      "kentucky",
      "statewide",
      "infrastructure",
      "public sector",
      "equity",
      "health system",
    ],
  },
  {
    id: "literacy",
    index: "04",
    title: "AI literacy",
    shortTitle: "Literacy",
    color: "chartreuse",
    position: { x: 51, y: 48 },
    thesis: "Judgment is the infrastructure.",
    problem:
      "Access to AI is moving faster than the shared judgment needed to use it well in clinical and educational settings.",
    aiRole:
      "Create practical ways for clinicians, educators, staff, and students to learn by doing, testing, and reflecting.",
    humanGuardrail:
      "Fluency means knowing when a tool is useful, risky, ungrounded, or simply beside the point.",
    evidence:
      "Co-created the University of Kentucky's institutional AI literacy curriculum and founded the UK AI Incubator.",
    sourceLabel: "UK AI literacy + Incubator work",
    keywords: [
      "education",
      "curriculum",
      "literacy",
      "faculty",
      "student",
      "training",
      "workshop",
      "university",
      "incubator",
    ],
  },
  {
    id: "reasoning",
    index: "05",
    title: "Clinical reasoning + assessment",
    shortTitle: "Reasoning",
    color: "cyan",
    position: { x: 20, y: 76 },
    thesis: "Use AI to sharpen thinking—not hide it.",
    problem:
      "Generative systems can produce fluent answers while making the quality of the underlying reasoning harder to see.",
    aiRole:
      "Explore AI as a reference, teaching partner, and assessment surface for diagnostic reasoning and decision-making.",
    humanGuardrail:
      "The goal is better human judgment, with uncertainty, provenance, and evaluation kept visible.",
    evidence:
      "Grant-supported clinical-reasoning work builds on a completed NBME AI Research Fellowship in June 2026.",
    sourceLabel: "Clinical reasoning + NBME fellowship",
    keywords: [
      "clinical",
      "reasoning",
      "assessment",
      "diagnosis",
      "evaluation",
      "medical education",
      "nbme",
      "research",
    ],
  },
];

export const briefingPresets: BriefingPreset[] = [
  {
    label: "Health-system leader",
    prompt: "How do you move healthcare AI beyond the pilot?",
  },
  {
    label: "Conference organizer",
    prompt: "What would make a practical AI talk memorable?",
  },
  {
    label: "Educator",
    prompt: "How should clinicians learn to work with AI?",
  },
  {
    label: "Public-sector partner",
    prompt: "Where can AI help statewide prevention in Kentucky?",
  },
];

export const systemLayers: SystemLayer[] = [
  {
    id: "model",
    index: "01",
    label: "Model",
    title: "Can it detect or generate the right thing?",
    description:
      "Performance matters. It is also the beginning of the system, not the end of the work.",
    failure: "A benchmark win with no usable path into care.",
    question: "What is the model allowed to decide—and what is it not?",
  },
  {
    id: "workflow",
    index: "02",
    label: "Workflow",
    title: "Can it survive contact with a real Tuesday?",
    description:
      "The tool has to fit existing people, time, handoffs, constraints, and incentives.",
    failure: "A separate dashboard that quietly becomes one more inbox.",
    question: "Whose work changes when the signal appears?",
  },
  {
    id: "trust",
    index: "03",
    label: "Trust",
    title: "Can a person understand what happens next?",
    description:
      "Useful communication respects language, context, uncertainty, and the right to ask a human.",
    failure: "Technically correct outreach that nobody believes or acts on.",
    question: "What would make this legible to the person receiving it?",
  },
  {
    id: "ownership",
    index: "04",
    label: "Ownership",
    title: "Who is accountable for the handoff?",
    description:
      "Every recommendation needs a named path from signal to scheduling, care, or follow-up.",
    failure: "The algorithm finds the gap; the system leaves it open.",
    question: "Who owns the next step when the model is right?",
  },
  {
    id: "learning",
    index: "05",
    label: "Learning loop",
    title: "Can the system learn without hiding harm?",
    description:
      "Feedback, drift, missed cases, and uneven outcomes have to remain observable over time.",
    failure: "A pilot freezes into infrastructure without a feedback loop.",
    question: "What evidence would make us change or stop this system?",
  },
];

export const talks: TalkItem[] = [
  {
    id: "dreams-of-data",
    title: "Dreams of Data: The Promise of AI for Kentucky Healthcare",
    audience: "Kentucky REC Annual Conference",
    summary:
      "From AI excitement to data-driven, practical precision medicine across the Commonwealth.",
    href: "https://www.kentuckyrec.com/2025-annual-conference/",
    keywords: ["kentucky", "health system", "rural", "screening"],
  },
  {
    id: "precision-medicine",
    title: "Precision Medicine 2.0: Logistical Precision with AI",
    audience: "Markey Cancer Center",
    summary:
      "Making precision medicine more operational, reachable, and useful beyond the model demo.",
    href: "https://cme.cecentral.com/node/3673/bio/11990/view",
    keywords: ["cancer", "implementation", "precision", "healthcare"],
  },
  {
    id: "dawn-of-ai",
    title: "The Dawn of AI in Medical Education",
    audience: "SAEM webinar",
    summary:
      "Large language models, clinical reasoning assessment, and what medical education has to build next.",
    href:
      "https://www.saem.org/detail-pages/media/the-dawn-of-ai-in-medical-education",
    keywords: ["education", "reasoning", "assessment", "llm"],
  },
  {
    id: "personalizing-learning",
    title: "Personalizing Learning with AI",
    audience: "Cassyni",
    summary:
      "AI as an invisible layer over professional life, learning, and the systems clinicians work inside.",
    href: "https://cassyni.com/events/HVY1tsKLvcDMQrSyQAqNds",
    note: "Starts at 29:00",
    keywords: ["education", "learning", "clinical", "faculty"],
  },
  {
    id: "assessment",
    title: "AI for Assessment and Evaluation in Medical Education",
    audience: "Cassyni",
    summary:
      "Why educators need to build, test, and understand AI-powered assessment and feedback.",
    href: "https://cassyni.com/events/R2RUrHw6cqfDzUzGihxfkq",
    note: "Starts at 19:00",
    keywords: ["assessment", "evaluation", "education", "faculty"],
  },
];

export const fieldNotes: FieldNote[] = [
  {
    type: "Field note / 01",
    title: "The hard part is not the model demo.",
    summary:
      "It is the handoff, the explanation, the accountable next step, and the follow-through.",
  },
  {
    type: "Field note / 02",
    title: "AI literacy is clinical infrastructure.",
    summary:
      "People need better ways to decide when a system is useful, risky, ungrounded, or beside the point.",
  },
  {
    type: "Field note / 03",
    title: "Human connection is not the fallback.",
    summary:
      "It is the point of building more precise, reachable, and responsive systems of care.",
  },
];

export const credentials: CredentialItem[] = [
  {
    label: "Clinical practice",
    detail: "Pediatric emergency physician",
  },
  {
    label: "Public health",
    detail: "Principal investigator, state-funded AHEAD project",
  },
  {
    label: "Research",
    detail: "Completed NBME AI Research Fellowship · June 2026",
  },
  {
    label: "Institutional AI",
    detail: "UK AI curriculum · AI Incubator · UK–Microsoft collaboration",
  },
];

export const contactEmail =
  "mailto:tsthe2@uky.edu?subject=Healthcare%20AI%20conversation";
