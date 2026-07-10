# Signal Field Speaker Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the approved launch footage and rebuild the Speaker site as the responsive, accessible, video-led Signal Field experience.

**Architecture:** Keep the existing Vite, React 19, and strict TypeScript application. Store verified copy and media metadata in typed content, isolate the Signal Field and media-player behavior in focused components, generate optimized derivatives from the untouched `E:` sources, and deploy the static build through Sites after local browser verification.

**Tech Stack:** React 19, TypeScript 5.7 strict mode, Vite 6, Vitest, Testing Library, PowerShell, ffmpeg, CSS, Sites hosting.

## Global Constraints

- Work in `C:\AA Code\Speaker` on `master`; commit directly and do not push unless asked.
- Raw media stays untouched at `E:\Video\PRIVATE\M4ROOT\CLIP`.
- Exclude `C0050` and `C0051` from every launch derivative and content reference.
- Preserve the approved hero copy: `Tama Thé`, `Making AI useful in healthcare.`, and `Physician. Educator. Builder.`
- Use no gradients, decorative orbs, generic AI illustrations, nested cards, or runtime animation dependency.
- Videos never autoplay sound. Reduced-motion and save-data users receive posters instead of autoplay loops.
- Voiced clips require a poster, WebVTT captions, plain-text transcript, duration, context, and explicit play control.
- Keep contact as the existing mail link. No backend, CMS, public fee schedule, or booking automation.
- Local integration may use the selected footage; public publication remains contingent on participant and event reuse permission.

## File Structure

- `src/types.ts`: strict `SignalNode`, `MediaStory`, `TalkItem`, `CredentialItem`, and site-content contracts.
- `src/content.ts`: verified copy, five Signal Field nodes, five media stories, talks, notes, credentials, and contact data.
- `src/hooks/useMediaPreferences.ts`: reduced-motion and save-data decision.
- `src/components/HeroMedia.tsx`: poster-first muted hero loop.
- `src/components/SignalField.tsx`: accessible node selector and stable detail surface.
- `src/components/MediaStory.tsx`: editorial story trigger and fallback content.
- `src/components/MediaGallery.tsx`: one active story, one dialog, and page-level open-state notification.
- `src/components/MediaDialog.tsx`: focused video, captions, transcript, close, and focus restoration.
- `src/App.tsx`: semantic page composition.
- `src/styles.css`: Signal Field visual system, responsive rules, and reduced-motion behavior.
- `src/**/*.test.tsx`: content and interaction tests.
- `vitest.config.ts`, `vitest.setup.ts`: browser-like unit-test environment.
- `scripts/render-site-media.ps1`: deterministic derivative renderer.
- `scripts/check-site-media.mjs`: derivative and manifest validation.
- `scripts/check-positioning.mjs`: approved/rejected copy and design-token validation.
- `public/media/`: generated MP4, JPEG, and VTT launch assets only.
- `public/og.png`: site-specific social preview generated after copy and visual direction stabilize.

---

### Task 1: Test Harness and Typed Content Contract

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/content.test.ts`
- Modify: `src/types.ts`
- Modify: `src/content.ts`

**Interfaces:**
- Consumes: Approved copy and media selections from `docs/superpowers/specs/2026-07-10-speaker-site-signal-field-design.md`.
- Produces: `siteContent.signalNodes: SignalNode[]`, `siteContent.mediaStories: MediaStory[]`, and stable IDs consumed by every component.

- [ ] **Step 1: Install test-only dependencies and scripts**

Run:

```powershell
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add these scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
HTMLMediaElement.prototype.pause = vi.fn();

HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
};

HTMLDialogElement.prototype.close = function close() {
  this.open = false;
  this.dispatchEvent(new Event("close"));
};
```

- [ ] **Step 2: Write the failing content-contract test**

Create `src/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteContent } from "./content";

describe("Signal Field content", () => {
  it("ships five unique field nodes and five approved media stories", () => {
    expect(siteContent.signalNodes).toHaveLength(5);
    expect(new Set(siteContent.signalNodes.map((node) => node.id)).size).toBe(5);
    expect(siteContent.mediaStories).toHaveLength(5);
    expect(siteContent.mediaStories.map((story) => story.sourceClip)).not.toContain("C0050");
    expect(siteContent.mediaStories.map((story) => story.sourceClip)).not.toContain("C0051");
  });

  it("keeps the approved hero terse and non-redundant", () => {
    expect(siteContent.hero.name).toBe("Tama Thé");
    expect(siteContent.hero.statement).toBe("Making AI useful in healthcare.");
    expect(siteContent.hero.descriptor).toBe("Physician. Educator. Builder.");
    expect(siteContent.hero).not.toHaveProperty("eyebrow");
  });
});
```

- [ ] **Step 3: Run the test and confirm RED**

Run: `npm test -- src/content.test.ts`

Expected: FAIL because the old `SiteContent` has no `signalNodes`, `mediaStories`, `hero.name`, or `hero.statement`.

- [ ] **Step 4: Implement the strict contracts**

Define these public interfaces in `src/types.ts`:

```ts
export type SignalId =
  | "cancer-screening"
  | "retinopathy"
  | "rural-access"
  | "ai-literacy"
  | "clinical-reasoning";

export interface SignalNode {
  id: SignalId;
  label: string;
  shortLabel: string;
  summary: string;
  evidence: string;
  relatedTalk: string;
  mediaStoryId: string;
  accent: "chartreuse" | "cyan" | "orange" | "white";
}

export interface MediaStory {
  id: string;
  title: string;
  summary: string;
  context: string;
  sourceClip: string;
  sourceRange: string;
  duration: string;
  videoSrc: string;
  posterSrc: string;
  captionsSrc: string;
  transcript: string[];
  relatedSignal: SignalId;
}
```

Replace the old hero contract with:

```ts
export interface HeroContent {
  name: string;
  statement: string;
  descriptor: string;
  primaryAction: LinkAction;
}
```

Populate `src/content.ts` with exactly five nodes and five stories using these IDs:

```ts
const mediaStoryIds = [
  "cancer-screening",
  "diabetic-retinopathy",
  "human-connection",
  "incubator-in-action",
  "better-physician",
] as const;
```

Use the asset filenames from Task 2 and the verified transcript text from the media index. Keep existing verified project, talk, credential, and mail-link facts; shorten copy to the specification limits.

- [ ] **Step 5: Run the focused and full tests**

Run:

```powershell
npm test -- src/content.test.ts
npm test
```

Expected: PASS with two content-contract tests and no other failures.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json vitest.config.ts vitest.setup.ts src/types.ts src/content.ts src/content.test.ts
git commit -m "feat: define Signal Field content model"
```

---

### Task 2: Deterministic Media Derivatives

**Files:**
- Create: `scripts/check-site-media.mjs`
- Create: `scripts/render-site-media.ps1`
- Create: `public/media/*.vtt`
- Generate: `public/media/*.mp4`
- Generate: `public/media/*.jpg`
- Modify: `package.json`

**Interfaces:**
- Consumes: Raw clips in `E:\Video\PRIVATE\M4ROOT\CLIP` and ffmpeg at `%LOCALAPPDATA%\Temp\speaker-media-tools\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe`.
- Produces: The exact `videoSrc`, `posterSrc`, and `captionsSrc` paths declared in `siteContent.mediaStories` plus `hero-signal-loop.mp4` and `hero-signal-poster.jpg`.

- [ ] **Step 1: Write the failing media checker**

Create `scripts/check-site-media.mjs` with this manifest:

```js
import { readFileSync, statSync } from "node:fs";

const files = [
  "public/media/hero-signal-loop.mp4",
  "public/media/hero-signal-poster.jpg",
  "public/media/cancer-screening.mp4",
  "public/media/cancer-screening.jpg",
  "public/media/cancer-screening.vtt",
  "public/media/diabetic-retinopathy.mp4",
  "public/media/diabetic-retinopathy.jpg",
  "public/media/diabetic-retinopathy.vtt",
  "public/media/human-connection.mp4",
  "public/media/human-connection.jpg",
  "public/media/human-connection.vtt",
  "public/media/incubator-in-action.mp4",
  "public/media/incubator-in-action.jpg",
  "public/media/incubator-in-action.vtt",
  "public/media/better-physician.mp4",
  "public/media/better-physician.jpg",
  "public/media/better-physician.vtt",
];

const missing = files.filter((file) => {
  try {
    return statSync(file).size === 0;
  } catch {
    return true;
  }
});

if (missing.length > 0) {
  console.error(missing.join("\n"));
  process.exit(1);
}

const renderer = readFileSync("scripts/render-site-media.ps1", "utf8");
if (renderer.includes("C0050") || renderer.includes("C0051")) process.exit(1);
console.log(`Media check passed: ${files.length} assets.`);
```

Add `"check:media": "node scripts/check-site-media.mjs"` to `package.json`.

- [ ] **Step 2: Run the checker and confirm RED**

Run: `npm run check:media`

Expected: FAIL listing the missing launch derivatives.

- [ ] **Step 3: Create the renderer manifest and focused-clip loop**

Create `scripts/render-site-media.ps1` with parameters for `SourceRoot`, `OutputRoot`, and `FfmpegPath`. Use this focused manifest:

```powershell
$stories = @(
    @{ Name = "cancer-screening"; Clip = "C0029"; Start = "00:21:27"; Duration = "00:00:39"; Poster = "00:00:08" },
    @{ Name = "diabetic-retinopathy"; Clip = "C0029"; Start = "00:37:18"; Duration = "00:00:19"; Poster = "00:00:08" },
    @{ Name = "human-connection"; Clip = "C0029"; Start = "00:55:36"; Duration = "00:00:28"; Poster = "00:00:10" },
    @{ Name = "incubator-in-action"; Clip = "C0040"; Start = "00:03:15"; Duration = "00:00:22"; Poster = "00:00:08" },
    @{ Name = "better-physician"; Clip = "C0047"; Start = "00:01:46"; Duration = "00:00:28"; Poster = "00:00:08" }
)
```

For each story, render with:

```powershell
& $FfmpegPath -hide_banner -loglevel error -y -ss $story.Start -i $source `
  -t $story.Duration -map 0:v:0 -map 0:a:0 -vf "scale=-2:720:flags=lanczos,format=yuv420p" `
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v libx264 -preset medium -crf 24 `
  -movflags +faststart -c:a aac -b:a 128k $videoPath
```

Extract each poster from the rendered derivative with `-ss $story.Poster -frames:v 1 -q:v 3`.

- [ ] **Step 4: Render the silent hero montage**

Use four eight-second inputs from the approved source ranges. Normalize each to 1280x720 at 30 fps, apply 0.5-second `xfade` transitions at offsets `7.5`, `15`, and `22.5`, remove audio, encode H.264 with `-crf 27`, and write `hero-signal-loop.mp4`. Extract `hero-signal-poster.jpg` from 10 seconds.

Pass these exact inputs to ffmpeg in this order:

```text
-ss 00:21:27 -t 00:00:08 -i E:\Video\PRIVATE\M4ROOT\CLIP\C0029.MP4
-ss 00:01:50 -t 00:00:08 -i E:\Video\PRIVATE\M4ROOT\CLIP\C0040.MP4
-ss 00:00:34 -t 00:00:08 -i E:\Video\PRIVATE\M4ROOT\CLIP\C0047.MP4
-ss 00:00:56 -t 00:00:08 -i E:\Video\PRIVATE\M4ROOT\CLIP\C0046.MP4
```

The command's filter graph must use these labels and offsets exactly:

```text
[0:v]scale=1280:720,fps=30,format=yuv420p[v0];
[1:v]scale=1280:720,fps=30,format=yuv420p[v1];
[2:v]scale=1280:720,fps=30,format=yuv420p[v2];
[3:v]scale=1280:720,fps=30,format=yuv420p[v3];
[v0][v1]xfade=transition=fade:duration=0.5:offset=7.5[x1];
[x1][v2]xfade=transition=fade:duration=0.5:offset=15[x2];
[x2][v3]xfade=transition=fade:duration=0.5:offset=22.5[outv]
```

- [ ] **Step 5: Add corrected WebVTT captions**

Create one VTT per focused story. Each file starts with `WEBVTT`, uses timestamps relative to the derivative, and corrects names and domain terms including Kentucky, Medicaid, diabetic retinopathy, AI, and Incubator. Derive cue boundaries from `%LOCALAPPDATA%\SpeakerMediaIndex\transcripts\<clip>.json`, subtract the cut start, and manually compare the resulting text with the canonical transcript excerpts in `docs/media/README.md`.

- [ ] **Step 6: Render and verify GREEN**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\render-site-media.ps1
npm run check:media
```

Expected: `Media check passed: 17 assets.` Confirm the hero file has no audio stream and each story file has one video and one audio stream using ffmpeg header inspection.

- [ ] **Step 7: Commit**

```powershell
git add package.json package-lock.json scripts/render-site-media.ps1 scripts/check-site-media.mjs public/media
git commit -m "feat: add curated speaker media"
```

---

### Task 3: Hero Media Preferences and Signal Field

**Files:**
- Create: `src/hooks/useMediaPreferences.ts`
- Create: `src/components/HeroMedia.tsx`
- Create: `src/components/HeroMedia.test.tsx`
- Create: `src/components/SignalField.tsx`
- Create: `src/components/SignalField.test.tsx`

**Interfaces:**
- Consumes: `HeroContent`, `SignalNode[]`, `MediaStory[]`.
- Produces: `<HeroMedia paused={boolean} />` and `<SignalField nodes={signalNodes} stories={mediaStories} />`.

- [ ] **Step 1: Write the failing Signal Field test**

Create `src/components/SignalField.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { siteContent } from "../content";
import { SignalField } from "./SignalField";

describe("SignalField", () => {
  it("defaults to cancer screening and updates from a real button", async () => {
    const user = userEvent.setup();
    render(<SignalField nodes={siteContent.signalNodes} stories={siteContent.mediaStories} />);

    expect(screen.getByRole("heading", { name: /closing kentucky/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /diabetic retinopathy/i }));
    expect(screen.getByRole("heading", { name: /retinopathy/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /diabetic retinopathy/i })).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- src/components/SignalField.test.tsx`

Expected: FAIL because `SignalField.tsx` does not exist.

- [ ] **Step 3: Implement media preferences and hero**

`useMediaPreferences()` returns `{ reduceMotion, saveData, allowAutoplay }` without `any`. Model `navigator.connection` through a local intersection type with optional `saveData?: boolean`. Subscribe to the reduced-motion media query and clean up the listener.

`HeroMedia` renders the poster-first `<video>` only when `allowAutoplay` is true. A video ref effect pauses when `paused` becomes true and resumes muted playback when it becomes false:

```tsx
<video autoPlay muted loop playsInline preload="metadata" poster="/media/hero-signal-poster.jpg">
  <source src="/media/hero-signal-loop.mp4" type="video/mp4" />
</video>
```

On playback error, retain the poster layer and mark the video hidden. Ignore a rejected `video.play()` promise because the poster remains the complete fallback.

Create `src/components/HeroMedia.test.tsx` before implementation with a test that renders `<HeroMedia paused={false} />`, asserts the labeled video is present, rerenders with `paused={true}`, and expects `HTMLMediaElement.prototype.pause` to have been called. Run it once before implementation and confirm it fails because `HeroMedia` does not exist.

- [ ] **Step 4: Implement SignalField**

Use one `selectedId` state initialized to `nodes[0].id`. Render every node as a button with `aria-pressed`. Resolve the linked story by `mediaStoryId`; throw during development if content references a missing story. Keep the detail region mounted so selection cannot resize the section unexpectedly.

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- src/components/SignalField.test.tsx
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/hooks/useMediaPreferences.ts src/components/HeroMedia.tsx src/components/HeroMedia.test.tsx src/components/SignalField.tsx src/components/SignalField.test.tsx
git commit -m "feat: add interactive healthcare AI field"
```

---

### Task 4: Accessible Video Stories

**Files:**
- Create: `src/components/MediaDialog.tsx`
- Create: `src/components/MediaStory.tsx`
- Create: `src/components/MediaGallery.tsx`
- Create: `src/components/MediaDialog.test.tsx`

**Interfaces:**
- Consumes: `MediaStory[]` and `onOpenChange(open: boolean): void` from `App`.
- Produces: explicit-play story surfaces, one shared accessible focused dialog, and page-level media-open state used to pause the hero.

- [ ] **Step 1: Write the failing dialog test**

Create `src/components/MediaDialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { siteContent } from "../content";
import { MediaGallery } from "./MediaGallery";

describe("MediaStoryCard", () => {
  it("opens the focused story, exposes transcript text, and restores focus", async () => {
    const user = userEvent.setup();
    render(<MediaGallery stories={siteContent.mediaStories} onOpenChange={() => undefined} />);
    const play = screen.getByRole("button", { name: /play closing kentucky/i });

    await user.click(play);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /show transcript/i }));
    expect(screen.getByText(/depending on where you live/i)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(play).toHaveFocus();
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- src/components/MediaDialog.test.tsx`

Expected: FAIL because the media components do not exist.

- [ ] **Step 3: Implement the story trigger and focused dialog**

`MediaStoryCard` is stateless and renders a stable 16:9 poster, duration, title, context, and a text play command. Its `onPlay(story, trigger)` callback passes the story and invoking button to `MediaGallery`. `MediaGallery` owns the active story and invoking element, renders exactly one `MediaDialog`, and calls `onOpenChange(true)` on open and `onOpenChange(false)` after close. `MediaDialog` uses a native `<dialog>` controlled through `showModal()` and `close()`, listens for native cancel, pauses video on close, and restores focus to the invoker.

The focused video includes:

```tsx
<video controls playsInline preload="metadata" poster={story.posterSrc}>
  <source src={story.videoSrc} type="video/mp4" />
  <track kind="captions" src={story.captionsSrc} srcLang="en" label="English" default />
</video>
```

The transcript uses a real disclosure button. Playback failure displays poster, summary, duration, transcript, and related signal rather than an empty player.

- [ ] **Step 4: Run tests**

Run:

```powershell
npm test -- src/components/MediaDialog.test.tsx
npm test
```

Expected: PASS, including focus restoration.

- [ ] **Step 5: Commit**

```powershell
git add src/components/MediaDialog.tsx src/components/MediaStory.tsx src/components/MediaGallery.tsx src/components/MediaDialog.test.tsx
git commit -m "feat: add accessible video stories"
```

---

### Task 5: Page Composition, Metadata, and Positioning Guard

**Files:**
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Modify: `scripts/check-positioning.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: typed content and all components from Tasks 1, 3, and 4.
- Produces: the full semantic one-page experience with stable anchors.

- [ ] **Step 1: Write the failing page test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("leads with the person and the work instead of sales copy", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "Tama Thé" })).toBeInTheDocument();
    expect(screen.getByText("Making AI useful in healthcare.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the work" })).toHaveAttribute("href", "#field");
    expect(screen.queryByText(/proof points/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invite dr/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because the old hero uses the positioning statement as its `h1` and retains the old composition.

- [ ] **Step 3: Recompose App.tsx**

Keep `const [isMediaOpen, setIsMediaOpen] = useState(false)` in `App`. Pass `paused={isMediaOpen}` to `HeroMedia` and `onOpenChange={setIsMediaOpen}` to `MediaGallery`, so an explicit story playback pauses the decorative loop. Build this semantic order:

```tsx
<Header />
<Hero />
<SignalFieldSection />
<MediaGallery stories={mediaStories} onOpenChange={setIsMediaOpen} />
<SelectedWorkSection />
<TalksAndNotesSection />
<ProfileSection />
<ContactSection />
<Footer />
```

Use `id="field"`, `id="stories"`, `id="talks"`, `id="about"`, and `id="contact"`. The `h1` is only the name. Keep the profile below work, stories, and talks. Do not render an eyebrow in the hero.

- [ ] **Step 4: Update positioning and document metadata**

Make `scripts/check-positioning.mjs` require:

```js
[
  "Tama Thé",
  "Making AI useful in healthcare.",
  "Physician. Educator. Builder.",
  "Cancer screening",
  "Diabetic retinopathy",
  "Human connection",
  "Completed NBME AI Research Fellowship",
  "For invitations and collaborations",
]
```

Reject `Current focus`, `Proof points`, `Invite Dr.`, `paid keynote work`, `C0050`, and `C0051`.

Update `index.html` title and description to describe Tama Thé and useful AI in healthcare. Add Open Graph and X text metadata without an image until Task 7 supplies the verified social card.

- [ ] **Step 5: Run tests and positioning check**

Run:

```powershell
npm test -- src/App.test.tsx
npm run check:positioning
npm test
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/App.tsx src/App.test.tsx scripts/check-positioning.mjs index.html
git commit -m "feat: compose Signal Field speaker site"
```

---

### Task 6: Signal Field Visual System and Responsive Behavior

**Files:**
- Create: `scripts/check-design.mjs`
- Modify: `package.json`
- Replace: `src/styles.css`

**Interfaces:**
- Consumes: class names and section IDs from Tasks 3 through 5.
- Produces: near-black editorial layout, stable desktop/mobile geometry, and reduced-motion behavior.

- [ ] **Step 1: Write the failing design guard**

Create `scripts/check-design.mjs`:

```js
import { readFileSync } from "node:fs";

const css = readFileSync("src/styles.css", "utf8");
const required = ["#050607", "#d7ff3f", "#33d6ff", "#ff5a36", "prefers-reduced-motion", "aspect-ratio"];
const rejected = ["radial-gradient(", "linear-gradient(", "border-radius: 999", "letter-spacing: -"];
const viewportFont = /font-size\s*:[^;]*vw/;
const missing = required.filter((token) => !css.includes(token));
const presentRejected = rejected.filter((token) => css.includes(token));

if (missing.length || presentRejected.length || viewportFont.test(css)) {
  console.error(JSON.stringify({ missing, presentRejected, viewportFont: viewportFont.test(css) }, null, 2));
  process.exit(1);
}

console.log("Signal Field design check passed.");
```

Add `"check:design": "node scripts/check-design.mjs"`.

- [ ] **Step 2: Run the guard and confirm RED**

Run: `npm run check:design`

Expected: FAIL because the old stylesheet uses gradients and the previous palette.

- [ ] **Step 3: Replace the stylesheet**

Implement these fixed tokens:

```css
:root {
  --ink: #050607;
  --paper: #f7f8f3;
  --white: #ffffff;
  --muted: #a8aca6;
  --line: rgba(255, 255, 255, 0.2);
  --chartreuse: #d7ff3f;
  --cyan: #33d6ff;
  --orange: #ff5a36;
  --content: 1240px;
}
```

Use full-width unframed section bands, no section-as-card styling, and cards only for repeated media or project records. Reserve media with `aspect-ratio: 16 / 9`. Keep hero height between `min-height: 720px` and `height: 88svh` without viewport-scaled font sizes. Use fixed responsive typography steps rather than `vw` font sizing.

At `max-width: 760px`, convert the field constellation to a horizontally scrollable button rail and one-column detail region. Keep every section within `calc(100% - 32px)` and prevent horizontal document overflow.

Under reduced motion, disable autoplay visibility, pulses, transforms, smooth scroll, and transitions while retaining posters and selected states.

- [ ] **Step 4: Run static checks and full tests**

Run:

```powershell
npm run check:design
npm run check:positioning
npm test
npm run build
```

Expected: all PASS and Vite emits the production bundle.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json scripts/check-design.mjs src/styles.css
git commit -m "feat: apply Signal Field visual system"
```

---

### Task 7: Social Card, Browser Verification, and Sites Preview

**Files:**
- Generate: `public/og.png`
- Modify: `index.html`
- Modify: `.openai/hosting.json` only if Sites setup requires it for the existing Vite project.

**Interfaces:**
- Consumes: completed local site and approved final copy.
- Produces: verified local build and hosted preview URL.

- [ ] **Step 1: Generate one site-specific social card**

Use `imagegen` once after the page copy and palette are stable. The prompt must request a complete 1200x630 card with correct text `Tama Thé` and `Making AI useful in healthcare.`, near-black ground, white Swiss editorial typography, chartreuse/cyan/orange signal lines, and a documentary healthcare-AI visual language derived from the finished site. Inspect the generated text; retry once only if unusable.

Save the verified output as `public/og.png`. Add Open Graph and X image metadata in `index.html` using `/og.png`.

- [ ] **Step 2: Run the complete automated proof set**

Run:

```powershell
npm run check:media
npm run check:design
npm run check:positioning
npm test
npm run build
```

Expected: every command exits 0.

- [ ] **Step 3: Start the development server and verify in the in-app browser**

Run `npm run dev` in a retained session and use the exact printed local URL. Verify:

- Desktop at approximately 1440x900
- Mobile at approximately 390x844
- No console errors, text overlap, horizontal scroll, blank video, or unstable dimensions
- Hero reveals the next section
- Every Signal Field button changes the stable detail region
- Every story opens, shows captions/transcript, closes with Escape, and restores focus
- Reduced-motion mode produces a complete poster-first experience
- Contact mail link and external talk links have correct destinations

- [ ] **Step 4: Use Sites hosting for the preview and finalize absolute social metadata**

Invoke `sites:sites-hosting` for the existing Vite project. Preserve the current package manager and lockfile. Use the returned stable preview origin to replace the temporary social image value in `index.html` with an absolute `<preview-origin>/og.png` URL, rerun `npm run build`, and update the same hosted preview. Return the hosted preview URL; do not represent the preview as a public launch until reuse permissions are confirmed.

- [ ] **Step 5: Commit final verified assets and metadata**

```powershell
git add public/og.png index.html .openai/hosting.json
git commit -m "chore: prepare Signal Field preview"
```

If `.openai/hosting.json` is not created or changed, omit it from `git add`.

---

## Final Verification Checklist

- [ ] Five content nodes and five focused stories pass typed-content tests.
- [ ] Seventeen media assets exist, are nonempty, and exclude May footage.
- [ ] Hero derivative has no audio stream.
- [ ] Voiced stories have audio, posters, captions, and transcript text.
- [ ] Signal Field and dialog behavior pass Testing Library tests.
- [ ] Positioning and design guards pass.
- [ ] Production build succeeds.
- [ ] Desktop, mobile, keyboard, reduced-motion, and media fallbacks pass browser review.
- [ ] Hosted preview URL resolves successfully.
- [ ] Source footage remains untouched.
- [ ] No public-launch claim is made before reuse permission is confirmed.
