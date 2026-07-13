export type WallTheme =
  | "black"
  | "chalk"
  | "acid"
  | "blue"
  | "orange"
  | "violet";

export type WallMedia =
  | {
      kind: "image";
      src: string;
      alt: string;
      fit?: "cover" | "contain";
      position?: string;
    }
  | {
      kind: "sprite";
      src: string;
      alt: string;
      columns: 6;
      rows: 5;
      frames: 30;
      frameWidth: 480;
      frameHeight: 270;
      frameMs?: number;
      startFrame?: number;
    }
  | {
      kind: "video";
      src: string;
      poster: string;
      alt: string;
      captioned?: boolean;
    }
  | {
      kind: "text";
    };

export type WallItem = {
  id: string;
  title: string;
  kicker: string;
  body: string;
  keywords: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  theme: WallTheme;
  media: WallMedia;
  href: string;
  linkLabel: string;
};

const cassyniFiles =
  "https://cassyni-user-files-prod.s3.amazonaws.com";

const assessmentEvent =
  "https://cassyni.com/events/R2RUrHw6cqfDzUzGihxfkq";

const learningEvent =
  "https://cassyni.com/events/HVY1tsKLvcDMQrSyQAqNds";

export const wallItems: WallItem[] = [
  {
    id: "kentucky-stage",
    title: "AI will reshape every industry. What Kentucky does next is up to us.",
    kicker: "Microsoft × UK / 28-second clip",
    body:
      "The argument in 28 seconds: AI will touch every industry. Kentucky's students and faculty should be the ones who figure out what comes next.",
    keywords: [
      "kentucky",
      "microsoft",
      "university of kentucky",
      "students",
      "faculty",
      "workforce",
      "The promise of AI for Kentucky healthcare",
    ],
    x: 140,
    y: 120,
    w: 820,
    h: 540,
    theme: "black",
    media: {
      kind: "video",
      src: "/media-wall/kentucky-ai-future.mp4",
      poster: "/media-wall/kentucky-ai-future.jpg",
      alt: "Tama The speaking about the future of AI in Kentucky with animated captions",
      captioned: true,
    },
    href: "https://www.youtube.com/watch?v=TU3i1DEY2pI",
    linkLabel: "Watch the full video on YouTube",
  },
  {
    id: "ai-is-coming",
    title: "AI is coming. That doesn't mean we trust it with everything.",
    kicker: "Responsible AI / 18-second clip",
    body:
      "We need to know what it can do—and what we should absolutely not rely on it for.",
    keywords: [
      "responsible ai",
      "ethics",
      "guardrails",
      "judgment",
      "ai literacy",
      "adoption",
    ],
    x: 1090,
    y: 80,
    w: 560,
    h: 315,
    theme: "black",
    media: {
      kind: "video",
      src: "/media-wall/ai-is-coming.mp4",
      poster: "/media-wall/ai-is-coming.jpg",
      alt: "Tama Thé speaking about the capabilities and limits of AI with animated captions",
      captioned: true,
    },
    href: "https://www.youtube.com/watch?v=TU3i1DEY2pI",
    linkLabel: "Watch the full video on YouTube",
  },
  {
    id: "students-take-it-home",
    title: "The students take it home.",
    kicker: "Creating an AI Future / 20-second clip",
    body:
      "The real impact starts after they leave campus: students bring AI into the places where they already live and work.",
    keywords: [
      "kentucky",
      "students",
      "community impact",
      "ai education",
      "workforce",
    ],
    x: 1090,
    y: 460,
    w: 500,
    h: 280,
    theme: "black",
    media: {
      kind: "video",
      src: "/media-wall/students-take-it-home.mp4",
      poster: "/media-wall/students-take-it-home.jpg",
      alt: "Tama The speaking about students carrying AI into their communities with animated captions",
      captioned: true,
    },
    href: "https://www.youtube.com/watch?v=tjLBKX_7irw",
    linkLabel: "Watch the full video on YouTube",
  },
  {
    id: "assessment-title",
    title: "AI for assessment and evaluation",
    kicker: "Medical education / Cassyni",
    body:
      "A practical look at where AI might help educators, where it can mislead them, and what we still have to judge for ourselves.",
    keywords: [
      "assessment",
      "evaluation",
      "medical education",
      "faculty",
      "teaching",
    ],
    x: 1810,
    y: 150,
    w: 650,
    h: 455,
    theme: "blue",
    media: {
      kind: "image",
      src: `${cassyniFiles}/8SaPHmZ4nX1SruWSTZsQaS`,
      alt: "Event artwork for AI in medical education",
      fit: "cover",
    },
    href: assessmentEvent,
    linkLabel: "Watch the event",
  },
  {
    id: "assessment-live-01",
    title: "How should medical educators be using AI?",
    kicker: "Personalizing learning / video",
    body:
      "Not all the time. Not for everything. The interesting work is teaching people to tell the difference.",
    keywords: [
      "students",
      "assessment",
      "generative ai",
      "reasoning",
      "education",
    ],
    x: 2600,
    y: 90,
    w: 820,
    h: 520,
    theme: "black",
    media: {
      kind: "video",
      src: "/media-wall/learning-questions.mp4",
      poster: "/media-wall/learning-questions.jpg",
      alt: "Tama The speaking about how medical educators should use AI",
    },
    href: learningEvent,
    linkLabel: "Watch from my section",
  },
  {
    id: "portrait",
    title: "Tama The, MD",
    kicker: "Pediatric emergency physician",
    body:
      "I work where medicine, public health, education, and AI keep running into one another.",
    keywords: [
      "tama the",
      "speaker",
      "physician",
      "pediatric emergency medicine",
      "bio",
    ],
    x: 120,
    y: 790,
    w: 460,
    h: 590,
    theme: "chalk",
    media: {
      kind: "image",
      src: `${cassyniFiles}/K7pTXF26jVe7ZfT1rYPpv2`,
      alt: "Portrait of Tama The",
      fit: "cover",
      position: "center top",
    },
    href: assessmentEvent,
    linkLabel: "Speaker profile",
  },
  {
    id: "model-is-easy",
    title: "The model is usually the easy part.",
    kicker: "Implementation",
    body:
      "The hard part is fitting it into real work, deciding who owns the result, and noticing when it starts making things worse.",
    keywords: [
      "implementation",
      "workflow",
      "governance",
      "ownership",
      "monitoring",
    ],
    x: 700,
    y: 760,
    w: 710,
    h: 420,
    theme: "orange",
    media: { kind: "text" },
    href: "https://cme.cecentral.com/node/3673/bio/11990/view",
    linkLabel: "Precision Medicine 2.0",
  },
  {
    id: "assessment-live-02",
    title: "A fluent answer is not the same as good reasoning.",
    kicker: "Clinical reasoning / moving preview",
    body:
      "AI can sound finished before the thinking is finished. I care about how we make the reasoning visible enough to test.",
    keywords: [
      "clinical reasoning",
      "diagnosis",
      "llm",
      "evaluation",
      "uncertainty",
    ],
    x: 1530,
    y: 760,
    w: 850,
    h: 510,
    theme: "violet",
    media: {
      kind: "video",
      src: "/media-wall/assessment-results.mp4",
      poster: "/media-wall/assessment-results.jpg",
      alt: "Tama The presenting results from an AI assessment study",
    },
    href: assessmentEvent,
    linkLabel: "Watch the discussion",
  },
  {
    id: "assessment-slide-01",
    title: "Show the work.",
    kicker: "From the assessment talk",
    body:
      "If an AI system is helping with assessment, educators need more than a score. They need enough evidence to question it.",
    keywords: [
      "evidence",
      "assessment",
      "transparency",
      "educators",
      "ai systems",
    ],
    x: 2510,
    y: 760,
    w: 530,
    h: 620,
    theme: "blue",
    media: {
      kind: "image",
      src: `${cassyniFiles}/DMkCDdQgUWVNvcfirBDc2S`,
      alt: "A slide from the Cassyni event on AI and assessment",
      fit: "cover",
    },
    href: assessmentEvent,
    linkLabel: "Open the full event",
  },
  {
    id: "practice-not-webinar",
    title: "People need practice, not another AI webinar.",
    kicker: "AI literacy",
    body:
      "Use it. Test it. Break it. Compare the output with the real work. That is how judgment gets better.",
    keywords: [
      "ai literacy",
      "workshop",
      "faculty development",
      "training",
      "practice",
    ],
    x: 3160,
    y: 740,
    w: 360,
    h: 650,
    theme: "acid",
    media: { kind: "text" },
    href: learningEvent,
    linkLabel: "Personalizing Learning with AI",
  },
  {
    id: "assessment-live-03",
    title: "The answer key moved.",
    kicker: "Medical education / moving preview",
    body:
      "That does not make assessment impossible. It does mean we have to stop pretending the old assignment still measures the same thing.",
    keywords: [
      "medical education",
      "assessment design",
      "students",
      "assignments",
      "ai literacy",
    ],
    x: 80,
    y: 1510,
    w: 730,
    h: 470,
    theme: "black",
    media: {
      kind: "video",
      src: "/media-wall/assessment-engine.mp4",
      poster: "/media-wall/assessment-engine.jpg",
      alt: "Tama The demonstrating the code behind an AI assessment tool",
    },
    href: assessmentEvent,
    linkLabel: "Watch on Cassyni",
  },
  {
    id: "screening-connection",
    title: "Screening creates a connection problem.",
    kicker: "Cancer prevention",
    body:
      "Finding someone who is overdue is not the win. The win is getting that person through the next door, and the one after that.",
    keywords: [
      "cancer screening",
      "prevention",
      "patient navigation",
      "outreach",
      "follow-up",
    ],
    x: 930,
    y: 1390,
    w: 600,
    h: 530,
    theme: "chalk",
    media: { kind: "text" },
    href: "https://www.kentuckyrec.com/kentucky-rec-annual-conference-oct-23-2025-dr-tama-the-the-promise-of-ai-for-kentucky-healthcare/",
    linkLabel: "See the Kentucky talk",
  },
  {
    id: "assessment-slide-02",
    title: "Assessment has consequences.",
    kicker: "From the assessment talk",
    body:
      "This is not a toy problem. A bad evaluation can change what a learner is trusted to do next.",
    keywords: [
      "assessment",
      "safety",
      "learners",
      "medical education",
      "trust",
    ],
    x: 1660,
    y: 1430,
    w: 680,
    h: 480,
    theme: "orange",
    media: {
      kind: "image",
      src: `${cassyniFiles}/72VY8Y3cvn9vhWp41qjXtA`,
      alt: "A presentation slide from the Cassyni assessment event",
      fit: "cover",
    },
    href: assessmentEvent,
    linkLabel: "See the complete talk",
  },
  {
    id: "assessment-live-04",
    title: "What happens when AI becomes part of the work?",
    kicker: "Learning at work / video",
    body:
      "People are already using it inside searches, drafts, and quiet workarounds. The curriculum has to catch up with the work.",
    keywords: [
      "clinical reasoning",
      "teaching",
      "assessment",
      "ai in education",
      "research",
    ],
    x: 2490,
    y: 1490,
    w: 930,
    h: 520,
    theme: "violet",
    media: {
      kind: "video",
      src: "/media-wall/learning-demo.mp4",
      poster: "/media-wall/learning-demo.jpg",
      alt: "Tama The demonstrating how AI is already changing learning at work",
    },
    href: learningEvent,
    linkLabel: "Watch from my section",
  },
  {
    id: "kentucky-not-diagram",
    title: "Kentucky is not a clean diagram.",
    kicker: "A useful constraint",
    body:
      "Distance, staffing, broadband, transportation, and records all change the answer. I start there.",
    keywords: [
      "kentucky",
      "rural",
      "access",
      "infrastructure",
      "health systems",
    ],
    x: 60,
    y: 2020,
    w: 500,
    h: 360,
    theme: "acid",
    media: { kind: "text" },
    href: "https://www.kentuckyrec.com/2025-annual-conference/",
    linkLabel: "Kentucky REC conference",
  },
  {
    id: "learning-at-work",
    title: "Learning at work is already changing.",
    kicker: "Personalizing learning / video",
    body:
      "Some of it is obvious. Some of it is happening inside search boxes, drafts, and quiet little workarounds nobody put in the curriculum.",
    keywords: [
      "learning",
      "workplace",
      "personalization",
      "curriculum",
      "ai literacy",
    ],
    x: 600,
    y: 2070,
    w: 800,
    h: 270,
    theme: "blue",
    media: {
      kind: "video",
      src: "/media-wall/learning-sources.mp4",
      poster: "/media-wall/learning-sources.jpg",
      alt: "Tama The discussing research and practical resources for AI in medical education",
    },
    href: learningEvent,
    linkLabel: "Watch on Cassyni",
  },
  {
    id: "dawn-of-ai",
    title: "The dawn of AI in medical education",
    kicker: "The MDM podcast",
    body:
      "A conversation about clinical reasoning, assessment, and what changes when a plausible answer is always one prompt away.",
    keywords: [
      "podcast",
      "medical education",
      "clinical reasoning",
      "assessment",
      "conversation",
    ],
    x: 1510,
    y: 2040,
    w: 760,
    h: 300,
    theme: "chalk",
    media: {
      kind: "image",
      src: `${cassyniFiles}/VBZC3Rh9psQ7zpxLSicFHY`,
      alt: "Tama The speaking during an online event",
      fit: "cover",
    },
    href: "https://themdm.buzzsprout.com/2371946/episodes/16566164-the-dawn-of-ai-in-medical-education-chris-nash-md-edm",
    linkLabel: "Listen to the episode",
  },
  {
    id: "contact",
    title: "Bring me the messy version.",
    kicker: "Talks / workshops / working sessions",
    body:
      "If the problem crosses medicine, public health, education, and AI, that is probably the interesting part.",
    keywords: [
      "contact",
      "speaker",
      "workshop",
      "keynote",
      "collaboration",
    ],
    x: 2440,
    y: 2110,
    w: 900,
    h: 250,
    theme: "acid",
    media: { kind: "text" },
    href: "mailto:tsthe2@uky.edu?subject=Healthcare%20AI%20conversation",
    linkLabel: "Email me",
  },
];
