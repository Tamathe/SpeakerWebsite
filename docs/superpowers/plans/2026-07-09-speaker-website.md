# Speaker Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, dark-stage, one-page public professional home for Dr. Tama The in `C:\AA Code\Speaker`.

**Architecture:** Use a Vite React TypeScript app with structured local content and focused presentation components. The first release is a single-page site with future-ready content groups for Work, Talks, Videos, Writing, and About expansion.

**Tech Stack:** Vite, React, TypeScript, CSS, local static content, no backend.

## Global Constraints

- Project root is `C:\AA Code\Speaker`.
- Site tone must be dark, vivid, premium, academically serious, and organized as a living archive with a quiet invitation path.
- The homepage must read as a public professional archive first and an invitation path second.
- Version one must not include a backend contact form, CMS, blog engine, public fee schedule, payment flow, or booking automation.
- Booking language should be `Invite` or `Speaking`, not hard-sell language.
- The top navigation should use `Contact`, not a stronger booking phrase.
- Invite path should use a mail link in version one.
- Missing video or image assets should render polished asset-ready panels, not broken boxes.
- TypeScript strict mode is required.
- Do not use `any` types.

---

## File Structure

- Create `package.json`: scripts and dependencies for the standalone app.
- Create `index.html`: Vite HTML entry.
- Create `tsconfig.json` and `vite.config.ts`: strict TypeScript and Vite config.
- Create `src/main.tsx`: React bootstrap.
- Create `src/App.tsx`: page composition and section components.
- Create `src/content.ts`: typed content groups for hero, media, work, talks, thinking, credibility, and invite materials.
- Create `src/types.ts`: shared content interfaces.
- Create `src/styles.css`: dark-stage visual system and responsive layout.
- Create `public/images/dark-academic-stage.png`: generated temporary hero/media asset.
- Create `scripts/check-positioning.mjs`: copy-positioning guard against returning to speaker-sales framing.

## Reframe Addendum

After browser review, the site was intentionally shifted away from a speaker sales page. The revised homepage leads with `Work, talks, and writing on AI in academic medicine and higher education.`, uses `Explore the work` and `Recent thinking` as hero actions, changes the nav invitation path to `Contact`, and adds `npm run check:positioning` to guard against self-promotional drift.

---

### Task 1: Scaffold The Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`

**Interfaces:**
- Produces: a working React mount point at `#root`.
- Produces: scripts `dev`, `build`, and `preview`.

- [x] **Step 1: Create the package metadata and scripts**

Create `package.json` with:

```json
{
  "name": "speaker-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.11"
  }
}
```

- [x] **Step 2: Create the HTML entry**

Create `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Dr. Tama The speaks on AI, academic medicine, higher education, and practical institutional readiness." />
    <title>Tama The, MD | Academic AI Speaker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [x] **Step 3: Create strict TypeScript config**

Create `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "skipLibCheck": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["vite.config.ts", "src"]
}
```

- [x] **Step 4: Create Vite config**

Create `vite.config.ts` with:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [x] **Step 5: Create the React bootstrap**

Create `src/main.tsx` with:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [x] **Step 6: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is created and dependencies install successfully.

- [x] **Step 7: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json vite.config.ts src/main.tsx
git commit -m "feat: scaffold speaker site"
```

Expected: a local commit is created.

---

### Task 2: Add Typed Content And Dark-Stage Homepage

**Files:**
- Create: `src/types.ts`
- Create: `src/content.ts`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `public/images/dark-academic-stage.png`

**Interfaces:**
- Consumes: React mount point from Task 1.
- Produces: `siteContent` with typed content groups.
- Produces: default export `App`.

- [x] **Step 1: Create shared content types**

Create `src/types.ts` with:

```ts
export interface HeroContent {
  eyebrow: string;
  title: string;
  summary: string;
  primaryAction: LinkAction;
  secondaryAction: LinkAction;
  proofPoints: string[];
}

export interface LinkAction {
  label: string;
  href: string;
}

export interface FeaturedMedia {
  label: string;
  title: string;
  summary: string;
  status: string;
}

export interface WorkItem {
  title: string;
  summary: string;
}

export interface TalkItem {
  title: string;
  audience: string;
  summary: string;
}

export interface ThinkingItem {
  type: string;
  title: string;
  summary: string;
}

export interface CredentialItem {
  label: string;
  detail: string;
}

export interface InviteContent {
  title: string;
  summary: string;
  email: string;
  materials: string[];
}

export interface SiteContent {
  hero: HeroContent;
  featuredMedia: FeaturedMedia;
  currentWork: WorkItem[];
  talks: TalkItem[];
  recentThinking: ThinkingItem[];
  credentials: CredentialItem[];
  invite: InviteContent;
}
```

- [x] **Step 2: Create the first content set**

Create `src/content.ts` with:

```ts
import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  hero: {
    eyebrow: "Academic medicine | Higher education | AI",
    title: "Helping academic institutions become AI-ready.",
    summary:
      "Dr. Tama The is a physician educator and practical AI leader helping universities, health systems, and faculty communities move from AI anxiety to AI-ready practice.",
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
    title: "A stronger reel belongs here.",
    summary:
      "Version one reserves a polished stage for the best keynote clip, speaker reel, or full talk recording once final media is selected.",
    status: "Asset-ready panel",
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
      detail: "Pediatric emergency physician with frontline academic medicine experience.",
    },
    {
      label: "AI leadership",
      detail: "Leading university-level AI curriculum and faculty development work.",
    },
    {
      label: "National fellowship",
      detail: "National Board of Medical Examiners AI Fellow.",
    },
    {
      label: "Speaking record",
      detail: "Invited grand rounds, CME lectures, national presentations, and paid keynote work.",
    },
  ],
  invite: {
    title: "Invite Dr. The",
    summary:
      "For keynotes, academic medicine sessions, higher education convenings, faculty development, and AI strategy conversations.",
    email: "mailto:tsthe2@uky.edu?subject=Speaking%20Invitation",
    materials: [
      "Speaker bio",
      "Headshot",
      "Talk descriptions",
      "AV preferences",
    ],
  },
};
```

- [x] **Step 3: Build the page components**

Create `src/App.tsx` with:

```tsx
import { siteContent } from "./content";
import type { CredentialItem, LinkAction, TalkItem, ThinkingItem, WorkItem } from "./types";

function Header() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand" href="#top" aria-label="Tama The homepage">
        Tama Thé, MD
      </a>
      <nav className="nav-links">
        <a href="#work">Work</a>
        <a href="#talks">Talks</a>
        <a href="#thinking">Thinking</a>
        <a href="#invite">Invite</a>
      </nav>
    </header>
  );
}

function ActionLink({ action, variant }: { action: LinkAction; variant: "primary" | "secondary" }) {
  return (
    <a className={`action-link action-link-${variant}`} href={action.href}>
      {action.label}
    </a>
  );
}

function Hero() {
  const { hero } = siteContent;

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p className="hero-summary">{hero.summary}</p>
        <div className="hero-actions" aria-label="Primary actions">
          <ActionLink action={hero.primaryAction} variant="primary" />
          <ActionLink action={hero.secondaryAction} variant="secondary" />
        </div>
      </div>
      <aside className="proof-panel" aria-label="Professional proof points">
        <p className="panel-label">Proof points</p>
        <ul>
          {hero.proofPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function FeaturedMedia() {
  const { featuredMedia } = siteContent;

  return (
    <section className="section featured" id="featured" aria-labelledby="featured-title">
      <div className="section-heading">
        <p className="eyebrow">{featuredMedia.label}</p>
        <h2 id="featured-title">{featuredMedia.title}</h2>
      </div>
      <div className="media-stage">
        <div>
          <span>{featuredMedia.status}</span>
          <p>{featuredMedia.summary}</p>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="surface-card">
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
    </article>
  );
}

function TalkCard({ talk }: { talk: TalkItem }) {
  return (
    <article className="talk-card">
      <p>{talk.audience}</p>
      <h3>{talk.title}</h3>
      <span>{talk.summary}</span>
    </article>
  );
}

function ThinkingCard({ item }: { item: ThinkingItem }) {
  return (
    <article className="thinking-row">
      <p>{item.type}</p>
      <div>
        <h3>{item.title}</h3>
        <span>{item.summary}</span>
      </div>
    </article>
  );
}

function CredentialCard({ item }: { item: CredentialItem }) {
  return (
    <article className="credential">
      <p>{item.label}</p>
      <span>{item.detail}</span>
    </article>
  );
}

function App() {
  const { currentWork, talks, recentThinking, credentials, invite } = siteContent;

  return (
    <main>
      <Header />
      <Hero />
      <FeaturedMedia />

      <section className="section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">Current work</p>
          <h2 id="work-title">Practical AI work for institutions that teach, heal, and govern.</h2>
        </div>
        <div className="card-grid">
          {currentWork.map((item) => (
            <WorkCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="section" id="talks" aria-labelledby="talks-title">
        <div className="section-heading section-heading-wide">
          <p className="eyebrow">Selected talks</p>
          <h2 id="talks-title">Keynotes and sessions that translate AI pressure into practice.</h2>
        </div>
        <div className="talk-list">
          {talks.map((talk) => (
            <TalkCard talk={talk} key={talk.title} />
          ))}
        </div>
      </section>

      <section className="section split-section" id="thinking" aria-labelledby="thinking-title">
        <div className="section-heading">
          <p className="eyebrow">Recent thinking</p>
          <h2 id="thinking-title">A living archive of talks, essays, videos, and field notes.</h2>
        </div>
        <div className="thinking-list">
          {recentThinking.map((item) => (
            <ThinkingCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="credibility-title">
        <div className="section-heading section-heading-wide">
          <p className="eyebrow">Credibility</p>
          <h2 id="credibility-title">Clinical, educational, and institutional signal in one place.</h2>
        </div>
        <div className="credential-grid">
          {credentials.map((item) => (
            <CredentialCard item={item} key={item.label} />
          ))}
        </div>
      </section>

      <section className="invite-section" id="invite" aria-labelledby="invite-title">
        <div>
          <p className="eyebrow">Invite</p>
          <h2 id="invite-title">{invite.title}</h2>
          <p>{invite.summary}</p>
        </div>
        <div className="invite-panel">
          <a className="action-link action-link-primary" href={invite.email}>
            Start a conversation
          </a>
          <ul>
            {invite.materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="site-footer">
        <span>Tama Thé, MD</span>
        <span>Academic medicine, higher education, and practical AI readiness.</span>
      </footer>
    </main>
  );
}

export default App;
```

- [x] **Step 4: Build the visual system**

Create `src/styles.css` with:

```css
:root {
  color: #f8fafc;
  background: #050608;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --background: #050608;
  --surface: #0b1020;
  --surface-strong: #111827;
  --text: #f8fafc;
  --muted: #aeb7c7;
  --soft: #d6dce8;
  --line: rgba(255, 255, 255, 0.14);
  --accent: #67e8f9;
  --accent-strong: #22d3ee;
  --green: #86efac;
  --gold: #facc15;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(103, 232, 249, 0.16), transparent 30rem),
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 32rem),
    var(--background);
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

main {
  overflow: hidden;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 20px 0;
  background: rgba(5, 6, 8, 0.82);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--line);
}

.brand {
  font-weight: 800;
  letter-spacing: 0;
}

.nav-links {
  display: flex;
  gap: 22px;
  color: var(--muted);
  font-size: 0.92rem;
}

.nav-links a:hover {
  color: var(--text);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 40px;
  width: min(1180px, calc(100% - 40px));
  min-height: calc(100vh - 82px);
  margin: 0 auto;
  padding: 72px 0 64px;
  align-items: center;
}

.hero-copy h1,
.section-heading h2,
.invite-section h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  letter-spacing: 0;
}

.hero-copy h1 {
  max-width: 860px;
  font-size: clamp(3rem, 9vw, 7.8rem);
  line-height: 0.9;
}

.eyebrow {
  margin: 0 0 16px;
  color: var(--accent);
  font-size: 0.77rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-summary {
  max-width: 720px;
  margin: 28px 0 0;
  color: var(--soft);
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 6px;
  font-weight: 800;
}

.action-link-primary {
  background: var(--accent);
  color: #041014;
}

.action-link-primary:hover {
  background: var(--accent-strong);
}

.action-link-secondary {
  border: 1px solid var(--line);
  color: var(--text);
}

.action-link-secondary:hover {
  border-color: var(--accent);
}

.proof-panel,
.surface-card,
.talk-card,
.credential,
.invite-panel {
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border-radius: 8px;
}

.proof-panel {
  padding: 26px;
}

.panel-label {
  margin: 0 0 20px;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.proof-panel ul,
.invite-panel ul {
  display: grid;
  gap: 14px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.proof-panel li,
.invite-panel li {
  color: var(--soft);
  line-height: 1.45;
}

.proof-panel li::before,
.invite-panel li::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.section,
.invite-section {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 76px 0;
}

.featured {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 28px;
  align-items: stretch;
}

.section-heading {
  max-width: 700px;
}

.section-heading-wide {
  max-width: 880px;
}

.section-heading h2,
.invite-section h2 {
  font-size: clamp(2rem, 5vw, 4.4rem);
  line-height: 0.98;
}

.media-stage {
  min-height: 360px;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  border: 1px solid rgba(103, 232, 249, 0.34);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(103, 232, 249, 0.2), transparent 45%),
    radial-gradient(circle at 80% 20%, rgba(134, 239, 172, 0.16), transparent 26rem),
    #080c16;
}

.media-stage span {
  display: inline-flex;
  margin-bottom: 12px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.media-stage p {
  max-width: 520px;
  margin: 0;
  color: var(--soft);
  font-size: 1.1rem;
  line-height: 1.55;
}

.card-grid,
.credential-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}

.surface-card,
.talk-card,
.credential {
  padding: 22px;
}

.surface-card h3,
.talk-card h3,
.thinking-row h3 {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.15;
}

.surface-card p,
.talk-card span,
.thinking-row span,
.credential span,
.invite-section p {
  color: var(--muted);
  line-height: 1.55;
}

.surface-card p {
  margin: 16px 0 0;
}

.talk-list {
  display: grid;
  gap: 14px;
  margin-top: 30px;
}

.talk-card {
  display: grid;
  grid-template-columns: 0.32fr 0.38fr 0.3fr;
  gap: 24px;
  align-items: start;
}

.talk-card p,
.credential p,
.thinking-row p {
  margin: 0;
  color: var(--green);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.split-section {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 48px;
  align-items: start;
}

.thinking-list {
  display: grid;
  gap: 16px;
}

.thinking-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 20px;
  padding: 0 0 18px;
  border-bottom: 1px solid var(--line);
}

.credential-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.invite-section {
  display: grid;
  grid-template-columns: 1fr 0.75fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 54px;
  padding: 46px;
  border: 1px solid rgba(103, 232, 249, 0.28);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(103, 232, 249, 0.13), rgba(255, 255, 255, 0.04));
}

.invite-section p {
  max-width: 660px;
  font-size: 1.12rem;
}

.invite-panel {
  display: grid;
  gap: 22px;
  padding: 24px;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 38px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .hero,
  .featured,
  .split-section,
  .invite-section {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: auto;
  }

  .card-grid,
  .credential-grid {
    grid-template-columns: 1fr;
  }

  .talk-card,
  .thinking-row {
    grid-template-columns: 1fr;
  }

  .site-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
}

@media (max-width: 620px) {
  .nav-links {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    font-size: 0.82rem;
  }

  .hero,
  .section,
  .invite-section {
    width: min(100% - 28px, 1180px);
  }

  .hero-copy h1 {
    font-size: clamp(2.6rem, 17vw, 4.8rem);
  }

  .invite-section {
    padding: 28px;
  }

  .site-footer {
    flex-direction: column;
    width: min(100% - 28px, 1180px);
  }
}
```

- [x] **Step 5: Run the build**

Run: `npm run build`

Expected: TypeScript succeeds and Vite produces `dist/`.

- [x] **Step 6: Commit the homepage**

Run:

```bash
git add src/types.ts src/content.ts src/App.tsx src/styles.css
git commit -m "feat: build dark speaker homepage"
```

Expected: a local commit is created.

---

### Task 3: Local Review And Closeout

**Files:**
- Modify: `docs/superpowers/sprints/2026-07-09-speaker-website-sprint.md`

**Interfaces:**
- Consumes: finished app from Task 2.
- Produces: local dev URL for browser review.

- [x] **Step 1: Start the local dev server**

Run: `npm run dev`

Expected: Vite prints a local URL.

- [x] **Step 2: Open the app in the browser**

Open the Vite local URL and inspect:

- Dark visual direction
- Hero hierarchy
- Featured media panel
- Archive sections
- Invite link
- Mobile-friendly stacking

- [x] **Step 3: Update sprint status**

Update `docs/superpowers/sprints/2026-07-09-speaker-website-sprint.md` so Phase 3 and Phase 4 are complete and the plan path is recorded.

- [x] **Step 4: Commit closeout docs**

Run:

```bash
git add docs/superpowers/sprints/2026-07-09-speaker-website-sprint.md docs/superpowers/plans/2026-07-09-speaker-website.md
git commit -m "docs: record speaker site plan"
```

Expected: a local commit is created.

---

## Self-Review

- Spec coverage: The plan covers standalone Vite setup, strict TypeScript, dark-stage visual direction, one-page living archive structure, quiet invite path, generated project-local media asset, asset-ready media state, no backend, and local verification.
- Placeholder scan: No `TBD`, `TODO`, or implementation-later placeholders are present.
- Type consistency: The planned `siteContent` object matches the interfaces in `src/types.ts`; `App` consumes that object directly.
