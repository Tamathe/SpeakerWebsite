import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  hero: {
    title: "Making AI useful in healthcare.",
    summary:
      "Projects, talks, and notes on clinical AI, screening, education, and implementation in Kentucky and beyond.",
    primaryAction: {
      label: "Projects",
      href: "#work",
    },
    secondaryAction: {
      label: "Notes",
      href: "#thinking",
    },
    proofPoints: [
      "Kentucky cancer screening",
      "Diabetic retinopathy projects",
      "Clinical AI implementation",
      "Education and faculty development",
    ],
  },
  featuredMedia: {
    label: "Archive",
    title: "Projects, talks, and notes.",
    summary:
      "Selected lectures, project updates, and practical writing as the work develops.",
    status: "Work in progress",
    imageSrc: "/images/dark-academic-stage.png",
    imageAlt:
      "Dark academic auditorium stage with a lectern and blue AI-inspired screen light.",
  },
  currentWork: [
    {
      title: "Kentucky cancer screening",
      summary:
        "Practical AI and workflow projects aimed at making prevention easier to identify, explain, and follow through.",
    },
    {
      title: "Diabetic retinopathy projects",
      summary:
        "Exploring how clinical AI can support earlier detection, clearer handoffs, and better patient follow-up.",
    },
    {
      title: "Clinical education and implementation",
      summary:
        "Teaching clinicians and educators how to use AI safely, practically, and with enough context to matter.",
    },
  ],
  talks: [
    {
      title: "Making AI Useful In Healthcare",
      audience: "Healthcare, public health, and academic leaders",
      summary:
        "A practical session on moving from AI excitement to tools, workflows, and decisions that help patients and teams.",
    },
    {
      title: "From Tool To Teammate",
      audience: "Academic medicine and health systems",
      summary:
        "A practical frame for moving AI from novelty to trustworthy clinical, educational, and operational support.",
    },
    {
      title: "Teaching Clinicians In An AI World",
      audience: "Faculty development and CME",
      summary:
        "A faculty-facing session for educators who need clear clinical examples, boundaries, and practices they can use immediately.",
    },
  ],
  recentThinking: [
    {
      type: "Field note",
      title: "Why healthcare AI has to earn trust at the workflow level",
      summary:
        "The hard part is not the model demo. It is the handoff, the explanation, the accountability, and the follow-through.",
    },
    {
      type: "Project note",
      title: "What cancer screening teaches us about implementation",
      summary:
        "Useful AI has to connect risk, outreach, patient understanding, and the next action.",
    },
    {
      type: "Essay",
      title: "AI education for clinicians should start with judgment",
      summary:
        "Before clinicians need more tools, they need better ways to decide when a tool is useful, risky, or beside the point.",
    },
  ],
  credentials: [
    {
      label: "Clinical practice",
      detail:
        "Pediatric emergency physician with frontline academic medicine experience.",
    },
    {
      label: "Healthcare AI projects",
      detail:
        "Cancer screening, diabetic retinopathy, and implementation work with Kentucky partners.",
    },
    {
      label: "National fellowship",
      detail: "National Board of Medical Examiners AI Fellow.",
    },
    {
      label: "Teaching",
      detail:
        "Grand rounds, CME lectures, national presentations, and academic convenings.",
    },
  ],
  invite: {
    title: "For invitations and collaborations",
    summary:
      "For healthcare AI projects, lectures, workshops, panels, clinical education, and thoughtful implementation conversations.",
    email: "mailto:tsthe2@uky.edu?subject=Speaking%20Invitation",
    materials: ["Short bio", "Selected topics", "Media links", "AV notes"],
  },
};
