import { AmbientSpeakerVideo } from "../components/AmbientSpeakerVideo";
import { EngagementList } from "../components/EngagementList";
import { LegislatureVideo } from "../components/LegislatureVideo";
import {
  credentials,
  engagements,
  incubatorSiteUrl,
  signatureTopics,
  siteIdentity,
} from "../siteContent";

export function SpeakingPage() {
  return (
    <>
      <header className="speaking-hero">
        <div className="shell speaking-hero-grid">
          <div className="speaking-hero-content">
            <h1>Start with the work, not with a tour of AI tools.</h1>
            <p>
              I speak about AI through the problems people are already trying to
              solve—in healthcare, medical education, universities, public
              systems, and Kentucky communities.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#featured-talk"
                data-analytics-id="hero-watch-featured"
              >
                Watch the featured talk <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button button-outline"
                href={siteIdentity.email}
                data-analytics-id="hero-invite-email"
              >
                Invite Tama to speak <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <figure className="speaking-hero-media">
            <div className="speaking-hero-frame">
              <AmbientSpeakerVideo className="speaking-hero-video" />
              <span className="speaking-hero-vignette" aria-hidden="true" />
            </div>
            <figcaption className="speaking-reel-caption">
              <span>Selected appearances / Kentucky and beyond</span>
              <span>30-second ambient reel</span>
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
            <p className="section-index">Featured talk / NBME NICE 2026</p>
            <h2 id="featured-talk-title">
              What if healthcare AI were shared infrastructure?
            </h2>
            <p>
              In this excerpt, Tama makes the case for moving beyond
              disconnected tools and building an intelligence layer that can
              help public systems find people who need care and connect them to
              the next step.
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

      <section
        className="story-section story-section-incubator"
        id="incubator"
        aria-labelledby="incubator-feature-title"
      >
        <div className="shell story-grid story-grid-media-first">
          <div className="story-copy">
            <p className="section-index">Build in public / UK AI Incubator</p>
            <h2 id="incubator-feature-title">
              People in a room, building the future together.
            </h2>
            <p>
              The AI Incubator brings students, faculty, and staff together to
              test tools, pitch ambitious ideas, and solve real problems. It is
              a community built around curiosity, practical work, and learning
              in public.
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
            <p className="section-index">Teaching / TEK 100</p>
            <h2 id="tek100-title">Teach the principles that survive the next tool.</h2>
            <p>
              A moment from TEK 100, the foundational, hands-on AI literacy
              course co-created for University of Kentucky students. The aim is
              not fluency in one product. It is the judgment to approach any AI
              tool thoughtfully.
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
            <p className="section-index">Public leadership / Kentucky</p>
            <h2 id="legislature-title">
              Artificial Intelligence at the University of Kentucky
            </h2>
            <p>
              A presentation to the Kentucky General Assembly Artificial
              Intelligence Task Force on AI work across the university and UK
              HealthCare, presented with Hubert Ballard, MD.
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

      <section className="topics-section" id="topics" aria-labelledby="topics-title">
        <div className="shell section-intro">
          <p className="section-index">Signature topics</p>
          <div>
            <h2 id="topics-title">Practical, candid, and grounded in current work.</h2>
          </div>
        </div>
        <div className="shell topic-grid">
          {signatureTopics.map((topic) => (
            <article key={topic.number}>
              <span>{topic.number}</span>
              <h3>{topic.title}</h3>
              <p>{topic.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="engagements-section" id="engagements" aria-labelledby="engagements-title">
        <div className="shell section-intro">
          <p className="section-index">Selected engagements</p>
          <div>
            <h2 id="engagements-title">A growing record of talks and public conversations.</h2>
            <p>
              The archive links to full events and recordings where a stable
              public source is available.
            </p>
          </div>
        </div>
        <div className="shell">
          <EngagementList engagements={engagements} />
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
            <figcaption>Current speaker headshot</figcaption>
          </figure>
          <div className="speaker-kit-copy">
            <p className="section-index">About / Speaker materials</p>
            <h2 id="speaker-kit-title">For event organizers.</h2>
            <p>
              Tama Thé is a pediatric emergency physician and medical educator
              working across healthcare, education, public systems, and AI.
              Download the current headshot here; short and extended bios and
              talk information are available by email.
            </p>
            <div className="speaker-kit-actions">
              <a
                className="button button-primary"
                href="/media/speaking/tama-headshot.png"
                download
                data-analytics-id="speaker-headshot-download"
              >
                Download headshot <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button button-outline"
                href={siteIdentity.email}
                data-analytics-id="speaker-kit-email"
              >
                Email Tama.the@uky.edu <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
