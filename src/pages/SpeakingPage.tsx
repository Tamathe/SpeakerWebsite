import { EngagementList } from "../components/EngagementList";
import { AmbientSpeakerVideo } from "../components/AmbientSpeakerVideo";
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
        <div className="video-led-hero-stage">
          <AmbientSpeakerVideo className="video-led-hero-reel" />
          <span className="video-led-hero-vignette" aria-hidden="true" />
          <div className="shell video-led-hero-caption" aria-hidden="true">
            <span>Field reel / Kentucky</span>
            <span>Healthcare / Education / Public systems</span>
          </div>
        </div>

        <div className="shell video-led-hero-message">
          <div>
            <p className="page-kicker">Healthcare / Education / Public systems</p>
            <h1>{siteIdentity.thesis}</h1>
          </div>
          <div className="video-led-hero-summary">
            <p>
              AI becomes useful when information reaches the people who can act
              on it—and when the next step actually happens. My work connects
              healthcare, education, and public systems around that problem.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#mission"
                data-analytics-id="hero-watch-argument"
              >
                See the throughline <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button button-outline"
                href="#featured-talk"
                data-analytics-id="hero-read-mission"
              >
                Watch the argument
              </a>
            </div>
          </div>
        </div>
      </header>

      <section
        className="mission-case"
        id="mission"
        aria-labelledby="mission-title"
      >
        <div className="shell mission-case-grid">
          <div className="mission-case-copy">
            <p className="section-index">The throughline</p>
            <h2 id="mission-title">The output is not the outcome.</h2>
            <p>
              A prediction, score, or polished answer can still leave the real
              problem untouched. The work is designing what happens next: who
              receives the information, what decision it changes, who owns the
              follow-through, and how we learn whether it helped.
            </p>
          </div>

          <figure className="mission-case-visual">
            <img
              src="/images/studio/ai-for-ky.png"
              alt="A map of Kentucky marked with connected locations across the state"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>Connect the signal to the next step.</span>
              <span>Information / Judgment / Action</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="featured-talk-section"
        id="featured-talk"
        aria-labelledby="featured-talk-title"
      >
        <div className="shell featured-talk-grid">
          <div className="featured-talk-copy">
            <p className="section-index">One public case / NBME NICE 2026</p>
            <h2 id="featured-talk-title">
              Shared information should produce a useful next step.
            </h2>
            <p>
              In this excerpt, I make the case for governed connections across
              existing healthcare systems. The goal is not one giant database.
              It is a network that returns something useful to the person
              responsible for the next step in care.
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
          <p className="section-index">Healthcare / From signal to care</p>
          <div>
            <h2 id="work-title">Three projects. One operating question.</h2>
            <p>
              What has to happen after useful information becomes available?
              Each project connects a signal to a decision, a responsible
              person, and a way to see whether the next step was completed.
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
            <p className="section-index">Education / Build the judgment</p>
            <h2 id="tek100-title">People need practice turning AI output into a decision.</h2>
            <p>
              Connecting information to action requires people who can test AI,
              recognize its limits, and decide when it belongs in the work.
              TEK 100 gives University of Kentucky students that practice
              through foundational, hands-on AI literacy.
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
            <p className="section-index">Community / Put ideas to work</p>
            <h2 id="incubator-feature-title">Give unfinished ideas a path to action.</h2>
            <p>
              The AI Incubator gives students, faculty, and staff a place to
              bring a real problem into the room, find the missing expertise,
              and move toward a small, testable next step. The community is how
              ideas cross the disciplinary lines that usually keep them stuck.
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
            <p className="section-index">Public systems / Build shared direction</p>
            <h2 id="legislature-title">
              Artificial Intelligence at the University of Kentucky
            </h2>
            <p>
              Presented with Hubert Ballard, MD, this briefing to the Kentucky
              General Assembly Artificial Intelligence Task Force connected AI
              work across the university and UK HealthCare to a larger question:
              what Kentucky needs in order to act together.
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
          <p className="section-index">Speaking / Testing the work in public</p>
          <div>
            <h2 id="engagements-title">Take the hard part into the room.</h2>
            <p>
              I use talks, workshops, and public conversations to test these
              ideas with the people who have to build, govern, teach, and use
              the systems in practice.
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
            <p className="section-index">Collaboration / Speaking</p>
            <h2 id="speaker-kit-title">Start with the problem that crosses the lines.</h2>
            <p>
              {siteIdentity.bio} I work with people who need to connect a
              technical possibility to the institutional and human work that
              makes it useful.
            </p>
            <div className="speaker-kit-actions">
              <a
                className="button button-primary"
                href={siteIdentity.email}
                data-analytics-id="collaboration-email"
              >
                Start a conversation <span aria-hidden="true">↗</span>
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
