import { EngagementList } from "../components/EngagementList";
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
        <img
          src="/images/dark-academic-stage.png"
          alt="Dark auditorium stage with a lectern and cobalt-blue lighting"
        />
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
            <a className="button button-primary" href={siteIdentity.email}>
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-outline" href="#engagements">
              Selected engagements
            </a>
          </div>
        </div>
      </header>

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
            <p className="section-index">Full record in progress</p>
            <h2 id="record-title">More of the chronology is being assembled.</h2>
          </div>
          <div>
            <p>
              The next archive pass will add dates, titles, and media for these
              engagements without guessing at details that still need to be
              verified.
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
