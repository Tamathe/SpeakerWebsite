# Signal Field Speaker Site Reboot Design

**Date:** 2026-07-10
**Status:** Written specification awaiting final approval
**Baseline:** `master` at `11cdd43`
**Project:** `C:\AA Code\Speaker`

## 1. Goal

Rebuild Tama Thé's public site as a vivid, video-led professional archive about
practical AI in healthcare. The site must support university, state,
healthcare, education, collaboration, and speaking audiences without reading
like a sales page.

The work is the subject. Kentucky healthcare problems, projects, students,
collaborators, and practical outcomes carry the story. Tama is the connective
presence rather than the subject of every frame.

## 2. Launch Scope

The launch is a single responsive React page with anchored sections, an
interactive project field, short-form video stories, selected talks, a brief
profile, and a quiet contact path.

The May recordings `C0050` and `C0051` are explicitly excluded from launch.
They may enter a later media update after their separate audio is synchronized
and reviewed.

Launch does not require a backend, CMS, authentication, booking automation, or
public fee schedule.

## 3. Audiences

Primary audiences:

- Healthcare, public-sector, and university leaders looking for practical AI
  work
- Conference, retreat, and panel organizers evaluating Tama as a speaker
- Clinicians, educators, students, and collaborators exploring the work

The first viewport must establish three things quickly:

1. This is Tama The's site.
2. The focus is useful AI in healthcare.
3. The evidence is real work, not promotional claims.

## 4. Positioning and Copy

The hero contains no eyebrow and no duplicate statement.

- Name: `Tama Thé`
- Primary statement: `Making AI useful in healthcare.`
- Compact descriptor: `Physician. Educator. Builder.`
- Primary action: `Explore the work`
- Quiet navigation action: `Contact`

The page uses short declarative copy. Long biography and credential blocks are
replaced by evidence, selected facts, and links to deeper material.

## 5. Visual Direction

The selected direction is Signal Field.

- Near-black cinematic canvas
- White editorial typography
- Chartreuse, cyan, and restrained orange-red signals
- Swiss-influenced type treatment with system sans and mono metadata
- Full-bleed video rather than framed hero cards
- Fine rules, coordinates, and connection lines rather than decorative blobs
- Square or lightly rounded surfaces with an 8-pixel maximum radius
- No gradients, orbs, generic AI illustrations, nested cards, or oversized
  marketing copy

The palette must not read as a one-color blue or purple technology theme.
Color identifies project families and interaction state.

## 6. Page Architecture

### 6.1 Header

A compact fixed header contains the name and anchor links for Field, Stories,
Talks, About, and Contact. It becomes a compact menu on narrow screens without
hiding the contact path.

### 6.2 Opening Signal

The opening uses a full-bleed muted video montage with text over the footage.
It occupies roughly 85 to 92 percent of the first viewport so the next section
remains visible. The name is the semantic `h1`; the positioning statement is a
large supporting line.

The hero never autoplays sound. Reduced-motion and save-data users receive the
poster image instead of an autoplaying loop.

### 6.3 Signal Field

The signature interaction connects five bodies of work:

- Cancer screening
- Diabetic retinopathy
- Rural access and statewide infrastructure
- AI literacy
- Clinical reasoning and assessment

Each node is a real button. Selecting a node changes the adjacent project
summary, evidence line, related talk, and associated media. The default is
Cancer screening. Focus, hover, and selected states are distinct. On mobile,
the map becomes a horizontal selector above a stable detail region rather than
an absolute-positioned constellation.

### 6.4 Video Stories

Three editorial stories lead the section:

1. Closing Kentucky's cancer-screening gaps
2. Bringing diabetic-retinopathy screening into primary care
3. Keeping human connection at the center of AI-enabled care

Supporting stories show Tama in the field and students explaining why the work
matters. Each story has a poster, concise context, duration, and explicit play
control. Activating a story opens a focused accessible player with native
controls, captions, transcript, project context, and related links.

### 6.5 Selected Work

Project summaries stay concise and connect directly to the Signal Field and
video stories. Claims remain limited to verified source material already in
`src/content.ts` and the media index.

### 6.6 Selected Talks and Notes

The talk list retains the strongest verified external links. Notes remain a
small living-archive surface rather than an invented blog. Existing unlinked
draft notes may appear as labeled field notes but never imply publication.

### 6.7 Brief Profile

The profile is deliberately late in the page. It contains one short paragraph
and a compact credential strip covering clinical practice, the completed NBME
AI Research Fellowship, UK AI literacy work, the AI Incubator, and state-funded
healthcare projects.

### 6.8 Contact

The final section uses the existing email link and frames contact as an
invitation to discuss healthcare AI projects, talks, workshops, retreats,
panels, and public-sector collaboration. It does not show fees, availability
claims, a lead form, or sales language.

## 7. Launch Media

Raw media remains at `E:\Video\PRIVATE\M4ROOT\CLIP` and is never moved or
modified. Only optimized derivatives enter the site.

### 7.1 Hero montage

The silent hero montage uses short visual selections from:

- `C0029` `21:27-21:35`: Tama speaking on stage
- `C0040` `01:50-01:58`: Tama trying a healthcare technology demonstration
- `C0047` `00:34-00:42`: student voice and visible community
- `C0046` `00:56-01:04`: pediatric AR project detail

The montage is a seamless 16:9 loop at 720p with no audio track. CSS
`object-fit: cover` provides the responsive crop; a dedicated poster preserves
the key subject when playback is disabled.

### 7.2 Focused story clips

| Asset | Source | Cut | Purpose |
| --- | --- | --- | --- |
| Cancer screening | `C0029` | `21:27-22:06` | Kentucky life expectancy and screening gaps |
| Diabetic retinopathy | `C0029` | `37:18-37:37` | Deep-learning screening in primary care |
| Human connection | `C0029` | `55:36-56:04` | Precision and impact without replacing people |
| Incubator in action | `C0040` | `03:15-03:37` | Students and faculty leaning into AI together |
| Better physician | `C0047` | `01:46-02:14` | Student perspective on AI in future practice |

Each focused clip is an optimized 720p H.264 MP4 with AAC audio, a JPEG poster,
and a WebVTT caption file. Captions are generated from timed transcripts and
then corrected against the final audio. The implementation stores media
metadata in structured TypeScript content rather than scattering filenames
through components.

## 8. Application Architecture

The existing Vite, React 19, and strict TypeScript stack remains in place.
There is no framework migration.

Responsibilities are separated as follows:

- `src/content.ts`: verified projects, talks, notes, credentials, and media
  metadata
- `src/types.ts`: strict content and media contracts
- `src/App.tsx`: page composition and semantic section order
- `src/components/SignalField.tsx`: accessible project selector and detail
  surface
- `src/components/MediaStory.tsx`: poster, metadata, and play action
- `src/components/MediaDialog.tsx`: focused player, captions, transcript, and
  focus management
- `src/styles.css`: complete Signal Field visual and responsive system
- `public/media/`: optimized derivatives, posters, and captions only

The site remains static and deployable without server state. External talk
links open normally. Contact remains a mail link.

## 9. Interaction Behavior

- Anchor navigation uses native links and respects reduced motion.
- Signal Field selection uses buttons and local React state.
- Video stories never play audio without an explicit user action.
- Opening a story pauses any other story and the decorative hero loop.
- The media dialog traps focus, closes with Escape, restores focus to the
  invoking control, and exposes a visible close icon with an accessible label.
- Transcript disclosure is available without requiring playback.
- Hover effects never carry information that is unavailable to keyboard and
  touch users.

## 10. Resilience and Fallbacks

- A failed hero video shows its poster while retaining all hero copy and
  actions.
- A failed focused clip still shows its poster, title, summary, duration,
  transcript, and related project.
- Missing optional media omits the player without collapsing the surrounding
  project story.
- `prefers-reduced-motion: reduce` disables autoplay, parallax, field pulses,
  and animated scrolling.
- Save-data mode avoids autoplay and preloads only metadata.
- If a non-critical interaction fails, core text, links, posters, and native
  media remain usable within the rendered page.

## 11. Accessibility

- Semantic landmarks and one `h1`
- Visible keyboard focus on every action
- WCAG AA contrast for text and controls
- Native video controls and captions for every voiced clip
- Plain-text transcripts adjacent to each media story
- No flashing animation or sound-dependent meaning
- Stable dimensions for videos, selectors, and controls
- Mobile text wraps without overlap at 320 pixels and wider

## 12. Performance

- Hero derivative targets approximately 4 to 6 MB.
- Focused clips target approximately 3 to 8 MB each where source quality
  permits.
- Only the hero uses eager media loading; story clips preload metadata.
- Posters reserve aspect ratio before media loads.
- Below-the-fold media uses native lazy behavior where supported.
- No new runtime dependency is required for animation, icons, or video.

## 13. Verification

Before local completion:

- Validate every selected timestamp against the canonical media index.
- Confirm all generated videos and posters are nonblank and correctly framed.
- Confirm voiced clips include working caption tracks.
- Run `npm run build` and `npm run check:positioning`.
- Inspect desktop and mobile layouts in the in-app browser.
- Verify keyboard operation for navigation, Signal Field, media playback, the
  transcript disclosure, and dialog close/return focus.
- Check for console errors, text overlap, horizontal scrolling, and broken
  external links.
- Confirm reduced-motion mode presents a complete static experience.

## 14. Publication Boundary

Local integration is allowed for review. Public deployment requires
confirmation that identifiable students, presenters, panelists, and event
footage may be reused. No clip is represented as a patient testimonial, and no
clinical patient footage is included in launch scope.

## 15. Success Criteria

The reboot succeeds when:

- The first viewport feels vivid and unmistakably about useful AI in
  healthcare.
- A visitor can understand the Kentucky cancer-screening and
  diabetic-retinopathy work without reading a long biography.
- The signature field interaction is useful with pointer, keyboard, and touch.
- Video proves the work without turning the page into a promotional reel.
- Contact is easy to find but never dominates the experience.
- The site remains complete when video, motion, or sound is unavailable.
