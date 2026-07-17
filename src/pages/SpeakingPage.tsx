import { AmbientSpeakerVideo } from "../components/AmbientSpeakerVideo";
import { EngagementList } from "../components/EngagementList";
import { LegislatureVideo } from "../components/LegislatureVideo";
import {
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
            <h1>{siteIdentity.thesis}</h1>
            <p>
              Making AI Useful means connecting data to action in healthcare,
              education, and public systems.
            </p>
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
            <h2 id="featured-talk-title">
              Connecting healthcare information across Kentucky.
            </h2>
            <p>
              A shared statewide data infrastructure will identify patients at
              risk and connect them with care.
            </p>
            <div className="featured-talk-details" aria-label="Video details">
              <span>1:23 excerpt</span>
              <span>English captions</span>
              <span>Produced by NBME</span>
            </div>
            <a
              className="button button-primary featured-talk-cta"
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
            <p>
              <strong>
                <em>
                  NBME Invitational Conference for Educators (NICE) - June 2026
                </em>
              </strong>
            </p>
          </div>
        </div>
      </section>

      <section className="mission-work" id="work" aria-labelledby="work-title">
        <div className="shell section-intro section-intro-no-eyebrow">
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

      <section
        className="story-section story-section-tek100"
        id="tek100"
        aria-labelledby="tek100-title"
      >
        <div className="shell story-grid">
          <div className="story-copy">
            <h2 id="tek100-title">AI literacy at the University of Kentucky.</h2>
            <p>
              TEK 100 is a foundational, hands-on AI literacy course co-created
              for University of Kentucky students. Students use AI, test its
              output, compare it with trusted sources, and decide when it
              belongs in the work.
            </p>
            <div className="featured-talk-details" aria-label="Video details">
              <span>1:11 excerpt</span>
              <span>English captions</span>
              <span>Foundational AI literacy</span>
            </div>
          </div>
          <div className="story-player">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/media/speaking/tek100-tama-poster.jpg"
              data-analytics-video-id="tek100-excerpt"
            >
              <source
                src="/media/speaking/tek100-tama-excerpt.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/media/speaking/tek100-tama-excerpt.en.vtt"
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
        <div className="shell section-intro section-intro-no-eyebrow">
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
