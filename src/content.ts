import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  hero: {
    eyebrow: "Academic medicine | Higher education | AI",
    title: "Helping institutions become AI-ready.",
    summary:
      "Dr. Tama Thé is a physician educator and practical AI leader helping universities, health systems, and faculty communities move from AI anxiety to AI-ready practice.",
    primaryAction: {
      label: "Watch featured talk",
      href: "#featured",
    },
    secondaryAction: {
      label: "Invite",
      href: "#invite",
    },
    proofPoints: [
      "Pediatric emergency physician",
      "University AI curriculum leader",
      "NBME AI Fellow",
      "Invited keynote and CME speaker",
    ],
  },
  featuredMedia: {
    label: "Featured media",
    title: "The strongest reel belongs here.",
    summary:
      "Version one reserves a polished stage for the best keynote clip, speaker reel, or full talk recording once final media is selected.",
    status: "Asset-ready panel",
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
        "A keynote on what institutions can do now to prepare students, faculty, and systems for human-centered AI practice.",
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
        "A workshop-style talk for faculty who need clear practices, policies, and examples they can use immediately.",
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
      label: "Speaking record",
      detail:
        "Invited grand rounds, CME lectures, national presentations, and paid keynote work.",
    },
  ],
  invite: {
    title: "Invite Dr. Thé",
    summary:
      "For keynotes, academic medicine sessions, higher education convenings, faculty development, and AI strategy conversations.",
    email: "mailto:tsthe2@uky.edu?subject=Speaking%20Invitation",
    materials: ["Speaker bio", "Headshot", "Talk descriptions", "AV preferences"],
  },
};
