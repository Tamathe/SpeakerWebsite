export type LinkItem = {
  label: string;
  href: string;
  note?: string;
};

export type Initiative = {
  id: string;
  number: string;
  title: string;
  area: string;
  stage: string;
  question: string;
  summary: string;
  focus: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  links?: LinkItem[];
};

export type EducationProject = {
  id: string;
  number: string;
  title: string;
  category: string;
  stage: string;
  question: string;
  summary: string;
  guardrail: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
};

export type Engagement = {
  id: string;
  title: string;
  venue: string;
  format: string;
  summary: string;
  href?: string;
  note?: string;
  topics: string[];
};

export const siteIdentity = {
  name: "Tama Thé, MD",
  descriptor: "Physician · Educator · Builder",
  thesis: "Making AI useful in healthcare.",
  bio:
    "I am a pediatric emergency physician and medical educator working where medicine, public health, education, and AI keep running into one another. My work focuses on the part after the model: how people understand it, how it fits into real work, and who owns what happens next.",
  email: "mailto:tsthe2@uky.edu?subject=Healthcare%20AI%20conversation",
};

export const credentials = [
  "Pediatric emergency physician",
  "Principal investigator · state-funded AHEAD project",
  "Completed NBME AI Research Fellowship · June 2026",
  "UK AI curriculum · AI Incubator · UK–Microsoft collaboration",
];

export const homePathways = [
  {
    number: "01",
    title: "AI in Healthcare",
    description:
      "Projects built around screening, access, logistics, and the human work that has to follow an AI result.",
    href: "/healthcare",
  },
  {
    number: "02",
    title: "AI in Medical Education",
    description:
      "Research and teaching on clinical reasoning, assessment, and learning in an AI-shaped workplace.",
    href: "/medical-education",
  },
  {
    number: "03",
    title: "AI Incubator",
    description:
      "A cross-campus community for learning to work with AI by testing ideas, building projects, and sharing what works.",
    href: "/incubator",
  },
  {
    number: "04",
    title: "AI Literacy",
    description:
      "Practice-based learning for testing AI, recognizing its limits, and deciding when it belongs in the work.",
    href: "/ai-literacy",
  },
  {
    number: "05",
    title: "Speaking",
    description:
      "Talks, workshops, and public conversations that start with real problems instead of a tour of AI tools.",
    href: "/speaking",
  },
];

export const literacyPractices = [
  {
    number: "01",
    title: "Use it.",
    summary:
      "Work with AI on recognizable tasks instead of only watching someone else demonstrate it.",
  },
  {
    number: "02",
    title: "Test it.",
    summary:
      "Look for missing context, unsupported confidence, and the places where a polished answer hides weak work.",
  },
  {
    number: "03",
    title: "Compare it.",
    summary:
      "Set the output beside trusted sources, professional standards, and the work a person would actually do.",
  },
  {
    number: "04",
    title: "Decide.",
    summary:
      "Know when AI helps, when more review is needed, and when it does not belong in the task.",
  },
];

export const literacyContexts = [
  {
    number: "01",
    title: "Curriculum",
    summary:
      "Learning experiences organized around capabilities, limitations, verification, and responsible use.",
  },
  {
    number: "02",
    title: "Faculty and learner development",
    summary:
      "Practice for clinicians, educators, staff, and students who are already encountering AI in everyday work.",
  },
  {
    number: "03",
    title: "Learning in public",
    summary:
      "Talks, workshops, and open demonstrations that begin with real problems instead of a product tour.",
  },
];

export const healthcareInitiatives: Initiative[] = [
  {
    id: "ahead",
    number: "01",
    title: "KY-AHEAD",
    area: "Population health / Oncology",
    stage: "Finding overdue patients",
    question:
      "How do we help more people get the cancer screening they are due for?",
    summary:
      "KY-AHEAD uses data and AI-assisted review to identify Kentuckians who may be due for colorectal, cervical, or lung cancer screening. Care teams remain responsible for outreach, navigation, and scheduling.",
    focus:
      "A state-funded partnership with Kentucky CHFS focused on closing cancer-screening gaps without treating identification as the endpoint.",
    image: "/images/studio/ai-for-ky.png",
    imageAlt:
      "AI for Kentucky public-health concept visualization with an accurate relief map covered in dense cobalt and white pushpins",
    imageCaption: "Concept visualization",
    links: [
      {
        label: "Related Kentucky healthcare talk",
        href: "https://www.kentuckyrec.com/kentucky-rec-annual-conference-oct-23-2025-dr-tama-the-the-promise-of-ai-for-kentucky-healthcare/",
      },
    ],
  },
  {
    id: "retinopathy",
    number: "02",
    title: "Rural Diabetic Retinopathy Screening",
    area: "Rural health / Ophthalmology",
    stage: "Screening closer to home",
    question:
      "How do we catch preventable vision loss before it changes a life?",
    summary:
      "The project is testing retinal cameras, AI-assisted triage, specialist review, and patient navigation in rural Kentucky so screening can happen closer to primary care.",
    focus:
      "The difficult part is the connection: who receives the referral, what can be handled locally, and who helps the patient reach follow-up care.",
    image: "/images/studio/retinopathy.png",
    imageAlt:
      "Conceptual studio visualization of a portable retinal camera, lenses, and a retinal image on a small monitor",
    imageCaption: "Concept visualization",
  },
  {
    id: "whole-blood-drone",
    number: "03",
    title: "Whole-Blood Drone Delivery",
    area: "Trauma / Aerospace",
    stage: "Testing rural trauma logistics",
    question:
      "Can blood travel by drone and still arrive ready for emergency use?",
    summary:
      "This pre-clinical initiative tests whether drones can carry whole-blood units while preserving temperature and laboratory integrity before any patient-facing use.",
    focus:
      "The early work centers on packaging, cold-chain performance, flight conditions, and the practical constraints of rural trauma care.",
    image: "/images/studio/blood-drone.png",
    imageAlt:
      "Conceptual studio visualization of a large drone carrying an insulated container beside testing instruments and packaging materials",
    imageCaption: "Concept visualization",
  },
];

export const implementationQuestions = [
  {
    number: "01",
    label: "Model",
    question: "Does it work well enough for this job?",
  },
  {
    number: "02",
    label: "Workflow",
    question: "Whose day changes when the result appears?",
  },
  {
    number: "03",
    label: "Trust",
    question: "Will the person receiving it understand it?",
  },
  {
    number: "04",
    label: "Ownership",
    question: "Who is responsible for the next step?",
  },
  {
    number: "05",
    label: "Follow-up",
    question: "How will we know when it stops working?",
  },
];

export const educationProjects: EducationProject[] = [
  {
    id: "seef",
    number: "01",
    title: "SEEF",
    category: "Assessment research",
    stage: "Institutional rubrics / General-purpose LLM",
    question:
      "Can a general-purpose model evaluate performance using the rubrics schools already trust?",
    summary:
      "SEEF studies whether a general-purpose language model can support scoring within current institutional grading structures without task-specific model training. The work emphasizes rubric alignment, transparent rationale, and the variability introduced by prompts, model versions, and drift.",
    guardrail:
      "The purpose is to test the quality and limits of AI-supported evaluation—not to turn a fluent model response into unquestioned judgment.",
    image: "/media-wall/assessment-results.jpg",
    imageAlt:
      "Presentation still showing a comparison of human and AI ratings in an assessment study",
    imageCaption: "Assessment research presentation",
  },
  {
    id: "stemmler",
    number: "02",
    title: "Entrustable Professional AI",
    category: "Stemmler study / Formative assessment",
    stage: "Multi-center validation design",
    question:
      "Can formative assessment look more like the clinical work learners will actually do?",
    summary:
      "The proposed multi-center study evaluates AI-supported formative clinical-practice and performance assessment across bounded data interpretation, communication and documentation of reasoning, and sequential decisions in evolving cases.",
    guardrail:
      "The platform functions as a research instrument. Scores and feedback remain formative and research-use only while validity, fairness, feasibility, implementation, and learning signals are evaluated.",
    image: "/media-wall/assessment-engine.jpg",
    imageAlt:
      "Presentation still showing the code and interface behind an AI-supported assessment demonstration",
    imageCaption: "Assessment system demonstration",
  },
  {
    id: "reasoning",
    number: "03",
    title: "Clinical Reasoning and Assessment",
    category: "Medical education research",
    stage: "NBME fellowship completed June 2026",
    question:
      "How do we use AI to examine reasoning without making it the answer key?",
    summary:
      "Large language models can sound certain and polished even when the reasoning underneath is incomplete. This work asks how educators can make reasoning visible enough to test, question, and improve.",
    guardrail:
      "A plausible answer is not the same as defensible reasoning. Educators still need evidence, uncertainty, and a clear account of how a conclusion was reached.",
    image: "/media-wall/learning-sources.jpg",
    imageAlt:
      "Presentation slide from a discussion of evidence and transparency in AI-supported assessment",
    imageCaption: "AI and assessment discussion",
  },
];

export const engagements: Engagement[] = [
  {
    id: "kentucky-legislature-ai",
    title: "Artificial Intelligence at the University of Kentucky",
    venue: "Kentucky General Assembly",
    format: "Legislative presentation",
    summary:
      "A presentation with Hubert Ballard on AI work across the University of Kentucky and UK HealthCare.",
    href: "https://www.youtube.com/watch?v=v1aHwVq0dLI&t=4664s",
    note: "Presentation begins at 1:17:44",
    topics: ["Kentucky", "Healthcare", "Higher education"],
  },
  {
    id: "kentucky-future",
    title: "Creating an AI Future for Kentucky",
    venue: "Microsoft × University of Kentucky",
    format: "Public conversation",
    summary:
      "A Kentucky-centered conversation about students, faculty, the workforce, and what responsible AI adoption can make possible.",
    href: "https://www.youtube.com/watch?v=tjLBKX_7irw",
    topics: ["Kentucky", "AI literacy", "Workforce"],
  },
  {
    id: "dreams-of-data",
    title: "Dreams of Data: The Promise of AI for Kentucky Healthcare",
    venue: "Kentucky REC Annual Conference",
    format: "Invited talk",
    summary:
      "What Kentucky can do with better data, stronger connections, and a practical approach to AI in healthcare.",
    href: "https://www.kentuckyrec.com/2025-annual-conference/",
    topics: ["Healthcare", "Rural access", "Screening"],
  },
  {
    id: "precision-medicine",
    title: "Precision Medicine 2.0: Logistical Precision with AI",
    venue: "Markey Cancer Center",
    format: "CME presentation",
    summary:
      "Why precision medicine depends as much on logistics, access, navigation, and follow-through as it does on the science.",
    href: "https://cme.cecentral.com/node/3673/bio/11990/view",
    topics: ["Cancer", "Implementation", "Access"],
  },
  {
    id: "dawn-of-ai",
    title: "The Dawn of AI in Medical Education",
    venue: "Society for Academic Emergency Medicine",
    format: "Webinar",
    summary:
      "What large language models mean for clinical reasoning, assessment, and the way physicians are trained.",
    href: "https://www.saem.org/detail-pages/media/the-dawn-of-ai-in-medical-education",
    topics: ["Medical education", "Reasoning", "Assessment"],
  },
  {
    id: "assessment",
    title: "AI for Assessment and Evaluation in Medical Education",
    venue: "Cassyni",
    format: "Invited presentation",
    summary:
      "What educators need to understand before using AI for assessment, scoring, and feedback.",
    href: "https://cassyni.com/events/R2RUrHw6cqfDzUzGihxfkq",
    note: "Tama's section begins at 19:00",
    topics: ["Assessment", "Evaluation", "Faculty development"],
  },
  {
    id: "personalizing-learning",
    title: "Personalizing Learning with AI",
    venue: "Cassyni",
    format: "Invited presentation",
    summary:
      "How AI is changing learning at work, including the quiet changes happening inside searches, drafts, and everyday workflows.",
    href: "https://cassyni.com/events/HVY1tsKLvcDMQrSyQAqNds",
    note: "Tama's section begins at 29:00",
    topics: ["Learning", "Clinical education", "AI literacy"],
  },
];

export const signatureTopics = [
  {
    number: "01",
    title: "Making AI useful in healthcare",
    summary:
      "A practical framework for moving from model performance to workflow, trust, ownership, and follow-through.",
  },
  {
    number: "02",
    title: "AI in medical education",
    summary:
      "What changes when a plausible answer is always one prompt away—and how teaching and assessment can respond.",
  },
  {
    number: "03",
    title: "Learning to work with AI",
    summary:
      "Practice-based AI literacy for universities, health systems, faculty communities, and public-sector leaders.",
  },
  {
    number: "04",
    title: "Building for Kentucky",
    summary:
      "AI, rural access, workforce, public health, and the infrastructure required to connect an insight to real care.",
  },
];

export const speakingRecordVenues = [
  "University law school",
  "Howard University",
  "AAMC",
];

export const contactEmail = siteIdentity.email;
