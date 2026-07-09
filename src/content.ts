import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  hero: {
    title: "Making AI useful in healthcare.",
    summary:
      "Clinical AI projects, talks, and notes on screening, education, assessment, and implementation across Kentucky.",
    primaryAction: {
      label: "Projects",
      href: "#work",
    },
    secondaryAction: {
      label: "Notes",
      href: "#thinking",
    },
    proofPoints: [
      "State cancer screening work",
      "Diabetic retinopathy projects",
      "UK AI literacy curriculum",
      "Completed NBME AI Research Fellowship",
    ],
  },
  featuredMedia: {
    label: "Kentucky healthcare",
    title: "Dreams of Data: The Promise of AI for Kentucky Healthcare.",
    summary:
      "A talk on moving from AI excitement to data-driven, practical precision medicine across the Commonwealth.",
    status: "Featured talk",
    href: "https://www.kentuckyrec.com/2025-annual-conference/",
    actionLabel: "View event",
    imageSrc: "/images/dark-academic-stage.png",
    imageAlt:
      "Dark academic auditorium stage with a lectern and blue AI-inspired screen light.",
  },
  profile: {
    title: "Physician, educator, AI implementer.",
    summary:
      "Tama Th\u00e9 is a pediatric emergency physician who completed an AI Research Fellowship with the National Board of Medical Examiners in June 2026. His work sits where clinical care, medical education, assessment, and public-health implementation meet.",
    details: [
      "Co-created the University of Kentucky's institutional AI literacy and skills curriculum.",
      "Founded and directs the AI Incubator at the University of Kentucky.",
      "Leads healthcare AI work in the University of Kentucky-Microsoft strategic collaboration.",
      "Principal investigator for a state-funded cancer screening gap project with Kentucky CHFS.",
    ],
  },
  currentWork: [
    {
      title: "AHEAD: closing Kentucky's cancer screening gap",
      summary:
        "A state-funded CHFS partnership using AI and linked public-health data to identify people overdue for high-impact prevention and connect them with tailored outreach.",
    },
    {
      title: "Diabetic retinopathy projects",
      summary:
        "AI-supported screening and follow-up work aimed at earlier detection, clearer handoffs, and practical patient navigation.",
    },
    {
      title: "Clinical reasoning AI",
      summary:
        "Grant-supported work exploring generative AI as a reference for diagnostic reasoning and decision-making in complex patient care.",
    },
    {
      title: "AI literacy at scale",
      summary:
        "University-wide curriculum and faculty development that help clinicians, educators, staff, and students use AI with better judgment.",
    },
  ],
  talks: [
    {
      title: "Dreams of Data: The Promise of AI for Kentucky Healthcare",
      audience: "Kentucky REC Annual Conference",
      summary:
        "Data-driven precision medicine, screening, and practical implementation across Kentucky healthcare.",
      href: "https://www.kentuckyrec.com/2025-annual-conference/",
    },
    {
      title: "Precision Medicine 2.0: Logistical Precision with AI",
      audience: "Markey Cancer Center",
      summary:
        "A healthcare implementation talk on making precision medicine more operational, reachable, and useful.",
      href: "https://cme.cecentral.com/node/3673/bio/11990/view",
    },
    {
      title: "The Dawn of AI in Medical Education",
      audience: "SAEM webinar",
      summary:
        "A technical session on large language models, clinical reasoning assessment, and the future of medical education.",
      href: "https://www.saem.org/detail-pages/media/the-dawn-of-ai-in-medical-education",
    },
    {
      title: "Personalizing Learning with AI",
      audience: "Cassyni",
      summary:
        "AI as an invisible layer over professional life, learning, and the systems clinicians work inside.",
      href: "https://cassyni.com/events/HVY1tsKLvcDMQrSyQAqNds",
      note: "Starts at 29:00",
    },
    {
      title: "AI for Assessment and Evaluation in Medical Education",
      audience: "Cassyni",
      summary:
        "Why educators need to build, test, and understand AI-powered tools for assessment and feedback.",
      href: "https://cassyni.com/events/R2RUrHw6cqfDzUzGihxfkq",
      note: "Starts at 19:00",
    },
    {
      title: "Blueprint for Care",
      audience: "Louisville AI Week",
      summary:
        "How the University of Kentucky is moving healthcare AI from concepts to enterprise-scale experiences.",
    },
  ],
  recentThinking: [
    {
      type: "Field note",
      title: "What cancer screening asks of AI",
      summary:
        "Useful AI has to connect risk, outreach, patient understanding, scheduling, and the next accountable step.",
    },
    {
      type: "Project note",
      title: "The quiet work of healthcare AI",
      summary:
        "The hard part is not the model demo. It is the handoff, the explanation, the accountability, and the follow-through.",
    },
    {
      type: "Essay",
      title: "AI literacy is clinical infrastructure",
      summary:
        "Clinicians and educators need better ways to decide when a tool is useful, risky, or beside the point.",
    },
  ],
  credentials: [
    {
      label: "Clinical practice",
      detail:
        "Pediatric emergency physician with frontline academic medicine experience.",
    },
    {
      label: "State-funded work",
      detail:
        "Principal investigator for AHEAD, an AI and public-health data project focused on cancer screening gaps in Kentucky.",
    },
    {
      label: "National fellowship",
      detail:
        "Completed an AI Research Fellowship with the National Board of Medical Examiners in June 2026.",
    },
    {
      label: "Institutional AI",
      detail:
        "Co-created UK AI literacy training, founded the UK AI Incubator, and leads healthcare AI collaboration work.",
    },
  ],
  invite: {
    title: "For invitations and collaborations",
    summary:
      "For healthcare AI projects, lectures, workshops, faculty retreats, panels, public-sector collaborations, and implementation conversations.",
    email: "mailto:tsthe2@uky.edu?subject=Speaking%20Invitation",
    materials: ["Short bio", "Selected topics", "Media links", "AV notes"],
  },
};
