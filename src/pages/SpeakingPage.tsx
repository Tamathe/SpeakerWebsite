import { AmbientSpeakerVideo } from "../components/AmbientSpeakerVideo";
import { EngagementList } from "../components/EngagementList";
import { LegislatureVideo } from "../components/LegislatureVideo";
import {
  engagements,
  signatureTopics,
  siteIdentity,
  speakingRecordVenues,
} from "../siteContent";

export function SpeakingPage() {
  return (
    <>
      <header className="speaking-hero">
        <AmbientSpeakerVideo className="speaking-hero-video" />
        <div className="speaking-shade" aria-hidden="true" />
        <div className="shell speaking-hero-content">
          <p className="page-kicker">Speaker profile / Talks and workshops</p>
          <h1>Start with the work, not with a tour of AI tools.</h1>
          <p>
            I speak about AI through the problems people are already trying to
            solve—in healthcare, medical education, universities, public
            systems, and Kentucky communities.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#featured-talk">
              Watch the featured talk <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-outline" href={siteIdentity.email}>
              Invite Tama to speak <span aria-hidden="true">↗</span>
            </a>
          </div>
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
              In this 90-second excerpt, Tama makes the case for moving beyond
              disconnected tools and building an intelligence layer that can
              help public systems find people who need care and connect them to
              the next step.
            </p>
            <div className="featured-talk-details" aria-label="Video details">
              <span>1:29 excerpt</span>
              <span>English captions</span>
              <span>Produced by NBME</span>
            </div>
            <a
              className="text-link"
              href="https://f.io/AWtTiZWu"
              target="_blank"
              rel="noreferrer"
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
            >
              <source
                src="/media/speaking/nbme-nice-2026-excerpt.mp4"
                type="video/mp4"
              />
              <track
                kind="captions"
                src="/media/speaking/nbme-nice-2026.en.vtt"
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

      <section className="legislature-section" aria-labelledby="legislature-title">
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
            >
              Open the official recording <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="topics-section" aria-labelledby="topics-title">
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

      <section className="record-section" aria-labelledby="record-title">
        <div className="shell record-grid">
          <div>
            <p className="section-index">Selected settings</p>
            <h2 id="record-title">From classrooms to public forums.</h2>
          </div>
          <div>
            <p>
              The record spans medical education, healthcare, university
              strategy, workforce, and public policy. Selected photographs and
              additional recordings will be added as permissions and source
              details are confirmed.
            </p>
            <div className="venue-list">
              {speakingRecordVenues.map((venue) => (
                <span key={venue}>{venue}</span>
              ))}
            </div>
            <a className="text-link" href={siteIdentity.email}>
              Request a bio, headshot, or talk information <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
