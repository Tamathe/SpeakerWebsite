# Speaker Website Design

**Date:** 2026-07-09
**Project root:** `C:\AA Code\Speaker`
**Status:** awaiting user review

## Goal

Build a standalone speaker website for Dr. Tama Thé that feels vivid, premium, and personally owned without becoming a blunt advertisement. The site should support academic medicine, higher education, university, state, and conference audiences at the same time.

The first version will be a polished one-page site that can later grow into separate pages for Speaking, Videos, Writing, and About.

## Positioning

The site should present Dr. Thé as a physician educator and practical AI leader helping academic institutions move from AI anxiety to AI-ready practice.

The tone should be:

- Dynamic and vivid
- Academically serious
- Quietly premium
- Useful as a living archive
- Discoverably bookable, not aggressively salesy

The booking path should use language like `Invite` or `Speaking`, not hard-sell language. Public fees should not appear on version one.

## Visual Direction

Use a dark stage design system.

- Near-black primary background
- Vivid accent color for energy and wayfinding
- Strong media placement for featured talks or reel
- Sharp editorial typography
- Serious, compact navigation
- Enough contrast and movement to feel alive

The site can use dark sections throughout, but it should avoid feeling like a generic tech keynote sales page. Archive sections should bring order and credibility through restrained layout, clear labels, and content density.

## Homepage Structure

Version one is a one-page site with these sections:

1. **Hero**
   - Signature speaker identity
   - Clear academic AI positioning
   - Primary action: featured talk or reel
   - Secondary action: invite

2. **Featured Media**
   - Asset-ready area for the best talk, reel, or keynote clip
   - Should look intentional even before final video assets are added

3. **Current Work**
   - AI curricula
   - Faculty development
   - Academic medicine and higher education implementation
   - Institutional strategy

4. **Selected Talks**
   - Keynote and workshop topics
   - Framed for universities, health systems, academic medicine, faculty development, and leadership audiences

5. **Recent Thinking**
   - Videos, essays, posts, talks, or notes
   - This is the living archive layer and should be easy to update

6. **Credibility**
   - Physician educator role
   - University AI leadership
   - NBME AI Fellowship
   - AI curriculum work
   - Publications, presentations, CME, and invited talks

7. **Invite**
   - Quiet invitation path
   - Email link in version one instead of a backend form
   - Space for downloadable bio, headshot, media kit, and AV information later

## Content Model

Keep version-one content as structured data inside the site source rather than hardcoded into many components.

Initial content groups:

- `featuredMedia`
- `currentWork`
- `talks`
- `writing`
- `videos`
- `roles`
- `credentials`
- `inviteMaterials`

This keeps the one-page version clean and makes later page splits easier.

## Technical Approach

Use a lightweight React, Vite, and TypeScript site.

Reasons:

- Good fit for a standalone polished site
- Fast local development
- Simple deployment options
- Easy to grow into a larger archive
- No unnecessary backend for version one

The first version does not need authentication, a database, CMS, or server-side form handling.

## Components

Likely components:

- `Header`
- `Hero`
- `FeaturedMedia`
- `CurrentWork`
- `Talks`
- `RecentThinking`
- `Credibility`
- `Invite`
- `Footer`

Shared types should describe the content objects. No `any` types should be introduced.

## Error And Empty States

- External links should be normal links and fail gracefully in the browser.
- Missing video or image assets should render polished asset-ready panels, not broken boxes.
- Invite should start as a mail link, avoiding form-delivery failure.
- Future downloadable assets can be added only when actual files exist.

## Accessibility And Responsiveness

- Maintain strong color contrast on dark backgrounds.
- Use semantic sections and headings.
- Keep keyboard-friendly links and controls.
- Ensure mobile layout stacks cleanly.
- Avoid text overlap and viewport-scaled font sizing.

## Verification

Before considering implementation locally complete:

- Install dependencies if needed.
- Run the project build or type check.
- Start the local dev server.
- Inspect the page in the browser for visual fit.

If a check cannot run, close out with the exact proof rung reached.

## Out Of Scope For Version One

- Backend contact form
- CMS
- Blog engine
- Public fee schedule
- Payment or booking automation
- Full media kit downloads unless source assets are provided
- Multi-page routing beyond anchors or future-ready structure

## Approval Needed

Before implementation starts, confirm this design still matches the intended direction:

Dark, vivid, premium, academically serious, and organized as a living archive with a quiet invitation path.
