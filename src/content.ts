import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  hero: {
    eyebrow: "Academic medicine | Higher education | AI",
    title: "Work, talks, and writing on AI in academic medicine and higher education.",
    summary:
      "A public home for teaching, writing, and institutional work at the edge of AI, clinical education, and human-centered academic practice.",
    primaryAction: {
      label: "Explore the work",
      href: "#work",
    },
    secondaryAction: {
      label: "Recent thinking",
      href: "#thinking",
    },
    proofPoints: [
      "Physician educator in pediatric emergency medicine",
      "University AI curriculum and faculty development work",
      "National Board of Medical Examiners AI Fellow",
      "Grand rounds, CME, academic, and public-sector teaching",
    ],
  },
  featuredMedia: {
    label: "Teaching, writing, and institutional work",
    title: "A public archive in progress.",
    summary:
      "This space can hold selected lectures, writing, videos, and project notes without making the site feel like a brochure.",
    status: "Media and notes",
    imageSrc: "/images/dark-academic-stage.png",
    imageAlt:
      "Dark academic auditorium stage with a lectern and blue AI-inspired screen light.",
  },
  currentWork: [
    {
      title: "AI curricula for real institutions",
      summary:
        "Building practical AI learning experiences for students, faculty, and academic leaders.",
    },
    {
      title: "Faculty development that starts Monday",
      summary:
        "Helping educators translate AI pressure into useful classroom and clinical teaching practice.",
    },
    {
      title: "Academic medicine implementation",
      summary:
        "Connecting clinical credibility, learner safety, and institutional strategy in the AI transition.",
    },
  ],
  talks: [
    {
      title: "The AI-Ready University",
      audience: "Provosts, deans, faculty leaders",
      summary:
        "A practical session on what institutions can do now to prepare students, faculty, and systems for human-centered AI practice.",
    },
    {
      title: "From Tool To Teammate",
      audience: "Academic medicine and health systems",
      summary:
        "A practical frame for moving AI from novelty to trustworthy clinical, educational, and operational support.",
    },
    {
      title: "Teaching In An AI World",
      audience: "Faculty development and CME",
      summary:
        "A faculty-facing session for educators who need clear practices, policies, and examples they can use immediately.",
    },
  ],
  recentThinking: [
    {
      type: "Field note",
      title: "What universities should do before they buy another AI tool",
      summary:
        "Institutional readiness starts with teaching, governance, and workflow, not procurement alone.",
    },
    {
      type: "Video",
      title: "AI literacy as a clinical education problem",
      summary:
        "Why academic medicine needs shared language before it can scale responsible AI practice.",
    },
    {
      type: "Essay",
      title: "The future is not AI versus humans",
      summary:
        "The useful question is how institutions redesign human work around new capabilities.",
    },
  ],
  credentials: [
    {
      label: "Clinical practice",
      detail:
        "Pediatric emergency physician with frontline academic medicine experience.",
    },
    {
      label: "AI leadership",
      detail:
        "Leading university-level AI curriculum and faculty development work.",
    },
    {
      label: "National fellowship",
      detail: "National Board of Medical Examiners AI Fellow.",
    },
    {
      label: "Teaching and presentations",
      detail:
        "Grand rounds, CME lectures, national presentations, and academic convenings.",
    },
  ],
  invite: {
    title: "For invitations and collaborations",
    summary:
      "For lectures, workshops, panels, faculty development, academic medicine sessions, and thoughtful AI strategy conversations.",
    email: "mailto:tsthe2@uky.edu?subject=Speaking%20Invitation",
    materials: ["Short bio", "Selected topics", "Media links", "AV notes"],
  },
};
