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
    thesis: "Screening is not the endpoint.",
    problem:
      "Kentucky has people who are overdue for cancer screening, but the information needed to find and reach them is spread across different parts of the healthcare system.",
    aiRole:
      "AI can help identify people who may be overdue, tailor outreach, and direct them to a specific next step.",
    humanGuardrail:
      "Someone still has to answer questions, help with scheduling, and make sure the referral is completed.",
    evidence:
      "I lead AHEAD, a state-funded partnership with Kentucky CHFS focused on cancer-screening gaps.",
    sourceLabel: "AHEAD",
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
    thesis: "Finding disease early only matters if the patient gets care.",
    problem:
      "Many people with diabetes do not get regular eye screening, especially when an eye clinic is far away.",
    aiRole:
      "AI-assisted cameras can move screening into primary care and flag patients who need follow-up.",
    humanGuardrail:
      "The difficult part is the connection question: who receives the referral, what can be handled locally, and who helps the patient get there?",
    evidence:
      "I am working with UK and rural-health partners on screening sites, referral pathways, and patient navigation across Kentucky.",
    sourceLabel: "Kentucky diabetic-retinopathy work",
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
    title: "Rural access across Kentucky",
    shortTitle: "Rural access",
    color: "orange",
    position: { x: 83, y: 71 },
    thesis: "Kentucky is not a clean diagram.",
    problem:
      "Distance, staffing, broadband, transportation, and fragmented records all change what is possible from one community to the next.",
    aiRole:
      "AI may help connect information across the state and make communication easier to understand and act on.",
    humanGuardrail:
      "The project has to be designed around local clinics and communities. They cannot be an afterthought.",
    evidence:
      "My Kentucky work includes cancer screening, diabetic retinopathy, rural health, and the state infrastructure needed to connect patients with care.",
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
    thesis: "People need practice, not another AI webinar.",
    problem:
      "Clinicians, educators, staff, and students already have access to AI. Most have had very little chance to learn what good use actually looks like.",
    aiRole:
      "AI can be the thing people practice with: testing outputs, comparing approaches, finding limits, and deciding when not to use it.",
    humanGuardrail:
      "The point is better judgment, not memorizing a list of tools or pretending the risks have been solved.",
    evidence:
      "I co-created the University of Kentucky's AI literacy curriculum and founded the UK AI Incubator.",
    sourceLabel: "UK AI literacy and AI Incubator",
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
    title: "Clinical reasoning and assessment",
    shortTitle: "Reasoning",
    color: "cyan",
    position: { x: 20, y: 76 },
    thesis: "A fluent answer is not the same as good reasoning.",
    problem:
      "Large language models can sound certain and polished even when the reasoning underneath the answer is incomplete or wrong.",
    aiRole:
      "I am studying how AI can support teaching and assessment of diagnostic reasoning without becoming the answer key.",
    humanGuardrail:
      "We still need to see the reasoning, test it against evidence, and be honest about uncertainty.",
    evidence:
      "This work builds on my clinical-reasoning research and the NBME AI Research Fellowship I completed in June 2026.",
    sourceLabel: "Clinical reasoning and NBME fellowship",
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
    prompt: "How do we get an AI project out of the pilot stage?",
  },
  {
    label: "Conference organizer",
    prompt: "What could you talk about that is practical, not hype?",
  },
  {
    label: "Educator",
    prompt: "How should we teach clinicians to use AI?",
  },
  {
    label: "Kentucky partner",
    prompt: "How could AI help with prevention across Kentucky?",
  },
];

export const systemLayers: SystemLayer[] = [
  {
    id: "model",
    index: "01",
    label: "Model",
    title: "Does it work well enough for this job?",
    description:
      "A benchmark is useful, but it does not tell us whether the model will help in this clinic, with these patients, doing this job.",
    failure: "A model that performs well in a paper and has nowhere sensible to go in the clinic.",
    question: "What exactly are we asking the model to do?",
  },
  {
    id: "workflow",
    index: "02",
    label: "Workflow",
    title: "Who has to do something when it fires?",
    description:
      "The tool has to fit the time, staff, handoffs, and incentives that already shape the work.",
    failure: "A new dashboard that quietly becomes one more inbox nobody has time to check.",
    question: "Whose day changes when this result appears?",
  },
  {
    id: "trust",
    index: "03",
    label: "Trust",
    title: "Will anyone understand or believe the result?",
    description:
      "Patients and clinicians need an explanation they can understand, including what the system does not know.",
    failure: "Technically correct outreach that nobody trusts or acts on.",
    question: "Would this make sense to the person receiving it?",
  },
  {
    id: "ownership",
    index: "04",
    label: "Ownership",
    title: "Who owns the next step?",
    description:
      "A result needs a clear path to scheduling, referral, treatment, or follow-up.",
    failure: "The algorithm finds the problem, but nobody is responsible for what happens next.",
    question: "When the model is right, who is responsible for acting on it?",
  },
  {
    id: "learning",
    index: "05",
    label: "Follow-up",
    title: "How will we know when it stops working?",
    description:
      "We need to watch for drift, missed cases, extra work, and differences in who benefits over time.",
    failure: "A promising pilot becomes permanent before anyone decides how it will be monitored.",
    question: "What would make us change this project—or stop it?",
  },
];

export const talks: TalkItem[] = [
  {
    id: "dreams-of-data",
    title: "Dreams of Data: The Promise of AI for Kentucky Healthcare",
    audience: "Kentucky REC Annual Conference",
    summary:
      "What Kentucky can do with better data, better connections, and a practical approach to AI in healthcare.",
    href: "https://www.kentuckyrec.com/2025-annual-conference/",
    keywords: ["kentucky", "health system", "rural", "screening"],
  },
  {
    id: "precision-medicine",
    title: "Precision Medicine 2.0: Logistical Precision with AI",
    audience: "Markey Cancer Center",
    summary:
      "Why precision medicine depends as much on logistics, access, and follow-through as it does on the science.",
    href: "https://cme.cecentral.com/node/3673/bio/11990/view",
    keywords: ["cancer", "implementation", "precision", "healthcare"],
  },
  {
    id: "dawn-of-ai",
    title: "The Dawn of AI in Medical Education",
    audience: "SAEM webinar",
    summary:
      "What large language models mean for clinical reasoning, assessment, and the way we train physicians.",
    href:
      "https://www.saem.org/detail-pages/media/the-dawn-of-ai-in-medical-education",
    keywords: ["education", "reasoning", "assessment", "llm"],
  },
  {
    id: "personalizing-learning",
    title: "Personalizing Learning with AI",
    audience: "Cassyni",
    summary:
      "How AI is changing learning at work, including the parts we may not notice happening.",
    href: "https://cassyni.com/events/HVY1tsKLvcDMQrSyQAqNds",
    note: "Starts at 29:00",
    keywords: ["education", "learning", "clinical", "faculty"],
  },
  {
    id: "assessment",
    title: "AI for Assessment and Evaluation in Medical Education",
    audience: "Cassyni",
    summary:
      "What educators need to understand before using AI for assessment and feedback.",
    href: "https://cassyni.com/events/R2RUrHw6cqfDzUzGihxfkq",
    note: "Starts at 19:00",
    keywords: ["assessment", "evaluation", "education", "faculty"],
  },
];

export const fieldNotes: FieldNote[] = [
  {
    type: "Field note / 01",
    title: "Screening creates a connection problem.",
    summary:
      "If we identify more people with cancer or diabetic retinopathy, we also need a realistic way to get them into care.",
  },
  {
    type: "Field note / 02",
    title: "AI literacy is not knowing every tool.",
    summary:
      "It is knowing how to test the output, recognize the limits, and decide whether AI belongs in the task at all.",
  },
  {
    type: "Field note / 03",
    title: "The goal is better care, not less human contact.",
    summary:
      "If AI gives clinicians more time and helps patients get the right care, it is doing something useful. If it adds noise, it is not.",
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
