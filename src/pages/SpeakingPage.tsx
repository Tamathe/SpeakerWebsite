import { AmbientSpeakerVideo } from "../components/AmbientSpeakerVideo";
import { EngagementList } from "../components/EngagementList";
import { LegislatureVideo } from "../components/LegislatureVideo";
import {
  credentials,
  engagements,
  healthcareInitiatives,
  incubatorSiteUrl,
  siteIdentity,
} from "../siteContent";

export function SpeakingPage() {
  return (
    <>
      <header className="video-led-hero">
        <div className="shell video-led-hero-layout">
          <div className="video-led-hero-copy">
            <p className="page-kicker">Healthcare / Education / Public systems</p>
            <h1>{siteIdentity.thesis}</h1>
            <p>
              My work focuses on what happens after an AI system produces an
              answer: who receives the information, what decision it changes,
              and whether the next step is completed. I work on that problem
              across healthcare, education, and public systems in Kentucky.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#work"
                data-analytics-id="hero-current-work"
              >
                View current work <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button button-outline"
                href="#featured-talk"
                data-analytics-id="hero-featured-presentation"
              >
                Featured presentation
              </a>
            </div>
          </div>

          <figure className="video-led-hero-media">
            <div className="video-led-hero-stage">
              <AmbientSpeakerVideo className="video-led-hero-reel" />
              <span className="video-led-hero-vignette" aria-hidden="true" />
            </div>
            <figcaption className="speaking-reel-caption">
              <span>Selected talks and teaching / 2025–2026</span>
              <span>Kentucky</span>
            </figcaption>
          </figure>
        </div>
      </header>

      <section
        className="featured-talk-section"
        id="featured-talk"
        aria-labelledby="featured-talk-title"
      >
        <div className="shell featured-talk-grid">
          <div className="featured-talk-copy">
            <p className="section-index">Featured presentation / NBME NICE 2026</p>
            <h2 id="featured-talk-title">
              Connecting healthcare information across Kentucky.
            </h2>
            <p>
              This excerpt describes governed connections across existing
              healthcare systems. The goal is not one statewide database. It is
              to return useful information to the person responsible for the
              next step in care.
            </p>
            <div className="featured-talk-details" aria-label="Video details">
              <span>1:23 excerpt</span>
              <span>English captions</span>
              <span>Produced by NBME</span>
            </div>
            <a
              className="text-link"
              href="https://f.io/AWtTiZWu"
              target="_blank"
              rel="noreferrer"
              data-analytics-id="nbme-full-presentation"
            >
              Watch the full NBME presentation <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="featured-talk-player">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/media/speaking/nbme-stage-poster.jpg"
              data-analytics-video-id="nbme-excerpt"
            >
              <source
                src="/media/speaking/nbme-nice-2026-healthcare-ai-excerpt.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/media/speaking/nbme-nice-2026-healthcare-ai.en.vtt"
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support embedded video. You can watch the
              full presentation using the link beside this player.
            </video>
            <p>NBME NICE 2026 · Presentation excerpt</p>
          </div>
        </div>
      </section>

      <section className="mission-work" id="work" aria-labelledby="work-title">
        <div className="shell section-intro">
          <p className="section-index">Healthcare projects</p>
          <div>
            <h2 id="work-title">Current work in healthcare.</h2>
            <p>
              These projects address cancer screening, diabetic retinopathy,
              and blood delivery. In each, the technical system is one part of
              the work. The rest is referral, navigation, scheduling, clinical
              responsibility, and follow-up.
            </p>
          </div>
        </div>

        <div className="shell mission-project-grid">
          {healthcareInitiatives.map((initiative) => (
            <article className="mission-project" key={initiative.id}>
              <figure>
                <img
                  src={initiative.image}
                  alt={initiative.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{initiative.imageCaption}</figcaption>
              </figure>
              <div className="mission-project-heading">
                <span>{initiative.number}</span>
                <p>{initiative.area}</p>
              </div>
              <h3>{initiative.title}</h3>
              <p className="mission-project-stage">{initiative.stage}</p>
              <p className="mission-project-question">{initiative.question}</p>
              <p className="mission-project-summary">{initiative.summary}</p>
              <p className="mission-project-focus">{initiative.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hero-facts proof-strip" aria-label="Selected experience">
        {credentials.map((credential) => (
          <span key={credential.label}>
            <small>{credential.label}</small>
            <strong>{credential.detail}</strong>
          </span>
        ))}
      </section>

      <section
        className="story-section story-section-tek100"
        id="tek100"
        aria-labelledby="tek100-title"
      >
        <div className="shell story-grid">
          <div className="story-copy">
            <p className="section-index">AI literacy / TEK 100</p>
            <h2 id="tek100-title">AI literacy at the University of Kentucky.</h2>
            <p>
              TEK 100 is a foundational, hands-on AI literacy course co-created
              for University of Kentucky students. Students use AI, test its
              output, compare it with trusted sources, and decide when it
              belongs in the work.
            </p>
            <div className="featured-talk-details" aria-label="Video details">
              <span>0:31 excerpt</span>
              <span>English captions</span>
              <span>Foundational AI literacy</span>
            </div>
          </div>
          <div className="story-player">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/media/speaking/tek100-tech-agnostic-poster.jpg"
              data-analytics-video-id="tek100-excerpt"
            >
              <source
                src="/media/speaking/tek100-tech-agnostic-excerpt.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/media/speaking/tek100-tech-agnostic-excerpt.en.vtt"
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support embedded video.
            </video>
            <p>TEK 100 · Course excerpt</p>
          </div>
        </div>
      </section>

      <section
        className="story-section story-section-incubator"
        id="incubator"
        aria-labelledby="incubator-feature-title"
      >
        <div className="shell story-grid story-grid-media-first">
          <div className="story-copy">
            <p className="section-index">University of Kentucky / AI Incubator</p>
            <h2 id="incubator-feature-title">The UK AI Incubator.</h2>
            <p>
              I founded the UK AI Incubator as an open cross-campus community
              for students, faculty, and staff. People bring early projects,
              find collaborators outside their usual disciplines, and work
              toward a small, testable next step.
            </p>
            <div className="featured-talk-details" aria-label="Video details">
              <span>0:58 film</span>
              <span>English captions</span>
              <span>University of Kentucky</span>
            </div>
            <a
              className="text-link"
              href={incubatorSiteUrl}
              target="_blank"
              rel="noreferrer"
              data-analytics-id="incubator-site"
            >
              Visit the AI Incubator <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="story-player">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/media/speaking/ai-incubator-commercial-poster.jpg"
              data-analytics-video-id="incubator-film"
            >
              <source
                src="/media/speaking/ai-incubator-commercial.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/media/speaking/ai-incubator-commercial.en.vtt"
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support embedded video. Visit the AI
              Incubator using the link beside this player.
            </video>
            <p>UK AI Incubator · Community film</p>
          </div>
        </div>
      </section>

      <section
        className="legislature-section"
        id="legislature"
        aria-labelledby="legislature-title"
      >
        <div className="shell legislature-grid">
          <div className="legislature-media">
            <LegislatureVideo />
            <p>Official recording · KY LRC Committee Meetings</p>
          </div>
          <div className="legislature-copy">
            <p className="section-index">
              Kentucky General Assembly / September 11, 2025
            </p>
            <h2 id="legislature-title">
              Artificial Intelligence at the University of Kentucky
            </h2>
            <p>
              Hubert Ballard, MD, and I briefed the Artificial Intelligence Task
              Force on AI work across the university and UK HealthCare,
              including what Kentucky would need to connect data, technical
              capacity, outreach, and care.
            </p>
            <dl className="legislature-details">
              <div>
                <dt>Venue</dt>
                <dd>Kentucky General Assembly</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>September 11, 2025</dd>
              </div>
              <div>
                <dt>Recording</dt>
                <dd>Presentation begins at 1:17:44</dd>
              </div>
            </dl>
            <a
              className="text-link"
              href="https://www.youtube.com/watch?v=v1aHwVq0dLI&t=4664s"
              target="_blank"
              rel="noreferrer"
              data-analytics-id="legislature-official-recording"
            >
              Open the official recording <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="engagements-section"
        id="speaking"
        aria-labelledby="engagements-title"
      >
        <div className="shell section-intro">
          <p className="section-index">Speaking</p>
          <div>
            <h2 id="engagements-title">Selected talks and public presentations.</h2>
            <p>
              My talks focus on the practical work required to use AI in
              healthcare and education: data, workflow, professional judgment,
              governance, and follow-up.
            </p>
          </div>
        </div>
        <div className="shell">
          <EngagementList engagements={engagements.slice(0, 6)} />
        </div>
      </section>

      <section
        className="speaker-kit-section"
        id="contact"
        aria-labelledby="speaker-kit-title"
      >
        <div className="shell speaker-kit-grid">
          <figure className="speaker-kit-photo">
            <img
              src="/media/speaking/tama-headshot.png"
              alt="Tama Thé smiling in a bright office"
              width="960"
              height="1088"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Current headshot</figcaption>
          </figure>
          <div className="speaker-kit-copy">
            <p className="section-index">About / Collaboration</p>
            <h2 id="speaker-kit-title">
              I work across healthcare, education, and public systems.
            </h2>
            <p>{siteIdentity.bio}</p>
            <div className="speaker-kit-actions">
              <a
                className="button button-primary"
                href={siteIdentity.email}
                data-analytics-id="collaboration-email"
              >
                Email Tama <span aria-hidden="true">↗</span>
              </a>
              <a
                className="button button-outline"
                href="/media/speaking/tama-headshot.png"
                download
                data-analytics-id="speaker-headshot-download"
              >
                Download headshot <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
